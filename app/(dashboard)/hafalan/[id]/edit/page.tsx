'use client'

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function EditHafalanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [namaSantri, setNamaSantri] = useState("");
  const [judulSurah, setJudulSurah] = useState("");
  const [ayat, setAyat] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/hafalan/${id}`);
      const data = await res.json();
      setNamaSantri(data.namaSantri);
      setJudulSurah(data.judulSurah);
      setAyat(data.ayat.toString());
    };
    fetchData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/hafalan/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        namaSantri,
        judulSurah,
        ayat: Number(ayat),
      }),
    });

    if (res.ok) {
      toast.success("Data berhasil diupdate");
      router.push("/hafalan");
    } else {
      toast.error("Gagal update data");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Hafalan</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          value={namaSantri}
          onChange={(e) => setNamaSantri(e.target.value)}
          placeholder="Nama Santri"
          className="w-full border rounded p-2"
        />
        <input
          value={judulSurah}
          onChange={(e) => setJudulSurah(e.target.value)}
          placeholder="Judul Surah"
          className="w-full border rounded p-2"
        />
        <input
          value={ayat}
          onChange={(e) => setAyat(e.target.value)}
          placeholder="Ayat"
          type="number"
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}

