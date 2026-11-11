# Contributing

This guide explains how to create and modify components in the Aitho Design UI library.

## Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AITHO/aitho-design-ui.git
   cd aitho-design-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Creating a New Component

You have two options for creating components: using the automated generator or creating components manually.

### Option 1: Using the Component Generator (Recommended)

Run the component generator:

```bash
npm run component:new
```

You'll be prompted for:

1. Whether to use Radix UI primitives (recommended for complex interactive components)
   - If yes, you'll see a list of available Radix components to choose from
   - If no, you'll proceed to naming your component
2. Component name (will be automatically converted to PascalCase)

The generator will automatically:

1. Create all necessary component files
2. Update configuration files
3. Install Radix UI dependencies (if selected)
4. Generate PandaCSS styles

### Option 2: Manual Component Creation

Follow these steps to create components manually:

1. **Create Component Directory Structure**

   ```
   lib/components/YourComponent/
   ├── YourComponent.tsx         # Main component file
   ├── YourComponent.recipe.ts   # PandaCSS styling recipe
   └── YourComponent.stories.tsx # Storybook documentation
   └── YourComponent.test.tsx    # Test file
   ```

2. **Implement Required Files with these templates**

   a. `YourComponent.tsx`:

   ```typescript
   import * as React from "react";
   import { yourComponent, type YourComponentVariantProps } from "@styled/recipes";

   export type YourComponentProps = YourComponentVariantProps &
   React.ComponentProps<'div'> & {
     /** Optional description of children prop */
     children?: React.ReactNode;
   };

   export const YourComponent: React.FC<YourComponentProps> = ({
     children,
     ...props
   }) => {
     const classes = yourComponent(props);

     return (
       <div className={classes.root} {...props}>
         {children}
       </div>
     );
   };

   YourComponent.displayName = 'YourComponent';
   ```

   For Radix UI components, use this template instead:

   ```typescript
   import * as React from "react";
   import * as ComponentPrimitive from "@radix-ui/react-component";
   import { yourComponent, type YourComponentVariantProps } from "@styled/recipes";

   export type YourComponentProps = YourComponentVariantProps &
   React.ComponentProps<typeof ComponentPrimitive.Root> & {
     children?: React.ReactNode;
   };

   export const YourComponent: React.FC<YourComponentProps> = ({
     children,
     ...props
   }) => {
     const classes = yourComponent(props);

     return (
       <ComponentPrimitive.Root className={classes.root} {...props}>
         {children}
       </ComponentPrimitive.Root>
     );
   };

   YourComponent.displayName = 'YourComponent';
   ```

   b. `YourComponent.recipe.ts`:

   ```typescript
   import { defineSlotRecipe } from "@pandacss/dev";

   const SIZES = ["sm", "md", "lg"] as const;
   const VARIANTS = ["primary", "secondary"] as const;

   export type SizeVariant = (typeof SIZES)[number];
   export type VariantType = (typeof VARIANTS)[number];

   const SIZE_MAPS = {
     sm: { padding: "2", fontSize: "sm" },
     md: { padding: "3", fontSize: "base" },
     lg: { padding: "4", fontSize: "lg" },
   } as const;

   const VARIANT_MAPS = {
     primary: {
       bg: "blue.500",
       color: "white",
     },
     secondary: {
       bg: "gray.100",
       color: "gray.900",
     },
   } as const;

   export const yourComponentRecipe = defineSlotRecipe({
     className: "your-component",
     slots: ["root"],
     base: {
       root: {
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         borderRadius: "md",
         transition: "colors",
       },
     },
     variants: {
       size: Object.fromEntries(
         SIZES.map((size) => [
           size,
           {
             root: SIZE_MAPS[size],
           },
         ]),
       ),
       variant: Object.fromEntries(
         VARIANTS.map((variant) => [
           variant,
           {
             root: VARIANT_MAPS[variant],
           },
         ]),
       ),
     },
     defaultVariants: {
       size: "md",
       variant: "primary",
     },
   });
   ```

   c. `YourComponent.stories.tsx`:

   ```typescript
   import type { Meta, StoryObj } from "@storybook/react";
   import { YourComponent } from "./YourComponent";
   import {
     argTypeSize,
     argTypeVariant,
     SIZES,
     VARIANT_SECONDARY,
   } from "lib/utils/constants";

   const meta = {
     title: "Components/YourComponent",
     component: YourComponent,
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
       size: argTypeSize(SIZES, "sm"),
     },
   } satisfies Meta<typeof YourComponent>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     args: {
       children: "Default Component",
     },
   };
   ```

   d. `YourComponent.test.tsx`

   ```typescript
   import { describe, it, expect } from 'vitest';
   import { render } from '@testing-library/react';
   import { YourComponent } from './YourComponent';

   describe('YourComponent', () => {
     it('renders without crashing', () => {
       const { container } = render(<YourComponent>Test</YourComponent>);
       expect(container.firstChild).toBeTruthy();
     });

     it('renders children correctly', () => {
       const testText = 'Test Content';
       const { container } = render(<YourComponent>{testText}</YourComponent>);
       expect(container.textContent).toBe(testText);
     });
   });
   ```

3. **Update Configuration Files**

   a. Add to `lib/preset.ts`:

   ```typescript
   import { yourComponentRecipe } from "./components/YourComponent/YourComponent.recipe";

   export const preset = definePreset({
     theme: {
       slotRecipes: {
         yourComponent: yourComponentRecipe,
         // ... other recipes
       },
     },
     staticCss: {
       recipes: {
         yourComponent: ["*"],
         // ... other recipes
       },
     },
   });
   ```

   b. Add to `lib/main.ts`:

   ```typescript
   export {
     YourComponent,
     type YourComponentProps,
   } from "./components/YourComponent/YourComponent";
   ```

4. **Generate Styles**

   ```bash
   npm run codegen
   ```

5. **If Using Radix UI**

   Install the required Radix UI primitive:

   ```bash
   npm install @radix-ui/react-[component-name]
   ```

## Testing & Quality Assurance

1. **Before Committing**

   ```bash
   # Format code
   npm run format:fix

   # Test code
    npm run test:ui

   # Build to verify
   npm run build
   ```

2. **Visual Testing**
   ```bash
   npm run storybook
   # or
   npm run dev
   ```

## Pull Request Process

1. **Create a feature branch from the default branch**

   ```bash
   git switch -c feat/your-feature-name
   ```

2. **Submit PR**
   - Clear description of changes
   - Breaking change notes

3. **PR Checklist**
   - [ ] Stories are comprehensive
   - [ ] Types are properly defined
   - [ ] Code is formatted
   - [ ] Tests are passing
   - [ ] Build passes

## Commit Messages

Commits are validated by [commitlint](https://commitlint.js.org/) against the
[Conventional Commits](https://www.conventionalcommits.org/) specification, and
a Husky hook runs Prettier on staged files. Use the usual prefixes (`feat:`,
`fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `build:`, `ci:`) and mark
breaking changes with a `!` or a `BREAKING CHANGE:` footer.

## Licensing of Contributions

This project is released under the [Apache License 2.0](LICENSE). By
submitting a pull request, you confirm that you have the right to contribute
the code and agree that your contribution is distributed under those terms,
unless a separate written agreement applies. Please do not add code taken from
other projects unless its license is compatible, and identify it in the pull
request.

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
Security problems must be reported privately: see [SECURITY.md](SECURITY.md),
not a public issue.
