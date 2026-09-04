import { Avatar } from "@components/Avatar/Avatar";
import {
  argTypeSize,
  COLORS_WITH_TRANSPARENT,
  COLORS_WITH_BLACK,
  SIZES_WITH_XL,
} from "lib/utils/constants";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An image element with a fallback for representing the user.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: argTypeSize(SIZES_WITH_XL, "md"),
    backgroundColor: {
      control: "select",
      options: COLORS_WITH_TRANSPARENT,
      description: "The background color of the avatar.",
      table: {
        defaultValue: { summary: "gray" },
        type: {
          summary:
            "red | green | blue | purple | yellow | gray | white | transparent",
        },
      },
    },
    textColor: {
      control: "select",
      options: COLORS_WITH_BLACK,
      description: "The text color of the avatar initials.",
      table: {
        defaultValue: { summary: "gray" },
        type: {
          summary:
            "red | green | blue | purple | yellow | gray | white | black",
        },
      },
    },
    name: {
      control: "text",
      description:
        "The name to generate initials from, if no image is provided.",
    },
    src: {
      control: "text",
      description: "The image source URL.",
    },
    alt: {
      control: "text",
      description: "Alternative text description for the avatar image.",
    },
  },
  args: {
    size: "md",
    backgroundColor: "gray",
    textColor: "gray",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Morty Smith",
  },
};

export const WithImage: Story = {
  args: {
    name: "Rick Sanchez",
    src: "https://avatar.iran.liara.run/public",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
      {SIZES_WITH_XL.map((arg) => (
        <Avatar {...args} key={arg} size={arg} name={arg} />
      ))}
    </div>
  ),
};

export const BackgroundColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {COLORS_WITH_TRANSPARENT.map((arg) => (
        <Avatar {...args} key={arg} backgroundColor={arg} name={arg} />
      ))}
    </div>
  ),
};

export const TextColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {COLORS_WITH_BLACK.map((arg) => (
        <Avatar {...args} key={arg} textColor={arg} name={arg} />
      ))}
    </div>
  ),
};

export const ProfileExample: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Avatar
        {...args}
        backgroundColor="blue"
        textColor="blue"
        size="lg"
        src="https://avatar.iran.liara.run/public"
        alt="User Profile"
      />
      <div>
        <p style={{ fontWeight: 500 }}>Rick Sanchez</p>
        <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>Mad Scientist</p>
      </div>
    </div>
  ),
};

export const GroupedAvatars: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "-1rem" }}>
      <Avatar
        {...args}
        backgroundColor="blue"
        textColor="blue"
        src="https://avatar.iran.liara.run/public"
      />
      <Avatar
        {...args}
        backgroundColor="green"
        textColor="green"
        name="Rick Sanchez"
        style={{ marginLeft: "-1rem" }}
      />
      <Avatar
        {...args}
        backgroundColor="purple"
        textColor="purple"
        name="Morty Smith"
        style={{ marginLeft: "-1rem" }}
      />
      <Avatar
        {...args}
        backgroundColor="yellow"
        textColor="yellow"
        name="+ 2"
        style={{ marginLeft: "-1rem" }}
      />
    </div>
  ),
};
