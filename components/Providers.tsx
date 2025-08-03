"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  // Pastikan component sudah mounted di client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render versi SSR-safe dulu
  if (!mounted) {
    return (
      <SessionProvider>
        {children}
        {/* Toaster tidak di-render saat SSR untuk menghindari hydration mismatch */}
      </SessionProvider>
    );
  }

  // Render lengkap setelah mounted
  return (
    <SessionProvider
      // Tambahkan konfigurasi untuk stabilitas
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
      <Toaster 
        richColors 
        position="top-center"
        expand={true}
        closeButton={true}
        // Tambahkan props untuk konsistensi
        theme="light"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            color: '#1f2937',
          },
          className: 'toast',
          duration: 4000,
        }}
      />
    </SessionProvider>
  );
}