"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  LayoutDashboard,
  Package,
  MessageSquare,
  ShoppingBag,
  MapPin,
  Heart,
  Store,
  ExternalLink,
  LogOut,
  Camera,
  Truck,
} from "lucide-react";
import { User as UserType, VendorProfile } from "@/types/auth";
import { useUploadAvatar } from "@/hooks/useAccount";
import { useChatStore } from "@/stores/chat.store";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";

interface AccountSidebarProps {
  user: UserType | null;
  vendorProfile: VendorProfile | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  pendingOrdersCount?: number;
}

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tab?: string;
  href?: string;
  badge?: React.ReactNode;
}

interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  user,
  vendorProfile,
  activeTab,
  onSelectTab,
  onLogout,
  pendingOrdersCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();
  const unreadCount = useChatStore((s) => s.unreadCount);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatarMutation.mutate(file);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const navGroups: SidebarNavGroup[] = [
    {
      title: "Manage My Account",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: LayoutDashboard,
          tab: "overview",
        },
        {
          id: "settings",
          label: "My Profile & Security",
          icon: User,
          tab: "settings",
        },
        {
          id: "addresses",
          label: "Address Book",
          icon: MapPin,
          tab: "addresses",
        },
      ],
    },
    {
      title: "My Orders",
      items: [
        {
          id: "orders",
          label: "All Orders",
          icon: Package,
          tab: "orders",
          badge:
            pendingOrdersCount && pendingOrdersCount > 0 ? (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === "orders"
                  ? "bg-white text-primary"
                  : "bg-amber-50 text-amber-700"
                  }`}
              >
                {pendingOrdersCount} active
              </span>
            ) : null,
        },
        {
          id: "track-order",
          label: "Live Order Tracker",
          icon: Truck,
          href: "/track-order",
        },
      ],
    },
    {
      title: "My Messages",
      items: [
        {
          id: "chat",
          label: "Seller Chats",
          icon: MessageSquare,
          tab: "chat",
          badge:
            unreadCount > 0 ? (
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === "chat"
                  ? "bg-white text-highlight"
                  : "bg-highlight text-white animate-pulse"
                  }`}
              >
                {unreadCount} new
              </span>
            ) : null,
        },
      ],
    },
    {
      title: "My Activity",
      items: [
        {
          id: "cart",
          label: "Shopping Cart",
          icon: ShoppingBag,
          tab: "cart",
          badge:
            cartItemCount > 0 ? (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === "cart"
                  ? "bg-white text-primary"
                  : "bg-muted text-primary font-bold"
                  }`}
              >
                {cartItemCount}
              </span>
            ) : null,
        },
        {
          id: "wishlist",
          label: "My Wishlist",
          icon: Heart,
          href: "/wishlist",
          badge:
            wishlistCount > 0 ? (
              <span className="text-[10px] font-bold bg-muted text-secondary px-1.5 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            ) : null,
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-6">
      {/* 1. Customer Mini Profile Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="relative group shrink-0">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center font-bold text-base text-primary relative">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || "Customer"}
                fill
                className="object-cover"
              />
            ) : (
              <span>{getInitials(user?.name)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadAvatarMutation.isPending}
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs hover:bg-primary/90 transition-transform active:scale-90 cursor-pointer disabled:opacity-50"
            title="Upload photo"
          >
            <Camera className="w-2.5 h-2.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="min-w-0">
          <p className="text-[14px] text-secondary font-medium">Hello,</p>
          <p className="text-[14px] font-bold text-primary truncate">
            {user?.name || "Customer"}
          </p>
        </div>
      </div>

      {/* 2. Structured Dynamic Navigation Groups */}
      <div className="space-y-5 text-[14px]">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h4 className="text-[14px] font-bold text-primary tracking-wider mb-2 px-2">
              {group.title}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.tab === activeTab;
                const commonClasses = `w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors text-left ${isActive
                  ? "bg-primary text-white font-bold"
                  : "text-secondary hover:text-primary hover:bg-muted/70"
                  }`;

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={commonClasses}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => item.tab && onSelectTab(item.tab)}
                    className={`${commonClasses} cursor-pointer`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Vendor Program */}
        <div className="pt-2 border-t border-border">
          {vendorProfile?.status === "APPROVED" ? (
            <a
              href={process.env.NEXT_PUBLIC_VENDOR_URL || "#"}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 font-bold transition-colors border border-amber-200"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-700" />
                <span>Vendor Dashboard</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            </a>
          ) : (
            <Link
              href="/vendor-apply"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-secondary hover:text-primary hover:bg-muted/70 font-medium transition-colors"
            >
              <Store className="w-4 h-4" />
              <span>Sell on Vexlora</span>
            </Link>
          )}
        </div>

        {/* Sign Out */}
        <div className="pt-2 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-highlight hover:bg-rose-50 font-bold transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
