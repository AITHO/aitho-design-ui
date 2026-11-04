import React, { memo } from "react";
import {
  DotsVerticalIcon,
  DotsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@radix-ui/react-icons";
import { MenuDropdown } from "./MenuDropdown";
import { SidebarItem, MenuConfiguration } from "../types";

interface ItemMenuButtonProps {
  item: SidebarItem;
  hasSubItems: boolean;
  menuConfig?: MenuConfiguration;
  expandedItems: Set<string>;
  handleMenuOpenChange: (open: boolean) => void;
  classes: Record<string, string>;
}

interface SubItemsIndicatorProps {
  expandedItems: Set<string>;
  itemKey: string;
  classes: Record<string, string>;
}

// Visual indicator only: the item's own button toggles the sub-items and
// exposes aria-expanded; pointer events fall through to that button.
const SubItemsIndicator = ({
  expandedItems,
  itemKey,
  classes,
}: SubItemsIndicatorProps) => (
  <span
    className={classes.itemMenuButton}
    style={{ pointerEvents: "none" }}
    aria-hidden
    data-testid="sub-items-indicator"
  >
    {expandedItems.has(itemKey) ? <ArrowUpIcon /> : <ArrowDownIcon />}
  </span>
);

interface SimpleMenuButtonProps {
  menuConfig?: MenuConfiguration;
  classes: Record<string, string>;
  onClick: (e: React.MouseEvent) => void;
}

const SimpleMenuButton = ({
  menuConfig,
  classes,
  onClick,
}: SimpleMenuButtonProps) => (
  <div className={classes.itemMenuButton}>
    <button type="button" className={classes.itemMenuButton} onClick={onClick}>
      {menuConfig?.customIcon ||
        (menuConfig?.iconDirection === "horizontal" ? (
          <DotsHorizontalIcon />
        ) : (
          <DotsVerticalIcon />
        ))}
    </button>
  </div>
);

export const ItemMenuButton = memo(
  ({
    item,
    hasSubItems,
    menuConfig,
    expandedItems,
    handleMenuOpenChange,
    classes,
  }: ItemMenuButtonProps) => {
    if (item.disabled) return null;
    if (hasSubItems) {
      return (
        <SubItemsIndicator
          expandedItems={expandedItems}
          itemKey={item.key}
          classes={classes}
        />
      );
    }

    if (!menuConfig?.visible) return null;

    const menuItems = item.menuItems || menuConfig.defaultItems || [];

    if (!menuConfig.withDropDown) {
      const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const firstItem = menuItems[0];
        if (firstItem?.type === "item") {
          firstItem.onClick?.();
        }
      };

      return (
        <SimpleMenuButton
          menuConfig={menuConfig}
          classes={classes}
          onClick={handleClick}
        />
      );
    }

    return (
      <MenuDropdown
        menuItems={menuItems}
        menuConfig={menuConfig}
        handleMenuOpenChange={handleMenuOpenChange}
        classes={classes}
      />
    );
  },
);

ItemMenuButton.displayName = "ItemMenuButton";
