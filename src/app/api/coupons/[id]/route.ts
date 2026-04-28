import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// PATCH /api/coupons/[id]  — تفعيل/تعطيل أو تعديل
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.coupon.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل التعديل" }, { status: 500 });
  }
}

// DELETE /api/coupons/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.coupon.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}

// POST /api/coupons/[id]/validate  — التحقق من صلاحية الكوبون
export async function POST(req: NextRequest, { params }: Params) {
  // هذا الـ route يُستخدم للـ validate عبر الكود مش الـ id
  const { id } = await params;
  if (id === "validate") {
    const { code } = await req.json();
    const coupon = await prisma.coupon.findUnique({ where: { code: code?.toUpperCase() } });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ valid: false, error: "كوبون غير صالح أو منتهي" }, { status: 400 });
    }
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ valid: false, error: "انتهت صلاحية الكوبون" }, { status: 400 });
    }
    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: "تم استخدام الكوبون بالحد الأقصى" }, { status: 400 });
    }

    return NextResponse.json({ valid: true, discount: coupon.discount, type: coupon.type, code: coupon.code });
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
