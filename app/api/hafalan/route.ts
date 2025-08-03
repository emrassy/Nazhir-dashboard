import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const hafalan = await db.hafalan.findMany({
      orderBy: { tanggal: "desc" },
    });

    return NextResponse.json(hafalan);
  } catch (error) {
    console.error("Database error in GET /api/hafalan:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data hafalan" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tanggal, surat, ayat, catatan, namaSantri } = body;

    console.log("Received POST data:", { tanggal, surat, ayat, catatan, namaSantri });

    // Validasi input
    if (!tanggal || !surat || !ayat || !namaSantri) {
      return NextResponse.json(
        { message: "Tanggal, surat, ayat, dan nama santri wajib diisi" },
        { status: 400 }
      );
    }

    const newHafalan = await db.hafalan.create({
      data: {
        tanggal: new Date(tanggal),
        surat,
        ayat,
        catatan: catatan || null,
        namaSantri,
      },
    });

    console.log("Created hafalan:", newHafalan);
    return NextResponse.json(newHafalan, { status: 201 });

  } catch (error) {
    console.error("Database error in POST /api/hafalan:", error);

    return NextResponse.json(
      { message: "Gagal menambahkan data hafalan" },
      { status: 500 }
    );
  }
}
