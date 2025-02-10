import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
    try {
        await connectDB();
        const tasks = await Task.find({ status: 'active' }).populate('requirement.categoryId');
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
        }

        const data = await request.json();
        await connectDB();

        const task = await Task.create(data);
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        const { taskId } = await request.json();

        await connectDB();

        const user = await User.findById(decoded.userId);
        const task = await Task.findById(taskId);

        if (!user || !task) {
            return NextResponse.json({ error: 'Kullanıcı veya görev bulunamadı' }, { status: 404 });
        }

        // Görevi tamamla ve ödülleri ver
        user.completedTasks.push({ taskId: task._id });
        await user.addXP(task.reward.xp);
        user.gems += task.reward.gems;
        user.hearts += task.reward.hearts;

        await user.save();

        return NextResponse.json({ message: 'Görev tamamlandı', user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}