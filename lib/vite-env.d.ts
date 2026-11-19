/// <reference types="vite/client" />

// pdf.js ships no types for its worker bundle: PdfPreview imports it only to run the parser in place.
declare module "pdfjs-dist/build/pdf.worker.min.mjs";
