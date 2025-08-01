import { z } from "zod";

export const AbsensiFormSchema = z.object({
  namaSantri: z.string().min(1, "Nama santri wajib diisi"),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  status: z.string().min(1, "Status wajib diisi"),
  catatan: z.string().optional(),
});

export type AbsensiFormData = z.infer<typeof AbsensiFormSchema>;
export const absensiFormSchema = AbsensiFormSchema;
