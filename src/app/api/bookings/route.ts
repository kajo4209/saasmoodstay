// src/app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ────────────────────────────────────────────────
// GET /api/bookings — جيب كل الحجوزات
// ────────────────────────────────────────────────
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { chalet: { select: { name: true, price: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "فشل في جلب الحجوزات" }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// POST /api/bookings — إضافة حجز جديد
// ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { chaletId, guestName, phone, checkIn, checkOut } = body;

    if (!chaletId || !guestName || !phone || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "يرجى ملء جميع الحقول" },
        { status: 400 }
      );
    }

    // ─── التحقق من توفر الشاليه في هذه الفترة ───
    const conflict = await prisma.booking.findFirst({
      where: {
        chaletId: Number(chaletId),
        OR: [
          {
            checkIn:  { lte: new Date(checkOut) },
            checkOut: { gte: new Date(checkIn) },
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "الشاليه محجوز في هذه الفترة" },
        { status: 409 }
      );
    }

    // ─── حساب الإجمالي ───
    const chalet = await prisma.chalet.findUnique({
      where: { id: Number(chaletId) },
    });

    if (!chalet) {
      return NextResponse.json({ error: "الشاليه غير موجود" }, { status: 404 });
    }

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const totalPrice = nights * chalet.price;

    const booking = await prisma.booking.create({
      data: {
        chaletId:  Number(chaletId),
        guestName,
        phone,
        checkIn:   new Date(checkIn),
        checkOut:  new Date(checkOut),
        totalPrice,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "فشل في إنشاء الحجز" }, { status: 500 });
  }
}
