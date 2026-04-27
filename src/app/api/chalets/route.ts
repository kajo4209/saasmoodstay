// src/app/api/chalets/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// ────────────────────────────────────────────────
// GET /api/chalets — جيب كل الشاليهات
// ────────────────────────────────────────────────
export async function GET() {
  try {
    const chalets = await prisma.chalet.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(chalets);
  } catch (error) {
    console.error("GET /api/chalets error:", error);
    return NextResponse.json(
      { error: "فشل في جلب الشاليهات" },
      { status: 500 }
    );
  }
}

// ────────────────────────────────────────────────
// POST /api/chalets — أضف شاليه جديد
// ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name        = formData.get("name") as string;
    const price       = Number(formData.get("price"));
    const rooms       = Number(formData.get("rooms"));
    const description = formData.get("description") as string;
    const features    = formData.get("features") as string;
    const type        = (formData.get("type") as string) ?? "family";

    // ─── التحقق من البيانات ───
    if (!name || !price || !rooms || !description) {
      return NextResponse.json(
        { error: "يرجى ملء جميع الحقول المطلوبة" },
        { status: 400 }
      );
    }

    // ─── رفع الصور ───
    const imageFiles = formData.getAll("images") as File[];
    const savedPaths: string[] = [];

    if (imageFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "chalets");
      await mkdir(uploadDir, { recursive: true });

      for (const file of imageFiles) {
        if (file.size === 0) continue;

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext    = file.name.split(".").pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        savedPaths.push(`/uploads/chalets/${filename}`);
      }
    }

    // ─── حفظ في قاعدة البيانات ───
    const chalet = await prisma.chalet.create({
      data: {
        name,
        price,
        rooms,
        description,
        features,
        type,
        images: savedPaths,
      },
    });

    return NextResponse.json(chalet, { status: 201 });
  } catch (error) {
    console.error("POST /api/chalets error:", error);
    return NextResponse.json(
      { error: "فشل في إضافة الشاليه" },
      { status: 500 }
    );
  }
}
