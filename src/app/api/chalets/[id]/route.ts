import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

async function uploadImageToCloudinary(file: File): Promise<string> {
  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "moodstay/chalets" },
      (error, result) => {
        if (error || !result?.secure_url) { reject(error ?? new Error("Upload failed")); return; }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chalet = await prisma.chalet.findUnique({
    where: { id: Number(id) },
    include: { bookings: true },
  });
  if (!chalet) return NextResponse.json({ error: "Chalet not found" }, { status: 404 });
  return NextResponse.json(chalet);
}

// PUT — يقبل FormData ويتعامل مع الصور
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const formData    = await req.formData();
    const name        = formData.get("name") as string;
    const price       = Number(formData.get("price"));
    const rooms       = Number(formData.get("rooms"));
    const description = formData.get("description") as string;
    const features    = formData.get("features") as string;
    const type        = (formData.get("type") as string) ?? "family";

    // الصور الحالية المتبقية (اللي الأونر مامسحهاش)
    const keptImages  = formData.getAll("keptImages") as string[];

    // صور جديدة للرفع
    const newFiles    = formData.getAll("newImages") as File[];
    const uploadedUrls: string[] = [];

    for (const file of newFiles) {
      if (file && file.size > 0) {
        const url = await uploadImageToCloudinary(file);
        uploadedUrls.push(url);
      }
    }

    const finalImages = [...keptImages, ...uploadedUrls];

    const chalet = await prisma.chalet.update({
      where: { id: Number(id) },
      data: { name, price, rooms, description, features, type, images: finalImages },
    });

    return NextResponse.json(chalet);
  } catch (error) {
    console.error("PUT /api/chalets/:id error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

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