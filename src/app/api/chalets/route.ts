import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

async function uploadImageToCloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "moodstay/chalets" },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

export async function GET() {
  try {
    const chalets = await prisma.chalet.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        bookings: {
          where: { status: "confirmed" }, // بس الحجوزات المؤكدة
          select: { id: true },
        },
      },
    });

    // تحويل البيانات وإضافة bookingsCount
    const chaletsWithCount = chalets.map((chalet) => ({
      ...chalet,
      bookingsCount: chalet.bookings.length, // عدد الحجوزات المؤكدة
      bookings: undefined, // نشيل الـ array عشان الـ response يبقى نظيف
    }));

    return NextResponse.json(chaletsWithCount);
  } catch (error) {
    console.error("GET /api/chalets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chalets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const rooms = Number(formData.get("rooms"));
    const description = formData.get("description") as string;
    const features = formData.get("features") as string;
    const type = ((formData.get("type") as string) ?? "family") as "family" | "youth";

    if (!name || !price || !rooms || !description || !features) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    if (
      imageFiles.length > 0 &&
      (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET)
    ) {
      return NextResponse.json(
        { error: "Cloudinary environment variables are missing on server." },
        { status: 500 }
      );
    }

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await uploadImageToCloudinary(file);
        imageUrls.push(url);
      }
    }

    const chalet = await prisma.chalet.create({
      data: {
        name,
        price,
        rooms,
        description,
        features,
        type,
        images: imageUrls,
      },
    });

    // إضافة bookingsCount = 0 للشاليه الجديد
    const chaletWithCount = {
      ...chalet,
      bookingsCount: 0,
    };

    return NextResponse.json(chaletWithCount, { status: 201 });
  } catch (error) {
    console.error("POST /api/chalets error:", error);
    const details =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { error: `Failed to create chalet: ${details}` },
      { status: 500 }
    );
  }
}