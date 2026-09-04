type DropdownMenuType =
  | "label"
  | "item"
  | "separator"
  | "check"
  | "radioGroup"
  | "subMenu";
interface BaseDropdownMenu {
  /** The type of the content.
   * Options: 'label', 'item', 'separator', 'check', 'radioGroup', 'subMenu'.
   */
  type: DropdownMenuType;
}

interface DropdownMenuLabel extends BaseDropdownMenu {
  type: "label";

  /** The text of the label. */
  text: string;
}

interface DropdownMenuItem extends BaseDropdownMenu {
  type: "item";

  /** The text of the item. */
  text: string;

  /** *(optional)*
   * Item element in right position.
   */
  rightSlot?: React.ReactNode;

  /** Callback when clicked option. */
  onClick: () => void;

  /** *(optional)*
   * Disable the option.
   * @default false
   */
  disable?: boolean;
}

interface DropdownMenuSeparator extends BaseDropdownMenu {
  type: "separator";
}

interface DropdownMenuCheck extends BaseDropdownMenu {
  type: "check";

  /** The text of the check. */
  text: string;

  /** Indicates the checked item. */
  isCheck: boolean;

  /** Callback when clicked option. */
  onChange: () => void;

  /** *(optional)*
   * Disable the option.
   * @default false
   */
  disable?: boolean;
}

interface DropdownMenuRadio extends BaseDropdownMenu {
  type: "radioGroup";

  /** The selected value. */
  selected: string;

  /** The list of options. */
  options: string[];

  /** Callback when clicked option. */
  onChange: (e: string) => void;

  /** *(optional)*
   * Disable the option.
   * @default false
   */
  disable?: boolean;
}

interface DropdownMenuSubMenu extends BaseDropdownMenu {
  type: "subMenu";

  /** The text of the subMenu. */
  text: string;

  /** The contents array of the subMenu. Pass an objects array with type and and related props. */
  subMenuElements: DropdownMenuContentProps[];

  /**  *(optional)*
   * Disable the option.
   * @default false
   */
  disable?: boolean;
}

export type DropdownMenuContentProps =
  | DropdownMenuLabel
  | DropdownMenuItem
  | DropdownMenuSeparator
  | DropdownMenuCheck
  | DropdownMenuRadio
  | DropdownMenuSubMenu;
