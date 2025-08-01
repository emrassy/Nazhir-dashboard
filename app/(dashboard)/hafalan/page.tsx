'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Hafalan {
  id: string;
  namaSantri: string;
  judulSurah: string;
  ayat: string;
  tanggal: string;
}

export default function HafalanPage() {
  const router = useRouter();
  const [hafalanList, setHafalanList] = useState<Hafalan[]>([]);
  const [judulSurah, setJudulSurah] = useState('');
  const [ayat, setAyat] = useState('');
  const [tanggal, setTanggal] = useState('');

  const fetchHafalan = async () => {
    const res = await fetch('/api/hafalan');
    const data = await res.json();
    setHafalanList(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/hafalan', {
      method: 'POST',
      body: JSON.stringify({
        judulSurah,
        ayat,
        tanggal,
      
      }),
    });
    if (res.ok) {
      toast.success('Hafalan berhasil ditambahkan');
      setJudulSurah('');
      setAyat('');
      setTanggal('');
      fetchHafalan();
    } else {
      toast.error('Gagal menambah hafalan');
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/hafalan/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      router.refresh(); // reload data
      toast.success('Data berhasil dihapus');
    } else {
      toast.error('Gagal menghapus data');
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
          placeholder="Judul Surah"
          value={judulSurah}
          onChange={(e) => setJudulSurah(e.target.value)}
        />
        <Input
          placeholder="Ayat"
          value={ayat}
          onChange={(e) => setAyat(e.target.value)}
        />
        <Input
          placeholder="Tanggal"
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
        <Button type="submit">Tambah Hafalan</Button>
      </form>

      <div className="space-y-4">
        {hafalanList.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{h.namaSantri}</h2>
              <p className="text-sm text-gray-500">
                {h.judulSurah} - Ayat {h.ayat}
              </p>
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
        ))}
      </div>
    </div>
  );
}
