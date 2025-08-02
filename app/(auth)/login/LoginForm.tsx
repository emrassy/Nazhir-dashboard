'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.ok) {
      toast.success("Login berhasil!");
      router.push(callbackUrl);
    } else {
      toast.error("Email atau password salah");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4 w-full max-w-sm p-6 border rounded-xl shadow-md"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </Button>

      <p className="text-sm text-center">
        Belum mendaftar?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Silakan daftar
        </Link>
      </p>
    </form>
  );
}