"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  username: string | null;
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
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    reason: string | null;
  }>({ checking: false, available: null, reason: null });
  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const loadUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

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
        setUsername(existingProfile.username || "");
      } else {
        const defaultName = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
        setDisplayName(defaultName);
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }

      setLoading(false);
    };

    loadUserAndProfile();
  }, [router]);

  // Username availability check with debounce
  const checkUsername = useCallback(async (value: string) => {
    if (!value || value === profile?.username) {
      setUsernameStatus({ checking: false, available: null, reason: null });
      return;
    }

    setUsernameStatus({ checking: true, available: null, reason: null });

    try {
      const res = await fetch(`/api/username/check?username=${encodeURIComponent(value)}`);
      const data = await res.json();
      setUsernameStatus({ checking: false, available: data.available, reason: data.reason });
    } catch {
      setUsernameStatus({ checking: false, available: false, reason: "檢查失敗" });
    }
  }, [profile?.username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);

    if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);

    if (!value || value === profile?.username) {
      setUsernameStatus({ checking: false, available: null, reason: null });
      return;
    }

    if (value.length < 3) {
      setUsernameStatus({ checking: false, available: false, reason: "至少需要 3 個字元" });
      return;
    }

    usernameTimerRef.current = setTimeout(() => checkUsername(value), 500);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

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
            if (blob) resolve(blob);
            else reject(new Error("壓縮失敗"));
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

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "圖片大小不能超過 10MB" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "請上傳圖片檔案" });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const compressedBlob = await compressImage(file, 400, 0.8);
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedBlob, {
          upsert: true,
          contentType: "image/jpeg"
        });

      if (uploadError) throw uploadError;

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

    // Validate username if changed
    if (username && username !== profile?.username) {
      if (usernameStatus.checking || usernameStatus.available === false) {
        setMessage({ type: "error", text: "請確認使用者名稱可用後再儲存" });
        return;
      }
    }

    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const updates: Record<string, unknown> = {
        id: user.id,
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl,
        bio: bio.trim() || null,
        updated_at: new Date().toISOString(),
      };

      // Only include username if it's set and different
      if (username && username !== profile?.username) {
        updates.username = username;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert(updates, { onConflict: "id" });

      if (error) {
        if (error.code === "23505" && error.message?.includes("username")) {
          setMessage({ type: "error", text: "此使用者名稱已被使用，請選擇其他名稱" });
        } else {
          console.error("Supabase error details:", error);
          throw error;
        }
        return;
      }

      // Update local profile state
      setProfile((prev) => prev ? { ...prev, username: username || prev.username } : prev);
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

  const hasExistingUsername = !!profile?.username;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">帳號設定</h1>
        <p className="mt-2 text-base text-muted-foreground">
          管理你的個人資料和偏好設定
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg p-4 text-base ${
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
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">頭像</CardTitle>
            <CardDescription className="text-base">
              點擊頭像更換你的個人照片（會自動壓縮）
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploading}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80 disabled:opacity-50 sm:h-28 sm:w-28"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="頭像"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground sm:text-4xl">
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
              <div className="text-center text-sm text-muted-foreground sm:text-left sm:text-base">
                <p>支援 JPG、PNG、GIF 格式</p>
                <p>圖片會自動壓縮優化</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用者名稱 */}
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">使用者名稱</CardTitle>
            <CardDescription className="text-base">
              設定你的專屬網址 solo.tw/@username
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base">使用者名稱</Label>
              <div className="flex items-center gap-2">
                <span className="text-base text-muted-foreground">solo.tw/@</span>
                <div className="relative flex-1">
                  <Input
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="your_name"
                    maxLength={20}
                    disabled={hasExistingUsername}
                    className="h-11 text-base lowercase"
                  />
                  {usernameStatus.checking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  )}
                  {!usernameStatus.checking && usernameStatus.available === true && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {!usernameStatus.checking && usernameStatus.available === false && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {usernameStatus.reason && (
                <p className={`text-sm ${usernameStatus.available ? "text-green-600" : "text-red-500"}`}>
                  {usernameStatus.reason}
                </p>
              )}
              {usernameStatus.available === true && (
                <p className="text-sm text-green-600">可以使用！</p>
              )}
              {hasExistingUsername ? (
                <p className="text-sm text-muted-foreground">
                  使用者名稱設定後無法更改。你的個人主頁：
                  <a href={`/@${profile?.username}`} className="ml-1 text-primary hover:underline">
                    solo.tw/@{profile?.username}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  3-20 個字元，僅限小寫英文、數字和底線。設定後無法更改，請謹慎選擇。
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 基本資料 */}
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">基本資料</CardTitle>
            <CardDescription className="text-base">
              設定你的顯示名稱和自我介紹
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-5 pt-0 sm:space-y-6 sm:p-6 sm:pt-0">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-base">顯示名稱</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="輸入你想顯示的名稱"
                maxLength={50}
                className="h-11 text-base"
              />
              <p className="text-sm text-muted-foreground">
                這個名稱會顯示在控制臺和你的個人主頁上
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-base">自我介紹</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="簡單介紹一下你自己..."
                maxLength={200}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-muted-foreground">
                {bio.length}/200 字元
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 帳號資訊（唯讀） */}
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">帳號資訊</CardTitle>
            <CardDescription className="text-base">
              你的登入資訊
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-5 pt-0 sm:space-y-6 sm:p-6 sm:pt-0">
            <div className="space-y-2">
              <Label className="text-base">Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="h-11 bg-muted text-base"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">登入方式</Label>
              <Input
                value={user?.app_metadata?.provider === "google" ? "Google 帳號" : "Email"}
                disabled
                className="h-11 bg-muted text-base"
              />
            </div>
          </CardContent>
        </Card>

        {/* 儲存按鈕 */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="h-11 w-full text-base sm:w-auto sm:px-6"
          >
            取消
          </Button>
          <Button type="submit" disabled={saving} className="h-11 w-full text-base sm:w-auto sm:px-6">
            {saving ? "儲存中..." : "儲存設定"}
          </Button>
        </div>
      </form>
    </div>
  );
}
