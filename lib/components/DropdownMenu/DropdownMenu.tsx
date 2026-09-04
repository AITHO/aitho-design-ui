import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import { dropdownMenu, type DropdownMenuVariantProps } from "@styled/recipes";
import { nanoid } from "nanoid";
import * as React from "react";
import { DropdownMenuContentProps } from "./types";

const renderMenuContent = (
  classes: ReturnType<typeof dropdownMenu>,
  items: DropdownMenuContentProps[],
): React.ReactNode =>
  items.map((item) => {
    switch (item.type) {
      case "label":
        return (
          <DropdownMenuPrimitive.Label
            data-testid="label"
            key={nanoid()}
            className={classes.label}
          >
            {item.text}
          </DropdownMenuPrimitive.Label>
        );
      case "item":
        return (
          <DropdownMenuPrimitive.Item
            data-testid="item"
            key={nanoid()}
            className={classes.item}
            disabled={item.disable}
            onClick={!item.disable ? item.onClick : undefined}
          >
            {item.text}
            {item.rightSlot && (
              <div className={classes.rightSlot}>{item.rightSlot}</div>
            )}
          </DropdownMenuPrimitive.Item>
        );
      case "separator":
        return (
          <DropdownMenuPrimitive.Separator
            data-testid="separator"
            key={nanoid()}
            className={classes.separator}
          />
        );
      case "check":
        return (
          <DropdownMenuPrimitive.CheckboxItem
            data-testid="check"
            key={nanoid()}
            className={classes.item}
            checked={item.isCheck}
            disabled={item.disable}
            onCheckedChange={item.onChange}
          >
            {item.text}
            <DropdownMenuPrimitive.ItemIndicator className={classes.rightSlot}>
              <CheckIcon />
            </DropdownMenuPrimitive.ItemIndicator>
          </DropdownMenuPrimitive.CheckboxItem>
        );
      case "radioGroup":
        return (
          <DropdownMenuPrimitive.RadioGroup
            data-testid="radioGroup"
            key={nanoid()}
            className={classes.radioGroup}
            value={item.selected}
            onValueChange={item.onChange}
          >
            {item.options.map((option) => (
              <DropdownMenuPrimitive.RadioItem
                key={nanoid()}
                className={classes.item}
                value={option}
                disabled={item.disable}
              >
                {option}
                <DropdownMenuPrimitive.ItemIndicator
                  className={classes.rightSlot}
                >
                  <DotFilledIcon />
                </DropdownMenuPrimitive.ItemIndicator>
              </DropdownMenuPrimitive.RadioItem>
            ))}
          </DropdownMenuPrimitive.RadioGroup>
        );
      case "subMenu":
        return (
          <DropdownMenuPrimitive.Sub data-testid="subMenu" key={nanoid()}>
            <DropdownMenuPrimitive.SubTrigger
              disabled={item.disable}
              className={classes.item}
            >
              {item.text}
              <div className={classes.rightSlot}>
                <ChevronRightIcon />
              </div>
            </DropdownMenuPrimitive.SubTrigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.SubContent className={classes.content}>
                {renderMenuContent(classes, item.subMenuElements)}
              </DropdownMenuPrimitive.SubContent>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Sub>
        );
    }
  });

export type DropdownMenuProps = DropdownMenuVariantProps &
  React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
    /** Clickable element than displays dropdownMenu. */
    trigger: React.ReactNode;

    /** The contents array of the dropdownMenu.
     * Pass an objects array with type and related props.
     */
    menuContent: DropdownMenuContentProps[];

    /** *(optional)*
     * The arrow of the dropdownMenu.
     * @default false
     */
    arrow?: boolean;

    /** *(optional)*
     * The distance in pixels from the trigger.
     * @default -10
     */
    sideOffset?: number;

    /** *(optional)*
     * The preferred side of the trigger to render against when open. May change when collisions occur.
     * Options: 'top', 'left', 'right', 'bottom'.
     * @default "top"
     */
    side?: "top" | "left" | "right" | "bottom";

    /** *(optional)*
     * The preferred alignment against the trigger. May change when collisions occur.
     * Options: 'start', 'center', 'end'.
     * @default "start"
     */
    align?: "start" | "center" | "end";

    /** *(optional)*
     * The container element that the dialog should be rendered into.
     * If provided, the dialog will be rendered into the specified container element.
     */
    container?: HTMLElement | null;

    /** *(optional)*
     * The z-index of the dropdownMenu.
     * @default 200
     */
    zIndex?: number;
  };

/**
 * Displays a menu to the user with a set of actions or functions-triggered by a button.
 *
 * @param trigger - Clickable element than displays dropdownMenu.
 * @param menuContent - The contents array of the dropdownMenu.
 * @param arrow - *(optional)* The arrow of the dropdownMenu.
 * @param sideOffset - *(optional)* The distance in pixels from the trigger.
 * @param side - *(optional)* The preferred side of the trigger to render against when open.
 * @param align - *(optional)* The preferred alignment against the trigger. May change when collisions occur.
 * @param container - *(optional)* The container element that the dialog should be rendered into.
 * @param size - *(optional)* The size of the tooltip component. Options: 'sm', 'md', 'lg'.
 * @param variant - *(optional)* The visual style variant. Options: 'primary', 'ghost'.
 * @param zIndex - *(optional)* The z-index of the dropdownMenu.
 */

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  menuContent,
  arrow = false,
  sideOffset = -10,
  side = "top",
  align = "start",
  zIndex = 200,
  container,
  variant,
  size,
  ...props
}) => {
  const classes = dropdownMenu({ variant, size });

  const computedContainer = React.useMemo(() => {
    if (container) return container;
    return document.querySelector("#root") ?? document.body;
  }, [container]);

  return (
    <DropdownMenuPrimitive.Root {...props}>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal container={computedContainer}>
        <DropdownMenuPrimitive.Content
          style={{ zIndex }}
          sideOffset={sideOffset}
          side={side}
          align={align}
          className={classes.content}
        >
          {renderMenuContent(classes, menuContent)}
          {arrow && <DropdownMenuPrimitive.Arrow className={classes.arrow} />}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
