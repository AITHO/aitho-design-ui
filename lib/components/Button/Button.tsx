import { button, type ButtonVariantProps } from "@styled/recipes";
import * as React from "react";
import { ButtonHTMLAttributes } from "react";

export interface Icon {
  data: React.ElementType;
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    /** *(optional)*
     * Icon to be displayed in the button.
     * */
    icon?: Icon;

    /** *(optional)*
     * Specifies the position of the icon relative to the button's content.
     * @default "start"
     * */
    iconPosition?: "start" | "end";

    /** When true, the button width/height shrink to min-content. */
    compact?: boolean;
  };

/**
 * A button means an operation (or a series of operations).
 *
 * @param icon - *(optional)* Icon component to be used in the button.
 * @param iconPosition - *(optional)* Position of the icon.Options: 'start', 'end'.
 * @param children - The button's content.
 * @param size - *(optional)* The size variant of the button. Options: 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'.
 * @param borderRadius - *(optional)* The border radius style of the button. Options: 'flat', 'rounded', 'pills'.
 * @param variant - *(optional)* The color scheme of the button. Options: 'primary', 'transparent', 'outline', 'error'.
 * @param layout - *(optional)* The layout style variant of the button. Options: 'horizontal', 'vertical'.
 * @param disabled - *(optional)* Disable the button.
 * @param compact - *(optional)* When true, the button width/height shrink to min-content.
 */

export const Button: React.FC<ButtonProps> = ({
  icon,
  iconPosition = "start",
  children,
  size,
  borderRadius,
  variant,
  layout,
  disabled,
  compact,
  ...props
}) => {
  const classes = button({
    size,
    borderRadius,
    variant,
    layout,
    disabled,
    compact,
  });

  const renderIcon = React.useCallback(() => {
    if (!icon) return null;

    const IconComponent = icon.data;
    return <IconComponent className={classes.icon} />;
  }, [icon, classes.icon]);

  return (
    <button
      className={classes.root}
      {...props}
      disabled={disabled}
      data-full-start={icon && children && iconPosition === "start"}
      data-full-end={icon && children && iconPosition === "end"}
    >
      {iconPosition === "start" && renderIcon()}
      {children && <span className={classes.content}>{children}</span>}
      {iconPosition === "end" && renderIcon()}
    </button>
  );
};

Button.displayName = "Button";
