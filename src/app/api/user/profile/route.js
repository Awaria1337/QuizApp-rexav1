import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        await connectDB();

        const user = await User.findById(decoded.userId)
            .select('-password')
            .populate('inventory.itemId')
            .populate('completedTasks.taskId');

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(user);
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
        const data = await request.json();
        await connectDB();

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Şifre değişikliği
        if (data.currentPassword && data.newPassword) {
            const isValid = await bcrypt.compare(data.currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(data.newPassword, salt);
        }

        // Diğer alanları güncelle
        if (data.username) user.username = data.username;
        if (data.email) user.email = data.email;
        if (data.avatar) user.avatar = data.avatar;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json(userResponse);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
