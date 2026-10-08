"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  KeyRound,
  LogOut,
  Laptop,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { User as UserType } from "@/types/auth";
import {
  useUpdateProfile,
  useChangePassword,
  useActiveSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "@/hooks/useAccount";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface AccountSettingsTabProps {
  user: UserType | null;
}

export const AccountSettingsTab: React.FC<AccountSettingsTabProps> = ({ user }) => {
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const { data: sessions, isLoading: loadingSessions } = useActiveSessions();
  const revokeSessionMutation = useRevokeSession();
  const revokeOtherSessionsMutation = useRevokeOtherSessions();

  // Profile info state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessionsOnPasswordChange, setRevokeOtherSessionsOnPasswordChange] =
    useState(true);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    await updateProfileMutation.mutateAsync({
      name: name.trim(),
      phone: phone.trim() || undefined,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    await changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
      revokeOtherSessions: revokeOtherSessionsOnPasswordChange,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 text-[14px]">
      {/* 2-Column Grid: Personal Details & Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Profile Details Card */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Personal Details</h3>
              <p className="text-[14px] text-secondary">
                Update your account name and phone number
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              value={user?.email || ""}
              disabled
              helperText="Email cannot be changed directly for security reasons."
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Contact Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={updateProfileMutation.isPending}
                className="w-full text-[14px] font-bold"
              >
                Save Profile Details
              </Button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-highlight/10 text-highlight flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Security & Password</h3>
              <p className="text-[14px] text-secondary">
                Ensure account protection with a strong passphrase
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
            <Input
              label="Current Password *"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="New Password *"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm New Password *"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Repeat new password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="revokeOtherSessions"
                checked={revokeOtherSessionsOnPasswordChange}
                onChange={(e) => setRevokeOtherSessionsOnPasswordChange(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-border focus:ring-primary/20 cursor-pointer"
              />
              <label
                htmlFor="revokeOtherSessions"
                className="text-[14px] text-secondary cursor-pointer"
              >
                Sign out of all other devices on password change
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="highlight"
                isLoading={changePasswordMutation.isPending}
                className="w-full text-[14px] font-bold"
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Login Sessions */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Active Login Sessions</h3>
              <p className="text-[14px] text-secondary">
                Devices where you are currently signed in to Vexlora
              </p>
            </div>
          </div>

          <Button
            onClick={() => revokeOtherSessionsMutation.mutate()}
            variant="outline"
            size="sm"
            isLoading={revokeOtherSessionsMutation.isPending}
            leftIcon={<LogOut className="w-3.5 h-3.5 text-secondary" />}
            className="self-start sm:self-auto hover:text-highlight hover:border-rose-200 text-[14px] font-bold"
          >
            Sign Out All Other Sessions
          </Button>
        </div>

        <div className="mt-4 divide-y divide-border">
          {loadingSessions ? (
            <div className="py-8 text-center text-[14px] text-secondary">
              Loading active sessions...
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="py-8 text-center text-[14px] text-secondary">
              1 Active Session (Current Device)
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-primary shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-bold text-primary">
                        {sess.userAgent?.includes("Mobile")
                          ? "Mobile Browser"
                          : sess.userAgent?.includes("Macintosh")
                          ? "Mac Device"
                          : sess.userAgent?.includes("Windows")
                          ? "Windows Device"
                          : "Web Browser"}
                      </p>
                      {sess.isCurrent && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Current Device
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-0.5">
                      IP: {sess.ipAddress || "Unknown IP"} • Signed in:{" "}
                      {new Date(sess.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    onClick={() => revokeSessionMutation.mutate(sess.id)}
                    disabled={revokeSessionMutation.isPending}
                    className="text-[14px] font-bold text-highlight hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
