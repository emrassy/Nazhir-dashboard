// app/api/hafalan/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const hafalan = await db.hafalan.findMany({
      orderBy: { tanggal: "desc" },
      include: { santri: true }, // kalau kamu ingin info santri juga
    });

    return NextResponse.json(hafalan);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data", error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tanggal, surat, ayat, catatan, santriId } = body;

    if (!tanggal || !surat || !ayat || !santriId) {
      return NextResponse.json(
        { message: "Tanggal, surat, ayat, dan santriId wajib diisi" },
        { status: 400 }
      );
    }

    const newHafalan = await db.hafalan.create({
      data: {
        tanggal: new Date(tanggal),
        surat,
        ayat,
        catatan,
        santri: {
          connect: { id: santriId }, // ini cara menghubungkan dengan relasi
        },
      },
    });

    return NextResponse.json(newHafalan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menambahkan data", error }, { status: 500 });
  }
}
