// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    name: string | null;
    email: string;
    password: string;
    role: string;
    emailVerified: Date | null;
  }
}
