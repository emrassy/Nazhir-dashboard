'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
    tanggal: "",
    status: "Hadir",
    catatan: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isSubmittingRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    setForm(prev => ({
      ...prev,
      tanggal: new Date().toISOString().split("T")[0]
    }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = (): boolean => {
    if (!form.namaSantri.trim()) return false
    if (!form.tanggal) return false
    if (!form.status) return false

    const selectedDate = new Date(form.tanggal)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    if (selectedDate > today) return false

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading || isSubmittingRef.current) return
    if (!validateForm()) return

    setIsLoading(true)
    isSubmittingRef.current = true

    try {
      const dataToSend = {
        namaSantri: form.namaSantri.trim(),
        tanggal: form.tanggal,
        status: form.status,
        catatan: form.catatan?.trim() || "",
        createdAt: new Date().toISOString()
      }

      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      if (!res.ok) {
        throw new Error("Gagal menambahkan absensi")
      }

      setForm({
        namaSantri: "",
        tanggal: new Date().toISOString().split("T")[0],
        status: "Hadir",
        catatan: "",
      })

      setTimeout(() => {
        router.push("/absensi?added=true")
      }, 1500)

    } catch (error) {
      console.error("Error saving absensi:", error)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        isSubmittingRef.current = false
      }, 2000)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Tambah Absensi Santri</h1>

      {!mounted ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="namaSantri">Nama Santri</Label>
            <Input 
              id="namaSantri"
              name="namaSantri" 
              value={form.namaSantri} 
              onChange={handleChange} 
              required 
              placeholder="Masukkan nama santri"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input 
              id="tanggal"
              type="date" 
              name="tanggal" 
              value={form.tanggal} 
              onChange={handleChange} 
              required 
              max={new Date().toISOString().split("T")[0]}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status Kehadiran</Label>
            <select 
              id="status"
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading}
            >
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Alpha">Alpha</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="catatan">Catatan (Opsional)</Label>
            <Textarea 
              id="catatan"
              name="catatan" 
              value={form.catatan} 
              onChange={handleChange} 
              placeholder="Tambahkan catatan jika diperlukan"
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || isSubmittingRef.current}
              className={`${(isLoading || isSubmittingRef.current) ? "opacity-50 cursor-not-allowed" : ""} min-w-[120px]`}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
            <Link 
              href="/absensi" 
              className="text-sm text-blue-500 hover:underline transition-colors"
            >
              ← Kembali
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
