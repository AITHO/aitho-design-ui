import { list, type ListVariantProps } from "@styled/recipes";
import { nanoid } from "nanoid";
import * as React from "react";
interface ListItemProp {
  /** *(optional)*
   * Item elements in left position.
   */
  leftSlot?: React.ReactNode[];

  /** *(optional)*
   * Item elements in right position.
   */
  rightSlot?: React.ReactNode[];
}

export type ListProps = ListVariantProps & {
  /** List items.
   * Pass an objects array with leftSlot and rightSlot.
   */
  items: ListItemProp[];

  /** *(optional)*
   * If true, applies alternating styles to the rows of the table (striped).
   * @default false
   */
  striped?: boolean;
};

/**
 * Provides a list of items.
 *
 * @param items - List items.
 * @param striped - *(optional)* If true, applies alternating styles to the rows of the table (striped).
 * @param size - *(optional)* The size of the tooltip component. Options: 'sm', 'md', 'lg'.
 * @param variant - *(optional)* The visual style variant. Options: 'primary', 'secondary', 'neutral'.
 */

export const List: React.FC<ListProps> = ({
  items,
  striped,
  size,
  variant,
  ...props
}) => {
  const classes = list({ size, variant, striped });
  return (
    <div className={classes.root} {...props}>
      {items.map((item) => (
        <div key={nanoid()} className={classes.container}>
          <div className={classes.content}>
            <div className={classes.item}>
              {item.leftSlot?.map((item) => (
                <div key={nanoid()}>{item}</div>
              ))}
            </div>

            <div className={classes.rightSlot}>
              <div className={classes.item}>
                {item.rightSlot?.map((item) => (
                  <div key={nanoid()}>{item}</div>
                ))}
              </div>
            </div>
          </div>
          <div className={classes.separator} />
        </div>
      ))}
    </div>
  );
};

List.displayName = "List";
