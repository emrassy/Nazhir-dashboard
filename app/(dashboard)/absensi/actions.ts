"use server"

import { db } from "@/lib/db"

export async function getAbsensiList() {
  const data = await db.absensi.findMany({
    orderBy: { tanggal: "desc" },
  })
  return data.map((item) => ({
    ...item,
    tanggal: item.tanggal.toISOString(),
  }))
}

export async function deleteAbsensi(id: string) {
  await db.absensi.delete({
    where: { id },
  })
}
