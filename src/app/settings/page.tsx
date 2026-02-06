"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  updated_at: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const loadUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      // 取得或建立 profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (existingProfile) {
        setProfile(existingProfile);
        setDisplayName(existingProfile.display_name || "");
        setBio(existingProfile.bio || "");
        setAvatarUrl(existingProfile.avatar_url);
      } else {
        // 如果沒有 profile，使用預設值
        const defaultName = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
        setDisplayName(defaultName);
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }

      setLoading(false);
    };

    loadUserAndProfile();
  }, [router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 壓縮圖片函數（自動壓縮到 400px 寬，約 50KB）
  const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 計算縮放比例
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("無法建立 canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("壓縮失敗"));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("圖片載入失敗"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 檢查檔案大小（最大 10MB，會自動壓縮）
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "圖片大小不能超過 10MB" });
      return;
    }

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "請上傳圖片檔案" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // 壓縮圖片（最大 400px 寬，JPEG 品質 80%，約 50KB）
      const compressedBlob = await compressImage(file, 400, 0.8);
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      // 上傳壓縮後的圖片到 Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedBlob, {
          upsert: true,
          contentType: "image/jpeg"
        });

      if (uploadError) throw uploadError;

      // 取得公開 URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      setMessage({ type: "success", text: "頭像上傳成功！" });
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: "error", text: "上傳失敗，請稍後再試" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const updates = {
        id: user.id,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      setMessage({ type: "success", text: "設定已儲存！" });
    } catch (error) {
      console.error("Save error:", error);
      setMessage({ type: "error", text: "儲存失敗，請稍後再試" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">帳號設定</h1>
        <p className="mt-2 text-muted-foreground">
          管理你的個人資料和偏好設定
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 頭像設定 */}
        <Card>
          <CardHeader>
            <CardTitle>頭像</CardTitle>
            <CardDescription>
              點擊頭像更換你的個人照片（會自動壓縮）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploading}
                className="relative h-24 w-24 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="頭像"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                    {displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <div className="text-sm text-muted-foreground">
                <p>支援 JPG、PNG、GIF 格式</p>
                <p>圖片會自動壓縮優化</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本資料 */}
        <Card>
          <CardHeader>
            <CardTitle>基本資料</CardTitle>
            <CardDescription>
              設定你的顯示名稱和自我介紹
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">顯示名稱</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="輸入你想顯示的名稱"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                這個名稱會顯示在控制臺和你的診斷結果上
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">自我介紹</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="簡單介紹一下你自己..."
                maxLength={200}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/200 字元
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 帳號資訊（唯讀） */}
        <Card>
          <CardHeader>
            <CardTitle>帳號資訊</CardTitle>
            <CardDescription>
              你的登入資訊
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>登入方式</Label>
              <Input
                value={user?.app_metadata?.provider === "google" ? "Google 帳號" : "Email"}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* 儲存按鈕 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            取消
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "儲存中..." : "儲存設定"}
          </Button>
        </div>
      </form>
    </div>
  );
}
