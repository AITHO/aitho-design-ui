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
  toggleSubItems: (key: string) => void;
  handleMenuOpenChange: (open: boolean) => void;
  classes: Record<string, string>;
}

interface SubItemsButtonProps {
  expandedItems: Set<string>;
  itemKey: string;
  toggleSubItems: (key: string) => void;
  classes: Record<string, string>;
}

const SubItemsButton = ({
  expandedItems,
  itemKey,
  toggleSubItems,
  classes,
}: SubItemsButtonProps) => (
  <div className={classes.itemMenuButton}>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleSubItems(itemKey);
      }}
    >
      {expandedItems.has(itemKey) ? <ArrowUpIcon /> : <ArrowDownIcon />}
    </button>
  </div>
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
    toggleSubItems,
    handleMenuOpenChange,
    classes,
  }: ItemMenuButtonProps) => {
    if (item.disabled) return null;
    if (hasSubItems) {
      return (
        <SubItemsButton
          expandedItems={expandedItems}
          itemKey={item.key}
          toggleSubItems={toggleSubItems}
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
