"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Trash2,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  Store,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { User, VendorProfile } from "@/types/auth";
import { useUploadAvatar, useDeleteAvatar } from "@/hooks/useAccount";

interface AccountHeaderProps {
  user: User | null;
  vendorProfile: VendorProfile | null;
  onNavigateToTab: (tab: string) => void;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({
  user,
  vendorProfile,
  onNavigateToTab,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="bg-white rounded-3xl border border-border p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Top row: Avatar + Action triggers */}
        <div className="flex items-start justify-between gap-4">
          {/* Avatar with photo action */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-muted p-1 border border-border shadow-xs">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-white flex items-center justify-center font-bold text-2xl text-primary">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Customer"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{getInitials(user?.name)}</span>
                )}
              </div>
            </div>

            {/* Upload trigger button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              title="Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            {user?.image && (
              <button
                type="button"
                onClick={() => deleteAvatarMutation.mutate()}
                disabled={deleteAvatarMutation.isPending}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-md bg-highlight text-white flex items-center justify-center shadow-xs hover:bg-highlight/90 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                title="Remove Avatar"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Edit Profile / Vendor Button */}
          <div>
            {vendorProfile?.status === "APPROVED" ? (
              <a
                href={process.env.NEXT_PUBLIC_VENDOR_URL || "#"}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-[14px] font-bold flex items-center gap-1.5 transition-colors border border-amber-200"
              >
                <Store className="w-4 h-4" />
                <span>Vendor Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            ) : (
              <button
                onClick={() => onNavigateToTab("settings")}
                className="px-3.5 py-1.5 rounded-xl border border-border bg-muted/60 hover:bg-muted text-primary text-[14px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* User Info & Badges */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-primary tracking-tight">
              {user?.name || "Valued Customer"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Account
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              {user?.role || "CUSTOMER"}
            </span>
          </div>

          <div className="mt-3 space-y-1.5 text-[14px] text-secondary font-medium">
            {user?.email && (
              <div className="flex items-center gap-2 text-secondary">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
            {user?.phone ? (
              <div className="flex items-center gap-2 text-secondary">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{user.phone}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <button
                  onClick={() => onNavigateToTab("settings")}
                  className="text-primary hover:underline font-semibold"
                >
                  + Add phone number
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 text-secondary">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>Member since {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
