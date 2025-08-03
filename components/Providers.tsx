"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
      <Toaster
        position="top-right"
        theme="light"
        richColors
        toastOptions={{
          duration: 4000,
          style: {
            background: "#e0f2fe",
            border: "1px solid #3b82f6",
            color: "#1e3a8a",
          },
          classNames: {
            success: "text-blue-700 [&>svg]:text-blue-600",
            error: "text-red-700 [&>svg]:text-red-600",
          },
        }}
      />
    </SessionProvider>
  );
}
