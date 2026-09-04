import { DropdownMenuContentProps } from "@components/DropdownMenu/types";

export type MenuItem = DropdownMenuContentProps & {
  /** *(optional)*
   * Special action identifier for the item.
   * Options: "edit" or undefined.
   * @default "edit"
   */
  action?: "edit";
};

export interface MenuConfiguration {
  /**
   * Whether the menu button should be displayed.
   * @default false
   */
  visible: boolean;

  /** *(optional)*
   * Custom icon component for the menu button.
   */
  customIcon?: React.ReactNode;

  /** *(optional)*
   * Direction of the default menu icon.
   * Options: 'vertical', 'horizontal'.
   */
  iconDirection?: "vertical" | "horizontal";

  /** *(optional)*
   * Whether to use dropdown menu or simple button.
   * @default false
   */
  withDropDown?: boolean;

  /** *(optional)*
   * Default menu items for all sidebar items.
   */
  defaultItems?: MenuItem[];

  /** *(optional)*
   * Menu position configuration.
   * Pass an object with side, align and offset.
   */
  position?: {
    /** *(optional)*
     * The side of the position.
     * Options: 'top', 'right', 'bottom', 'left'.
     * @default "right"
     */
    side?: "top" | "right" | "bottom" | "left";

    /** *(optional)*
     * The align of the position.
     * Options: 'start', 'center', 'end'.
     * @default "start"
     */
    align?: "start" | "center" | "end";

    /** *(optional)*
     * The offset of the position.
     */
    offset?: number;
  };

  /** *(optional)*
   * Z-index for the dropdown menu.
   */
  zIndex?: number;
}

export interface SidebarItem {
  /** Unique identifier for the item. */
  key: string;

  /** *(optional)*
   * Icon component to display next to the text.
   */
  icon?: React.ReactNode;

  /** *(optional)*
   * Display text for the item,
   */
  text: string;

  /** *(optional)*
   * Whether the item is currently selected.
   * @default false
   */
  selected?: boolean;

  /** *(optional)*
   * Whether the item is currently disabled.
   * @default false
   */
  disabled?: boolean;

  /** *(optional)*
   * Array of nested navigation items.
   */
  subItems?: SidebarItem[];

  /** *(optional)*
   * Callback function triggered when the item is clicked.
   */
  onClick?: () => void;

  /** *(optional)*
   * Menu items configuration for this specific item.
   */
  menuItems?: MenuItem[];

  /** *(optional)*
   * Whether the item's text can be edited.
   * @default false
   */
  editable?: boolean;

  /** *(optional)*
   * Whether the item is currently being edited.
   * @default false
   */
  isEditing?: boolean;
}
