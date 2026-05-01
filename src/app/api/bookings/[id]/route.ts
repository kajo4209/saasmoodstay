import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bookings/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        chalet: { select: { name: true, price: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("GET booking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/bookings/[id]  → تحديث الحالة
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const status = body?.status;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const current = await prisma.booking.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // منع التعارض في حالة التأكيد
    if (status === "confirmed") {
      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          chaletId: current.chaletId,
          status: "confirmed",
          checkIn: { lt: current.checkOut },
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
      where: { id },
      data: { status },
      include: {
        chalet: { select: { name: true } }, // مهم للفرونت
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT booking error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/bookings/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE booking error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
