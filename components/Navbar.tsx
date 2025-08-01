'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 shadow bg-background text-foreground flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Nazhir</Link>
      <div className="flex gap-4">
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/api/auth/signout">Logout</Link>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
