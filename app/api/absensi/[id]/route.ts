import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: any, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await db.absensi.findUnique({ where: { id } });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updated = await db.absensi.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.absensi.delete({ where: { id } });
  return NextResponse.json({ success: true });
}