import { Meta, StoryObj } from "@storybook/react-vite";
import { RangeDatePicker, RangeDatePickerProps } from "./RangeDatePicker";
import {
  argTypeDisabled,
  argTypeSize,
  argTypeType,
  LANGUAGES,
  BASE_SIZES,
  TYPES,
} from "lib/utils/constants";

const meta = {
  title: "Components/RangeDatePicker",
  component: RangeDatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "RangeDatePicker component providing a dual-calendar interface for selecting date ranges with features like localization, min/max dates and disabled dates.",
      },
    },
  },
  argTypes: {
    type: argTypeType(TYPES),
    size: argTypeSize(BASE_SIZES, "md"),
    lang: {
      control: "select",
      options: LANGUAGES,
      description: "Language code for localization.",
      table: {
        defaultValue: { summary: "en" },
        type: { summary: "it | en" },
      },
    },
    disabled: argTypeDisabled(),
    minDate: {
      control: "date",
      description: "Minimum selectable date.",
      table: {
        type: { summary: "Date" },
      },
    },
    maxDate: {
      control: "date",
      description: "Maximum selectable date.",
      table: {
        type: { summary: "Date" },
      },
    },
    disabledDates: {
      control: "object",
      description: "Array of dates to be disabled.",
      table: {
        defaultValue: { summary: "[]" },
        type: { summary: "Date[]" },
      },
    },
    onChange: {
      description: "Callback function to handle date range changes.",
    },
  },
  args: {
    type: "outline",
    size: "md",
    lang: "en",
    disabled: false,
    disabledDates: [],
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RangeDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const StoryWrapper = (args: RangeDatePickerProps) => {
  const theme = document.documentElement.getAttribute("data-panda-theme");

  const handleDescription = (args: RangeDatePickerProps) => {
    if (args.disabled) {
      return "Disabled date picker";
    }

    if (args.minDate || args.maxDate) {
      return "Date picker with date constraints";
    }

    if (args.disabledDates?.length) {
      return "Date picker with specific disabled dates";
    }

    if (args.lang === "it") {
      return "Date picker with Italian localization";
    }

    const typeDescriptions = {
      outline: "Default outlined date picker",
      filled: "Filled style date picker",
      ghost: "Ghost style date picker",
    };

    if (args.type) {
      return typeDescriptions[args.type as keyof typeof typeDescriptions];
    }

    const sizeDescriptions = {
      sm: "Small size date picker",
      md: "Medium size date picker",
      lg: "Large size date picker",
    };

    if (args.size) {
      return sizeDescriptions[args.size as keyof typeof sizeDescriptions];
    }

    return "Standard date range picker";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        padding: "24px",
        margin: theme === "dark" ? "-1rem" : "",
        width: "100vw",
        height: "50vh",
      }}
    >
      <p
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          color: "var(--text-primary)",
          marginBottom: "24px",
        }}
      >
        {handleDescription(args)}
      </p>
      <RangeDatePicker {...args} />
    </div>
  );
};

export const Default: Story = {
  render: StoryWrapper,
};

export const Types: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {TYPES.map((arg) => (
        <StoryWrapper {...args} key={arg} type={arg} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <StoryWrapper {...args} key={arg} size={arg} />
      ))}
    </div>
  ),
};

export const Languages: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {LANGUAGES.map((arg) => (
        <StoryWrapper {...args} key={arg} lang={arg} />
      ))}
    </div>
  ),
};

export const WithDateConstraints: Story = {
  render: (args) => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const disabledDates = [
      new Date(today.getTime() + 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 48 * 60 * 60 * 1000),
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <StoryWrapper {...args} minDate={today} maxDate={nextMonth} />
        <StoryWrapper {...args} disabledDates={disabledDates} />
      </div>
    );
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
  render: StoryWrapper,
};

export const WithCallbacks: Story = {
  args: {
    onChange: (dates) => console.log("Date selection changed:", dates),
  },
  render: StoryWrapper,
};
