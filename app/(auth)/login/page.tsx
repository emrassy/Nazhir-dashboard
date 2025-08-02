import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={
        <div className="space-y-4 w-full max-w-sm p-6 border rounded-xl shadow-md">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
