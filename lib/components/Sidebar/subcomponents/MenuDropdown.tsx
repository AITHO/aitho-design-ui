import { memo, useMemo, useCallback } from "react";
import { DotsVerticalIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu } from "lib/main";
import { MenuItem, MenuConfiguration } from "../types";
import { convertMenuItems } from "../utils";

interface MenuDropdownProps {
  menuItems: MenuItem[];
  menuConfig: MenuConfiguration;
  handleMenuOpenChange: (open: boolean) => void;
  classes: Record<string, string>;
}

export const MenuDropdown = memo(
  ({
    menuItems,
    menuConfig,
    handleMenuOpenChange,
    classes,
  }: MenuDropdownProps) => {
    const convertedMenuItems = useMemo(
      () => convertMenuItems(menuItems),
      [menuItems],
    );

    const getMenuIcon = useCallback(() => {
      if (menuConfig?.customIcon) {
        return menuConfig.customIcon;
      }
      return menuConfig?.iconDirection === "horizontal" ? (
        <DotsHorizontalIcon data-testid="dots-horizontal-icon" />
      ) : (
        <DotsVerticalIcon data-testid="dots-vertical-icon" />
      );
    }, [menuConfig]);

    return (
      <div className={classes.itemMenuButton}>
        <DropdownMenu
          variant="ghost"
          modal={false}
          arrow
          trigger={
            <div className={classes.itemMenuButton}>{getMenuIcon()}</div>
          }
          side={menuConfig.position?.side ?? "right"}
          align={menuConfig.position?.align ?? "start"}
          sideOffset={menuConfig.position?.offset ?? 1}
          onOpenChange={handleMenuOpenChange}
          menuContent={convertedMenuItems}
        />
      </div>
    );
  },
);

MenuDropdown.displayName = "MenuDropdown";
