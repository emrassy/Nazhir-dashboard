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
        console.error("Error fetching hafalan data:", error);
        toast.error("Terjadi kesalahan saat mengambil data");
        // Redirect back if data fetch fails
        router.push("/hafalan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

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
        const errorText = await res.text();
        console.error("Update API error:", errorText);
        toast.error(errorText || "Gagal update data");
      }
    } catch (error) {
      console.error("Network error updating hafalan:", error);
      toast.error("Gagal update data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/hafalan");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Hafalan</h1>
        <Button variant="outline" onClick={handleCancel}>
          Kembali
        </Button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Nama Santri <span className="text-red-500">*</span>
          </label>
          <Input
            value={namaSantri}
            onChange={(e) => setNamaSantri(e.target.value)}
            placeholder="Nama Santri"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Nama Surat <span className="text-red-500">*</span>
          </label>
          <Input
            value={surat}
            onChange={(e) => setSurat(e.target.value)}
            placeholder="Contoh: Al-Baqarah"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ayat <span className="text-red-500">*</span>
          </label>
          <Input
            value={ayat}
            onChange={(e) => setAyat(e.target.value)}
            placeholder="Contoh: 1-5"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Tanggal <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Catatan
          </label>
          <Input
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Catatan tambahan (opsional)"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Mengupdate..." : "Update Hafalan"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}