import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { checkbox, type CheckboxVariantProps } from "@styled/recipes";

type RequiredProp = boolean | "none" | "primary" | undefined;

export interface CheckboxProps
  extends
    Omit<CheckboxVariantProps, "required">,
    Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "required"> {
  squareIcon?: boolean;
  required?: RequiredProp;
}

/**
 * A control that allows the user to toggle between checked and not checked.
 *
 * @param size - *(optional)* The size of the checkbox. Options: 'sm', 'md', 'lg', 'xl'.
 * @param variant - *(optional)* he background color variant of the checkbox. Options: 'primary', 'secondary'.
 * @param border - *(optional)* The border of the checkbox. Options: 'solid', 'dashed', 'none'.
 * @param defaultChecked - *(optional)* If the checkbox is checked by default.
 * @param disabled - *(optional)* If the checkbox is disabled.
 * @param required - *(optional)* If the checkbox is required.  Options: 'none', 'primary' or boolean.
 * @param squareIcon - *(optional)* If true, displays a square icon instead of a checkmark.
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  disabled,
  size,
  variant,
  border,
  required,
  squareIcon = false,
  ...props
}) => {
  const requiredVariant = required === true ? "primary" : required;

  const classes = checkbox({
    size,
    variant,
    border,
    required: requiredVariant as "primary" | "none" | undefined,
  });

  return (
    <CheckboxPrimitive.Root
      className={classes.root}
      disabled={disabled}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={classes.indicator}>
        {squareIcon ? (
          <div className={classes.icon}>
            <div className={classes.squareIcon} />
          </div>
        ) : (
          <CheckIcon className={classes.icon} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
