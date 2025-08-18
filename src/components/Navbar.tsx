"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import ProfileDropdown from "@/components/ProfileDropdown";

export default function Navbar() {
  const auth = useAuth();
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
        Product.AI
      </div>
      <div className="flex items-center gap-3">
        {auth?.user ? (
          <>
            <Link href="/Profile" className="text-sm font-medium hover:underline">Profile</Link>
            <ProfileDropdown />
          </>
        ) : null}
      </div>
    </nav>
  );
} 