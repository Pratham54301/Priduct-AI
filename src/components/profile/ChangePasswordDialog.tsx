import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


interface ChangePasswordDialogProps {
  onSave: (data: { current: string; newPassword: string }) => Promise<void>;
}

export default function ChangePasswordDialog({ onSave }: ChangePasswordDialogProps) {
  const [current, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await onSave({ current, newPassword });
      setSuccess(true);
      setCurrent("");
      setNewPassword("");
      setConfirm("");
      toast({ title: "Password changed successfully!", variant: "default" });
    } catch {
      setError("Failed to change password");
      toast({ title: "Failed to change password", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Current Password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">Password changed successfully!</div>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 