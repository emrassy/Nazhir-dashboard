import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const hafalan = await db.hafalan.findUnique({
      where: { id },
    });

    if (!hafalan) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(hafalan);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data", error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { tanggal, surat, ayat, catatan } = body;

    if (!tanggal || !surat || !ayat) {
      return NextResponse.json({ message: "Tanggal, surat, dan ayat wajib diisi" }, { status: 400 });
    }

    const updated = await db.hafalan.update({
      where: { id },
      data: {
        tanggal: new Date(tanggal),
        surat,
        ayat,
        catatan,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengupdate data", error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.hafalan.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus data", error }, { status: 500 });
  }
}