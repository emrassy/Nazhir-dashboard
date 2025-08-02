"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteAbsensi } from "./actions" 

interface DeleteButtonProps {
  id: string;
}

export function DeleteButton({ id }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteAbsensi(id)
        toast.success("Absensi berhasil dihapus.")
      } catch (error) {
        console.error("Error deleting absensi:", error) // Menambahkan logging untuk kesalahan
        toast.error("Gagal menghapus absensi.")
      }
    })
  }

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={handleDelete}
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </Button>
  )
}
