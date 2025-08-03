"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { deleteAbsensi } from "./actions"

interface DeleteButtonProps {
  id: string | number;
  onSuccess?: () => void;
  className?: string;
}

export function DeleteButton({ id, onSuccess, className }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const operationIdRef = useRef<string>("")

  const handleDelete = async () => {
    if (isDeleting) return

    const operationId = `delete-${id}-${Date.now()}`
    operationIdRef.current = operationId

    try {
      setIsDeleting(true)
      await deleteAbsensi(Number(id))
      if (operationIdRef.current === operationId) {
        onSuccess?.()
      }
    } catch (error: any) {
      console.error("Error deleting absensi:", error)
    } finally {
      setIsDeleting(false)
      setTimeout(() => {
        operationIdRef.current = ""
      }, 1000)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isDeleting}
      onClick={handleDelete}
      className={`${isDeleting ? 'opacity-50 cursor-not-allowed' : ''} min-w-[80px] ${className || ''}`}
    >
      {isDeleting ? "Menghapus..." : "Hapus"}
    </Button>
  )
}

export function DeleteButtonWithConfirm({ id, onSuccess, className }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const operationIdRef = useRef<string>("")

  const handleConfirm = async () => {
    if (isDeleting) return

    const operationId = `delete-confirm-${id}-${Date.now()}`
    operationIdRef.current = operationId

    try {
      setIsDeleting(true)
      setShowConfirm(false)
      await deleteAbsensi(Number(id))
      if (operationIdRef.current === operationId) {
        onSuccess?.()
      }
    } catch (error: any) {
      console.error("Error deleting absensi:", error)
    } finally {
      setIsDeleting(false)
      setTimeout(() => {
        operationIdRef.current = ""
      }, 1000)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleConfirm}
          disabled={isDeleting}
          className="min-w-[100px]"
        >
          {isDeleting ? "Menghapus..." : "Ya, Hapus"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isDeleting}
        >
          Batal
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      className={`min-w-[80px] ${className || ''}`}
    >
      Hapus
    </Button>
  )
}
