import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { tooltip, type TooltipVariantProps } from "@styled/recipes";
import * as React from "react";

export type TooltipProps = TooltipVariantProps &
  React.ComponentProps<typeof TooltipPrimitive.Root> &
  Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
    /** The content of the tooltip. */
    textContent: string;

    /** *(optional)*
     * The distance in pixels from the trigger.
     * @default 5
     */
    sideOffset?: number;

    /** *(optional)*
     * Color of the children.
     */
    childColor?: string;

    /** *(optional)*
     * Color of the content.
     */
    contentColor?: string;

    /** *(optional)*
     * BackgroundColor of the content.
     */
    contentBackgroundColor?: string;

    /** *(optional)*
     * The preferred side of the trigger to render against when open. May change when collisions occur.
     * Options: 'top', 'left', 'right', 'bottom'.
     * @default "top"
     */
    side?: "top" | "left" | "right" | "bottom";

    /** *(optional)*
     * The preferred alignment against the trigger. May change when collisions occur.
     * Options: 'start', 'center', 'end'.
     * @default "center"
     */
    align?: "start" | "center" | "end";

    /** *(optional)*
     * Render the trigger as a different element instead of button.
     * @default "div"
     */
    triggerAs?: "button" | "div" | "span";
  };

/**
 * A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
 *
 * @param textContent - The content of the tooltip.
 * @param textAlign - *(optional)* Aligns the tooltip's text. Options: 'left', 'center', 'right'.
 * @param sideOffset - *(optional)* The distance in pixels from the trigger.
 * @param childColor - *(optional)* Color of the children.
 * @param contentColor - *(optional)* Color of the content.
 * @param contentBackgroundColor - *(optional)* BackgroundColor of the content.
 * @param side - *(optional)* The preferred side of the trigger to render against when open. May change when collisions occur.
 * @param align - *(optional)* The preferred alignment against the trigger. May change when collisions occur.
 * @param size - *(optional)* The size of the tooltip component. Options: 'sm', 'md', 'lg'.
 * @param children - *(optional)* Element on which the tooltip is displayed.
 * @param triggerAs - *(optional)* Element on which the tooltip is displayed.
 */

export const Tooltip = React.forwardRef<HTMLElement, TooltipProps>(
  (
    {
      children,
      textContent,
      sideOffset = 5,
      childColor,
      contentColor,
      contentBackgroundColor,
      side = "top",
      align = "center",
      triggerAs = "div",
      size,
      textAlign,
      open,
      defaultOpen,
      onOpenChange,
      delayDuration,
      disableHoverableContent,
      style,
      className,
      ...triggerProps
    },
    ref,
  ) => {
    const classes = tooltip({ size, textAlign });

    const TriggerElement = triggerAs;

    const triggerStyles =
      triggerAs === "button"
        ? {}
        : {
            color: childColor,
            display: "block",
            minWidth: "1rem",
            aspectRatio: "1/1",
          };
    return (
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root
          data-testid="tooltip"
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          delayDuration={delayDuration}
          disableHoverableContent={disableHoverableContent}
        >
          <TooltipPrimitive.Trigger asChild>
            <TriggerElement
              // Forward DOM props and ref so the Tooltip works as `asChild`
              // target of another Radix trigger (e.g. Popover trigger).
              {...triggerProps}
              ref={ref as React.Ref<never>}
              style={{ ...triggerStyles, ...style }}
              className={
                className ? `${classes.trigger} ${className}` : classes.trigger
              }
            >
              {children}
            </TriggerElement>
          </TooltipPrimitive.Trigger>
          {/* Portal: inside tables or scroll areas the tooltip was clipped and covered by neighbours */}
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              className={classes.content}
              style={{
                color: contentColor,
                backgroundColor: contentBackgroundColor,
              }}
              sideOffset={sideOffset}
              side={side}
              align={align}
            >
              {textContent}
              <TooltipPrimitive.Arrow
                style={{
                  fill: contentBackgroundColor,
                }}
                className={classes.arrow}
              />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  },
);

Tooltip.displayName = "Tooltip";
