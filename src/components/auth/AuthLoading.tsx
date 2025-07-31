"use client";
import { Loader2 } from "lucide-react";

interface AuthLoadingProps {
  message?: string;
}

export default function AuthLoading({ message = "Loading..." }: AuthLoadingProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
} 