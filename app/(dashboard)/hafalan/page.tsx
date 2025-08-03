'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
// Removed unused router import

interface Hafalan {
  id: string;
  tanggal: string;
  surat: string;
  ayat: string;
  catatan?: string;
  namaSantri: string; // Ganti dari relasi `santri`
}

export default function HafalanPage() {
  // Removed unused router variable
  const [hafalanList, setHafalanList] = useState<Hafalan[]>([]);
  const [namaSantri, setNamaSantri] = useState('');
  const [surat, setSurat] = useState('');
  const [ayat, setAyat] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchHafalan = async () => {
    try {
      const res = await fetch('/api/hafalan');
      if (res.ok) {
        const data = await res.json();
        setHafalanList(data);
      } else {
        toast.error('Gagal memuat data hafalan');
      }
    } catch (error) {
      console.error('Error fetching hafalan:', error);
      toast.error('Terjadi kesalahan saat memuat data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaSantri.trim() || !surat.trim() || !ayat.trim() || !tanggal) {
      toast.error('Nama santri, surat, ayat, dan tanggal harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        namaSantri: namaSantri.trim(),
        surat: surat.trim(),
        ayat: ayat.trim(),
        tanggal,
        catatan: catatan.trim() || undefined,
      };

      const res = await fetch('/api/hafalan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Hafalan berhasil ditambahkan');
        setNamaSantri('');
        setSurat('');
        setAyat('');
        setTanggal('');
        setCatatan('');
        await fetchHafalan();
      } else {
        const errorText = await res.text();
        console.error('API error:', errorText);
        toast.error(errorText || 'Gagal menambah hafalan');
      }
    } catch (error) {
      console.error('Network error adding hafalan:', error);
      toast.error('Kesalahan jaringan saat menambah hafalan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus hafalan ini?')) return;

    try {
      const res = await fetch(`/api/hafalan/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Data berhasil dihapus');
        setHafalanList(prev => prev.filter(h => h.id !== id));
      } else {
        const errorText = await res.text();
        console.error('Delete error:', errorText);
        toast.error(errorText || 'Gagal menghapus data');
      }
    } catch (error) {
      console.error('Network error deleting hafalan:', error);
      toast.error('Terjadi kesalahan saat menghapus data');
    }
  };

  useEffect(() => {
    fetchHafalan();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Catatan Hafalan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Nama Santri"
          value={namaSantri}
          onChange={(e) => setNamaSantri(e.target.value)}
          required
        />
        <Input
          placeholder="Nama Surat (contoh: Al-Fatihah)"
          value={surat}
          onChange={(e) => setSurat(e.target.value)}
          required
        />
        <Input
          placeholder="Ayat (contoh: 1-7)"
          value={ayat}
          onChange={(e) => setAyat(e.target.value)}
          required
        />
        <Input
          placeholder="Tanggal"
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />
        <Input
          placeholder="Catatan (opsional)"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menambahkan...' : 'Tambah Hafalan'}
        </Button>
      </form>

      <div className="space-y-4">
        {hafalanList.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada data hafalan</p>
        ) : (
          hafalanList.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{h.namaSantri}</h2>
                <p className="text-sm text-gray-500">
                  {h.surat} - Ayat {h.ayat}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(h.tanggal).toLocaleDateString('id-ID')}
                </p>
                {h.catatan && (
                  <p className="text-xs text-gray-600 mt-1">{h.catatan}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/hafalan/${h.id}/edit`}>
                  <button className="text-blue-600 hover:underline">Edit</button>
                </Link>
                <button
                  onClick={() => handleDelete(h.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}