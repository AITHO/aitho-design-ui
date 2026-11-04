import * as LabelPrimitive from "@radix-ui/react-label";
import { label, type LabelVariantProps } from "@styled/recipes";
import * as React from "react";

export type LabelProps = LabelVariantProps &
  React.ComponentProps<typeof LabelPrimitive.Root> & {
    /** *(optional)*
     * Whether the label is disabled.
     * @default false
     */
    disabled?: boolean;
    required?: boolean | "none" | "primary" | "bold" | "text" | "textBold";
  };

/**
 * Renders an accessible label associated with controls.
 *
 * @param children - The content of the label.
 * @param disabled - *(optional)* Whether the label is disabled.
 * @param size - *(optional)* The size of the label. Options: 'sm', 'md', 'lg', 'xl'.
 * @param variant - *(optional)* The color of the label. Options: 'text', 'primary'.
 * @param required - *(optional)* If the label is required. Options: 'none', 'primary', 'bold', 'text', 'textBold' or boolean.
 */

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ children, size, variant, required, ...props }, ref) => {
  const requiredVariant = required === true ? "primary" : required;

  const styles = label({
    size,
    variant,
    required: requiredVariant,
  });

  return (
    <LabelPrimitive.Root ref={ref} className={styles.root} {...props}>
      {children}
    </LabelPrimitive.Root>
  );
});

Label.displayName = "Label";
