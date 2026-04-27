// src/app/api/reports/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ─── إجمالي الحجوزات ───
    const totalBookings = await prisma.booking.count();

    // ─── إجمالي الإيرادات ───
    const revenueResult = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
    });
    const revenue = revenueResult._sum.totalPrice ?? 0;

    // ─── إجمالي الشاليهات ───
    const totalChalets = await prisma.chalet.count();

    // ─── الشاليهات الأكثر طلبًا ───
    const topChalets = await prisma.booking.groupBy({
      by: ["chaletId"],
      _count: true,
      orderBy: { _count: { chaletId: "desc" } },
      take: 5,
    });

    // ─── حجوزات آخر 7 أيام ───
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      include: { chalet: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // ─── إيرادات كل شهر (آخر 6 شهور) ───
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const allBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, totalPrice: true },
    });

    // تجميع الإيرادات شهريًا
    const monthlyRevenue: Record<string, number> = {};
    for (const booking of allBookings) {
      const key = booking.createdAt.toISOString().slice(0, 7); // "YYYY-MM"
      monthlyRevenue[key] = (monthlyRevenue[key] ?? 0) + booking.totalPrice;
    }

    return NextResponse.json({
      totalBookings,
      revenue,
      totalChalets,
      topChalets,
      recentBookings,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json(
      { error: "فشل في جلب التقارير" },
      { status: 500 }
    );
  }
}
