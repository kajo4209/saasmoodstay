import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/coupons/validate
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ valid: false, error: "أدخل الكود" }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.active)
      return NextResponse.json({ valid: false, error: "كوبون غير صالح" }, { status: 400 });

    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return NextResponse.json({ valid: false, error: "انتهت صلاحية الكوبون" }, { status: 400 });

    if (coupon.usedCount >= coupon.maxUses)
      return NextResponse.json({ valid: false, error: "تم استخدام الكوبون بالحد الأقصى" }, { status: 400 });

    return NextResponse.json({
      valid: true,
      discount: coupon.discount,
      type: coupon.type,
      code: coupon.code,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ valid: false, error: "حدث خطأ" }, { status: 500 });
  }
}
