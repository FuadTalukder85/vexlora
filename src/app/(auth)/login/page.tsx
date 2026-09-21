"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, LogIn, LogOut, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { useIsMounted } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login, logout, user, isAuthenticated, isLoading } = useAuthStore();
  const mounted = useIsMounted();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-redirect if already signed in
  React.useEffect(() => {
    if (mounted && isAuthenticated && user) {
      router.replace(redirectUrl);
    }
  }, [mounted, isAuthenticated, user, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      const res = await login(email, password);
      toast.success(`Welcome back, ${res.user?.name || "Shopper"}!`);
      router.push(redirectUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  if (mounted && isAuthenticated && user) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 bg-muted/50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-md">
            {user.name?.charAt(0).toUpperCase() || "V"}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-primary">
              You are signed in
            </h1>
            <p className="text-xs text-secondary font-medium">
              Signed in as <strong className="text-primary">{user.name}</strong> ({user.email})
            </p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-muted text-primary text-[10px] font-bold uppercase tracking-wider">
              Role: {user.role}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                router.push(redirectUrl);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              Continue to Marketplace <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={async () => {
                await logout();
                toast.success("Signed out successfully");
              }}
              className="w-full py-3 px-4 rounded-xl bg-highlight/10 hover:bg-highlight/10 text-highlight text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-highlight/30"
            >
              <LogOut className="w-4 h-4 text-highlight" />
              Sign Out from Vexlora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 bg-muted/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-border p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-primary text-white items-center justify-center font-extrabold text-2xl shadow-md mb-1">
            V
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            Welcome Back to Vexlora
          </h1>
          <p className="text-xs text-secondary">
            Sign in to access your orders, saved items, and personalized shopping
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-highlight/10 border border-highlight/30 text-highlight text-xs animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-highlight" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4 text-secondary" />}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-primary tracking-wide">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-primary hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-secondary" />}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In to Vexlora"}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center text-xs text-secondary">
          New to Vexlora?{" "}
          <Link
            href={`/register${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Create an Account <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
