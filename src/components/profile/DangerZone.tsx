'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow p-6 dark:bg-[#18181b] mt-6">
      <h2 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h2>
      <Button variant="destructive" onClick={() => setShowConfirm(true)}>
        Delete Account
      </Button>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#232323] p-6 rounded shadow-lg text-center">
            <div className="mb-4 text-white">Are you sure you want to delete your account? This action cannot be undone.</div>
            <Button variant="destructive" className="mr-2">Yes, Delete</Button>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
} 