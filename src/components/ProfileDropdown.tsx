"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Bell, Star, Settings } from "lucide-react";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || "/default-avatar.jpg"} />
            <AvatarFallback className="text-xs">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm font-medium hidden sm:block">
            {user.name}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => router.push("/Profile")}>
          <User className="mr-2 h-4 w-4" /> My Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/Profile#history")}>
          <Star className="mr-2 h-4 w-4" /> Prediction History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/Profile#watchlist")}>
          <Star className="mr-2 h-4 w-4" /> Watchlist
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/Profile#alerts")}>
          <Bell className="mr-2 h-4 w-4" /> Alert Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
