"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Input } from "@/components/ui/Input";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await register({ name, email, password, phone: phone || undefined });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-primary text-white items-center justify-center font-extrabold text-2xl shadow-md mb-1">
            V
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            Create Vexlora Account
          </h1>
          <p className="text-xs text-secondary">
            Join thousands of shoppers and discover verified products across multi-vendor stores
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            leftIcon={<UserIcon className="w-4 h-4 text-secondary" />}
          />

          <Input
            label="Email Address *"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4 text-secondary" />}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 019-2834"
            leftIcon={<Phone className="w-4 h-4 text-secondary" />}
          />

          <Input
            label="Password *"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            leftIcon={<Lock className="w-4 h-4 text-secondary" />}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account & Verify"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-secondary">
          Already have an account?{" "}
          <Link
            href={`/login${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            className="font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Sign In <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
