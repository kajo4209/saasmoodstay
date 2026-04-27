// src/app/api/bookings/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const from   = searchParams.get("from");
    const to     = searchParams.get("to");

    // ─────────────────────────
    // فلترة ديناميك
    // ─────────────────────────
    const where: any = {};

    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { id: isNaN(Number(search)) ? undefined : Number(search) },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (from || to) {
      where.checkIn = {};
      if (from) where.checkIn.gte = new Date(from);
      if (to) where.checkIn.lte = new Date(to);
    }

    // ─────────────────────────
    // GET BOOKINGS
    // ─────────────────────────
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        chalet: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ─────────────────────────
    // STATS
    // ─────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalToday = await prisma.booking.count({
      where: { createdAt: { gte: today } },
    });

    const totalMonth = await prisma.booking.count({
      where: { createdAt: { gte: monthStart } },
    });

    const pending = await prisma.booking.count({
      where: { status: "pending" },
    });

    const cancelled = await prisma.booking.count({
      where: { status: "cancelled" },
    });

    const revenueAgg = await prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: { status: "confirmed" },
    });

    const revenue = revenueAgg._sum.totalPrice || 0;

    return NextResponse.json({
      stats: {
        totalToday,
        totalMonth,
        pending,
        cancelled,
        revenue,
      },
      bookings,
    });
  } catch (error) {
    console.error("GET /api/bookings/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load bookings dashboard" },
      { status: 500 }
    );
  }
}