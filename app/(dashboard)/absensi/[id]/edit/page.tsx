import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { absensiFormSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

interface EditAbsensiPageProps {
  params: Promise<{ id: string }>; 
}

export default async function EditAbsensiPage({ params }: EditAbsensiPageProps) {
   const { id } = await params;

  const numericId = parseInt(id, 10);

   if (isNaN(numericId)) {
    return notFound();
  }

  const absensi = await db.absensi.findUnique({ where: { id: numericId } });

  if (!absensi) return notFound();

  async function handleEdit(formData: FormData) {
    "use server";

    const rawData = Object.fromEntries(formData.entries());
    const parsed = absensiFormSchema.safeParse(rawData);

    if (!parsed.success) {
      console.error("Data tidak valid", parsed.error.format());
      return;
    }

    const { namaSantri, tanggal, status, catatan } = parsed.data;

    try {
      await db.absensi.update({
        where: { id: numericId },
        data: {
          namaSantri,
          tanggal: new Date(tanggal),
          status,
          catatan,
        },
      });

      revalidatePath("/absensi");
      redirect("/absensi");
    } catch (updateError) {
      console.error("Error updating absensi:", updateError);
      // Anda bisa handle error ini sesuai kebutuhan
      throw updateError;
    }
  }

  return (
    <form action={handleEdit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold mb-4">Edit Absensi Santri</h1>

      <div>
        <Label htmlFor="namaSantri">Nama Santri</Label>
        <Input
          id="namaSantri"
          name="namaSantri"
          defaultValue={absensi.namaSantri}
          required
        />
      </div>

      <div>
        <Label htmlFor="tanggal">Tanggal</Label>
        <Input
          id="tanggal"
          type="date"
          name="tanggal"
          defaultValue={absensi.tanggal.toISOString().split("T")[0]}
          required
        />
      </div>

      <div>
        <Label htmlFor="status">Status Kehadiran</Label>
        <select
          id="status"
          name="status"
          defaultValue={absensi.status}
          className="w-full border rounded p-2"
          required
        >
          <option value="Hadir">Hadir</option>
          <option value="Izin">Izin</option>
          <option value="Sakit">Sakit</option>
          <option value="Alpha">Alpha</option>
        </select>
      </div>

      <div>
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea
          id="catatan"
          name="catatan"
          defaultValue={absensi.catatan || ""}
        />
      </div>

      <Button type="submit" className="w-full mt-4">
        Simpan Perubahan
      </Button>
    </form>
  );
}