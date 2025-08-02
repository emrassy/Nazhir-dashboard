'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface FormData {
  namaSantri: string;
  tanggal: string;
  status: string;
  catatan?: string;
}

export default function TambahAbsensiPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    namaSantri: "",
    tanggal: new Date().toISOString().split("T")[0],
    status: "Hadir",
    catatan: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Gagal menambahkan absensi")

      toast.success("Absensi berhasil ditambahkan")
      router.push("/absensi")
    } catch (error) {
      console.error("Error saving absensi:", error) // Menambahkan logging untuk kesalahan
      toast.error("Terjadi kesalahan saat menyimpan")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Tambah Absensi Santri</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nama Santri</Label>
          <Input name="namaSantri" value={form.namaSantri} onChange={handleChange} required />
        </div>
        <div>
          <Label>Tanggal</Label>
          <Input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required />
        </div>
        <div>
          <Label>Status Kehadiran</Label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded p-2">
            <option value="Hadir">Hadir</option>
            <option value="Izin">Izin</option>
            <option value="Sakit">Sakit</option>
            <option value="Alpha">Alpha</option>
          </select>
        </div>
        <div>
          <Label>Catatan (Opsional)</Label>
          <Textarea name="catatan" value={form.catatan} onChange={handleChange} />
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit">Simpan</Button>
          <Link href="/absensi" className="text-sm text-blue-500 hover:underline">← Kembali</Link>
        </div>
      </form>
    </div>
  )
}
