import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";
import { LoginHero } from "@/features/auth/login-hero";

export const metadata: Metadata = { title: "Entrar | VendorHub" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-surface p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl items-stretch gap-6 sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.1fr_1fr]">
        <LoginHero />
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}