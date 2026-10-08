import React, { Suspense } from "react";
import { Metadata } from "next";
import { AccountDashboardView } from "./components/AccountDashboardView";

export const metadata: Metadata = {
  title: "Customer Account Dashboard | Vexlora Multi-Vendor Marketplace",
  description:
    "View your customer orders, active cart items, total expenditures, saved shipping addresses, and direct merchant chats on Vexlora.",
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-bold text-primary">Loading Account Profile...</p>
        </div>
      }
    >
      <AccountDashboardView />
    </Suspense>
  );
}


