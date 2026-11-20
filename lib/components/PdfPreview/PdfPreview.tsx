import * as React from "react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";
import { pdfPreview } from "@styled/recipes";
import { Spinner } from "../Spinner/Spinner";
import { resolveLang } from "../DatePicker/dateUtils";

export interface PdfPreviewProps {
  /** The PDF to show: its bytes as a Blob, or a URL (object URLs included). */
  src: Blob | string;

  /** *(optional)*
   * Language of the built-in texts: 'it' or 'en'. Defaults to the document language.
   */
  lang?: string;

  /** *(optional)*
   * Accessible name of the preview, e.g. the document title.
   */
  "aria-label"?: string;

  /** *(optional)*
   * Called once the PDF has been read, with its number of pages.
   */
  onLoad?: (pageCount: number) => void;

  /** *(optional)*
   * Called when the PDF cannot be loaded or read.
   */
  onError?: (error: unknown) => void;

  /** *(optional)*
   * URL of pdf.js's worker (`pdfjs-dist/build/pdf.worker.min.mjs`, as the consumer's bundler
   * serves it). With it the PDF is read off the main thread; without it, in the page.
   */
  workerSrc?: string;

  /** *(optional)*
   * Extra class for the root element.
   */
  className?: string;
}

const TEXT = {
  it: {
    error: "Non è stato possibile mostrare l'anteprima del PDF.",
    page: (n: number, total: number) => `Pagina ${n} di ${total}`,
  },
  en: {
    error: "The PDF preview could not be shown.",
    page: (n: number, total: number) => `Page ${n} of ${total}`,
  },
};

// pdf.js weighs more than a megabyte: it loads only when a preview opens.
const loadPdfjs = async (workerSrc?: string) => {
  const pdfjs = await import("pdfjs-dist");
  if (workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  } else if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    // shortcut: with no worker URL the parser runs in the page, fine for documents of a few pages.
    // Once loaded this way pdf.js keeps parsing in the page, so pass workerSrc from the first preview.
    await import("pdfjs-dist/build/pdf.worker.min.mjs");
  }
  return pdfjs;
};

// Beyond twice the CSS pixels text gets no sharper, while the canvas buffer keeps growing.
const MAX_PIXEL_RATIO = 2;

const isCancellation = (error: unknown) =>
  error instanceof Error && error.name === "RenderingCancelledException";

/**
 * Whether the element is within a screen of the visible area, kept up to date while it scrolls:
 * a page is drawn when it comes near and gives its canvas back when it moves away.
 */
const useNearViewport = (ref: React.RefObject<HTMLElement | null>) => {
  const [near, setNear] = React.useState(
    typeof IntersectionObserver === "undefined",
  );

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "100% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return near;
};

interface PdfPageProps {
  document: PDFDocumentProxy;
  pageNumber: number;
  width: number;
  /** Width over height of the first page: the shape of a page not read yet. */
  aspectRatio: number;
  label: string;
  className: string;
  onError: (error: unknown) => void;
}

const PdfPage = ({
  document,
  pageNumber,
  width,
  aspectRatio,
  label,
  className,
  onError,
}: PdfPageProps) => {
  const figureRef = React.useRef<HTMLElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const near = useNearViewport(figureRef);
  // The page's own shape once it has been read; until then the first page's.
  const [pageRatio, setPageRatio] = React.useState(aspectRatio);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!near) {
      // Away from the visible area the page gives its canvas memory back; the figure keeps its
      // shape, so the scroll position does not move and a resize does not redraw it.
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    if (width <= 0) return;
    let cancelled = false;
    let task: RenderTask | undefined;

    void (async () => {
      try {
        const page = await document.getPage(pageNumber);
        if (cancelled) return;
        const actualSize = page.getViewport({ scale: 1 });
        setPageRatio(actualSize.width / actualSize.height);
        const viewport = page.getViewport({ scale: width / actualSize.width });
        // Drawn at the screen's pixel density, then shrunk by CSS: sharp text on retina screens.
        const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
        canvas.width = Math.floor(viewport.width * ratio);
        canvas.height = Math.floor(viewport.height * ratio);
        task = page.render({
          canvas,
          viewport,
          transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
        });
        await task.promise;
      } catch (error) {
        // A render cancelled by a resize or by unmounting is expected; anything else is a failure.
        if (!cancelled && !isCancellation(error)) onError(error);
      }
    })();

    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [document, pageNumber, width, near, onError]);

  // The figure carries the page's name and its shape, drawn or not: the pages further down stay
  // out of view and wait their turn. The canvas only draws it.
  return (
    <figure
      ref={figureRef}
      className={className}
      aria-label={label}
      style={{ aspectRatio: pageRatio }}
    >
      <canvas ref={canvasRef} />
    </figure>
  );
};

/**
 * Shows the pages of a PDF inside the page, without the browser's PDF viewer and its toolbar.
 * Pages fill the available width and follow it when it changes; each one is drawn when it comes
 * near the visible area.
 *
 * Needs the optional peer dependency `pdfjs-dist`.
 *
 * @param src - The PDF: a Blob or a URL.
 * @param lang - *(optional)* Language of the built-in texts: 'it' or 'en'.
 * @param aria-label - *(optional)* Accessible name of the preview.
 * @param onLoad - *(optional)* Called once the PDF has been read, with its number of pages.
 * @param onError - *(optional)* Called when the PDF cannot be loaded or read.
 * @param workerSrc - *(optional)* URL of pdf.js's worker: with it the PDF is read off the main thread.
 * @param className - *(optional)* Extra class for the root element.
 */
export const PdfPreview: React.FC<PdfPreviewProps> = ({
  src,
  lang,
  "aria-label": ariaLabel,
  onLoad,
  onError,
  workerSrc,
  className,
}) => {
  const classes = pdfPreview();
  const text = TEXT[resolveLang(lang)];
  const rootRef = React.useRef<HTMLElement>(null);
  const [document, setDocument] = React.useState<PDFDocumentProxy | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const [aspectRatio, setAspectRatio] = React.useState(1);
  // The latest callbacks, without reloading the PDF when the parent passes new functions.
  const callbacksRef = React.useRef({ onLoad, onError });
  React.useEffect(() => {
    callbacksRef.current = { onLoad, onError };
  }, [onLoad, onError]);

  const handlePageError = React.useCallback((error: unknown) => {
    setFailed(true);
    callbacksRef.current.onError?.(error);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    let task: PDFDocumentLoadingTask | undefined;
    setDocument(null);
    setFailed(false);

    void (async () => {
      try {
        const pdfjs = await loadPdfjs(workerSrc);
        const source =
          typeof src === "string"
            ? { url: src }
            : { data: new Uint8Array(await src.arrayBuffer()) };
        if (cancelled) return;
        // Errors only: pdf.js warnings (the in-place parser, repaired files) are noise in a consumer's console.
        task = pdfjs.getDocument({
          ...source,
          verbosity: pdfjs.VerbosityLevel.ERRORS,
        });
        const loaded = await task.promise;
        const firstPage = await loaded.getPage(1);
        const first = firstPage.getViewport({ scale: 1 });
        if (cancelled) return;
        setAspectRatio(first.width / first.height);
        setDocument(loaded);
        callbacksRef.current.onLoad?.(loaded.numPages);
      } catch (error) {
        if (cancelled) return;
        setFailed(true);
        callbacksRef.current.onError?.(error);
      }
    })();

    return () => {
      cancelled = true;
      // Destroying also stops a load still in progress.
      task?.destroy();
    };
  }, [src, workerSrc]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setWidth(Math.floor(root.clientWidth));
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    // An article: the preview is a self-contained document, and the tag says so without a role.
    <article
      ref={rootRef}
      className={`${classes.root} ${className ?? ""}`.trim()}
      aria-label={ariaLabel}
      aria-busy={!document && !failed}
    >
      {failed && (
        <div className={classes.status} role="alert">
          {text.error}
        </div>
      )}
      {!failed && !document && (
        <div className={classes.status}>
          <Spinner />
        </div>
      )}
      {document &&
        Array.from({ length: document.numPages }, (_, index) => (
          <PdfPage
            key={index}
            document={document}
            pageNumber={index + 1}
            width={width}
            aspectRatio={aspectRatio}
            label={text.page(index + 1, document.numPages)}
            className={classes.page}
            onError={handlePageError}
          />
        ))}
    </article>
  );
};
