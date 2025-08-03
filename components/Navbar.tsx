'use client'

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { LayoutDashboard, LogIn, LogOut, User } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }) // redirect ke halaman utama setelah logout
  }

  return (
    <nav className="px-4 py-2 h-14 shadow bg-white text-gray-800 flex justify-between items-center sticky top-0 z-50">
      {/* Kiri: Logo dan brand */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 relative">
          <Image
            src="/logo.png"
            alt="Nazhir Logo"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        <span className="text-lg font-semibold tracking-tight font-poppins hover:text-blue-600 transition-colors">
          Nazhir
        </span>
      </Link>

      {/* Kanan: Navigasi */}
      <div className="flex items-center gap-6 text-sm font-medium">
        {session ? (
          <>
            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>

            {/* Icon dan Nama User di paling kanan */}
            <div className="flex items-center gap-1 text-gray-700">
              <User size={18} />
              <span className="capitalize">{session.user?.name}</span>
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <LogIn size={18} />
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
