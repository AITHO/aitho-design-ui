import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { dialog, type DialogVariantProps } from "@styled/recipes";
import { Button } from "lib/main";
import * as React from "react";

export type DialogProps = DialogVariantProps & {
  /** Boolean value indicating the visibility of the dialog.
   * Determines whether the dialog is open or closed.
   * When set to `true`, the dialog will be displayed, otherwise it will be hidden.
   */
  open: boolean;

  /** Text to be displayed as the dialog's title.
   * The title of the dialog.
   * It is usually displayed prominently at the top of the dialog.
   */
  title: string;

  /** *(optional)*
   * Text to be displayed as the dialog's description.
   * This can be additional information about the dialog or instructions for the user.
   */
  description?: string;

  /** *(optional)*
   * The container element that the dialog should be rendered into.
   * If provided, the dialog will be rendered into the specified container element.
   */
  container?: HTMLElement | null;

  /** *(optional)*
   * Function that is called when the "Ok" button is clicked.
   * Callback function triggered when the "Ok" button is clicked.
   * If provided, it will be executed when the user confirms the dialog.
   */
  onOk?: () => void;

  /** *(optional)*
   * Function that is called when the "Cancel" button or the overlay is clicked.
   * Callback function triggered when the "Cancel" button or the overlay is clicked.
   * If provided, it will be executed when the user cancels the dialog.
   */
  onCancel?: () => void;

  /** *(optional)*
   * Boolean value to indicate whether the dialog is in a loading state.
   * Boolean value that controls whether the dialog's buttons are disabled.
   * If `true`, both the "Ok" and "Cancel" buttons will be disabled, often used during a loading state.
   * @default false
   */
  loading?: boolean;

  /** *(optional)*
   * Content to be rendered inside the dialog body.
   * The content displayed inside the dialog body.
   * This can be any React node, including text, components, or forms.
   */
  children?: React.ReactNode;

  /** *(optional)*
   * Boolean value that controls the visibility of the footer containing action buttons.
   * If `true`, the footer with "Ok" and "Cancel" buttons will be displayed.
   * @default true
   */
  footer?: boolean;

  /** *(optional)*
   * Custom text for the "Cancel" button.
   * The text displayed on the "Cancel" button.
   * You can customize the text of the "Cancel" button.
   * @default "Cancel"
   */
  cancelText?: string;

  /** *(optional)*
   * Custom text for the "Ok" button.
   * The text displayed on the "Ok" button.
   * You can customize the text of the "Ok" button.
   * @default "Ok"
   */
  okText?: string;

  /** *(optional)*
   * Boolean value that controls the visibility of the close button (usually an "X" icon).
   * If `true`, the close button will be shown; if `false`, it will be hidden.
   * @default true
   */
  close?: boolean;
};

/**
 * A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
 *
 * @param open - Boolean value indicating the visibility of the dialog.
 * @param title - Text to be displayed as the dialog's title.
 * @param description - *(optional)* Text to be displayed as the dialog's description.
 * @param container - *(optional)* The container element that the dialog should be rendered into.
 * @param onOk - *(optional)* Function that is called when the "Ok" button is clicked.
 * @param onCancel - *(optional)* Function that is called when the "Cancel" button or the overlay is clicked.
 * @param loading - *(optional)* Boolean value to indicate whether the dialog is in a loading state.
 * @param children - *(optional)* Content to be rendered inside the dialog body.
 * @param footer - *(optional)* Boolean value to toggle the visibility of the footer.
 * @param cancelText - *(optional)* Custom text for the "Cancel" button.
 * @param okText - *(optional)* Custom text for the "Ok" button.
 * @param close - *(optional)* Boolean value to toggle the visibility of the close button.
 * @param children - *(optional)* Content of the dialog body.
 */

export const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  description,
  onOk,
  onCancel,
  loading,
  children,
  footer = true,
  cancelText = "Cancel",
  okText = "Ok",
  close = true,
  container,
  width,
  ...props
}) => {
  const classes = dialog({ width });
  const triggerRef = React.useRef<Element | null>(null);

  // Capture the focused element when the dialog opens
  React.useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
    }
  }, [open]);

  const computedContainer = React.useMemo(() => {
    if (container) return container;
    return document.querySelector("#root") ?? document.body;
  }, [container]);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel?.();
      }}
    >
      <DialogPrimitive.Portal container={computedContainer}>
        <DialogPrimitive.Overlay
          className={classes.overlay}
          onClick={onCancel}
        />
        <DialogPrimitive.Content
          className={classes.content}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            (triggerRef.current as HTMLElement | null)?.focus();
          }}
          {...props}
        >
          <DialogPrimitive.Title className={classes.title}>
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className={classes.description}>
            {description}
          </DialogPrimitive.Description>
          {close && (
            <header className={classes.header}>
              <DialogPrimitive.Close asChild>
                <button
                  className={classes.close}
                  onClick={onCancel}
                  aria-label={`Close dialog`}
                >
                  <Cross1Icon data-testid="cross-icon" aria-hidden />
                </button>
              </DialogPrimitive.Close>
            </header>
          )}

          <div className={classes.body}>{children}</div>

          {footer && (
            <footer className={classes.footer} data-testid="dialog-footer">
              <Button
                onClick={onCancel}
                disabled={loading}
                aria-label={`${cancelText}`}
              >
                {cancelText}
              </Button>

              <Button
                onClick={onOk}
                disabled={loading}
                aria-label={`${okText}`}
              >
                {okText}
              </Button>
            </footer>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

Dialog.displayName = "Dialog";
