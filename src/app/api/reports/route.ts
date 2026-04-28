import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const [allBookings, allChalets] = await Promise.all([
      prisma.booking.findMany({
        include: { chalet: { select: { id: true, name: true, price: true, rooms: true, type: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.chalet.findMany({ orderBy: { id: "asc" } }),
    ]);

    const totalBookings     = allBookings.length;
    const confirmedBookings = allBookings.filter(b => b.status === "confirmed");
    const pendingBookings   = allBookings.filter(b => b.status === "pending");
    const cancelledBookings = allBookings.filter(b => b.status === "cancelled");

    const totalRevenue      = confirmedBookings.reduce((s, b) => s + b.totalPrice, 0);
    const totalDeposits     = confirmedBookings.reduce((s, b) => s + b.deposit, 0);
    const totalNights       = confirmedBookings.reduce((s, b) => s + b.nights, 0);
    const avgNights         = confirmedBookings.length ? Math.round(totalNights / confirmedBookings.length) : 0;
    const avgRevPerBooking  = confirmedBookings.length ? Math.round(totalRevenue / confirmedBookings.length) : 0;
    const conversionRate    = totalBookings ? Math.round((confirmedBookings.length / totalBookings) * 100) : 0;
    const cancellationRate  = totalBookings ? Math.round((cancelledBookings.length / totalBookings) * 100) : 0;

    // آخر 12 شهر
    const monthlyMap: Record<string, { revenue: number; bookings: number; nights: number }> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = { revenue: 0, bookings: 0, nights: 0 };
    }
    for (const b of confirmedBookings) {
      const key = b.createdAt.toISOString().slice(0, 7);
      if (monthlyMap[key]) {
        monthlyMap[key].revenue  += b.totalPrice;
        monthlyMap[key].bookings += 1;
        monthlyMap[key].nights   += b.nights;
      }
    }
    const monthlyRevenue = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

    const statusBreakdown = {
      confirmed: confirmedBookings.length,
      pending:   pendingBookings.length,
      cancelled: cancelledBookings.length,
    };

    // أيام الأسبوع
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const dayCount = [0, 0, 0, 0, 0, 0, 0];
    for (const b of confirmedBookings) dayCount[new Date(b.checkIn).getDay()]++;
    const bookingsByDay = dayNames.map((day, i) => ({ day, bookings: dayCount[i] }));

    // إحصائيات كل شاليه
    const chaletStats = allChalets.map(chalet => {
      const cb        = allBookings.filter(b => b.chaletId === chalet.id);
      const confirmed = cb.filter(b => b.status === "confirmed");
      const pending   = cb.filter(b => b.status === "pending");
      const cancelled = cb.filter(b => b.status === "cancelled");

      const revenue      = confirmed.reduce((s, b) => s + b.totalPrice, 0);
      const deposits     = confirmed.reduce((s, b) => s + b.deposit, 0);
      const totalNightsC = confirmed.reduce((s, b) => s + b.nights, 0);
      const avgNightsC   = confirmed.length ? +(totalNightsC / confirmed.length).toFixed(1) : 0;
      const avgPrice     = confirmed.length ? Math.round(revenue / confirmed.length) : 0;
      const occupancyRate = Math.min(100, Math.round((totalNightsC / 365) * 100));
      const revenueShare  = totalRevenue ? Math.round((revenue / totalRevenue) * 100) : 0;

      // شهري آخر 6 شهور
      const chalMonthly: Record<string, number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        chalMonthly[key] = 0;
      }
      for (const b of confirmed) {
        const key = b.createdAt.toISOString().slice(0, 7);
        if (chalMonthly[key] !== undefined) chalMonthly[key] += b.totalPrice;
      }
      const monthlyData = Object.entries(chalMonthly).map(([month, revenue]) => ({ month, revenue }));

      const recentBookings = cb.slice(0, 5).map(b => ({
        id:         b.id,
        guestName:  b.guestName,
        phone:      b.phone,
        checkIn:    b.checkIn.toISOString().slice(0, 10),
        checkOut:   b.checkOut.toISOString().slice(0, 10),
        nights:     b.nights,
        totalPrice: b.totalPrice,
        deposit:    b.deposit,
        status:     b.status,
        createdAt:  b.createdAt.toISOString().slice(0, 10),
      }));

      return {
        id: chalet.id, name: chalet.name, type: chalet.type,
        rooms: chalet.rooms, pricePerNight: chalet.price,
        totalBookings: cb.length, confirmedCount: confirmed.length,
        pendingCount: pending.length, cancelledCount: cancelled.length,
        revenue, deposits, avgNights: avgNightsC, avgPrice,
        occupancyRate, occupiedDays: totalNightsC, revenueShare,
        monthlyData, recentBookings,
      };
    });

    // أفضل شاليه
    const bestByRevenue   = [...chaletStats].sort((a, b) => b.revenue - a.revenue)[0]?.name ?? "-";
    const bestByOccupancy = [...chaletStats].sort((a, b) => b.occupancyRate - a.occupancyRate)[0]?.name ?? "-";
    const bestByBookings  = [...chaletStats].sort((a, b) => b.confirmedCount - a.confirmedCount)[0]?.name ?? "-";

    // أكثر الضيوف حجزاً
    const guestMap: Record<string, { name: string; phone: string; bookings: number; revenue: number }> = {};
    for (const b of confirmedBookings) {
      if (!guestMap[b.phone]) guestMap[b.phone] = { name: b.guestName, phone: b.phone, bookings: 0, revenue: 0 };
      guestMap[b.phone].bookings++;
      guestMap[b.phone].revenue += b.totalPrice;
    }
    const topGuests = Object.values(guestMap).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

    return NextResponse.json({
      totalBookings, totalRevenue, totalDeposits, totalNights,
      avgNights, avgRevPerBooking, conversionRate, cancellationRate,
      totalChalets: allChalets.length, statusBreakdown,
      bestByRevenue, bestByOccupancy, bestByBookings,
      monthlyRevenue, bookingsByDay, chaletStats, topGuests,
    });

  } catch (error) {
    console.error("GET /api/reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}