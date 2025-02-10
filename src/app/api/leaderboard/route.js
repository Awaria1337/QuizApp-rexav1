import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();

        // Get top users sorted by level and XP
        const users = await User.find({})
            .select('username level xp streak avatar')
            .sort({ level: -1, xp: -1 })
            .limit(100)
            .lean();

        // Calculate stats
        const stats = {
            totalPlayers: await User.countDocuments(),
            highestStreak: (await User.findOne().sort({ streak: -1 }).select('streak').lean())?.streak || 0,
            weeklyXP: await calculateWeeklyXP()
        };

        return NextResponse.json({ users, stats });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json(
            { error: 'Puan tablosu yüklenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}

async function calculateWeeklyXP() {
    try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const result = await User.aggregate([
            {
                $match: {
                    updatedAt: { $gte: weekAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalXP: { $sum: '$xp' }
                }
            }
        ]);

        return result[0]?.totalXP || 0;
    } catch (error) {
        console.error('Weekly XP calculation error:', error);
        return 0;
    }
}