import { Cross1Icon } from "@radix-ui/react-icons";
import { bottomSheet } from "@styled/recipes";
import * as React from "react";
import { createPortal } from "react-dom";

export interface BottomSheetProps {
  /** Boolean value indicating the visibility of the bottom sheet.
   * When set to `true`, the sheet is displayed, otherwise it is hidden.
   */
  isOpen: boolean;

  /** Function called when the sheet requests to close
   * (overlay tap, Escape key, swipe down or close button).
   */
  onClose: () => void;

  /** *(optional)*
   * Accessible name of the sheet; rendered in the default header unless `header` is provided.
   */
  title?: string;

  /** *(optional)*
   * Custom header content replacing the default title row (the grabber stays).
   */
  header?: React.ReactNode;

  /** *(optional)*
   * Sticky footer content (action buttons); gets safe-area bottom padding.
   */
  footer?: React.ReactNode;

  /** *(optional)*
   * Full-screen presentation for long forms instead of the bottom-anchored sheet.
   * @default false
   */
  fullScreen?: boolean;

  /** *(optional)*
   * Whether to show the close button in the default header.
   * @default true
   */
  showCloseButton?: boolean;

  /** *(optional)*
   * Accessible label for the close button.
   * @default "Close"
   */
  closeAriaLabel?: string;

  /** Content to be rendered inside the scrollable sheet body. */
  children: React.ReactNode;
}

const SWIPE_CLOSE_THRESHOLD_PX = 80;

/**
 * Mobile bottom sheet: bottom-anchored panel with grabber, swipe-down / overlay
 * tap / Escape to close, body scroll lock, scrollable body and sticky footer.
 * With `fullScreen` it covers the whole viewport (long forms).
 *
 * @param isOpen - Boolean value indicating the visibility of the bottom sheet.
 * @param onClose - Function called when the sheet requests to close.
 * @param title - *(optional)* Accessible name of the sheet, shown in the default header.
 * @param header - *(optional)* Custom header content replacing the default title row.
 * @param footer - *(optional)* Sticky footer content with safe-area bottom padding.
 * @param fullScreen - *(optional)* Full-screen presentation instead of the bottom-anchored sheet.
 * @param showCloseButton - *(optional)* Whether to show the close button in the default header.
 * @param closeAriaLabel - *(optional)* Accessible label for the close button.
 * @param children - Content to be rendered inside the scrollable sheet body.
 */

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  header,
  footer,
  fullScreen = false,
  showCloseButton = true,
  closeAriaLabel = "Close",
  children,
}) => {
  const classes = bottomSheet({ fullScreen });
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  const handleTouchStart = React.useCallback((event: React.TouchEvent) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }, []);

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent) => {
      if (touchStartY.current === null) {
        return;
      }
      const deltaY =
        (event.changedTouches[0]?.clientY ?? 0) - touchStartY.current;
      touchStartY.current = null;
      if (deltaY > SWIPE_CLOSE_THRESHOLD_PX) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={classes.root} onKeyDown={handleKeyDown}>
      <div className={classes.overlay} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={classes.panel}
      >
        {!fullScreen && (
          <div
            className={classes.grabberRow}
            data-testid="bottom-sheet-grabber"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <span className={classes.grabber} />
          </div>
        )}
        {header ?? (
          <div
            className={classes.header}
            onTouchStart={fullScreen ? undefined : handleTouchStart}
            onTouchEnd={fullScreen ? undefined : handleTouchEnd}
          >
            <span className={classes.title}>{title}</span>
            {showCloseButton && (
              <button
                type="button"
                className={classes.close}
                onClick={onClose}
                aria-label={closeAriaLabel}
              >
                <Cross1Icon data-testid="cross-icon" aria-hidden />
              </button>
            )}
          </div>
        )}
        <div className={classes.body}>{children}</div>
        {footer && <div className={classes.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

BottomSheet.displayName = "BottomSheet";
