import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ShopItem from '@/models/ShopItem';
import User from '@/models/User';

export async function GET(request) {
    try {
        await connectDB();
        const items = await ShopItem.find({ status: 'active' });
        return NextResponse.json(items);
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

        if (data.action === 'create') {
            const item = await ShopItem.create(data.item);
            return NextResponse.json(item, { status: 201 });
        }

        if (data.action === 'purchase') {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.userId);
            const item = await ShopItem.findById(data.itemId);

            if (!user || !item) {
                return NextResponse.json({ error: 'Kullanıcı veya ürün bulunamadı' }, { status: 404 });
            }

            // Kullanıcının yeterli parası var mı kontrol et
            if (item.price.currency === 'gem' && user.gems < item.price.amount) {
                return NextResponse.json({ error: 'Yetersiz taş' }, { status: 400 });
            }

            // Satın alma işlemini gerçekleştir
            user.gems -= item.price.amount;
            user.inventory.push({ itemId: item._id });

            // Eğer kalp veya taş satın alındıysa direkt ekle
            if (item.type === 'heart') user.hearts += item.quantity;
            if (item.type === 'gem') user.gems += item.quantity;

            await user.save();

            return NextResponse.json({ message: 'Satın alma başarılı', user });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
