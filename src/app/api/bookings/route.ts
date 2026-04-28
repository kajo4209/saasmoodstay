import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bookings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chaletId = searchParams.get("chaletId");
    const status = searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: {
        ...(chaletId ? { chaletId: Number(chaletId) } : {}),
        ...(status ? { status } : {}),
      },
      include: { chalet: { select: { name: true, price: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "فشل في جلب الحجوزات" }, { status: 500 });
  }
}

// POST /api/bookings
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chaletId, guestName, phone, checkIn, checkOut, notes, features } = body;

    if (!chaletId || !guestName || !phone || !checkIn || !checkOut) {
      return NextResponse.json({ error: "يرجى ملء جميع الحقول المطلوبة" }, { status: 400 });
    }

    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // ─── تحقق: لا يوجد حجز مؤكد في نفس الفترة ───
    const conflict = await prisma.booking.findFirst({
      where: {
        chaletId: Number(chaletId),
        status: { in: ["pending", "confirmed"] },  // نحجب pending و confirmed فقط
        checkIn:  { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "الشاليه محجوز في هذه الفترة، يرجى اختيار تواريخ أخرى" },
        { status: 409 }
      );
    }

    // ─── جيب بيانات الشاليه ───
    const chalet = await prisma.chalet.findUnique({ where: { id: Number(chaletId) } });
    if (!chalet) return NextResponse.json({ error: "الشاليه غير موجود" }, { status: 404 });

    // ─── احسب الليالي والسعر ───
    const nights = Math.max(
      1,
      Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const totalPrice = nights * chalet.price;
    const deposit    = Math.round(totalPrice * 0.15);

    const booking = await prisma.booking.create({
      data: {
        chaletId:   Number(chaletId),
        guestName,
        phone,
        checkIn:    checkInDate,
        checkOut:   checkOutDate,
        nights,
        totalPrice,
        deposit,
        notes:      notes || "",
        features:   Array.isArray(features) ? features.join("، ") : (features || ""),
        status:     "pending",
        payment:    "cash",
      },
      include: { chalet: { select: { name: true } } },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "فشل في إنشاء الحجز" }, { status: 500 });
  }
}
