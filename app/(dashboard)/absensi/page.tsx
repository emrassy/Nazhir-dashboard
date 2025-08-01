"use client"

import Link from "next/link"
import { useEffect, useState, useTransition } from "react"
import { deleteAbsensi, getAbsensiList } from "./actions" 
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CalendarDays, PlusCircle } from "lucide-react"

type Absensi = {
  id: string
  namaSantri: string
  tanggal: string 
  status: string
  catatan?: string | null
}

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteAbsensi(id)
        toast.success("Data absensi berhasil dihapus")
        location.reload()
      } catch (error) {
        toast.error("Gagal menghapus data")
      }
    })
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
      {isPending ? "Menghapus..." : "Hapus"}
    </Button>
  )
}

export default function AbsensiPage() {
  const [absensiList, setAbsensiList] = useState<Absensi[]>([])

  useEffect(() => {
    getAbsensiList().then(setAbsensiList)
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Absensi</h1>
        <Link href="/absensi/tambah">
          <Button className="flex gap-2">
            <PlusCircle className="w-5 h-5" />
            Tambah Absensi
          </Button>
        </Link>
      </div>

      {absensiList.length === 0 ? (
        <p className="text-gray-500">Belum ada data absensi.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Nama Santri</th>
                <th className="border px-4 py-2 text-left">Tanggal</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Catatan</th>
                <th className="border px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {absensiList.map((absensi) => (
                <tr key={absensi.id}>
                  <td className="border px-4 py-2">{absensi.namaSantri}</td>
                  <td className="border px-4 py-2">
                    {new Date(absensi.tanggal).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border px-4 py-2">{absensi.status}</td>
                  <td className="border px-4 py-2">{absensi.catatan}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Link href={`/absensi/${absensi.id}/edit`}>
                      <Button variant="outline">Edit</Button>
                    </Link>
                    <DeleteButton id={absensi.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
