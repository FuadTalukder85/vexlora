"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  Building,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  UserCheck,
  Clock,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { Input } from "@/components/ui/Input";

export default function VendorApplyPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    user,
    vendorProfile,
    applyVendorProfile,
    isLoading,
    isInitialChecking,
  } = useAuthStore();

  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleStoreNameChange = (name: string) => {
    setStoreName(name);
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
    setStoreSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!storeName.trim()) {
      setError("Store Name is required.");
      return;
    }

    try {
      await applyVendorProfile({
        storeName,
        storeSlug: storeSlug || undefined,
        description: description || undefined,
        bankAccountName: bankAccountName || undefined,
        bankAccountNumber: bankAccountNumber || undefined,
        bankName: bankName || undefined,
        documents: documentUrl
          ? [{ type: "TRADE_LICENSE", url: documentUrl }]
          : undefined,
      });

      setSuccessMsg(
        "Application submitted successfully! Our merchant onboarding team will review your business credentials."
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to submit vendor application.");
      }
    }
  };

  if (isInitialChecking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-muted/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-secondary">Checking account profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>Vexlora Merchant Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Grow Your Business on Vexlora
          </h1>
          <p className="text-sm text-primary max-w-xl mx-auto">
            Join our curated marketplace of verified stores. Reach millions of customers, manage inventory, and receive automated weekly payouts.
          </p>
        </div>

        {/* Status Views */}
        {!isAuthenticated && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-border text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-primary flex items-center justify-center mx-auto">
              <Store className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-primary">
                Sign In to Submit Your Merchant Application
              </h2>
              <p className="text-xs text-secondary max-w-md mx-auto">
                You need an active Vexlora account to register a store. If you don&apos;t have one yet, creating an account takes less than a minute.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-sm mx-auto">
              <Link
                href="/login?redirect=/vendor-apply"
                className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                href="/register?redirect=/vendor-apply"
                className="flex-1 py-3 px-4 rounded-xl bg-muted hover:bg-muted text-primary text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && vendorProfile?.status === "PENDING" && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-border text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider">
                Status: Application Under Review
              </span>
              <h2 className="text-2xl font-extrabold text-primary">
                Your Merchant Application is Being Processed
              </h2>
              <p className="text-xs text-primary max-w-lg mx-auto">
                Thank you for applying to sell on Vexlora! Our admin team is verifying your business license and trade credentials. Review typically takes 1-2 business days.
              </p>
            </div>

            <div className="p-5 bg-muted border border-border rounded-2xl text-left text-xs text-primary space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="font-semibold text-secondary">Applicant:</span>
                <span className="font-bold text-primary">{user?.name}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="font-semibold text-secondary">Store Name:</span>
                <span className="font-bold text-primary">{vendorProfile.storeName}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="font-semibold text-secondary">Store Identifier:</span>
                <span className="font-bold text-primary">{vendorProfile.storeSlug}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-secondary">Submitted On:</span>
                <span className="font-bold text-primary">
                  {vendorProfile.createdAt ? new Date(vendorProfile.createdAt).toLocaleDateString() : "Recently"}
                </span>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && vendorProfile?.status === "APPROVED" && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-border text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                Status: Active Merchant Store
              </span>
              <h2 className="text-2xl font-extrabold text-primary">
                Store Account Approved!
              </h2>
              <p className="text-xs text-primary max-w-lg mx-auto">
                Your store <strong className="text-primary">{vendorProfile.storeName}</strong> is fully verified. Open the Vexlora Merchant Hub to manage catalog, inventory, and customer orders.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={process.env.NEXT_PUBLIC_VENDOR_URL || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all shadow-md"
              >
                Launch Vendor Merchant Hub <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Application Form */}
        {isAuthenticated && (!vendorProfile || (vendorProfile.status !== "PENDING" && vendorProfile.status !== "APPROVED")) && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-border space-y-6">
            {/* Account Info Pill */}
            <div className="flex items-center gap-3 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs">
              <UserCheck className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-primary">Applying under verified account:</p>
                <p className="text-primary font-medium">
                  {user?.name} &bull; <span className="text-secondary">{user?.email}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-highlight/10 border border-highlight/30 text-highlight text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-highlight" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <div className="flex-1 font-medium">{successMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                  <Building className="w-4 h-4 text-primary" /> Store Information
                </h3>

                <Input
                  label="Store / Business Name *"
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  placeholder="e.g. Apex Electronics Store"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-primary tracking-wide">
                    Store URL Identifier (Slug)
                  </label>
                  <div className="flex items-center text-xs bg-muted border border-border rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                    <span className="px-3.5 py-2.5 text-secondary font-semibold border-r border-border bg-muted">
                      vexlora.com/store/
                    </span>
                    <input
                      type="text"
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value)}
                      placeholder="apex-electronics"
                      className="flex-1 px-3.5 py-2.5 bg-transparent focus:outline-none text-primary font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-primary tracking-wide">
                    Store Description & Catalog Overview
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Overview of your product catalog and brand values..."
                    className="w-full p-3.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-primary font-medium placeholder:text-secondary"
                  />
                </div>
              </div>

              {/* Banking & Settlement Details */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Banking & Payout Settlement
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Chase / Citibank / HSBC"
                  />
                  <Input
                    label="Account Holder Name"
                    type="text"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value)}
                    placeholder="Apex Electronics LLC"
                  />
                </div>

                <Input
                  label="Account / IBAN Number"
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="US12 3456 7890 1234"
                />
              </div>

              {/* Business Verification Document */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                  <FileText className="w-4 h-4 text-primary" /> Business License & Verification
                </h3>

                <Input
                  label="Trade License / Tax Document URL"
                  type="url"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="https://cloudinary.com/trade-license.pdf"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 rounded-xl bg-primary hover:bg-primary/95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Submitting Application..." : "Submit Merchant Application"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
