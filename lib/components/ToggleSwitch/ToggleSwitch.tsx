import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { toggleSwitch, type ToggleSwitchVariantProps } from "@styled/recipes";

export type ToggleSwitchProps = ToggleSwitchVariantProps &
  React.ComponentProps<typeof SwitchPrimitive.Root>;

/**
 * A control that allows the user to toggle between checked and not checked.
 *
 * @param size - *(optional)* The size of the toggleSwitch. Options: 'sm', 'md, 'lg'.
 * @param defaultChecked - *(optional)* If the toggleSwitch is checked by default.
 * @param disabled - *(optional)* If the toggleSwitch is disabled.
 */

export const ToggleSwitch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  ToggleSwitchProps
>(({ size, ...props }, ref) => {
  const styles = toggleSwitch({ size });

  return (
    <SwitchPrimitive.Root ref={ref} className={styles.root} {...props}>
      <SwitchPrimitive.Thumb className={styles.thumb} />
    </SwitchPrimitive.Root>
  );
});

ToggleSwitch.displayName = "ToggleSwitch";
