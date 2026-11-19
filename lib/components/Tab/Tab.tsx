import * as React from "react";
import {
  Root,
  List,
  Content,
  Trigger,
  TabsContentProps,
  TabsTriggerProps,
  TabsListProps,
  TabsProps,
} from "@radix-ui/react-tabs";
import { tab } from "@styled/recipes";

export interface ITab {
  /** The value of the tab */
  value: string;

  /** The title of the tab */
  label: React.ReactNode;

  /** The content of the tab */
  children: React.ReactNode;

  /** *(optional)*
   * Whether the tab is disabled.
   */
  disabled?: boolean;

  /** *(optional)*
   * Whether the tab as icon.
   */
  icon?: React.ReactNode;

  /** *(optional)*
   * Whether the tab is hidden.
   */
  hidden?: boolean;

  /** *(optional)*
   * Trigger props for customize tabs.
   */
  triggerProps?: TabsTriggerProps;

  /** *(optional)*
   * Content props for customize tabs.
   */
  contentProps?: TabsContentProps;
}

export type TabProps = TabsProps & {
  /** Array of tabs with label, value and content. */
  tabs: ITab[];

  /** *(optional)*
   * List props for customize tabs.
   */
  listProps?: TabsListProps;

  /** *(optional)*
   * A callback function triggered when the current tab changes.
   */
  onTabChange?: (value: string) => void;

  /** *(optional)*
   * Selected tab.
   */
  value?: string;

  /** *(optional)*
   * Let the tabs go onto more rows when they do not fit, instead of pushing the page sideways.
   * @default false
   */
  wrap?: boolean;
} & React.ComponentProps<typeof Root>;

/**
 * A set of tab panels that are displayed one at a time.
 *
 * @param tabs - Array of tabs with label, value and content.
 * @param listProps - *(optional)* List props for customize tabs.
 * @param onTabChange - *(optional)* A callback function triggered when the current tab changes.
 * @param value - *(optional)* Selected tab.
 * @param defaultValue - *(optional)* Default selected tab.
 * @param orientation - *(optional)* Orientation of the tab list. Options: 'horizontal, 'vertical'.
 * @param wrap - *(optional)* Let the tabs go onto more rows when they do not fit.
 */

/**
 * Keeps the list's underline under the selected tab. The first position is taken without sliding
 * (a page that opens has no previous tab); after that every change of selection, size or tabs moves
 * it. Positions come from the offsets inside the list, so a list that wraps onto two rows still puts
 * it under the right tab.
 */
const useTabIndicator = (
  listRef: React.RefObject<HTMLDivElement | null>,
  indicatorRef: React.RefObject<HTMLSpanElement | null>,
  vertical: boolean,
) => {
  React.useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const place = () => {
      const active = list.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]',
      );
      indicator.style.opacity = active ? "1" : "0";
      if (!active) return;
      // The recipe draws the 2px thickness. The other axis is cleared before measuring, so a
      // switch of orientation neither leaves the old length behind nor offsets by it.
      if (vertical) {
        indicator.style.width = "";
        indicator.style.height = `${active.offsetHeight}px`;
        const x =
          active.offsetLeft + active.offsetWidth - indicator.offsetWidth;
        indicator.style.transform = `translate(${x}px, ${active.offsetTop}px)`;
      } else {
        indicator.style.height = "";
        indicator.style.width = `${active.offsetWidth}px`;
        const y =
          active.offsetTop + active.offsetHeight - indicator.offsetHeight;
        indicator.style.transform = `translate(${active.offsetLeft}px, ${y}px)`;
      }
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(place);
    const observeTabs = () => {
      resizeObserver?.observe(list);
      for (const trigger of list.querySelectorAll('[role="tab"]')) {
        resizeObserver?.observe(trigger);
      }
    };
    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? undefined
        : new MutationObserver(() => {
            observeTabs();
            place();
          });

    place();
    observeTabs();
    mutationObserver?.observe(list, {
      attributes: true,
      attributeFilter: ["aria-selected"],
      childList: true,
      subtree: true,
    });
    const frame = requestAnimationFrame(() => {
      indicator.dataset.ready = "";
    });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [listRef, indicatorRef, vertical]);
};

export const Tab: React.FC<TabProps> = ({
  tabs,
  listProps,
  onTabChange,
  value,
  orientation,
  wrap,
  ...props
}) => {
  const classes = tab({ orientation, wrap });
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  useTabIndicator(listRef, indicatorRef, orientation === "vertical");

  return (
    <Root
      className={classes.root}
      value={value}
      onValueChange={onTabChange}
      {...props}
    >
      <List {...listProps} ref={listRef} className={classes.list}>
        {tabs.map((tab) =>
          tab.hidden ? null : (
            <Trigger
              className={classes.trigger}
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              style={tab.triggerProps?.style}
              data-testid={`tab-trigger-${tab.value}`}
              {...tab.triggerProps}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </Trigger>
          ),
        )}
        <span
          ref={indicatorRef}
          className={classes.indicator}
          aria-hidden="true"
          data-testid="tab-indicator"
        />
      </List>
      {tabs.map((tab) => (
        <Content
          className={classes.content}
          key={tab.value}
          value={tab.value}
          style={tab.contentProps?.style}
          data-testid={`tab-content-${tab.value}`}
          {...tab.contentProps}
        >
          {tab.children}
        </Content>
      ))}
    </Root>
  );
};

Tab.displayName = Root.displayName;
