"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { deleteAbsensi } from "./actions" 

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await deleteAbsensi(id)
            toast.success("Absensi berhasil dihapus.")
          } catch (error) {
            toast.error("Gagal menghapus absensi.")
          }
        })
      }
    >
      {isPending ? "Menghapus..." : "Hapus"}
    </Button>
  )
}
