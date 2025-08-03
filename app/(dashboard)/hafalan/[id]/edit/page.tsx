'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditHafalanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [namaSantri, setNamaSantri] = useState("");
  const [surat, setSurat] = useState("");
  const [ayat, setAyat] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/hafalan/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data");

        const data = await res.json();
        setNamaSantri(data.namaSantri || "");
        setSurat(data.surat || "");
        setAyat(data.ayat || "");
        setTanggal(data.tanggal?.split("T")[0] || "");
        setCatatan(data.catatan || "");
      } catch (error) {
        toast.error("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaSantri || !surat || !ayat || !tanggal) {
      toast.error("Semua kolom wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/hafalan/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          namaSantri,
          surat,
          ayat,
          tanggal,
          catatan: catatan || undefined
        }),
      });

      if (res.ok) {
        toast.success("Data berhasil diupdate");
        router.push("/hafalan");
      } else {
        throw new Error("Gagal update");
      }
    } catch (error) {
      toast.error("Gagal update data");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Memuat data...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Hafalan</h1>

      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Nama Santri</label>
          <Input
            value={namaSantri}
            onChange={(e) => setNamaSantri(e.target.value)}
            placeholder="Nama Santri"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Nama Surat</label>
          <Input
            value={surat}
            onChange={(e) => setSurat(e.target.value)}
            placeholder="Contoh: Al-Baqarah"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Ayat</label>
          <Input
            value={ayat}
            onChange={(e) => setAyat(e.target.value)}
            placeholder="Contoh: 1-5"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Tanggal</label>
          <Input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Catatan (opsional)</label>
          <Input
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Catatan tambahan"
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Mengupdate..." : "Update Hafalan"}
        </Button>
      </form>
    </div>
  );
}
