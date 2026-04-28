import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.DASHBOARD_PASSWORD;

    if (!correctPassword) {
      console.error("DASHBOARD_PASSWORD is not set in .env");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (!password || password !== correctPassword) {
      // تأخير بسيط لمنع brute-force
      await new Promise(r => setTimeout(r, 800));
      return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    // كوكي صالحة 7 أيام
    const res = NextResponse.json({ ok: true });
    res.cookies.set("dashboard_auth", process.env.DASHBOARD_PASSWORD!, {
      httpOnly: true,        // مش قابلة للقراءة من JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
    });
    return res;

  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}