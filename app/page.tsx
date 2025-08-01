'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
       <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Selamat Datang di Nazhir </h1>
          <p className="text-muted-foreground mb-6">
            Sistem Dashboard Pemantauan Hafalan, Absensi, dan Perkembangan Santri
            berbasis Web.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard">Masuk Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
