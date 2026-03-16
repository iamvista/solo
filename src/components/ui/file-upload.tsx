"use client";

import { useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  bucket: string;
  /** Path prefix inside bucket, e.g. "user-id" */
  pathPrefix?: string;
  /** Accepted MIME types */
  accept?: string;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Called with the public URL after successful upload */
  onUpload: (url: string) => void;
  /** Current file URL (for showing preview) */
  currentUrl?: string;
}

export function FileUpload({
  bucket,
  pathPrefix,
  accept = ".pdf,.zip,.png,.jpg,.jpeg,.webp",
  maxSizeMB = 10,
  onUpload,
  currentUrl,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`檔案大小不能超過 ${maxSizeMB}MB`);
        return;
      }

      setUploading(true);
      setError("");

      try {
        const supabase = createClient();

        // Get current user for path
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("請先登入");
          return;
        }

        // Build file path: {prefix or user_id}/{timestamp}-{filename}
        const prefix = pathPrefix || user.id;
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `${prefix}/${timestamp}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        setFileName(file.name);
        onUpload(urlData.publicUrl);
      } catch {
        setError("上傳失敗，請稍後再試");
      } finally {
        setUploading(false);
        // Reset input so same file can be re-uploaded
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [bucket, pathPrefix, maxSizeMB, onUpload],
  );

  const displayName = fileName || (currentUrl ? getFileNameFromUrl(currentUrl) : "");

  return (
    <div className="space-y-2">
      <div
        className="relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-stone-200 bg-stone-50 p-6 transition-colors hover:border-stone-300 hover:bg-stone-100"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleUpload}
          className="hidden"
        />
        {uploading ? (
          <div className="text-center">
            <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
            <p className="text-sm text-stone-500">上傳中...</p>
          </div>
        ) : displayName ? (
          <div className="text-center">
            <p className="text-2xl">✅</p>
            <p className="mt-1 text-sm font-medium text-stone-700 line-clamp-1">{displayName}</p>
            <p className="mt-1 text-xs text-stone-400">點擊重新上傳</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-2xl">📎</p>
            <p className="mt-1 text-sm text-stone-600">點擊或拖拉上傳檔案</p>
            <p className="mt-1 text-xs text-stone-400">
              最大 {maxSizeMB}MB · 支援 PDF、ZIP、圖片
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {currentUrl && (
        <div className="flex items-center gap-2">
          <span className="flex-1 truncate text-xs text-stone-400">{currentUrl}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => window.open(currentUrl, "_blank")}
          >
            預覽
          </Button>
        </div>
      )}
    </div>
  );
}

function getFileNameFromUrl(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/");
    const last = parts[parts.length - 1];
    // Remove timestamp prefix if present
    return last.replace(/^\d+-/, "").replace(/_/g, " ");
  } catch {
    return "";
  }
}
