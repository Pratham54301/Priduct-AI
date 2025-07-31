"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      <div>
        {!auth?.user ? (
          <>
            <button onClick={() => router.push("/login")} className="mr-2">Login</button>
            <button onClick={() => router.push("/register")}>Join Now</button>
          </>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </nav>
  );
} 