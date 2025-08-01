'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, BookOpen } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen py-12 px-6 md:px-20 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
        Selamat Datang di Dashboard Nazhir
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Absensi Santri */}
        <Card className="hover:shadow-lg transition-all">
          <CardContent className="p-6 flex flex-col items-center">
            <CalendarCheck className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Absensi Santri</h2>
            <p className="text-gray-600 mb-4 text-center">
              Pantau dan kelola kehadiran santri setiap hari.
            </p>
            <Link href="/absensi">
              <Button variant="default" className="w-full">
                Kelola Absensi
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Hafalan Santri */}
        <Card className="hover:shadow-lg transition-all">
          <CardContent className="p-6 flex flex-col items-center">
            <BookOpen className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Hafalan Santri</h2>
            <p className="text-gray-600 mb-4 text-center">
              Pantau perkembangan hafalan Al-Qur'an santri.
            </p>
            <Link href="/hafalan">
              <Button variant="default" className="w-full">
                Kelola Hafalan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
