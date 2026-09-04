import { Cross1Icon } from "@radix-ui/react-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { popover, type PopoverVariantProps } from "@styled/recipes";
import * as React from "react";

export type PopoverProps = PopoverVariantProps &
  React.ComponentProps<typeof PopoverPrimitive.Root> & {
    /** The element that triggers the popover. */
    trigger: React.ReactNode;

    /** *(optional)*
     * The alignment of the popover.
     * Options: 'start', 'center', 'end'.
     * @default "center"
     */
    align?: "start" | "center" | "end";

    /** *(optional)*
     * The side of the popover relative to the trigger.
     * Options: 'top', 'left', 'right', 'bottom'.
     * @default "top"
     */
    side?: "top" | "left" | "right" | "bottom";

    /** *(optional)*
     * The offset of the popover from the side of the trigger.
     * @default 4
     */
    sideOffset?: number;

    /**
     * Whether to hide the content when the trigger becomes fully occluded.
     * @default true
     */
    hideWhenDetached?: boolean;

    /**
     * An optional arrow element to render alongside the popover. This can be used to help visually link the anchor with the content.
     * @default true
     */
    arrow?: boolean;
  };

/**
 * Displays rich content in a portal, triggered by a button.
 *
 * @param trigger - The element that triggers the popover.
 * @param align - *(optional)* The alignment of the popover.
 * @param side - *(optional)* The side of the popover relative to the trigger.
 * @param sideOffset - *(optional)* The offset of the popover from the side of the trigger.
 * @param hideWhenDetached - *(optional)* Whether to hide the content when the trigger becomes fully occluded.
 * @param arrow - *(optional)* An optional arrow element to render alongside the popover. This can be used to help visually link the anchor with the content.
 * @param children - The content displayed inside the popover.
 * @param open - Controls the open state of the popover (controlled component).
 * @param defaultOpen - Initial open state of the popover (uncontrolled component).
 * @param modal - The modality of the popover. When set to true, interaction with outside elements will be disabled and only popover content will be visible to screen readers.
 * @param onOpenChange - Callback fired when open state changes (controlled component).
 * @param variant - *(optional)* The variant of the popover. Options: 'primary', 'secondary'.
 * @param size - *(optional)* The size of the popover. Options: 'sm', 'md', 'lg', 'xl'.
 * @param borderRadius - *(optional)* Border radius of the content. Options: 'sm', 'md', 'lg', 'xl'.
 */

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  align = "center",
  open,
  defaultOpen,
  modal,
  onOpenChange,
  side = "top",
  sideOffset = 4,
  hideWhenDetached = true,
  arrow = true,
  variant,
  size,
  borderRadius,
}) => {
  const classes = popover({ variant, size, borderRadius });

  return (
    <PopoverPrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        hideWhenDetached={hideWhenDetached}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={`popover-content ${classes.content}`}
      >
        {children}
        <PopoverPrimitive.Close
          aria-label="Close"
          className={`popover-close ${classes.close}`}
        >
          <Cross1Icon />
        </PopoverPrimitive.Close>
        {arrow && (
          <PopoverPrimitive.Arrow
            className={`popover-arrow ${classes.arrow}`}
          />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
};

Popover.displayName = "Popover";
