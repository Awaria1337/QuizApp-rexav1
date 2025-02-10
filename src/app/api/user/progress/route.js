import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        const { xp, categoryId, score, totalQuestions } = await request.json();

        await connectDB();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // XP ve level güncelleme
        const levelUpResult = await user.addXP(xp);

        // Kategori istatistiklerini güncelle
        await user.updateCategoryStats(categoryId, score, totalQuestions);

        return NextResponse.json({
            levelUp: levelUpResult.levelUp,
            newLevel: levelUpResult.newLevel,
            currentXP: levelUpResult.currentXP,
            nextLevelXP: levelUpResult.nextLevelXP
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}