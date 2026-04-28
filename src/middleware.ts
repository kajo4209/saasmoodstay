import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // حماية كل صفحات الداشبورد
  if (pathname.startsWith("/dashboard")) {
    const authCookie = req.cookies.get("dashboard_auth")?.value;
    const correctPassword = process.env.DASHBOARD_PASSWORD;

    if (!authCookie || authCookie !== correctPassword) {
      // احفظ الصفحة اللي كان بيحاول يوصلها عشان يرجعلها بعد اللوجين
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};