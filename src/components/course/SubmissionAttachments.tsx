"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * What the page hands over about one attachment.
 *
 * Deliberately no storage_path. The viewer asks the access route by id and the
 * server resolves the location itself, so a file's position in the bucket never
 * reaches a browser.
 */
export interface AttachmentView {
  id: string;
  filename: string;
  size_bytes: number;
  mime_type: string | null;
}

function isImage(mimeType: string | null): boolean {
  return mimeType?.startsWith("image/") ?? false;
}

function formatSize(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Signed URLs live for minutes, so every one is fetched at the moment it is
 * needed and none is ever stored. A URL held from page load would be dead by
 * the time a teacher works down a long roster.
 */
async function fetchAttachmentUrl(id: string): Promise<string> {
  const res = await fetch(`/api/submissions/files/${id}/access`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "無法開啟這個附件");
  }
  const { url } = await res.json();
  return url;
}

function Lightbox({
  file,
  url,
  onClose,
}: {
  file: AttachmentView;
  url: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // showModal() rather than the open attribute: it is what gives us the
    // top-layer backdrop, Esc-to-close, a focus trap, and focus handed back to
    // the thumbnail on close — all behaviour we would otherwise hand-roll.
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // A click landing on the dialog itself is a click on the backdrop: the
        // image and the button are children and would be the target instead.
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-label={file.filename}
      className="max-h-[90vh] max-w-[90vw] bg-transparent p-0 backdrop:bg-slate-900/70"
    >
      <div className="flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={file.filename}
          className="max-h-[80vh] max-w-full rounded-lg bg-white object-contain shadow-2xl"
        />
        <div className="flex items-center gap-3 rounded-full bg-white/95 px-4 py-2 shadow-lg">
          <span className="text-xs text-slate-600">{file.filename}</span>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="text-xs font-medium text-slate-900 hover:text-slate-600"
          >
            關閉
          </button>
        </div>
      </div>
    </dialog>
  );
}

function ImageAttachment({ file }: { file: AttachmentView }) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const retried = useRef(false);

  const loadThumb = useCallback(() => {
    let cancelled = false;
    fetchAttachmentUrl(file.id)
      .then((u) => {
        if (!cancelled) setThumbUrl(u);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [file.id]);

  useEffect(() => loadThumb(), [loadThumb]);

  async function handleOpen() {
    setBusy(true);
    setError(null);
    try {
      // Signed afresh on open rather than reusing the thumbnail's URL, which
      // may have expired while the page sat open.
      setFullUrl(await fetchAttachmentUrl(file.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "無法開啟這個附件");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        {file.filename}：{error}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleOpen}
        disabled={busy || !thumbUrl}
        aria-label={`放大 ${file.filename}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50 transition hover:border-slate-400 disabled:cursor-default"
      >
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={file.filename}
            className="h-full w-full object-cover"
            onError={() => {
              // The URL expired before the image loaded. Sign once more; a
              // second failure is a real error, not a stale URL.
              if (retried.current) {
                setError("無法載入預覽");
                return;
              }
              retried.current = true;
              setThumbUrl(null);
              loadThumb();
            }}
          />
        ) : (
          <span className="text-[10px] text-slate-400">載入中……</span>
        )}
      </button>

      <div className="min-w-0">
        <p className="truncate text-sm text-slate-700">{file.filename}</p>
        <p className="text-xs text-slate-500">
          {formatSize(file.size_bytes)}
          {" ・ "}
          <button
            type="button"
            onClick={handleOpen}
            disabled={busy}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {busy ? "開啟中……" : "點擊放大"}
          </button>
        </p>
      </div>

      {fullUrl && (
        <Lightbox
          file={file}
          url={fullUrl}
          onClose={() => setFullUrl(null)}
        />
      )}
    </div>
  );
}

function FileAttachment({ file }: { file: AttachmentView }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleOpen() {
    setBusy(true);
    setError(null);
    try {
      const url = await fetchAttachmentUrl(file.id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "無法開啟這個附件");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleOpen}
        disabled={busy}
        className="text-left text-sm text-blue-600 underline hover:text-blue-800"
      >
        📎 {file.filename}（{formatSize(file.size_bytes)}）
        {busy && "……"}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

/**
 * The attachments on one submission, rendered so they can actually be opened.
 *
 * Images resolve inline because the common case is a teacher grading a roster:
 * seeing the work should not cost a round trip to another tab. Everything else
 * opens in a new tab, which is honest about what a browser can do with a PDF or
 * a zip.
 *
 * Shared by the teacher's roster and the student's own view so the two cannot
 * drift; who may call the access route is settled server-side, not here.
 */
export function SubmissionAttachments({ files }: { files: AttachmentView[] }) {
  if (files.length === 0) return null;

  return (
    <ul className="mt-3 space-y-3">
      {files.map((f) => (
        <li key={f.id}>
          {isImage(f.mime_type) ? (
            <ImageAttachment file={f} />
          ) : (
            <FileAttachment file={f} />
          )}
        </li>
      ))}
    </ul>
  );
}
