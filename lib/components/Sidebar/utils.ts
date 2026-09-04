import { MenuItem, SidebarItem } from "./types";
import { DropdownMenuContentProps } from "@components/DropdownMenu/types";

export const findParentKeys = (
  items: SidebarItem[],
  targetKey: string,
  path: string[] = [],
): string[] => {
  for (const item of items) {
    if (item.key === targetKey) {
      return path;
    }
    if (item.subItems) {
      const result = findParentKeys(item.subItems, targetKey, [
        ...path,
        item.key,
      ]);
      if (result.length > 0) {
        return result;
      }
    }
  }
  return [];
};

export const convertMenuItems = (
  items: MenuItem[],
): DropdownMenuContentProps[] => {
  return items.map((item) => {
    switch (item.type) {
      case "label":
        return { type: item.type, text: item.text ?? "" };
      case "item":
        return {
          type: item.type,
          text: item.text ?? "",
          onClick: item.onClick,
          rightSlot: item.rightSlot,
          disable: item.disable ?? false,
        };
      case "separator":
        return { type: item.type };
      case "check":
        return {
          type: item.type,
          text: item.text ?? "",
          isCheck: item.isCheck || false,
          onChange: () => item.onChange?.(),
          disable: item.disable ?? false,
        };
      case "radioGroup":
        return {
          type: item.type,
          selected: item.selected ?? "",
          options: item.options || [],
          onChange: (value: string) => item.onChange?.(value),
          disable: item.disable ?? false,
        };
      case "subMenu":
        return {
          type: item.type,
          text: item.text ?? "",
          subMenuElements: item.subMenuElements
            ? convertMenuItems(item.subMenuElements)
            : [],
          disable: item.disable ?? false,
        };
      default: {
        return {
          type: "item",
          text: "Edit",
          onClick: () => console.log("Edit clicked"),
        };
      }
    }
  });
};
