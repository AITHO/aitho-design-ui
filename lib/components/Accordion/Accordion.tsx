import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { accordion, type AccordionVariantProps } from "@styled/recipes";
import * as React from "react";

interface AccordionItemProps {
  /** Value assigned of the content group. */
  value: string;

  /** Title of the content group. */
  header: React.ReactNode;

  /** Elements of the content. Each single component requires a key, except strings. */
  content: React.ReactNode[];

  /** *(optional)*
   * Disabled content group.
   * @default false
   */
  disabled?: boolean;

  /** *(optional)*
   * Accessible label for the trigger button, announced by screen readers instead of the header text.
   * Use when the header alone doesn't provide enough context (e.g. "Shipping policy, section 2 of 5").
   */
  ariaLabel?: string;

  /** *(optional)*
   * Additional description for the trigger, announced by screen readers after the label.
   */
  ariaDescription?: string;
}

export type AccordionProps = AccordionVariantProps &
  React.ComponentProps<typeof AccordionPrimitive.Root> & {
    /** Clickable elements array than displays accordion contents.
     * Pass an objects array with value, header, content and disabled.
     */
    items: AccordionItemProps[];

    /** *(optional)*
     * The width of accordion.
     * @default "15.625rem"
     */
    width?: string;

    /** *(optional)*
     * The height of trigger.
     * @default "2.813rem"
     */
    triggerHeight?: string;
  };

/**
 * A vertically stacked set of interactive headings that each reveal an associated section of content.
 *
 * @param items - Clickable elements than displays accordion contents.
 * @param width - *(optional)* The width of accordion.
 * @param triggerHeight - *(optional)* The height of trigger.
 * @param type - *(optional)* Determines whether one or multiple items can be opened at the same time. Options: 'single', 'multiple'.
 * @param collapsible - *(optional)* When type is 'single', allows closing content when clicking trigger for an open item.
 * @param size - *(optional)* The size of the tooltip component. Options: 'sm', 'md', 'lg'.
 * @param variant - *(optional)* The visual style variant. Options: 'primary', 'secondary'.
 * @param borderColor - *(optional)* The border color of the input field. Options: 'base', 'primary'.
 */

export const Accordion: React.FC<AccordionProps> = ({
  items,
  width = "15.625rem",
  triggerHeight = "2.813rem",
  borderColor,
  ...props
}) => {
  const classes = accordion({ borderColor });
  return (
    <AccordionPrimitive.Root
      className={classes.root}
      style={{
        width: width,
      }}
      {...props}
    >
      {items.map(
        ({ value, header, content, disabled, ariaLabel, ariaDescription }) => {
          const descriptionId = ariaDescription
            ? `accordion-desc-${value}`
            : undefined;
          return (
            <AccordionPrimitive.Item
              key={value}
              className={classes.item}
              value={value}
              disabled={disabled}
            >
              <AccordionPrimitive.Header className={classes.header}>
                {ariaDescription && (
                  <span id={descriptionId} style={{ display: "none" }}>
                    {ariaDescription}
                  </span>
                )}
                <AccordionPrimitive.Trigger
                  className={classes.trigger}
                  style={{
                    height: triggerHeight,
                  }}
                  aria-label={ariaLabel}
                  aria-describedby={descriptionId}
                >
                  <ChevronRightIcon className={classes.chevron} aria-hidden />
                  {header}
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              {content.map((contentItem, i) => (
                <AccordionPrimitive.Content
                  key={`${value}-content-${i}`}
                  className={classes.content}
                >
                  {contentItem}
                </AccordionPrimitive.Content>
              ))}
            </AccordionPrimitive.Item>
          );
        },
      )}
    </AccordionPrimitive.Root>
  );
};

Accordion.displayName = "Accordion";
