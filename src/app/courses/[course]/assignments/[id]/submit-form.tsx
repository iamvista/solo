"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SUBMISSIONS_BUCKET } from "@/lib/assignments";
import {
  SubmissionAttachments,
  type AttachmentView,
} from "@/components/course/SubmissionAttachments";

interface Props {
  assignmentId: string;
  allowFile: boolean;
  allowText: boolean;
  allowLink: boolean;
  initialText: string;
  initialLink: string;
  existingFiles: AttachmentView[];
  hasSubmitted: boolean;
}

interface UploadedFile {
  path: string;
  filename: string;
  size_bytes: number;
  mime_type: string | null;
}

export function SubmitForm({
  assignmentId,
  allowFile,
  allowText,
  allowLink,
  initialText,
  initialLink,
  existingFiles,
  hasSubmitted,
}: Props) {
  const router = useRouter();
  const [text, setText] = useState(initialText);
  const [link, setLink] = useState(initialLink);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload straight to storage using a server-signed URL. The bytes never pass
   * through a route handler, which is what keeps attachments clear of the
   * platform's 4.5MB request body limit.
   */
  async function uploadOne(file: File): Promise<UploadedFile> {
    const res = await fetch(`/api/assignments/${assignmentId}/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name }),
    });
    if (!res.ok) throw new Error("無法建立上傳連結");

    const { token, path } = await res.json();
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(SUBMISSIONS_BUCKET)
      .uploadToSignedUrl(path, token, file);

    if (uploadError) throw new Error(`「${file.name}」上傳失敗`);

    return {
      path,
      filename: file.name,
      size_bytes: file.size,
      mime_type: file.type || null,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const uploaded: UploadedFile[] = [];
      for (const file of files) {
        uploaded.push(await uploadOne(file));
      }

      const res = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text_content: allowText ? text : undefined,
          link_url: allowLink ? link : undefined,
          files: allowFile && uploaded.length > 0 ? uploaded : undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Keep whatever they typed on screen — losing an essay to a failed
        // request would be worse than the failure itself.
        setError(body.error ?? "繳交失敗，請再試一次。");
        return;
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "繳交失敗，請再試一次。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {allowText && (
        <div>
          <label className="block text-sm font-medium text-slate-900">
            文字內容
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            placeholder="把你的作業寫在這裡"
          />
        </div>
      )}

      {allowLink && (
        <div>
          <label className="block text-sm font-medium text-slate-900">
            外部連結
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            placeholder="https://docs.google.com/..."
          />
        </div>
      )}

      {allowFile && (
        <div>
          <label className="block text-sm font-medium text-slate-900">
            上傳檔案
          </label>
          {existingFiles.length > 0 && (
            <>
              <p className="mt-1 text-xs text-slate-500">目前已附：</p>
              <SubmissionAttachments files={existingFiles} />
            </>
          )}
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:text-white"
          />
          {existingFiles.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              重新選檔會取代目前已附的檔案。
            </p>
          )}
        </div>
      )}

      <Button type="submit" disabled={busy}>
        {busy ? "繳交中……" : hasSubmitted ? "更新我的繳交" : "繳交作業"}
      </Button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
