import {
  Cross1Icon,
  EyeNoneIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { input, type InputVariantProps } from "@styled/recipes";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import { Label } from "../Label/Label";
import "./Input.css";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  type?: Extract<
    React.InputHTMLAttributes<HTMLInputElement>["type"],
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "time"
    | "datetime-local"
    | "range"
    | "search"
  >;
} & InputVariantProps & {
    /** *(optional)*
     * Text to display as the label for the input field.
     * Text to be passed as a label for the input field.
     * It will be displayed above or beside the input, and may be followed by an asterisk if the field is required.
     */
    label?: string;

    /** *(optional)*
     * If `true`, the input field is mandatory.
     * Indicates whether the input field is required. If `true`, an asterisk (*) will appear next to the label.
     * @default false
     */
    required?: boolean;

    /** *(optional)*
     * Custom error message to display in case of validation error.
     * Error message to display below the input field if validation fails.
     */
    errorMessage?: string;

    /** *(optional)*
     * If `true`, applies error styling to the input field.
     * Indicates whether the input should be styled with an error state (e.g., red border).
     * @default false
     */
    error?: boolean;

    /** *(optional)*
     * If `true`, the input field will have search functionality.
     * When `type` is "search", a search icon will be displayed (or a delete icon if there is a value).
     * @default false
     */
    inputSearch?: boolean;
  };

/**
 *
 * Provides an input bar of the chosen type.
 *
 * @param label - *(optional)* Text to display as the label for the input field.
 * @param required - *(optional)* If `true`, the input field is mandatory.
 * @param errorMessage - *(optional)* Custom error message to display in case of validation error.
 * @param error - *(optional)* If `true`, applies error styling to the input field.
 * @param inputSearch - *(optional)* If `true`, the input field will have search functionality.
 * @param placeholder - *(optional)* Placeholder text displayed in the input field.
 * @param type - *(optional)* The input field type. Options: 'text', 'email', 'password', 'number', 'tel', 'url', 'search, 'date', 'time', 'datetime-local', 'range'.
 * @param disabled - *(optional)* Disables the input field.
 * @param borderRadius - *(optional)* The border radius style of the input field. Options: 'none', 'rounded'.
 * @param borderColor - *(optional)* The border color of the input field. Options: 'base', 'primary', 'error'.
 * @param onChange - *(optional)* Callback function called when the user does type or interact with the input field.
 */

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      errorMessage,
      error,
      inputSearch,
      onChange,
      borderRadius,
      borderColor,
      type,
      value,
      ...props
    },
    ref,
  ) => {
    const uniqueId = nanoid();
    const classes = input({ borderRadius, borderColor });
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    const [val, setVal] = useState(value ?? "");
    const [prevValue, setPrevValue] = useState(value);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Update state during render when prop changes
    if (value !== prevValue) {
      setPrevValue(value);
      setVal(value ?? "");
    }

    const onValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);

      if (onChange) {
        onChange(e);
      }
    };

    const deleteValue = () => {
      setVal("");

      if (onChange) {
        onChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }

      inputRef.current?.focus();
    };

    return (
      <>
        <div className={classes.inputWrapper}>
          {label && (
            <Label htmlFor={uniqueId}>
              {required && <span className={classes.requiredMark}>*</span>}
              {label}:
            </Label>
          )}

          <div className={classes.inputContainer}>
            <input
              id={uniqueId}
              ref={inputRef}
              data-testid="input"
              className={classes.inputField}
              value={val}
              onChange={onValChange}
              type={isPasswordVisible ? "text" : type}
              {...props}
            />
            {inputSearch && type === "search" && (
              <>
                {val === "" ? (
                  <MagnifyingGlassIcon
                    className={classes.iconStyle}
                    data-testid="magnifying-glass-icon"
                  />
                ) : (
                  <button
                    type="button"
                    className={classes.iconStyle}
                    onClick={deleteValue}
                    data-testid="cross-icon"
                  >
                    <Cross1Icon />
                  </button>
                )}
              </>
            )}
            {type === "password" && val.toString().length > 0 && (
              <>
                {isPasswordVisible ? (
                  <button
                    type="button"
                    className={classes.iconStyle}
                    onClick={() => setIsPasswordVisible(false)}
                    data-testid="hide-password-icon"
                  >
                    <EyeNoneIcon />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={classes.iconStyle}
                    onClick={() => setIsPasswordVisible(true)}
                    data-testid="show-password-icon"
                  >
                    <EyeOpenIcon />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {error && <span className={classes.errorText}>{errorMessage}</span>}
      </>
    );
  },
);

Input.displayName = "Input";
