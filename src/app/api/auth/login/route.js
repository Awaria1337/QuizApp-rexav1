import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    await connectDB();

    // Kullanıcıyı bul
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Geçersiz email veya şifre" },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Geçersiz email veya şifre" },
        { status: 401 }
      );
    }

    // Streak kontrolü
    const now = new Date();
    const lastLogin = user.lastLoginDate;
    const daysSinceLastLogin = Math.floor(
      (now - lastLogin) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastLogin === 1) {
      user.streak += 1;
    } else if (daysSinceLastLogin > 1) {
      user.streak = 0;
    }

    user.lastLoginDate = now;
    await user.save();

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Hassas bilgileri çıkar
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Giriş hatası:", error);
    return NextResponse.json(
      { error: "Giriş sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
