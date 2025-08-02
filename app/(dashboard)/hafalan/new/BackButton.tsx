'use client'

import { Button } from "@/components/ui/button"

export default function BackButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => window.history.back()}
      className="mt-6"
    >
      Kembali ke Dashboard
    </Button>
  )
}