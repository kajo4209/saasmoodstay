// src/app/api/chalets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ────────────────────────────────────────────────
// GET /api/chalets/:id
// ────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const chalet = await prisma.chalet.findUnique({
    where: { id: Number(params.id) },
    include: { bookings: true },
  });

  if (!chalet) {
    return NextResponse.json({ error: "الشاليه غير موجود" }, { status: 404 });
  }

  return NextResponse.json(chalet);
}

// ────────────────────────────────────────────────
// PUT /api/chalets/:id — تعديل شاليه
// ────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const chalet = await prisma.chalet.update({
      where: { id: Number(params.id) },
      data: {
        name:        body.name,
        price:       Number(body.price),
        rooms:       Number(body.rooms),
        description: body.description,
        features:    body.features,
        type:        body.type,
      },
    });

    return NextResponse.json(chalet);
  } catch (error) {
    console.error("PUT /api/chalets/:id error:", error);
    return NextResponse.json({ error: "فشل في التعديل" }, { status: 500 });
  }
}

// ────────────────────────────────────────────────
// DELETE /api/chalets/:id
// ────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.chalet.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    console.error("DELETE /api/chalets/:id error:", error);
    return NextResponse.json({ error: "فشل في الحذف" }, { status: 500 });
  }
}
