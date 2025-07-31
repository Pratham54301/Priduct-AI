import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface EmailVerificationDialogProps {
  onSend: () => Promise<void>;
}

export default function EmailVerificationDialog({ onSend }: EmailVerificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    setLoading(true);
    try {
      await onSend();
      toast({ title: "Verification email sent!", variant: "success" });
    } catch {
      toast({ title: "Failed to send verification email", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Verify Email</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Email Verification</DialogTitle>
        </DialogHeader>
        <div className="mb-4">Click the button below to send a verification email to your address.</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send Verification Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 