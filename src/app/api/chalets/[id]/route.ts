// src/app/api/chalets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/chalets/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const chalet = await prisma.chalet.findUnique({
    where: { id: Number(id) },
    include: { bookings: true },
  });

  if (!chalet) {
    return NextResponse.json({ error: "Chalet not found" }, { status: 404 });
  }

  return NextResponse.json(chalet);
}

// PUT /api/chalets/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const chalet = await prisma.chalet.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        price: Number(body.price),
        rooms: Number(body.rooms),
        description: body.description,
        features: body.features,
        type: body.type,
      },
    });

    return NextResponse.json(chalet);
  } catch (error) {
    console.error("PUT /api/chalets/:id error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/chalets/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.chalet.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/chalets/:id error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
