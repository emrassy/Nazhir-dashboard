"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function HafalanForm() {
  const [form, setForm] = useState({ namaSantri: "", surat: "", ayat: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/hafalan", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("Data berhasil ditambahkan");
      setForm({ namaSantri: "", surat: "", ayat: "" });
    } else {
      toast.error("Gagal menambahkan data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nama Santri"
        name="namaSantri"
        value={form.namaSantri}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Surat"
        name="surat"
        value={form.surat}
        onChange={handleChange}
        required
      />
      <Input
        placeholder="Ayat"
        name="ayat"
        value={form.ayat}
        onChange={handleChange}
        required
      />
      <Button type="submit" className="w-full">Simpan</Button>
    </form>
  );
}
