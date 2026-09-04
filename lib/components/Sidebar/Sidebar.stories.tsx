import { Meta, StoryObj } from "@storybook/react-vite";
import {
  BellIcon,
  CalendarIcon,
  HomeIcon,
  ChatBubbleIcon,
  DotsVerticalIcon,
  GearIcon,
  Pencil1Icon,
  TrashIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { Sidebar, SidebarProps } from "./Sidebar";
import { Avatar, Button } from "lib/main";
import { AithoIcon } from "lib/Icons/AithoIcon";
import { useState } from "react";
import {
  argTypeChildren,
  argTypeVariant,
  BEHAVIOURS,
  POSITIONS_HORIZONTAL,
  POSITIONS_TYPES,
  VARIANTS_TERTIARY,
} from "lib/utils/constants";

const getDescription = (args: SidebarProps) => {
  if (!args) return "Sidebar Content";

  if (args.itemsLoading) {
    return "Sidebar in loading state";
  }

  if (args.openLastSelected) {
    return "Sidebar with auto-expanded submenu and scroll to selected item";
  }

  if (args.menuConfig?.visible) {
    return args.menuConfig.customIcon
      ? "Sidebar with custom menu icon for items"
      : "Sidebar with default menu icon for items";
  }

  if (Array.isArray(args.items) && args.items.some((item) => item.subItems)) {
    return "Sidebar with nested navigation items";
  }

  const descriptions = {
    permanent: "Permanent sidebar that stays visible at all times",
    toggle: "Toggleable sidebar that can be shown or hidden",
    hover: "Sidebar that expands when hovered over",
  };

  if (args.behaviour) {
    return descriptions[args.behaviour as keyof typeof descriptions];
  }

  if (args.expandOnHover) {
    return "Expandable sidebar that reveals full content on hover";
  }

  if (!args.items) {
    return "Sidebar with custom content";
  }

  return "Standard sidebar with navigation items";
};

const defaultMenuItems = [
  {
    type: "item" as const,
    text: "Edit",
    onClick: () => console.log("Edit clicked"),
    rightSlot: <Pencil1Icon />,
    action: "edit" as const,
  },
  {
    type: "separator" as const,
  },
  {
    type: "item" as const,
    text: "Delete",
    onClick: () => console.log("Delete clicked"),
    rightSlot: <TrashIcon />,
    disable: true,
  },
];

const navigationItems = [
  {
    key: "home",
    icon: <HomeIcon />,
    text: "Home",
    selected: true,
    menuItems: defaultMenuItems,
    editable: true,
  },
  {
    key: "calendar",
    icon: <CalendarIcon />,
    text: "Calendar",
    menuItems: defaultMenuItems,
    disabled: true,
  },
  {
    key: "notifications",
    icon: <BellIcon />,
    text: "Notifications",
    menuItems: defaultMenuItems,
    editable: true,
  },
];

const nestedNavigationItems = [
  {
    key: "chats",
    icon: <ChatBubbleIcon />,
    text: "Chats",
    menuItems: defaultMenuItems,
    subItems: [
      {
        key: "chat-1",
        icon: <CalendarIcon />,
        text: "Chat 1",
        menuItems: defaultMenuItems,
        editable: true,
        subItems: Array.from({ length: 100 }, (_, i) => ({
          key: `chat-${i}`,
          icon: <ChatBubbleIcon />,
          text: `Chat ${i}`,
          menuItems: defaultMenuItems,
          editable: true,
        })),
      },
    ],
  },
];

const deepNestedItems = [
  {
    key: "home",
    icon: <HomeIcon />,
    text: "Home",
    menuItems: defaultMenuItems,
    editable: true,
  },
  {
    key: "messages",
    icon: <ChatBubbleIcon />,
    text: "Messages",
    menuItems: defaultMenuItems,
    subItems: [
      {
        key: "direct",
        icon: <ChatBubbleIcon />,
        text: "Direct",
        menuItems: defaultMenuItems,
        editable: true,
        subItems: [
          {
            key: "team",
            icon: <ChatBubbleIcon />,
            text: "Team",
            menuItems: defaultMenuItems,
            editable: true,
          },
        ],
      },
    ],
  },
  {
    key: "settings",
    icon: <GearIcon />,
    text: "Settings",
    menuItems: defaultMenuItems,
    editable: true,
  },
];

const header = (
  onToggle?: () => void,
  isOpen?: boolean,
  expandOnHover?: boolean,
) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      transition: "gap 0.2s ease-in-out",
    }}
  >
    {onToggle && !expandOnHover && (
      <button
        onClick={onToggle}
        style={{
          position: !isOpen ? "absolute" : "relative",
          cursor: "pointer",
          display: "inline-block",
        }}
      >
        <HamburgerMenuIcon />
      </button>
    )}
    <AithoIcon width={100} />
  </div>
);

const footer = (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "100%",
    }}
  >
    <Avatar
      size="md"
      src="https://avatar.iran.liara.run/public"
      alt="User Profile"
    />
    <div style={{ overflow: "hidden" }}>
      <p
        style={{
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Rick Sanchez
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-secondary)",
          whiteSpace: "nowrap",
        }}
      >
        Mad Scientist
      </p>
    </div>
  </div>
);

const customBody = () => {
  const chatsItems = Array.from({ length: 5 }, (_, i) => ({
    key: `chat-${i}`,
    icon: <ChatBubbleIcon />,
    text: `Chat ${i}`,
    onClick: () => alert(`Open chat ${i}`),
  }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        width: "208px",
      }}
    >
      <Button
        icon={{
          data: ChatBubbleIcon,
        }}
      >
        New Chat
      </Button>
      {chatsItems.map((item) => (
        <button
          key={item.key}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            padding: "8px",
            borderRadius: "6px",
            cursor: "pointer",
            color: "var(--text-primary)",
            transition: "all 0.2s ease",
          }}
          onClick={item.onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              item.onClick();
            }
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--background-tertiary)";
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--background-tertiary)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "";
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = "";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <ChatBubbleIcon />
            <span>{item.text}</span>
          </div>
          <DotsVerticalIcon />
        </button>
      ))}
    </div>
  );
};

const defaultMenuConfig = {
  visible: true,
  iconDirection: "vertical" as const,
  withDropDown: true,
  position: {
    side: "right" as const,
    align: "start" as const,
    offset: 5,
  },
  defaultItems: defaultMenuItems,
};

const ToggleStory = (args: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(args.open);
  const toggleHeader = () => {
    const customHeader = header(
      () => setIsOpen((prev) => !prev),
      isOpen,
      args.expandOnHover,
    );
    return customHeader;
  };
  return (
    <Sidebar
      {...args}
      open={isOpen}
      header={toggleHeader()}
      onOpenChange={(open) => setIsOpen(open)}
    />
  );
};

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sidebar component providing a responsive navigation interface with nested items and customizable behaviors.",
      },
      controls: {
        exclude: ["children"],
      },
    },
  },
  argTypes: {
    behaviour: {
      control: "select",
      options: BEHAVIOURS,
      description:
        "Determines if sidebar is always visible, toggleable or expands on hover. Ignored if `expandOnHover=true`.",
      table: {
        defaultValue: { summary: "toggle" },
        type: { summary: "permanent | toggle | hover" },
      },
    },
    anchor: {
      control: "select",
      options: POSITIONS_HORIZONTAL,
      description:
        "Side of the screen where sidebar is anchored.  Use with `position='fixed'`",
      table: {
        defaultValue: { summary: "left" },
        type: { summary: "left | right" },
      },
    },
    variant: argTypeVariant(VARIANTS_TERTIARY, "primary"),
    position: {
      control: "select",
      options: POSITIONS_TYPES,
      description: "The position of the sidebar.",
      table: {
        defaultValue: { summary: "static" },
        type: { summary: "fixed | static" },
      },
    },
    open: {
      description: "Controls whether sidebar is expanded or collapsed.",
      control: "boolean",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    expandOnHover: {
      description: "Whether sidebar expands on mouse hover.",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    header: {
      control: "object",
      description: "Content to render in sidebar header.",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    footer: {
      control: "object",
      description: "Content to render in sidebar footer.",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    items: {
      description: "Array of navigation items to render.",
      control: "object",
      table: {
        defaultValue: { summary: "[]" },
        type: { summary: "SidebarItem[]" },
      },
    },
    menuConfig: {
      description: "Configuration object for menu behavior.",
      control: "object",
      table: {
        type: { summary: "MenuConfiguration" },
      },
    },
    onOpenChange: {
      description: "Callback fired when sidebar open state changes.",
    },
    openLastSelected: {
      description: "Whether to expand parents of last selected item.",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    lastSelectedKey: {
      description: "Key of the last selected navigation item.",
      control: "text",
    },
    onItemTextChange: {
      description:
        "Callback function triggered when the text of the menu item changes.",
    },
    itemsLoading: {
      description: "Whether the navigation items are still loading",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    children: argTypeChildren(),
    style: {
      description: "Ignore this option, need only for storybook.",
    },
  },
  decorators: [
    (Story, context) => {
      const theme = document.documentElement.getAttribute("data-panda-theme");
      return (
        <div
          style={{
            position: "relative",
            height: "600px",
            display: "flex",
            margin: theme === "dark" ? "-1rem" : "",
          }}
        >
          <Story />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <p
              style={{
                marginTop: "24px",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
                color: "var(--text-primary)",
              }}
            >
              {getDescription(context.args)}
            </p>
          </div>
        </div>
      );
    },
  ],
  args: {
    behaviour: "toggle",
    anchor: "left",
    variant: "primary",
    position: "static",
    open: true,
    expandOnHover: false,
    items: navigationItems,
    openLastSelected: false,
    itemsLoading: false,
    header: header(),
    footer: footer,
    style: { maxHeight: "600px" },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ToggleBehaviour: Story = {
  args: {
    menuConfig: { ...defaultMenuConfig, visible: false },
  },
  render: (args) => {
    return <ToggleStory {...args} />;
  },
};

export const PermanentBehaviour: Story = {
  args: {
    behaviour: "permanent",
    menuConfig: { ...defaultMenuConfig, visible: false },
  },
};

export const HoverBehaviour: Story = {
  args: {
    behaviour: "hover",
    expandOnHover: true,
    menuConfig: { ...defaultMenuConfig, visible: false },
  },
};

export const FixedPositionAndLeftAnchor: Story = {
  args: {
    behaviour: "hover",
    position: "fixed",
    expandOnHover: true,
    menuConfig: { ...defaultMenuConfig, visible: false },
  },
};

export const FixedPositionAndRightAnchor: Story = {
  args: {
    behaviour: "hover",
    position: "fixed",
    anchor: "right",
    expandOnHover: true,
    menuConfig: { ...defaultMenuConfig, visible: false },
  },
};

export const NestedItems: Story = {
  args: {
    items: nestedNavigationItems,
    menuConfig: defaultMenuConfig,
    onItemTextChange: (text) => console.log("Text changed to:", text),
  },
};

export const WithDropdownMenu: Story = {
  args: {
    menuConfig: defaultMenuConfig,
  },
};

export const WithCustomMenuIcon: Story = {
  args: {
    menuConfig: {
      ...defaultMenuConfig,
      customIcon: <GearIcon />,
    },
  },
};

export const WithAutoExpandAndScroll: Story = {
  args: {
    expandOnHover: true,
    items: deepNestedItems,
    menuConfig: defaultMenuConfig,
    openLastSelected: true,
    lastSelectedKey: "team",
    onItemTextChange: (text) => console.log("Text changed to:", text),
  },
};

export const CustomContent: Story = {
  args: {
    behaviour: "permanent",
    children: customBody(),
    menuConfig: { ...defaultMenuConfig, visible: false },
  },
  decorators: [(Story) => <Story />],
};

export const DisabledItems: Story = {
  args: {
    items: [
      {
        key: "home",
        icon: <HomeIcon />,
        text: "Home",
        selected: true,
        menuItems: defaultMenuItems,
      },
      {
        key: "disabled-item",
        icon: <CalendarIcon />,
        text: "Disabled Item",
        disabled: true,
        menuItems: defaultMenuItems,
      },
      {
        key: "nested-disabled",
        icon: <ChatBubbleIcon />,
        text: "Nested with Disabled",
        menuItems: defaultMenuItems,
        subItems: [
          {
            key: "sub-disabled",
            icon: <BellIcon />,
            text: "Disabled Sub-item",
            disabled: true,
            menuItems: defaultMenuItems,
          },
          {
            key: "sub-enabled",
            icon: <GearIcon />,
            text: "Enabled Sub-item",
            menuItems: defaultMenuItems,
          },
        ],
      },
    ],
    menuConfig: defaultMenuConfig,
  },
};

export const ItemsLoading: Story = {
  args: {
    itemsLoading: true,
  },
};

export const PrimaryVariant: Story = {
  args: {
    behaviour: "permanent",
    variant: "primary",
  },
};

export const SecondaryVariant: Story = {
  args: {
    behaviour: "permanent",
    variant: "secondary",
  },
};

export const TertiaryVariant: Story = {
  args: {
    behaviour: "permanent",
    variant: "tertiary",
  },
};
