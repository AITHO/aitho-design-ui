import React from "react";
import { textArea, type TextAreaVariantProps } from "@styled/recipes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Spinner } from "lib/main";

const useAutoResize = (
  ref: React.RefObject<HTMLTextAreaElement | null>,
  enabled: boolean,
) => {
  const adjustHeight = React.useCallback(() => {
    if (!ref.current || !enabled) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
  }, [enabled, ref]);

  React.useEffect(() => {
    if (!enabled || !ref.current) return;

    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [enabled, adjustHeight, ref]);

  return adjustHeight;
};

interface SendButtonProps {
  /** Callback fired when the sendButton is clicked. */
  onClick: () => void;

  /** Whether the sendButton is disabled. */
  disabled: boolean;

  /** *(optional)*
   * Whether the sendButton is loading.
   * @default false
   */
  loading?: boolean;

  /** *(optional)*
   * Loading element displayed inside the sendButton.
   */
  loadingElement?: React.ReactNode;

  /** *(optional)*
   * Icon displayed inside the sendButton.
   */
  icon?: React.ReactNode;

  /** *(optional)*
   * Personalize style.
   */
  className?: string;
}

const SendButton: React.FC<SendButtonProps> = ({
  onClick,
  disabled,
  loading,
  loadingElement,
  icon,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={className}
  >
    {loading
      ? (loadingElement ?? <Spinner type="circularFlashingDots" size="sm" />)
      : (icon ?? <ArrowRightIcon />)}
  </button>
);

export type TextAreaProps = TextAreaVariantProps & {
  /** *(optional)*
   * Label text displayed above the textarea.
   */
  label?: string;

  /** *(optional)*
   * Helper text displayed below the textarea.
   */
  helperText?: string;

  /** *(optional)*
   * Maximum number of characters allowed.
   */
  maxLength?: number;

  /** *(optional)*
   * Whether to display the character count.
   * @default false
   */
  showCount?: boolean;

  /** *(optional)*
   * Whether to automatically resize the textarea based on content.
   * @default false
   */
  autoResize?: boolean;

  /** *(optional)*
   * The size of the textarea component.
   */
  value?: string | number;

  /** *(optional)*
   * The initial value of the textarea in uncontrolled mode.
   */
  defaultValue?: string;

  /** *(optional)*
   * Callback fired when the textarea value changes.
   */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /** *(optional)*
   * Callback fired with the new text value input.
   */
  onTextChange?: (text: string) => void;

  /** *(optional)*
   * Callback fired when the text reaches the maxLength.
   */
  onLimitReached?: () => void;

  /** *(optional)*
   * SendButton element displayed on the right side of the textarea.
   * Pass an object with icon, label, disabled, loadingElement and onClick.
   * @example
   * sendButton: {
   *  icon: <Icon />,
   *  disabled: false,
   *  loadingElement: <Spinner />,
   *  onClick: (text: string) => console.log("Sending:", text),
   *  loading: true,
   * }
   */
  sendButton?: {
    /** *(optional)*
     * Icon displayed inside the sendButton.
     */
    icon?: React.ReactNode;

    /** *(optional)*
     * Whether the sendButton is disabled.
     * @default false
     */
    disabled?: boolean;

    /** *(optional)*
     * Loading element displayed inside the sendButton.
     */
    loadingElement?: React.ReactNode;

    /** Callback fired when the sendButton is clicked. */
    onClick: (text: string) => void;

    /** *(optional)*
     * Whether the sendButton is loading.
     * @default false
     */
    loading?: boolean;

    /** *(optional)*
     * Whether to send the message when the Enter key is pressed.
     * @default false
     */
    sendWithEnter?: boolean;
  };
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">;

/**
 * TextArea component that provides an enhanced textarea with features like auto-resize character count display and limit notifications.
 *
 * @param label - *(optional)* The label text displayed above the textarea.
 * @param sendButton - *(optional)* SendButton element displayed on the right side of the textarea.
 * @param helperText - *(optional)* Additional helper text displayed below the textarea.
 * @param maxLength - *(optional)* The maximum number of characters allowed.
 * @param showCount - *(optional)* Whether to display the character count.
 * @param autoResize - *(optional)* Enables automatic resizing of the textarea based on content height.
 * @param value - *(optional)* The controlled value of the textarea. When provided, the component is controlled.
 * @param defaultValue - *(optional)* The initial value of the textarea in uncontrolled mode.
 * @param onChange - *(optional)* Callback fired when the textarea value changes.
 * @param onTextChange - *(optional)* Callback fired with the new text value.
 * @param onLimitReached - *(optional)* Callback fired when the text reaches the maxLength.
 * @param type - *(optional)* The visual style variant of the textarea. Options: 'outline', 'filled', 'ghost', 'inputForm'.
 * @param size - *(optional)* The size of the textarea component. Options: 'sm', 'md', 'lg'.
 * @param disabled - *(optional)* Whether the textarea is disabled.
 * @param placeholder - *(optional)* Placeholder text when textarea is empty.
 * @param borderColor - *(optional)* The border color of the input field. Options: 'text', 'primary'.
 */

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  sendButton,
  helperText,
  maxLength,
  showCount = false,
  autoResize = false,
  value,
  defaultValue,
  onChange,
  onTextChange,
  onLimitReached,
  type,
  size,
  borderColor,
  ...props
}) => {
  const isControlled = typeof value !== "undefined";

  const [uncontrolledText, setUncontrolledText] = React.useState<string>(
    (defaultValue ?? "").toString(),
  );

  const text = React.useMemo(
    () => (isControlled ? value.toString() : uncontrolledText),
    [isControlled, value, uncontrolledText],
  );

  const uniqueId = React.useId();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const adjustHeight = useAutoResize(textareaRef, autoResize);

  const handleSendButtonClick = React.useCallback(() => {
    if (!sendButton?.onClick) return;

    sendButton.onClick(text);
    if (!isControlled) {
      setUncontrolledText("");
    }
    if (autoResize) {
      adjustHeight();
    }
  }, [sendButton, text, adjustHeight, isControlled, autoResize]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = maxLength
        ? e.target.value.slice(0, maxLength)
        : e.target.value;

      if (!isControlled) {
        setUncontrolledText(newText);
      }

      if (autoResize) {
        adjustHeight();
      }

      onChange?.(e);
      onTextChange?.(newText);

      if (maxLength && newText.length === maxLength) {
        onLimitReached?.();
      }
    },
    [
      isControlled,
      maxLength,
      autoResize,
      adjustHeight,
      onChange,
      onTextChange,
      onLimitReached,
    ],
  );

  React.useEffect(() => {
    if (!sendButton?.sendWithEnter) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendButtonClick();
        textareaRef.current?.blur();
      }
    };

    const textareaElement = textareaRef.current;
    if (textareaElement) {
      textareaElement.addEventListener("keydown", handleKeyDown);
      return () =>
        textareaElement.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleSendButtonClick, sendButton?.sendWithEnter]);

  const classes = textArea({ type, size, borderColor });
  const helperId = `${uniqueId}-helper`;

  return (
    <fieldset className={classes.root}>
      {label && (
        <label htmlFor={uniqueId} className={classes.label}>
          {label}
        </label>
      )}

      <div className={classes.wrapper}>
        <textarea
          ref={textareaRef}
          id={uniqueId}
          value={text}
          onChange={handleChange}
          className={classes.textarea}
          maxLength={maxLength}
          {...props}
        />

        {sendButton && (
          <SendButton
            onClick={handleSendButtonClick}
            disabled={text.length === 0}
            loading={sendButton.loading}
            loadingElement={sendButton.loadingElement}
            icon={sendButton.icon}
            className={classes.sendButton}
          />
        )}
      </div>

      <footer className={classes.footer}>
        {helperText && (
          <small id={helperId} className={classes.indicator}>
            {helperText}
          </small>
        )}

        {showCount && (
          <small
            className={classes.counter}
            data-state={
              maxLength && text.length >= maxLength
                ? "char-length-exceeded"
                : ""
            }
          >
            {maxLength ? `${text.length}/${maxLength}` : text.length}
          </small>
        )}
      </footer>
    </fieldset>
  );
};
