import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  memo,
} from "react";
import { sidebar, SidebarVariantProps } from "@styled/recipes";
import { Spinner } from "lib/main";
import { findParentKeys } from "./utils";
import { SidebarItemComponent } from "./subcomponents/SidebarItemComponent";
import { MenuConfiguration, SidebarItem } from "./types";
import { debounce } from "perfect-debounce";

const MENU_CLOSE_DELAY_MS = 100;
const HOVER_DEBOUNCE_MS = 100;

export type SidebarProps = SidebarVariantProps &
  React.HTMLAttributes<HTMLElement> & {
    /** *(optional)*
     * Whether the sidebar is expanded or collapsed.
     * To be used with `behaviour='toggle'` or `behaviour='drawer'`.
     * Ignored if `behaviour="hover"` or `expandOnHover=true`.
     * @default true
     */
    open?: boolean;

    /** *(optional)*
     * Whether the sidebar should expand when hovered.
     * @default false
     */
    expandOnHover?: boolean;

    /** *(optional)*
     * Content to display at the top of the sidebar.
     */
    header?: React.ReactNode;

    /** *(optional)*
     * Content to display at the bottom of the sidebar.
     */
    footer?: React.ReactNode;

    /** *(optional)*
     * Array of navigation items to render.
     * Pass an objects array with key, icon, text, selected, disabled, subItems, onClick, menuItems, editable and isEditing.
     * @default []
     */
    items?: SidebarItem[];

    /** *(optional)*
     * Configuration object for menu behavior.
     * Pass an object with visible, customIcon, iconDirection, withDropDown, defaultItems, position, zIndex.
     */
    menuConfig?: MenuConfiguration;

    /** *(optional)*
     * Callback fired when sidebar open state changes.
     */
    onOpenChange?: (isOpen: boolean) => void;

    /** *(optional)*
     * Whether to expand parents of last selected item.
     * @default false
     */
    openLastSelected?: boolean;

    /** *(optional)*
     * Key of the last selected navigation item.
     */
    lastSelectedKey?: string;

    /** *(optional)*
     * Callback function triggered when the text of the menu item changes.
     */
    onItemTextChange?: (newText: string) => void;

    /** *(optional)*
     * Whether the navigation items are still loading.
     * @default false
     */
    itemsLoading?: boolean;
  };

/**
 * Sidebar component providing a responsive navigation interface with nested items and customizable behaviors.
 *
 * @param open - *(optional)* Whether sidebar is expanded or collapsed.
 * @param expandOnHover- *(optional)* Whether sidebar expands on mouse hover.
 * @param header - *(optional)* Content to render in sidebar header.
 * @param footer - *(optional)* Content to render in sidebar footer.
 * @param items - *(optional)* Array of navigation items to render.
 * @param menuConfig - *(optional)* Configuration object for menu behavior.
 * @param onOpenChange - *(optional)* Callback fired when sidebar open state changes.
 * @param openLastSelected - *(optional)* Whether to expand parents of last selected item.
 * @param lastSelectedKey - *(optional)* Key of the last selected navigation item.
 * @param onItemTextChange - *(optional)* Callback function triggered when the text of the menu item changes.
 * @param itemsLoading - *(optional)* Whether the navigation items are still loading.
 * @param behaviour - *(optional)* Determines if sidebar is always visible, toggleable, expands on hover or slides in as a mobile drawer with an overlay. Ignored if `expandOnHover=true`. Options: 'permanent', 'toggle', 'hover', 'drawer'.
 * @param anchor - *(optional)* Side of the screen where sidebar is anchored. Use with `position='fixed'`. Options: 'left', 'right'.
 * @param variant - *(optional)* Visual theme variant of the sidebar. Options: 'primary', 'secondary', 'tertiary'.
 * @param position - *(optional)* The position of the sidebar. Options: 'fixed', 'static'.
 * @param children - *(optional)* Custom content to render instead of navigation items.
 *
 * @example
 * <Sidebar
 *   behaviour="static"
 *   anchor="left"
 *   items={navigationItems}
 *   header={<Logo />}
 *   footer={<UserProfile />}
 * />
 */

export const Sidebar: React.FC<SidebarProps> = ({
  behaviour,
  anchor,
  open = true,
  expandOnHover = false,
  menuConfig,
  header,
  footer,
  items = [],
  onOpenChange,
  children,
  openLastSelected = false,
  lastSelectedKey,
  variant,
  onItemTextChange,
  itemsLoading = false,
  position,
  ...props
}) => {
  const asideRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [prevIsOpenValue, setPrevIsOpenValue] = useState<boolean | undefined>(
    undefined,
  );
  const [prevLastSelectedKey, setPrevLastSelectedKey] =
    useState(lastSelectedKey);
  const [hasExpandedForKey, setHasExpandedForKey] = useState(false);
  const [interactionState, setInteractionState] = useState({
    isMenuOpen: false,
    isHovered: false,
  });

  const isOpen = useMemo(() => {
    if (!expandOnHover) return open;
    return interactionState.isMenuOpen || interactionState.isHovered;
  }, [expandOnHover, open, interactionState]);

  // Update state during render when isOpen changes
  if (isOpen !== prevIsOpenValue) {
    setPrevIsOpenValue(isOpen);
    if (!isOpen) {
      setExpandedItems(new Set());
      setHasExpandedForKey(false);
    }
  }

  // Expand parent items when sidebar opens with a selected item
  if (openLastSelected && lastSelectedKey && isOpen && !hasExpandedForKey) {
    const parentKeys = findParentKeys(items, lastSelectedKey);
    setExpandedItems(new Set(parentKeys));
    setHasExpandedForKey(true);
  }

  // Reset flag when lastSelectedKey changes
  if (lastSelectedKey !== prevLastSelectedKey) {
    setPrevLastSelectedKey(lastSelectedKey);
    setHasExpandedForKey(false);
  }

  const sidebarBehaviour = useMemo(
    () => (expandOnHover ? "hover" : behaviour),
    [expandOnHover, behaviour],
  );

  // The drawer behaviour is always a fixed full-height panel.
  const sidebarPosition = useMemo(
    () => (sidebarBehaviour === "drawer" ? "fixed" : position),
    [sidebarBehaviour, position],
  );

  const classes = useMemo(
    () =>
      sidebar({
        behaviour: sidebarBehaviour,
        anchor,
        variant,
        position: sidebarPosition,
        ...props,
      }),
    [sidebarBehaviour, anchor, variant, props, sidebarPosition],
  );

  const handleHoverChange = useCallback(
    (hovering: boolean) => {
      if (!expandOnHover) return;

      setInteractionState((prev) => ({
        ...prev,
        isHovered: hovering,
      }));

      if (!interactionState.isMenuOpen) {
        onOpenChange?.(hovering);
      }
    },
    [
      expandOnHover,
      onOpenChange,
      interactionState.isMenuOpen,
      setInteractionState,
    ],
  );

  const debouncedHoverChange = useMemo(
    () => debounce(handleHoverChange, HOVER_DEBOUNCE_MS),
    [handleHoverChange],
  );

  const handleMenuOpenChange = useCallback(
    (menuOpen: boolean) => {
      setInteractionState((prev) => ({
        ...prev,
        isMenuOpen: menuOpen,
      }));
    },
    [setInteractionState],
  );

  const handleMouseEnter = useCallback(() => {
    debouncedHoverChange(true);
  }, [debouncedHoverChange]);

  const handleMouseLeave = useCallback(() => {
    if (!interactionState.isMenuOpen) {
      debouncedHoverChange(false);
    }
  }, [debouncedHoverChange, interactionState.isMenuOpen]);

  useEffect(() => {
    if (!openLastSelected || !lastSelectedKey || !isOpen) return;

    const timeoutId = setTimeout(() => {
      if (selectedItemRef.current && navRef.current) {
        selectedItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, MENU_CLOSE_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [openLastSelected, lastSelectedKey, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!expandOnHover || !isOpen) return;

      const clickedElement = event.target as Node;
      const isOutside = [asideRef, navRef, divRef].every(
        (ref) => ref.current && !ref.current.contains(clickedElement),
      );

      // This is a hack to prevent the sidebar from closing when clicking on the dropdown menu items. Ideally there should be only one dropdown menu open at a time.
      const dropDownTrick =
        document.querySelectorAll(".aitho-dropdown-menu__content").length > 0;

      if (isOutside && !dropDownTrick) {
        setInteractionState({
          isMenuOpen: false,
          isHovered: false,
        });
        onOpenChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandOnHover, isOpen, onOpenChange]);

  useEffect(() => {
    return debouncedHoverChange.cancel();
  }, [debouncedHoverChange]);

  const toggleSubItems = useCallback(
    (itemKey: string) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (next.has(itemKey)) {
          next.delete(itemKey);
        } else {
          next.add(itemKey);
        }
        return next;
      });
    },
    [setExpandedItems],
  );

  const renderBody = useMemo(() => {
    if (children) {
      return (
        <section ref={navRef} className={classes.nav}>
          {children}
        </section>
      );
    }

    if (itemsLoading) {
      return (
        <section ref={navRef} className={classes.nav}>
          <Spinner type="circularFlashingDots" size="sm" />
        </section>
      );
    }

    if (items.length > 0) {
      return (
        <nav ref={navRef} className={classes.nav}>
          {items.map((item) => (
            <SidebarItemComponent
              key={item.key}
              item={item}
              level={0}
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
        </nav>
      );
    }

    return null;
  }, [
    children,
    itemsLoading,
    items,
    isOpen,
    expandedItems,
    lastSelectedKey,
    toggleSubItems,
    classes,
    menuConfig,
    handleMenuOpenChange,
    onItemTextChange,
  ]);

  return (
    <>
      {sidebarBehaviour === "drawer" && isOpen && (
        <div
          className={classes.overlay}
          data-testid="sidebar-overlay"
          aria-hidden="true"
          onClick={() => onOpenChange?.(false)}
        />
      )}
      <aside
        {...props}
        ref={asideRef}
        className={classes.root}
        data-state={isOpen ? "open" : "closed"}
        data-direction={anchor}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={classes.container} ref={divRef}>
          {header && <header className={classes.header}>{header}</header>}
          {renderBody}
          {footer && <footer className={classes.footer}>{footer}</footer>}
        </div>
      </aside>
    </>
  );
};

Sidebar.displayName = "Sidebar";

export default memo(Sidebar);
