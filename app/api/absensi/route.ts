import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const data = await db.absensi.findMany({ orderBy: { tanggal: 'desc' } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await db.absensi.create({ data: body });
  return NextResponse.json(data);
}
