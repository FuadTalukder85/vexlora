"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useCustomerDashboard } from "@/hooks/useAccount";
import { AccountSidebar } from "./AccountSidebar";
import { AccountOverviewTab } from "./AccountOverviewTab";
import { AccountOrdersTab } from "./AccountOrdersTab";
import { AccountChatTab } from "./AccountChatTab";
import { AccountCartTab } from "./AccountCartTab";
import { AccountAddressesTab } from "./AccountAddressesTab";
import { AccountSettingsTab } from "./AccountSettingsTab";
import { toast } from "sonner";

export const AccountDashboardView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const {
    user,
    isAuthenticated,
    isInitialChecking,
    vendorProfile,
    logout,
  } = useAuthStore();

  const { data: dashboardData, isLoading: loadingDashboard } = useCustomerDashboard();

  // Keep activeTab in sync with query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tabId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    router.push("/");
  };

  if (isInitialChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-bold text-primary">Loading your account...</p>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return (
      <div className="layout-container px-4 sm:px-8 py-16">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-border p-8 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary mx-auto mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-primary tracking-tight">
            Customer Profile & Account
          </h2>
          <p className="text-sm text-secondary mt-2 mb-6">
            Please sign in to view your account dashboard, cart items, pending orders, and seller chat messages.
          </p>
          <div className="space-y-2.5">
            <Link
              href="/login"
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-colors block shadow-xs"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/register"
              className="w-full py-2.5 bg-muted hover:bg-muted/80 text-primary rounded-xl text-sm font-bold transition-colors block"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border py-2.5 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="layout-container flex items-center gap-1.5 text-[14px] text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-bold text-primary">Manage My Account</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="capitalize text-secondary font-medium">
            {activeTab === "overview"
              ? "Dashboard"
              : activeTab === "orders"
                ? "My Orders"
                : activeTab === "chat"
                  ? "Seller Chats"
                  : activeTab === "cart"
                    ? "Shopping Cart"
                    : activeTab === "addresses"
                      ? "Address Book"
                      : activeTab === "settings"
                        ? "Profile & Security"
                        : activeTab}
          </span>
        </div>
      </div>

      <div className="layout-container px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-6 sm:pt-8">
        {/* Daraz-Style Master-Detail Layout: Left Sidebar + Right Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Daraz-Style Structured Navigation Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 sticky top-24">
            <AccountSidebar
              user={dashboardData?.user || user}
              vendorProfile={vendorProfile}
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              onLogout={handleLogout}
              pendingOrdersCount={dashboardData?.stats?.pendingOrdersCount}
            />
          </div>

          {/* Right Column: Active View Area */}
          <div className="lg:col-span-8 xl:col-span-9 min-w-0">
            {activeTab === "overview" && (
              <AccountOverviewTab
                dashboardData={dashboardData}
                onSelectTab={handleSelectTab}
              />
            )}
            {activeTab === "orders" && <AccountOrdersTab />}
            {activeTab === "chat" && <AccountChatTab />}
            {activeTab === "cart" && <AccountCartTab />}
            {activeTab === "addresses" && <AccountAddressesTab />}
            {activeTab === "settings" && (
              <AccountSettingsTab user={dashboardData?.user || user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
