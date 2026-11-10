import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { Scrollbar } from "./Scrollbar";

const meta = {
  title: "Components/Scrollbar",
  component: Scrollbar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A scrollbar drawn by the library over a scrolling element: the same in every browser and always visible while the content overflows.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Scrollbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ScrollingBox = ({ lines }: { lines: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div style={{ position: "relative", width: 240 }}>
      <div
        ref={ref}
        style={{ maxHeight: 200, overflowY: "auto", paddingRight: 12 }}
      >
        {Array.from({ length: lines }, (_, i) => (
          <p key={i} style={{ margin: "0 0 8px" }}>
            Line {i + 1}
          </p>
        ))}
      </div>
      <Scrollbar targetRef={ref} />
    </div>
  );
};

export const Default: Story = {
  args: { targetRef: { current: null } },
  render: () => <ScrollingBox lines={30} />,
};

export const ContentThatFits: Story = {
  args: { targetRef: { current: null } },
  render: () => <ScrollingBox lines={4} />,
};
