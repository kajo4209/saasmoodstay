import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalBookings = await prisma.booking.count();

    const revenueResult = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
    });
    const revenue = revenueResult._sum.totalPrice ?? 0;

    const totalChalets = await prisma.chalet.count();

    const topChalets = await prisma.booking.groupBy({
      by: ["chaletId"],
      _count: true,
      orderBy: { _count: { chaletId: "desc" } },
      take: 5,
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      include: { chalet: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const allBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true, totalPrice: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    for (const booking of allBookings) {
      const key = booking.createdAt.toISOString().slice(0, 7);
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
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
