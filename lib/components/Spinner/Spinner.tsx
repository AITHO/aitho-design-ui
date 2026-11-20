import * as React from "react";
import { spinner, type SpinnerVariantProps } from "@styled/recipes";

export type SpinnerProps = SpinnerVariantProps;

/**
 * Displays an animated loading indicator.
 *
 * @param size - *(optional)* The size of the component. Options: 'sm', 'md', 'lg', 'xl'.
 * @param type - *(optional)* The variant of the spinner. Options: 'linearFlashingDots', 'spinningSlashes', 'circularFlashingDots', 'rotatingSquares', 'rotatingDots'.
 * @param delayed - *(optional)* Show the spinner only if the load lasts more than 300ms, so a fast load never flashes it. @default true
 */

export const Spinner: React.FC<SpinnerProps> = ({
  size,
  type,
  delayed,
  ...props
}) => {
  const classes = spinner({ size, type, delayed });

  return (
    <div className={classes.root} {...props}>
      <span className={classes.element} {...props}></span>
    </div>
  );
};
