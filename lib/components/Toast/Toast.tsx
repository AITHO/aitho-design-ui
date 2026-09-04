import React, { useMemo, AnimationEvent } from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { toast, type ToastVariantProps } from "@styled/recipes";
import { Button } from "lib/main";
import { Cross1Icon } from "@radix-ui/react-icons";

export type ToastProps = Omit<
  ToastVariantProps &
    Omit<ToastPrimitive.ToastProps, "content"> &
    ToastPrimitive.ToastProviderProps & {
      /** *(optional)*
       * Title of the toast. Bold text on top.
       */
      title?: string;

      /** *(optional)*
       * Whether the toast can be closed.
       * If true, the toast will have a close button.
       * @default false
       */
      closable?: boolean;

      /** *(optional)*
       * Whether the toast can be closed by clicking on it. Only works if `closable` is true.
       * If true, and also closable, the toast will close when clicked.
       * @default false
       */
      closeOnClick?: boolean;

      /** *(optional)*
       * Callback called when the toast EXIT animation does end.
       */
      onAnimationEnd?: () => void;

      /** *(optional)*
       * Content of the toast.
       */
      content?: React.ReactNode;
    },
  "children"
>;

/**
 * A toast component that displays a message to the user for a short period of time. To learn about it read the ToastProvider documentation page.
 *
 * @param title - *(optional)* Title of the toast. Bold text on top.
 * @param closable - *(optional)* Whether the toast can be closed.
 * @param closeOnClick - *(optional)* Whether the toast can be closed by clicking on it. Only works if `closable` is true.
 * @param onAnimationEnd - *(optional)* Callback called when the toast EXIT animation does end.
 * @param content - *(optional)* Content of the toast.
 * @param variant - *(optional)* The visual style variant. Options: 'base', 'primary', 'secondary', 'warning', 'alert'.
 * @param size - *(optional)* The size of the toast. Options: 'sm', 'md', 'lg'.
 * @param position - *(optional)* The position of the toast in the viewport. Options: 'top', 'top-left, 'top-right', 'left', 'bottom', 'bottom-left', 'bottom-right', 'right'.
 * @param duration - *(optional)* The duration of the toast in milliseconds.
 * @param borders - *(optional)* The border radius of the toast. Options: 'flat', 'rounded', pills'.
 */

export const Toast: React.FC<ToastProps> = ({
  title,
  content,
  onOpenChange,
  onAnimationEnd,
  closable = false,
  closeOnClick = false,
  variant,
  size,
  borders,
  position,
  ...props
}) => {
  const classes = toast({ variant, size, borders, position });

  const handleOnClick = () => {
    if (closable && closeOnClick) onOpenChange?.(false);
  };

  const rootClassName = useMemo(() => {
    let res = classes.root;
    if (closable && closeOnClick) res += ` ${classes.clickable}`;
    return res;
  }, [classes.clickable, classes.root, closable, closeOnClick]);

  const handleAnimationEnd = (e: AnimationEvent) => {
    if (
      props.open !== undefined &&
      !props.open &&
      e.animationName.includes("toastSwipe")
    ) {
      onAnimationEnd?.();
    }
  };

  return (
    <ToastPrimitive.Root
      className={rootClassName}
      onOpenChange={onOpenChange}
      onClick={handleOnClick}
      onAnimationEnd={handleAnimationEnd}
      data-testid="toast"
      {...props}
    >
      <div className={classes.content}>
        {title && (
          <ToastPrimitive.Title>
            <b>{title}</b>
          </ToastPrimitive.Title>
        )}
        {content && (
          <ToastPrimitive.Description>{content}</ToastPrimitive.Description>
        )}
      </div>
      {closable && (
        <div className={classes.closeArea}>
          <Button
            icon={{ data: Cross1Icon }}
            borderRadius="pills"
            size="xs"
            variant="transparent"
            aria-label="Close"
            onClick={() => onOpenChange?.(false)}
          />
        </div>
      )}
    </ToastPrimitive.Root>
  );
};
