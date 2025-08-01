// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/hafalan/:path*",
    "/absensi/:path*",
    // tambahkan route lain yang harus dilindungi
  ],
};
