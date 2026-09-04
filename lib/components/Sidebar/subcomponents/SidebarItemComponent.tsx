import React, { memo, useState, useRef, useEffect } from "react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "lib/main";
import { SidebarItem, MenuConfiguration } from "../types";
import { ItemMenuButton } from "./ItemMenuButton";

interface SidebarItemComponentProps {
  item: SidebarItem;
  level: number;
  isOpen: boolean;
  expandedItems: Set<string>;
  lastSelectedKey?: string;
  toggleSubItems: (key: string) => void;
  classes: Record<string, string>;
  menuConfig?: MenuConfiguration;
  handleMenuOpenChange: (open: boolean) => void;
  selectedItemRef: React.RefObject<HTMLDivElement | null>;
  onItemTextChange?: (newText: string) => void;
}

export const SidebarItemComponent = memo(
  ({
    item,
    level,
    isOpen,
    expandedItems,
    lastSelectedKey,
    toggleSubItems,
    classes,
    menuConfig,
    handleMenuOpenChange,
    selectedItemRef,
    onItemTextChange,
  }: SidebarItemComponentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(item.text);
    const inputRef = useRef<HTMLInputElement>(null);
    const isSidebarOpen = isOpen ? "open" : "closed";
    const hasSubItems = Boolean(item.subItems?.length);
    const isExpanded = expandedItems.has(item.key);
    const indentation = `${level * 1.2 + 0.75}rem`;

    // Recursive function to check if item or any sub-item is selected
    const isItemSelected = (currentItem: SidebarItem): boolean => {
      const bool =
        currentItem.selected ||
        currentItem.key === lastSelectedKey ||
        currentItem.subItems?.some((subItem) => isItemSelected(subItem));
      return bool ?? false;
    };

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleEditStart = () => {
      setIsEditing(true);
      setEditedText(item.text);
    };

    const handleSaveEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      onItemTextChange?.(editedText.trim());
      setIsEditing(false);
      handleMenuOpenChange(false);
    };

    const handleCancelEdit = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(false);
      handleMenuOpenChange(false);
    };

    const handleClick = () => {
      if (!item.subItems?.length) {
        item.onClick?.();
        return;
      }
      toggleSubItems(item.key);
    };

    const menuItems = item.menuItems?.map((menuItem) =>
      menuItem.action === "edit"
        ? {
            ...menuItem,
            onClick: handleEditStart,
            disable: !item.editable,
            "data-testid": "edit-action-button",
          }
        : menuItem,
    );

    const itemIsSelected = isItemSelected(item);

    return (
      <>
        <div
          ref={itemIsSelected ? selectedItemRef : null}
          className={classes.item}
          data-selected={itemIsSelected}
          data-disabled={item.disabled}
          aria-disabled={item.disabled}
          onClick={item.disabled ? undefined : handleClick}
          onKeyDown={item.disabled ? undefined : handleClick}
          style={{
            paddingLeft: indentation,
          }}
          data-testid="sidebar-item-button"
        >
          <div className={classes.itemContainer}>
            {isEditing ? (
              <div className={classes.editContainer}>
                <input
                  ref={inputRef}
                  type="text"
                  className={classes.itemInput}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  data-state={isSidebarOpen}
                  data-testid="item-text-input"
                />
                <div className={classes.editActions}>
                  <Button
                    size="xxs"
                    icon={{ data: CheckIcon }}
                    onClick={handleSaveEdit}
                    data-testid="save-button"
                  />
                  <Button
                    size="xxs"
                    icon={{ data: Cross2Icon }}
                    onClick={handleCancelEdit}
                    variant="error"
                    data-testid="cancel-button"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={classes.itemIcon} data-testid="item-icon">
                  {item.icon}
                </div>
                <span
                  className={classes.itemText}
                  data-state={isSidebarOpen}
                  data-testid="item-text"
                >
                  {item.text}
                </span>
              </>
            )}
          </div>
          {!isEditing && (
            <ItemMenuButton
              item={{ ...item, menuItems }}
              hasSubItems={hasSubItems}
              menuConfig={menuConfig}
              expandedItems={expandedItems}
              toggleSubItems={toggleSubItems}
              handleMenuOpenChange={handleMenuOpenChange}
              classes={classes}
            />
          )}
        </div>

        {isExpanded && (
          <div
            className={classes.subItems}
            data-selected={itemIsSelected}
            data-expanded={isExpanded}
            data-testid="sub-items-container"
          >
            {item.subItems?.map((subItem) => (
              <SidebarItemComponent
                key={subItem.key}
                item={subItem}
                level={level + 1}
                isOpen={isOpen}
                expandedItems={expandedItems}
                lastSelectedKey={lastSelectedKey}
                toggleSubItems={toggleSubItems}
                classes={classes}
                menuConfig={menuConfig}
                handleMenuOpenChange={handleMenuOpenChange}
                selectedItemRef={selectedItemRef}
                onItemTextChange={onItemTextChange}
              />
            ))}
          </div>
        )}
      </>
    );
  },
);

SidebarItemComponent.displayName = "SidebarItem";
