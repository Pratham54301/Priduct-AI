import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { User } from "@/types/profile";
import { useToast } from "@/components/ui/use-toast";
import Cropper from "react-easy-crop";

interface EditProfileDialogProps {
  user: User;
  onSave: (data: Partial<User>) => void;
}

export default function EditProfileDialog({ user, onSave }: EditProfileDialogProps) {
  const [form, setForm] = useState<Partial<User>>({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    dob: user.dob,
    avatar: user.avatar,
  });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate type
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
      toast({ title: "Only PNG, JPG, or JPEG files allowed", variant: "destructive" });
      return;
    }
    // Validate size
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File must be under 2MB", variant: "destructive" });
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setShowCrop(true);
  };

  // Cropper callbacks
  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Utility to get cropped image as blob
  async function getCroppedImg(imageSrc: string, crop: any) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx!.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, "image/jpeg");
    });
  }

  function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });
  }

  const handleCropSave = async () => {
    if (!avatarPreview || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(avatarPreview, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    setAvatarFile(croppedFile);
    setAvatarPreview(URL.createObjectURL(croppedFile));
    setShowCrop(false);
  };

  const handleSave = async () => {
    setLoading(true);
    let avatarUrl = form.avatar;
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const res = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        avatarUrl = data.url;
      }
      await onSave({ ...form, avatar: avatarUrl });
      toast({ title: "Profile updated!", variant: "success" });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <img
              src={avatarPreview || "/default-avatar.jpg"}
              alt="avatar preview"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              title="Upload avatar"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Avatar
            </Button>
          </div>
          {showCrop && (
            <div className="relative w-full h-64 bg-black">
              <Cropper
                image={avatarPreview!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
              <Button onClick={handleCropSave} className="mt-2">Save Crop</Button>
            </div>
          )}
          <Input name="name" value={form.name || ""} onChange={handleChange} placeholder="Full Name" />
          <Input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" type="email" />
          <Input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Phone" />
          <Input name="address" value={form.address || ""} onChange={handleChange} placeholder="Address" />
          <Input name="dob" value={form.dob || ""} onChange={handleChange} placeholder="Date of Birth (YYYY-MM-DD)" />
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