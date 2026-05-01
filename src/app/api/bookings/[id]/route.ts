import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/bookings/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = Number(id);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        chalet: { select: { name: true, price: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = Number(id);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const current = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // منع التعارض
    if (status === "confirmed") {
      const conflict = await prisma.booking.findFirst({
        where: {
          id: { not: bookingId },
          chaletId: current.chaletId,
          status: "confirmed",
          checkIn: { lt: current.checkOut },
          checkOut: { gt: current.checkIn },
        },
      });

      if (conflict) {
        return NextResponse.json(
          { error: "هذه الفترة محجوزة بالفعل" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        chalet: { select: { name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = Number(id);

    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
