import { FileIcon, Link2Icon, TrashIcon } from "@radix-ui/react-icons";
import { fileUpload, type FileUploadVariantProps } from "@styled/recipes";
import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Label } from "../Label/Label";

export type FileUploadProps = React.InputHTMLAttributes<HTMLInputElement> &
  FileUploadVariantProps & {
    /** *(optional)*
     * Text to display as the label for the input field.
     * It will be displayed above or beside the input, and may be followed by an asterisk if the field is required.
     */
    label?: string;

    /** *(optional)*
     * Indicates whether the input field is required.
     * If `true`, an asterisk (*) will appear next to the label.
     * @default false
     */
    required?: boolean;

    /** *(optional)*
     * Custom error message to display below the input field if validation fails.
     */
    errorMessage?: string;

    /** *(optional)*
     * Indicates whether the input should be styled with an error state (e.g., red border).
     * If `true`, applies error styling to the input field.
     * @default false
     */
    error?: boolean;

    /** *(optional)*
     * Text displayed inside the input field when no file has been selected.
     */
    placeholder?: string;

    /** *(optional)*
     * This indicates whether the input field should allow users to select more than one file at a time.
     * If `true`, allows multiple files to be selected.
     * @default false
     */
    multiple?: boolean;

    /** *(required)*
     * A unique identifier for the input field.
     * The `id` is used to associate the input field with a corresponding `<label>` element to improve accessibility.
     * It should be a unique value within the document.
     */
    id: string;

    /** *(optional)*
     * Callback function triggered when a file is removed.
     */
    onFileDelete?: (file: File) => void;
  };

/**
 * Allows users to upload files with an optional label and error state.
 *
 * @param label - *(optional)* Text to display as the label for the input field.
 * @param required - *(optional)* Indicates whether the input field is required.
 * @param errorMessage - *(optional)* Custom error message to display below the input field if validation fails.
 * @param error - *(optional)* Indicates whether the input should be styled with an error state (e.g., red border).
 * @param placeholder - *(optional)* Text displayed inside the input field when no file has been selected.
 * @param multiple - *(optional)* This indicates whether the input field should allow users to select more than one file at a time.
 * @param id - *(required)* Unique identifier for the input field.
 * @param onFileDelete - *(optional)* Callback function triggered when a file is removed.
 * @param disabled - *(optional)* Disables the input field.
 * @param borderRadius - *(optional)* The border radius style of the input field. Options: 'none', 'rounded'.
 * @param borderColor - *(optional)* The border color of the input field. Options: 'base', 'primary', 'error'.
 * @param onChange - *(optional)* Callback function called when the user does type or interact with the input field.
 */

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      required,
      errorMessage,
      error,
      placeholder,
      multiple,
      id,
      onFileDelete,
      disabled,
      borderRadius,
      borderColor,
      onChange,
      ...props
    },
    ref,
  ) => {
    const classes = fileUpload({ borderRadius, borderColor });
    const fileInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => fileInputRef.current as HTMLInputElement);
    const [files, setFiles] = useState<File[]>([]);

    const onValChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesValue = e.target.files;

        if (!filesValue || filesValue.length === 0) return;

        const newFiles = Array.from(filesValue);

        setFiles((prev) => (multiple ? [...prev, ...newFiles] : [newFiles[0]]));

        onChange?.(e);
      },
      [multiple, onChange],
    );

    const deleteValueFile = useCallback(
      (index: number) => {
        setFiles((prevFiles) => {
          const deletedFile = prevFiles[index];
          const newFiles = prevFiles.filter((_, i) => i !== index);
          if (onFileDelete && deletedFile) {
            onFileDelete(deletedFile);
          }
          if (fileInputRef.current && newFiles.length === 0) {
            fileInputRef.current.value = "";
          }
          return newFiles;
        });
      },
      [onFileDelete],
    );

    return (
      <>
        <div className={classes.inputWrapper}>
          {label && (
            <div className={classes.labelContainer}>
              <Label htmlFor={id}>
                {required && <span className={classes.requiredMark}>*</span>}
                {label}:
              </Label>
            </div>
          )}

          <div className={classes.inputContainer}>
            <button
              type="button"
              className={classes.fileLabel}
              data-disabled={disabled}
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileIcon
                className={classes.iconFileInputStyle}
                data-disabled={disabled}
              />
              {placeholder}
            </button>
            <input
              ref={fileInputRef}
              disabled={disabled}
              data-testid="input"
              id={id}
              type="file"
              multiple={multiple}
              onChange={onValChange}
              className={classes.hiddenFileInput}
              {...props}
            />
            {files.length > 0 &&
              (multiple ? (
                files.map((item, index) => (
                  <div
                    key={item.name}
                    className={classes.filesContent}
                    data-disabled={disabled}
                  >
                    <div className={classes.fileIcon}>
                      <Link2Icon />
                      <p className={classes.fileName}>{item.name}</p>
                    </div>

                    <button
                      type="button"
                      data-testid="icon_trash"
                      className={classes.deleteIcon}
                      data-disabled={disabled}
                      disabled={disabled}
                      onClick={() => !disabled && deleteValueFile(index)}
                    >
                      <TrashIcon width={24} height={24} />
                    </button>
                  </div>
                ))
              ) : (
                <div className={classes.filesContent} data-disabled={disabled}>
                  <div className={classes.fileIcon}>
                    <Link2Icon />
                    <p className={classes.fileName}>{files[0]?.name}</p>
                  </div>

                  <button
                    type="button"
                    data-testid="icon_trash"
                    className={classes.deleteIcon}
                    data-disabled={disabled}
                    disabled={disabled}
                    onClick={() => {
                      if (disabled) return;

                      deleteValueFile(0);
                      setFiles([]);

                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <TrashIcon width={24} height={24} />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {error && <span className={classes.errorText}>{errorMessage}</span>}
      </>
    );
  },
);

FileUpload.displayName = "FileUpload";
