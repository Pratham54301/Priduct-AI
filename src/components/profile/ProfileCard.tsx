'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog";

export default function ProfileCard() {
  const { token = null } = useAuth() ?? {};
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = () => {
    setLoading(true);
    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { setUser(data); setLoading(false); })
      .catch(() => { setError("Failed to load profile"); setLoading(false); });
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [token]);

  const handleSave = async (form: Partial<User>) => {
    if (!token) return;
    await fetch("/api/me/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    fetchUser();
  };

  const handleChangePassword = async ({ current, newPassword }: { current: string; newPassword: string }) => {
    if (!token) return;
    await fetch("/api/me/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ current, newPassword }),
    });
  };

  if (loading) return (
    <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center dark:bg-[#18181b] w-full max-w-md mx-auto">
      <Skeleton className="w-24 h-24 rounded-full mb-4" />
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
  if (error) return (
    <div className="bg-red-900 text-red-200 p-4 rounded mb-4 w-full max-w-md mx-auto">
      {error}
    </div>
  );

  return (
    <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center dark:bg-[#18181b] w-full max-w-md mx-auto">
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>
          {user?.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "U"}
        </AvatarFallback>
      </Avatar>
      <div className="text-xl font-semibold mb-1 text-white">{user?.name || "User"}</div>
      <div className="text-gray-400 mb-1">{user?.email}</div>
      <div className="text-gray-500 mb-4">{user?.phone || "No phone"}</div>
      <div className="flex gap-2 flex-wrap justify-center">
        <EditProfileDialog user={user!} onSave={handleSave} />
        <ChangePasswordDialog onSave={handleChangePassword} />
      </div>
    </div>
  );
} 