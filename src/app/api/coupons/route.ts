import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── توليد كود عشوائي ─────────────────────────────────────────────────────
function generateCode(prefix = "MOOD"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let rand = "";
  for (let i = 0; i < 6; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${rand}`;
}

// GET /api/coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coupons);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "فشل في جلب الكوبونات" }, { status: 500 });
  }
}

// POST /api/coupons  — إنشاء يدوي أو توليد تلقائي
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      discount,
      type = "percent",
      maxUses = 1,
      expiresAt,
      description = "",
      autoGenerate = false,
      prefix = "MOOD",
    } = body;

    if (!discount || discount < 1 || discount > 100) {
      return NextResponse.json({ error: "قيمة الخصم يجب أن تكون بين 1 و 100" }, { status: 400 });
    }

    // توليد تلقائي: أنشئ الكود عشوائي مع ضمان عدم التكرار
    let finalCode = autoGenerate ? generateCode(prefix) : code?.trim().toUpperCase();

    if (!finalCode) {
      return NextResponse.json({ error: "يرجى إدخال كود أو تفعيل التوليد التلقائي" }, { status: 400 });
    }

    // تحقق من التكرار مع 5 محاولات للتوليد التلقائي
    if (autoGenerate) {
      let attempts = 0;
      while (attempts < 5) {
        const exists = await prisma.coupon.findUnique({ where: { code: finalCode } });
        if (!exists) break;
        finalCode = generateCode(prefix);
        attempts++;
      }
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: finalCode,
        discount: Number(discount),
        type,
        maxUses: Number(maxUses),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        description,
        active: true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "هذا الكود موجود بالفعل" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "فشل إنشاء الكوبون" }, { status: 500 });
  }
}
