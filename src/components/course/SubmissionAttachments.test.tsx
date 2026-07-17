import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { SubmissionAttachments, type AttachmentView } from "./SubmissionAttachments";

const PNG: AttachmentView = {
  id: "f1",
  filename: "定位收斂器-定位卡-方形.png",
  size_bytes: 177680,
  mime_type: "image/png",
};

const PDF: AttachmentView = {
  id: "f2",
  filename: "我的作業.pdf",
  size_bytes: 51200,
  mime_type: "application/pdf",
};

const fetchMock = vi.fn();
const openMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({
    ok: true,
    json: async () => ({ url: "https://storage.example/signed?token=abc" }),
  });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("open", openMock.mockReset());

  // jsdom implements <dialog> markup but not the modal behaviour behind it.
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("SubmissionAttachments", () => {
  it("renders nothing when there are no attachments", () => {
    const { container } = render(<SubmissionAttachments files={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows an image attachment as a thumbnail", async () => {
    render(<SubmissionAttachments files={[PNG]} />);

    const thumb = await screen.findByAltText(PNG.filename);
    expect(thumb.getAttribute("src")).toBe(
      "https://storage.example/signed?token=abc",
    );
    expect(fetchMock).toHaveBeenCalledWith("/api/submissions/files/f1/access");
  });

  it("labels the attachment with the original filename, not the storage key", async () => {
    render(<SubmissionAttachments files={[PNG]} />);
    expect(await screen.findByText(PNG.filename)).toBeTruthy();
  });

  it("enlarges an image in an overlay on click, without navigating away", async () => {
    render(<SubmissionAttachments files={[PNG]} />);

    fireEvent.click(await screen.findByLabelText(`放大 ${PNG.filename}`));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(openMock).not.toHaveBeenCalled();
  });

  it("signs a fresh URL when the overlay opens rather than reusing the thumbnail's", async () => {
    render(<SubmissionAttachments files={[PNG]} />);
    await screen.findByAltText(PNG.filename);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText(`放大 ${PNG.filename}`));

    // A URL held since page load may already be dead; opening asks for another.
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("re-signs once when a thumbnail URL has expired before it loaded", async () => {
    render(<SubmissionAttachments files={[PNG]} />);
    const thumb = await screen.findByAltText(PNG.filename);

    fireEvent.error(thumb);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });

  it("opens a non-image attachment in a new tab", async () => {
    render(<SubmissionAttachments files={[PDF]} />);

    const link = screen.getByRole("button", { name: /我的作業\.pdf/ });
    fireEvent.click(link);

    await waitFor(() =>
      expect(openMock).toHaveBeenCalledWith(
        "https://storage.example/signed?token=abc",
        "_blank",
        "noopener,noreferrer",
      ),
    );
    // A PDF gets no thumbnail: nothing was fetched until the click.
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("surfaces a denial instead of showing a broken image", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "這份附件不屬於你" }),
    });

    render(<SubmissionAttachments files={[PNG]} />);

    expect(await screen.findByText(/這份附件不屬於你/)).toBeTruthy();
    expect(screen.queryByAltText(PNG.filename)).toBeNull();
  });

  it("closes the overlay with the close control", async () => {
    render(<SubmissionAttachments files={[PNG]} />);
    fireEvent.click(await screen.findByLabelText(`放大 ${PNG.filename}`));
    await screen.findByRole("dialog");

    fireEvent.click(screen.getByRole("button", { name: "關閉" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("closes the overlay when the backdrop is clicked", async () => {
    render(<SubmissionAttachments files={[PNG]} />);
    fireEvent.click(await screen.findByLabelText(`放大 ${PNG.filename}`));

    const dialog = await screen.findByRole("dialog");
    // A click whose target is the dialog itself landed on the backdrop.
    fireEvent.click(dialog);

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("unmounts the overlay when the dialog emits close, as Esc does", async () => {
    render(<SubmissionAttachments files={[PNG]} />);
    fireEvent.click(await screen.findByLabelText(`放大 ${PNG.filename}`));

    const dialog = await screen.findByRole("dialog");
    // Esc fires the native close event; jsdom does not implement the key
    // handling, so the event it would raise is dispatched directly.
    fireEvent(dialog, new Event("close"));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("renders each attachment on a mixed submission", async () => {
    render(<SubmissionAttachments files={[PNG, PDF]} />);

    expect(await screen.findByAltText(PNG.filename)).toBeTruthy();
    expect(screen.getByRole("button", { name: /我的作業\.pdf/ })).toBeTruthy();
  });
});
