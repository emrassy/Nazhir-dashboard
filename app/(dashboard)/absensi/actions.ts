"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// Cache untuk mencegah multiple operations pada ID yang sama
const operationCache = new Map<string, Promise<any>>()

export async function getAbsensiList() {
  try {
    const data = await db.absensi.findMany({
      orderBy: { tanggal: "desc" },
    })
    
    return data.map((item) => ({
      ...item,
      tanggal: item.tanggal.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching absensi list:", error)
    throw new Error("Gagal mengambil data absensi")
  }
}

export async function deleteAbsensi(id: number) {
  const cacheKey = `delete-${id}`
  
  // Check if operation is already in progress
  if (operationCache.has(cacheKey)) {
    return operationCache.get(cacheKey)
  }

  const deleteOperation = async () => {
    try {
      // Verify record exists before deleting
      const existingAbsensi = await db.absensi.findUnique({
        where: { id }
      })

      if (!existingAbsensi) {
        throw new Error("Data absensi tidak ditemukan")
      }

      await db.absensi.delete({
        where: { id },
      })

      // Revalidate the path to refresh data
      revalidatePath("/absensi")
      
      return { success: true, message: "Data absensi berhasil dihapus" }

    } catch (error) {
      console.error("Error deleting absensi:", error)
      throw new Error("Gagal menghapus data absensi")
    } finally {
      // Clean up cache after operation
      setTimeout(() => {
        operationCache.delete(cacheKey)
      }, 1000)
    }
  }

  // Cache the operation
  const operation = deleteOperation()
  operationCache.set(cacheKey, operation)

  return operation
}

export async function createAbsensi(data: {
  namaSantri: string;
  tanggal: string;
  status: string;
  catatan?: string;
}) {
  try {
    const newAbsensi = await db.absensi.create({
      data: {
        namaSantri: data.namaSantri.trim(),
        tanggal: new Date(data.tanggal),
        status: data.status,
        catatan: data.catatan?.trim() || null,
        createdAt: new Date(),
      }
    })

    revalidatePath("/absensi")
    return newAbsensi

  } catch (error) {
    console.error("Error creating absensi:", error)
    throw new Error("Gagal menambahkan data absensi")
  }
}

export async function updateAbsensi(id: number, data: {
  namaSantri: string;
  tanggal: string;
  status: string;
  catatan?: string;
}) {
  try {
    const updatedAbsensi = await db.absensi.update({
      where: { id },
      data: {
        namaSantri: data.namaSantri.trim(),
        tanggal: new Date(data.tanggal),
        status: data.status,
        catatan: data.catatan?.trim() || null,
        updatedAt: new Date(),
      }
    })

    revalidatePath("/absensi")
    return updatedAbsensi

  } catch (error) {
    console.error("Error updating absensi:", error)
    throw new Error("Gagal mengupdate data absensi")
  }
}