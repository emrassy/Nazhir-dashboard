import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AbsensiFormSchema, absensiFormSchema } from "@/lib/schema"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { toast } from "sonner"

interface EditPageProps {
    params: { id: string }
}

export default async function EditAbsensiPage({ params }: EditPageProps) {
    const absensi = await db.absensi.findUnique({ where: { id: params.id } })

    if (!absensi) return notFound()

    async function handleEdit(formData: FormData) {
        "use server"

        const rawData = Object.fromEntries(formData.entries())
        const parsed = absensiFormSchema.safeParse(rawData)

        if (!parsed.success) {
            console.error("Data tidak valid", parsed.error.format());
            return;
        }

        const { namaSantri, tanggal, status, catatan } = parsed.data

        await db.absensi.update({
            where: { id: params.id },
            data: {
                namaSantri,
                tanggal: new Date(tanggal),
                status,
                catatan,
            },
        })

        revalidatePath("/absensi")
        redirect("/absensi")
    }

    return (
        <form action={handleEdit} className="max-w-2xl mx-auto p-6 space-y-4">
            <h1 className="text-xl font-bold mb-4">Edit Absensi Santri</h1>

            <div>
                <Label>Nama Santri</Label>
                <Input name="namaSantri" defaultValue={absensi.namaSantri} required />
            </div>

            <div>
                <Label>Tanggal</Label>
                <Input
                    type="date"
                    name="tanggal"
                    defaultValue={absensi.tanggal.toISOString().split("T")[0]}
                    required
                />
            </div>

            <div>
                <Label>Status</Label>
                <Input name="status" defaultValue={absensi.status} required />
            </div>

            <div>
                <Label>Catatan</Label>
                <Textarea name="catatan" defaultValue={absensi.catatan || ""} />
            </div>

            <Button type="submit" className="w-full mt-4">
                Simpan Perubahan
            </Button>
        </form>
    )
}
