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
 */

export const Tab: React.FC<TabProps> = ({
  tabs,
  listProps,
  onTabChange,
  value,
  orientation,
  ...props
}) => {
  const classes = tab({ orientation });

  return (
    <Root
      className={classes.root}
      value={value}
      onValueChange={onTabChange}
      {...props}
    >
      <List {...listProps} className={classes.list}>
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
