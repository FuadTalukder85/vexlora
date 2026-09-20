"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import { Input } from "@/components/ui/Input";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const redirectUrl = searchParams.get("redirect") || "/";

  const { verifyOtp, sendOtp, isLoading } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!emailParam) {
      setErrorMsg("Email parameter is missing.");
      toast.error("Email parameter is missing.");
      return;
    }

    try {
      await verifyOtp(emailParam, otp);
      setSuccessMsg("Email successfully verified! Redirecting...");
      toast.success("Account verified successfully! Welcome to Vexlora.");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid OTP verification code.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!emailParam) return;
    try {
      await sendOtp(emailParam, "email-verification");
      setSuccessMsg(`A new OTP code has been sent to ${emailParam}`);
      toast.success("New OTP code sent to your email!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend code";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 bg-slate-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">
            Verify Email Address
          </h1>
          <p className="text-xs text-secondary">
            Enter the 6-digit verification code sent to{" "}
            <strong className="text-primary">{emailParam || "your email"}</strong>
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div className="flex-1 font-medium">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="text-center text-xl tracking-widest font-mono font-bold h-12"
          />

          <button
            type="submit"
            disabled={isLoading || otp.length < 4}
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Verifying OTP..." : "Verify & Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 space-y-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-xs text-primary font-semibold hover:underline cursor-pointer disabled:opacity-50"
          >
            Didn&apos;t receive code? Resend OTP
          </button>

          <div>
            <Link
              href={`/login${redirectUrl !== "/" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
              className="text-xs text-secondary hover:text-primary font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
