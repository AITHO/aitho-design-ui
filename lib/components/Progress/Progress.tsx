import * as ProgressPrimitive from "@radix-ui/react-progress";
import { progress, type ProgressVariantProps } from "@styled/recipes";
import * as React from "react";

export type ProgressProps = ProgressVariantProps &
  React.ComponentProps<typeof ProgressPrimitive.Root>;

/**
 * A progress bar component that indicates the completion status of a process.
 *
 * @param value - The current value of the progress bar.
 * @param max - *(optional)* The maximum value of the progress bar.
 * @param variant - *(optional)* The visual style of the component. Options: 'primary'.
 * @param size - *(optional)* The size of the component. Options: 'sm', 'md', 'lg'.
 * @param borderRadius - *(optional)* The border radius of the component. Options: 'none', 'sm', 'md', 'lg'.
 */

export const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ variant, size, borderRadius, ...props }, ref) => {
  const classes = progress({ variant, size, borderRadius });
  const max = props.max ?? 100;
  const value = props.value ?? 0;
  const percentage = Math.round((value / max) * 100);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      tabIndex={0}
      {...props}
      className={classes.root}
      aria-valuetext={undefined}
    >
      <ProgressPrimitive.Indicator
        className={classes.indicator}
        aria-hidden="true"
        style={{
          transform: `translateX(-${100 - percentage}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";
