import { Button } from "@components/Button/Button";
import { Tab } from "./Tab";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@components/Input/Input";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { argTypeOrientation } from "lib/utils/constants";

const meta = {
  title: "Components/Tab",
  component: Tab,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A set of tab panels that are displayed one at a time.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: argTypeOrientation(),
    tabs: {
      control: "object",
      description: "Array of tabs with label, value and content.",
      table: {
        type: { summary: "ITab[]" },
      },
    },
    listProps: {
      control: "object",
      description: "Default selected tab",
      table: {
        type: { summary: "TabsListProps" },
      },
    },
    onTabChange: {
      description:
        "A callback function triggered when the current tab changes.",
    },
    value: {
      control: "text",
      description: "Selected tab.",
    },
    defaultValue: {
      control: "text",
      description: "Default selected tab.",
    },
  },
  args: {
    defaultValue: "tab1",
    orientation: "horizontal",
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { label: "Tab 1", value: "tab1", children: "Content of Tab 1" },
      { label: "Tab 2", value: "tab2", children: "Content of Tab 2" },
      { label: "Tab 3", value: "tab3", children: "Content of Tab 3" },
    ],
  },
};

export const VerticalTabs: Story = {
  args: {
    orientation: "vertical",
    defaultValue: "tabA",
    tabs: [
      { label: "Tab A", value: "tabA", children: "Content of Tab A" },
      { label: "Tab B", value: "tabB", children: "Content of Tab B" },
      { label: "Tab C", value: "tabC", children: "Content of Tab C" },
    ],
  },
};

export const TabsWithIcons: Story = {
  args: {
    tabs: [
      {
        label: (
          <div>
            <ChevronDownIcon style={{ marginRight: "8px" }} />
            Tab 1
          </div>
        ),
        value: "tab1",
        children: "This is the content of Tab 1",
      },
      {
        label: (
          <div>
            <ChevronDownIcon style={{ marginRight: "8px" }} />
            Tab 2
          </div>
        ),
        value: "tab2",
        children: "This is the content of Tab 2",
      },
      {
        label: (
          <div>
            <ChevronDownIcon style={{ marginRight: "8px" }} />
            Tab 3
          </div>
        ),
        value: "tab3",
        children: "This is the content of Tab 3",
      },
    ],
  },
};

export const TabsWithForm: Story = {
  args: {
    tabs: [
      {
        label: "Tab 1",
        value: "tab1",
        children: (
          <div>
            <h3>Tab 1: Login Form</h3>
            <Input placeholder="Username" />
            <Input placeholder="Password" type="password" />
            <Button>Login</Button>
          </div>
        ),
      },
      {
        label: "Tab 2",
        value: "tab2",
        children: (
          <div>
            <h3>Tab 2: Sign Up Form</h3>
            <Input placeholder="Email" />
            <Input placeholder="Username" />
            <Input placeholder="Password" type="password" />
            <Button>Sign Up</Button>
          </div>
        ),
      },
      {
        label: "Tab 3",
        value: "tab3",
        children: "Content of Tab 3",
      },
    ],
  },
};

export const TabsWithImages: Story = {
  args: {
    tabs: [
      {
        label: "Tab 1",
        value: "tab1",
        children: (
          <div>
            <h3>Tab 1: Images</h3>
            <div style={{ width: 150, height: 150 }}>Image placeholder 1</div>
            <div style={{ width: 150, height: 150 }}>Image placeholder 2</div>
          </div>
        ),
      },
      {
        label: "Tab 2",
        value: "tab2",
        children: (
          <div>
            <h3>Tab 2: More Images</h3>
            <div style={{ width: 150, height: 150 }}>Image placeholder 3</div>
            <div style={{ width: 150, height: 150 }}>Image placeholder 4</div>
          </div>
        ),
      },
      {
        label: "Tab 3",
        value: "tab3",
        children: "Content of Tab 3",
      },
    ],
  },
};

export const TabsWithDisabled: Story = {
  args: {
    tabs: [
      {
        label: "Tab 1",
        value: "tab1",
        children: "Content of Tab 1",
      },
      {
        label: "Tab 2 (Disabled)",
        value: "tab2",
        children: "Content of Tab 2",
        disabled: true,
      },
      {
        label: "Tab 3",
        value: "tab3",
        children: "Content of Tab 3",
      },
    ],
  },
};

export const TabsWithHidden: Story = {
  args: {
    tabs: [
      {
        label: "Tab 1",
        value: "tab1",
        children: "This is the content of Tab 1",
      },
      {
        label: "Tab 2 (Hidden)",
        value: "tab2",
        children: "This is the content of Tab 2",
        hidden: true,
      },
      {
        label: "Tab 3",
        value: "tab3",
        children: "This is the content of Tab 3",
      },
    ],
  },
};

export const CustomListStyle: Story = {
  args: {
    tabs: [
      {
        label: "Styled Tab 1",
        value: "tab1",
        children: "This is the first tab",
      },
      {
        label: "Styled Tab 2",
        value: "tab2",
        children: "This is the second tab",
      },
    ],
    listProps: {
      style: {
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "red",
      },
    },
  },
};

export const CustomTriggerStyles: Story = {
  args: {
    tabs: [
      {
        label: "Default Tab 1",
        value: "tab1",
        children: "Content of Tab 1",
      },
      {
        label: "Custom Trigger Tab 2",
        value: "tab2",
        children: "Content of Tab 2",
        triggerProps: {
          style: {
            color: "white",
            backgroundColor: "blue",
            borderRadius: "5px",
          },
          value: "tab2",
        },
      },
      {
        label: "Custom Trigger Tab 3",
        value: "tab3",
        children: "Content of Tab 3",
        triggerProps: {
          style: { color: "green", fontWeight: "bold" },
          value: "tab3",
        },
      },
    ],
  },
};

export const CustomContentStyles: Story = {
  args: {
    tabs: [
      {
        label: "Tab 1",
        value: "tab1",
        children: "Default content for Tab 1",
      },
      {
        label: "Tab 2",
        value: "tab2",
        children: "Custom styled content for Tab 2",
        contentProps: {
          style: {
            padding: "20px",
            backgroundColor: "lightblue",
            borderRadius: "8px",
          },
          value: "tab2",
        },
      },
      {
        label: "Tab 3",
        value: "tab3",
        children: "Custom styled content for Tab 3",
        contentProps: {
          style: {
            padding: "20px",
            backgroundColor: "lightgreen",
            border: "1px solid gray",
          },
          value: "tab3",
        },
      },
    ],
  },
};
