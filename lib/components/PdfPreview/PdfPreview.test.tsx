import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { PdfPreview } from "./PdfPreview";

const { getDocument, destroy, renderPage, GlobalWorkerOptions } = vi.hoisted(
  () => ({
    getDocument: vi.fn(),
    destroy: vi.fn(() => Promise.resolve()),
    renderPage: vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() })),
    GlobalWorkerOptions: { workerSrc: "" },
  }),
);

vi.mock("pdfjs-dist", () => ({
  getDocument,
  GlobalWorkerOptions,
  VerbosityLevel: { ERRORS: 0 },
}));
vi.mock("pdfjs-dist/build/pdf.worker.min.mjs", () => ({}));

const fakeDocument = (numPages: number) => ({
  numPages,
  getPage: vi.fn(() =>
    Promise.resolve({
      getViewport: ({ scale }: { scale: number }) => ({
        width: 600 * scale,
        height: 800 * scale,
      }),
      render: renderPage,
    }),
  ),
});

const resolvesTo = (document: unknown) =>
  getDocument.mockReturnValue({ promise: Promise.resolve(document), destroy });

describe("PdfPreview", () => {
  beforeEach(() => {
    // jsdom has no layout: give the preview a width so pages get drawn.
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(300);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    getDocument.mockReset();
    destroy.mockClear();
    renderPage.mockClear();
    GlobalWorkerOptions.workerSrc = "";
  });

  it("draws one labelled page per PDF page, sized to the available width", async () => {
    resolvesTo(fakeDocument(2));

    const onLoad = vi.fn();
    render(
      <PdfPreview
        src="/file.pdf"
        lang="it"
        aria-label="Cedolino"
        onLoad={onLoad}
      />,
    );

    expect(
      await screen.findByRole("figure", { name: "Pagina 2 di 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("figure", { name: "Pagina 1 di 2" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Cedolino" })).toHaveAttribute(
      "aria-busy",
      "false",
    );
    expect(getDocument).toHaveBeenCalledWith({
      url: "/file.pdf",
      verbosity: 0,
    });
    expect(onLoad).toHaveBeenCalledWith(2);
    await waitFor(() => expect(renderPage).toHaveBeenCalledTimes(2));
    expect(renderPage).toHaveBeenCalledWith(
      expect.objectContaining({ viewport: { width: 300, height: 400 } }),
    );
  });

  it("reads a Blob as bytes", async () => {
    resolvesTo(fakeDocument(1));
    const blob = new Blob([new Uint8Array([37, 80, 68, 70])], {
      type: "application/pdf",
    });

    render(<PdfPreview src={blob} lang="en" />);

    expect(
      await screen.findByRole("figure", { name: "Page 1 of 1" }),
    ).toBeInTheDocument();
    expect(getDocument).toHaveBeenCalledWith({
      data: new Uint8Array([37, 80, 68, 70]),
      verbosity: 0,
    });
  });

  it("shows the error text and reports the error when the PDF cannot be read", async () => {
    const failure = new Error("Invalid PDF structure");
    getDocument.mockReturnValue({ promise: Promise.reject(failure), destroy });
    const onError = vi.fn();

    render(<PdfPreview src="/broken.pdf" lang="it" onError={onError} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Non è stato possibile mostrare l'anteprima del PDF.",
    );
    expect(onError).toHaveBeenCalledWith(failure);
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
  });

  it("redraws the pages at the new width when the preview is resized", async () => {
    type Resize = (entries: { contentRect: { width: number } }[]) => void;
    let resize: Resize | undefined;
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn();
        disconnect = disconnect;
        constructor(callback: Resize) {
          resize = callback;
        }
      },
    );
    // A retina screen: the canvas is drawn at twice the pixels and shrunk by CSS.
    vi.stubGlobal("devicePixelRatio", 2);
    resolvesTo(fakeDocument(1));

    const { unmount } = render(
      <PdfPreview src="/file.pdf" className="custom" />,
    );
    await waitFor(() => expect(renderPage).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("article")).toHaveClass("custom");

    act(() => resize?.([{ contentRect: { width: 500.6 } }]));

    // 500.6 px of room become 500: the canvas never draws wider than the box.
    await waitFor(() =>
      expect(renderPage).toHaveBeenLastCalledWith(
        expect.objectContaining({
          viewport: expect.objectContaining({ width: 500 }),
          transform: [2, 0, 0, 2, 0, 0],
        }),
      ),
    );
    expect(renderPage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        canvas: expect.objectContaining({ width: 1000 }),
      }),
    );
    unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("releases the document when it unmounts", async () => {
    resolvesTo(fakeDocument(1));

    const { unmount } = render(<PdfPreview src="/file.pdf" />);
    await screen.findByRole("figure");
    unmount();

    expect(destroy).toHaveBeenCalled();
  });

  it("reports a page that cannot be drawn instead of leaving it blank", async () => {
    const failure = new Error("Bad page stream");
    // Rejected only when the page is drawn, so the rejection is always handled.
    renderPage.mockImplementationOnce(() => ({
      promise: Promise.reject(failure),
      cancel: vi.fn(),
    }));
    resolvesTo(fakeDocument(1));
    const onError = vi.fn();

    render(<PdfPreview src="/file.pdf" lang="it" onError={onError} />);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(failure);
  });

  it("treats a cancelled render as expected, not as a failure", async () => {
    const cancelled = new Error("Rendering cancelled");
    cancelled.name = "RenderingCancelledException";
    // Rejected only when the page is drawn, so the rejection is always handled.
    renderPage.mockImplementationOnce(() => ({
      promise: Promise.reject(cancelled),
      cancel: vi.fn(),
    }));
    resolvesTo(fakeDocument(1));
    const onError = vi.fn();

    render(<PdfPreview src="/file.pdf" onError={onError} />);

    await waitFor(() => expect(renderPage).toHaveBeenCalled());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
  });

  it("draws a page only when it comes near the visible area", async () => {
    const watched = new Map<
      Element,
      (entries: { isIntersecting: boolean }[]) => void
    >();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        callback: (entries: { isIntersecting: boolean }[]) => void;
        constructor(
          callback: (entries: { isIntersecting: boolean }[]) => void,
        ) {
          this.callback = callback;
        }
        observe(element: Element) {
          watched.set(element, this.callback);
        }
        disconnect = vi.fn();
      },
    );
    resolvesTo(fakeDocument(2));

    render(<PdfPreview src="/file.pdf" lang="en" />);
    const second = await screen.findByRole("figure", { name: "Page 2 of 2" });
    // Not drawn yet, the page keeps the shape of the first one (600 x 800).
    expect(second).toHaveStyle({ aspectRatio: "0.75" });
    expect(renderPage).not.toHaveBeenCalled();

    act(() => watched.get(second)?.([{ isIntersecting: true }]));

    await waitFor(() => expect(renderPage).toHaveBeenCalledTimes(1));
    expect(renderPage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        canvas: expect.objectContaining({ width: 300 }),
      }),
    );

    // Scrolled away, the page gives its canvas back and keeps its shape.
    act(() => watched.get(second)?.([{ isIntersecting: false }]));

    expect(renderPage).toHaveBeenLastCalledWith(
      expect.objectContaining({
        canvas: expect.objectContaining({ width: 0 }),
      }),
    );
    expect(second).toHaveStyle({ aspectRatio: "0.75" });
    expect(renderPage).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it("hands pdf.js the worker URL, so the PDF is read off the main thread", async () => {
    resolvesTo(fakeDocument(1));

    render(<PdfPreview src="/file.pdf" workerSrc="/pdf.worker.min.mjs" />);

    await screen.findByRole("figure");
    expect(GlobalWorkerOptions.workerSrc).toBe("/pdf.worker.min.mjs");
  });

  it("drops a load still in progress when the PDF changes", async () => {
    const pendingDestroy = vi.fn(() => Promise.resolve());
    getDocument.mockReturnValueOnce({
      promise: Promise.race([]), // never settles
      destroy: pendingDestroy,
    });
    const { rerender } = render(<PdfPreview src="/first.pdf" lang="en" />);
    await waitFor(() => expect(getDocument).toHaveBeenCalledTimes(1));

    resolvesTo(fakeDocument(1));
    rerender(<PdfPreview src="/second.pdf" lang="en" />);

    expect(
      await screen.findByRole("figure", { name: "Page 1 of 1" }),
    ).toBeInTheDocument();
    expect(pendingDestroy).toHaveBeenCalled();
    expect(getDocument).toHaveBeenLastCalledWith(
      expect.objectContaining({ url: "/second.pdf" }),
    );
  });
});
