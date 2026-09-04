export const storyTemplate = (name: string, pascalName: string): string => `
import { ${pascalName} } from './${pascalName}';
import type { Meta, StoryObj } from '@storybook/react';
import { argTypeSize, argTypeVariant, SIZES, VARIANT_SECONDARY } from "lib/utils/constants";

const meta = {
  title: 'Components/${pascalName}',
  component: ${pascalName},
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component's description.",
      },
    },
  },
  tags: ["autodocs"],
     argTypes: {
       variant: argTypeVariant(VARIANT_SECONDARY, "primary"),
       size: argTypeSize(SIZES, "md"),
     },
} satisfies Meta<typeof ${pascalName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default ${name}'
  }
};

export const Sizes: Story = {
  render: () => (
    <div>
      <${pascalName} size="sm">Small</${pascalName}>
      <${pascalName} size="md">Medium</${pascalName}>
      <${pascalName} size="lg">Large</${pascalName}>
    </div>
  ),
};
`;
