import React, { useState, useRef, useEffect } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { select, type SelectVariantProps } from "@styled/recipes";
import { Input } from "lib/main";

type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item> & {
  /** *(optional)*
   * The icon of the option.
   */
  icon?: React.ReactNode;
};

export type SelectProps = SelectVariantProps &
  React.ComponentProps<typeof SelectPrimitive.Root> &
  SelectPrimitive.SelectValueProps & {
    /** List options.
     * Pass an objects array with value, textValue and icon.
     */
    items: SelectItemProps[];

    /** *(optional)*
     * The number of options to show.
     */
    optionsShows?: number;

    /** *(optional)*
     * If true, you can filter the available options.
     */
    searchable?: boolean;

    /** *(optional)*
     * The search bar placeholder.
     */
    searchablePlaceholder?: string;
  };

/**
 * Displays a list of options for the user to pick from triggered by a button.
 *
 * @param items - List options.
 * @param optionsShows - *(optional)* The number of options to show.
 * @param searchable - *(optional)* If true, you can filter the available options.
 * @param searchablePlaceholder - *(optional)* The search bar placeholder.
 * @param placeholder - *(optional)* The placeholder of the select, if not provided the trigger is empty.
 * @param size - *(optional)* The size of the select. Options: 'xs', 'sm', 'md', 'lg', 'xl'.
 * @param variant - *(optional)* The variant of the select: primary. Options: 'primary'.
 * @param disabled - *(optional)* If true, the select is disabled.
 * @param borderColor - *(optional)* The border color of the select. Options: 'base', 'primary', 'error'.
 */

export const Select: React.FC<SelectProps> = ({
  borderColor,
  size,
  variant,
  items,
  placeholder,
  value,
  optionsShows,
  searchable = false,
  searchablePlaceholder,
  ...props
}) => {
  const classes = select({ borderColor, size, variant });
  const selectedItem = items.find((item) => item.value === value);

  const maxHeight = optionsShows ? `${optionsShows * 2.188}rem` : "43.75rem";

  const [searchOption, setSearchOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      // Small delay to ensure DOM is ready after portal renders
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, searchable]);

  const filteredItems = [
    ...items.filter((item) => item.value === value),
    ...items.filter(
      (item) =>
        item.value !== value &&
        (item.textValue ?? item.value)
          .toLowerCase()
          .includes(searchOption.toLowerCase()),
    ),
  ];

  return (
    <SelectPrimitive.Root
      value={value}
      {...props}
      onOpenChange={(open) => {
        setIsOpen(open);
        // Clear search when dropdown closes
        if (!open && searchable) {
          setSearchOption("");
        }
        props.onOpenChange?.(open);
      }}
    >
      <SelectPrimitive.Trigger className={`select-trigger ${classes.trigger}`}>
        <div className="select-trigger-content">
          {selectedItem?.icon && (
            <span className="select-trigger-icon">{selectedItem.icon}</span>
          )}
          <SelectPrimitive.Value
            placeholder={placeholder}
            className={`${classes.value} select-value`}
          />
        </div>
        <SelectPrimitive.Icon className={`${classes.icon} select-icon`}>
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          className={`${classes.content} select-content`}
          align="center"
          alignOffset={0}
          {...(searchable
            ? {
                onOpenAutoFocus: (e: Event) => {
                  e.preventDefault();
                },
              }
            : {})}
        >
          <SelectPrimitive.Viewport
            className={`${classes.viewport} select-viewport`}
            style={{
              maxHeight,
              overflowY: "auto",
            }}
          >
            {searchable && (
              <div className={classes.input}>
                <Input
                  ref={searchInputRef}
                  inputSearch
                  placeholder={searchablePlaceholder}
                  type="search"
                  value={searchOption}
                  onChange={(e) => setSearchOption(e.target.value)}
                  borderColor={borderColor}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            )}

            <SelectPrimitive.Group>
              {filteredItems?.map((item: SelectItemProps) => {
                return (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    icon={item.icon}
                    shouldHide={
                      item.value === value && searchOption.trim().length > 0
                    }
                    _selectSize={size}
                    _selectVariant={variant}
                    _selectBorderColor={borderColor}
                  >
                    {item.textValue ?? item.value}
                  </SelectItem>
                );
              })}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    icon?: React.ReactNode;
    value: string;
    shouldHide?: boolean;
    _selectSize?: SelectVariantProps["size"];
    _selectVariant?: SelectVariantProps["variant"];
    _selectBorderColor?: SelectVariantProps["borderColor"];
  }
>(
  (
    {
      children,
      value,
      shouldHide = false,
      _selectSize,
      _selectVariant,
      _selectBorderColor,
      ...props
    },
    ref,
  ) => {
    const classes = select({
      size: _selectSize,
      variant: _selectVariant,
      borderColor: _selectBorderColor,
    });

    return (
      <SelectPrimitive.Item
        ref={ref}
        {...props}
        value={value}
        className={`${classes.item} select-item`}
        style={shouldHide ? { display: "none" } : undefined}
      >
        <div className="select-item-content">
          {props.icon && <span className="select-item-icon">{props.icon}</span>}
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </div>
      </SelectPrimitive.Item>
    );
  },
);

SelectItem.displayName = "SelectItem";
Select.displayName = "Select";
