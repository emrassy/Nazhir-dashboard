"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Hafalan {
  id: string;
  namaSurat: string;
  ayat: string;
}

export default function HafalanList() {
  const [hafalan, setHafalan] = useState<Hafalan[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editNamaSurat, setEditNamaSurat] = useState("");
  const [editAyat, setEditAyat] = useState("");

  const fetchHafalan = async () => {
    const res = await fetch("/api/hafalan");
    const data = await res.json();
    setHafalan(data);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/hafalan/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Data berhasil dihapus");
      fetchHafalan();
    } else {
      toast.error("Gagal menghapus data");
    }
  };

  const handleEdit = (item: Hafalan) => {
    setEditId(item.id);
    setEditNamaSurat(item.namaSurat);
    setEditAyat(item.ayat);
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/hafalan/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaSurat: editNamaSurat, ayat: editAyat }),
    });

    if (res.ok) {
      toast.success("Data berhasil diupdate");
      setEditId(null);
      fetchHafalan();
    } else {
      toast.error("Gagal update data");
    }
  };

  useEffect(() => {
    fetchHafalan();
  }, []);

  return (
    <div className="mt-4 space-y-4">
      {hafalan.map((item) =>
        editId === item.id ? (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              value={editNamaSurat}
              onChange={(e) => setEditNamaSurat(e.target.value)}
            />
            <Input
              value={editAyat}
              onChange={(e) => setEditAyat(e.target.value)}
            />
            <Button onClick={handleUpdate}>Simpan</Button>
            <Button variant="outline" onClick={() => setEditId(null)}>
              Batal
            </Button>
          </div>
        ) : (
          <div
            key={item.id}
            className="flex items-center justify-between border p-3 rounded-lg"
          >
            <div>
              <p className="font-semibold">{item.namaSurat}</p>
              <p className="text-sm text-gray-500">{item.ayat}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleEdit(item)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(item.id)}
              >
                Hapus
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
