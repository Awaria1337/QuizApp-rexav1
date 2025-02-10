import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // Veritabanı bağlantısı
    await connectDB();
    console.log('MongoDB bağlantısı başarılı');

    // Kullanıcı adı veya email kontrolü
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      console.log('Kullanıcı zaten var:', existingUser.email);
      return NextResponse.json(
        { error: "Bu kullanıcı adı veya email zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Şifre hashlendi');

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    });

    console.log('Kullanıcı oluşturuldu:', user.email);

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}