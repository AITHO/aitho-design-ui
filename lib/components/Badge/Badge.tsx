import * as React from "react";
import { badge, type BadgeVariantProps } from "@styled/recipes";

export type BadgeProps = BadgeVariantProps & {
  /** Element on which the badge is displayed. */
  children: React.ReactNode;

  /** *(optional)*
   * The number content of the badge.
   */
  count?: number;

  /** *(optional)*
   * Max count to show.
   */
  max?: number;

  /** *(optional)*
   * The content of the badge.
   */
  content?: React.ReactNode;

  /** *(optional)*
   * If true, the badge will be invisible.
   * @default false
   */
  invisible?: boolean;

  /** *(optional)*
   * If true, the badge will show zero.
   * @default false
   */
  showZero?: boolean;
};

/**
 * Numerical value or status descriptor for UI elements.
 *
 * @param children - Element on which the badge is displayed.
 * @param count - *(optional)* The number content of the badge.
 * @param max - *(optional)* Max count to show.
 * @param content - *(optional)* The content of the badge.
 * @param invisible - *(optional)* If true, the badge will be invisible.
 * @param showZero - *(optional)* If true, the badge will show zero.
 * @param variant - *(optional)* The color of the badge. Options: 'primary', 'error', 'info', 'success', 'warning'.
 * @param type - *(optional)* The variant of the badge. Options: 'standard', 'dot'.
 * @param overlap - *(optional)* Shape the badge should overlap. Options: 'rectangular', 'circular'.
 * @param placement - *(optional)* The placement of the badge. Options: 'top-right', 'top-left', 'bottom-right', 'bottom-left'.
 */

export const Badge: React.FC<BadgeProps> = ({
  children,
  type,
  count,
  max,
  content,
  invisible,
  showZero,
  placement,
  variant,
  overlap,
  ...props
}) => {
  const classes = badge({ placement, variant, type, overlap });

  const displayCount = () => {
    if (type === "dot") return "";
    if (max && count !== undefined && count > max) return `${max}+`;
    return count;
  };

  const shouldShowBadge = () => {
    if (invisible) return false;
    if (type === "dot") return true;
    if (count === 0) return showZero;
    return !!(count ?? content);
  };

  if (!shouldShowBadge()) {
    return <>{children}</>;
  }

  return (
    <div className={classes.root} {...props}>
      {children}
      <div className={classes.badge}>
        {content}
        {displayCount()}
      </div>
    </div>
  );
};

Badge.displayName = "Badge";
