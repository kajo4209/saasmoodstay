import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bookings/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: { chalet: { select: { name: true, price: true } } },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

// PUT /api/bookings/[id]  → تحديث الحالة
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // إذا كان تأكيد → تحقق من عدم وجود تعارض مع حجز آخر مؤكد
    if (status === "confirmed") {
      const current = await prisma.booking.findUnique({ where: { id: Number(id) } });
      if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const conflict = await prisma.booking.findFirst({
        where: {
          id:       { not: Number(id) },
          chaletId: current.chaletId,
          status:   "confirmed",
          checkIn:  { lt: current.checkOut },
          checkOut: { gt: current.checkIn },
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "هذه الفترة محجوزة بالفعل في حجز آخر مؤكد" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: { status },
      include: { chalet: { select: { name: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/bookings/:id error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/bookings/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.booking.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
