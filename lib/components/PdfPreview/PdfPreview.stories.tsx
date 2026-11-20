import type { Meta, StoryObj } from "@storybook/react-vite";
import { PdfPreview } from "./PdfPreview";

// A two-page PDF written by hand, so the story needs no file. pdf.js rebuilds the
// cross-reference table that this sample leaves out.
const page = (text: string) => `BT /F1 28 Tf 72 720 Td (${text}) Tj ET`;
const samplePdf = new Blob(
  [
    [
      "%PDF-1.4",
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
      "2 0 obj << /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >> endobj",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj",
      `4 0 obj << /Length ${page("Page one").length} >> stream\n${page("Page one")}\nendstream endobj`,
      "5 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj",
      `6 0 obj << /Length ${page("Page two").length} >> stream\n${page("Page two")}\nendstream endobj`,
      "7 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
      "trailer << /Root 1 0 R >>",
      "%%EOF",
    ].join("\n"),
  ],
  { type: "application/pdf" },
);

const meta = {
  title: "Components/PdfPreview",
  component: PdfPreview,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shows the pages of a PDF without the browser's PDF viewer. Needs the optional peer dependency `pdfjs-dist`.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    src: samplePdf,
    lang: "en",
    "aria-label": "Sample document",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PdfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Unreadable: Story = {
  args: {
    src: new Blob(["not a pdf"], { type: "application/pdf" }),
  },
};
