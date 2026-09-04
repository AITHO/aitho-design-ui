import {
  ChevronDownIcon,
  ChevronUpIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { selectTags, type SelectTagsVariantProps } from "@styled/recipes";
import { nanoid } from "nanoid";
import * as React from "react";
import { useState } from "react";

export type SelectTagsProps = SelectTagsVariantProps & {
  /**
   * Array of strings representing the selectable options.
   * The list of selectable options.
   * These values will be displayed as available choices in the component.
   */
  options: string[];

  /**
   * Array of strings representing the selected options.
   * The currently selected values.
   * These values will be highlighted or marked as selected in the component.
   */
  value: string[];

  /**
   * Function to handle changes in the selected values.
   * Callback function invoked when the selection changes.
   * It receives the updated list of selected values as its argument.
   */
  onChange: (value: string[]) => void;

  /**
   * String to be displayed as the placeholder text.
   * Placeholder text displayed when no value is selected.
   * Provides a hint or instruction to the user about the expected input.
   */
  placeholder: string;

  /** *(optional)*
   * Boolean flag to control the display behavior of options.
   * A flag that determines which items to display in the component.
   * - When `true`, only the selected options will be shown, and the search
   *   will filter the available options.
   * - When `false`, or not provided, both selected and available options
   *   will be displayed, and the user can select from them.
   * @default false
   */
  isSelect?: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const filteredTools = (
  input: string,
  data: string[] | undefined,
  setSearch: React.Dispatch<React.SetStateAction<string[] | undefined>>,
) => {
  if (input.trim() !== "") {
    const lowerCaseInput = input.toLowerCase();
    const filtered = data?.filter((tool) =>
      tool.toLowerCase().includes(lowerCaseInput),
    );
    setSearch(filtered);
  }
};

/**
 * Displays a list of options the user can select.
 *
 * @param options - Array of strings representing the selectable options.
 * @param value - Array of strings representing the selected options.
 * @param onChange - Function to handle changes in the selected values.
 * @param placeholder - String to be displayed as the placeholder text.
 * @param isSelect - *(optional)* Boolean flag to control the display behavior of options.
 * @param height - *(optional)* The height size variant. Options: 'xs', 'sm', 'md', 'lg', 'xl'.
 * @param roundness - *(optional)* Border radius style. Options: 'none', 'rounded'.
 * @param borderColor - *(optional)* The border color of the select. Options: 'base', 'primary', 'error'.
 */

export const SelectTags: React.FC<SelectTagsProps> = ({
  placeholder,
  options,
  value,
  onChange,
  isSelect,
  borderColor,
  roundness,
  height,
  ...props
}) => {
  const classes = selectTags({ ...props, borderColor, roundness, height });

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[] | undefined>(
    [],
  );
  const [optionsData, setOptionsData] = useState<string[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [dropdownPosition, setDropdownPosition] = useState<"up" | "down">(
    "down",
  );

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [prevOptionsData, setPrevOptionsData] = React.useState(optionsData);

  // Update state during render when optionsData changes
  if (optionsData !== prevOptionsData) {
    setPrevOptionsData(optionsData);
    setFilteredOptions(optionsData);
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedNode = event.target as HTMLElement;

      if (containerRef.current && !containerRef.current.contains(clickedNode)) {
        if (
          event.clientX >= document.documentElement.offsetWidth ||
          event.clientY >= document.documentElement.offsetHeight
        ) {
          return;
        }

        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownPosition("up");
      } else {
        setDropdownPosition("down");
      }
    }
  }, [isOpen]);

  const handleAddItem = React.useCallback(
    (item: string) => {
      if (!value.includes(item)) {
        const newValue = [...value, item];
        onChange(newValue);
        setOptionsData([
          ...newValue.filter((item) => !options.includes(item)),
          ...options,
        ]);
      }
      setInputValue("");
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    [onChange, options, value],
  );

  const handleDeleteItem = React.useCallback(
    (item: string) => {
      const newValue = value.filter((v) => v !== item);
      onChange(newValue);
      setOptionsData([
        ...newValue.filter((item) => !options.includes(item)),
        ...options,
      ]);
      setIsOpen(false);
    },

    [onChange, options, setOptionsData, value],
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      filteredTools(newValue, options, setFilteredOptions);
      setHighlightedIndex(-1);
    },
    [options],
  );

  const getOptionsToDisplay = React.useMemo(() => {
    if (inputValue.trim() !== "" && filteredOptions?.length) {
      return filteredOptions;
    }
    return isSelect ? value : optionsData;
  }, [filteredOptions, inputValue, isSelect, optionsData, value]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          setHighlightedIndex((prev) =>
            prev < getOptionsToDisplay.length - 1 ? prev + 1 : 0,
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : getOptionsToDisplay.length - 1,
          );
          break;

        case "Enter":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          if (document.activeElement !== inputRef.current) return;
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleAddItem(getOptionsToDisplay[highlightedIndex]);
          } else if (inputValue.trim()) {
            handleAddItem(inputValue.trim());
          }
          break;

        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;

        default:
          break;
      }
    },
    [getOptionsToDisplay, handleAddItem, highlightedIndex, inputValue, isOpen],
  );

  React.useEffect(() => {
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const visiblePlaceholder = value.length ? "" : placeholder;

  const inputListItem = React.useMemo(() => {
    if (inputValue.trim()) {
      return (
        <button
          type="button"
          key={nanoid()}
          className={`${classes.dropdownOption} ${value.includes(inputValue) ? classes.selected : ""}`}
          onClick={() => handleAddItem(inputValue)}
        >
          {inputValue}
        </button>
      );
    }
  }, [
    classes.dropdownOption,
    classes.selected,
    handleAddItem,
    inputValue,
    value,
  ]);

  const handleToggleIcon = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div ref={containerRef} className={classes.wrapper} {...props}>
      <div className={classes.itemsWrapper}>
        {value?.map((item) => (
          <div className={classes.tagItem} key={nanoid()}>
            <p>{item}</p>
            <button
              type="button"
              className={classes.removeButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item);
              }}
              data-testid={`remove-icon-${item}`}
            >
              <Cross1Icon />
            </button>
          </div>
        ))}
      </div>
      <div className={classes.inputWrapper}>
        <input
          data-testid="input"
          ref={inputRef}
          value={inputValue}
          placeholder={visiblePlaceholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen(true)}
          className={classes.inputField}
        />

        {isOpen ? (
          <button
            type="button"
            className={classes.toggleIcon}
            onClick={handleToggleIcon}
            data-testid="toggle-icon"
            aria-label="Close options"
          >
            <ChevronUpIcon />
          </button>
        ) : (
          <button
            type="button"
            className={classes.toggleIcon}
            onClick={handleToggleIcon}
            data-testid="toggle-icon"
            aria-label="Open options"
          >
            <ChevronDownIcon />
          </button>
        )}
      </div>

      <div
        data-testid="dropdown"
        className={`
          ${classes.dropdown}
          ${isOpen ? classes.dropdownOpen : ""}
          ${dropdownPosition === "up" ? classes.dropdownUp : ""}
        `}
      >
        {getOptionsToDisplay.length ? (
          <>
            {inputListItem}
            {getOptionsToDisplay.map((item, index) => (
              <button
                type="button"
                key={nanoid()}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                className={`
                  ${classes.dropdownOption}
                  ${value.includes(item) ? classes.selected : ""}
                  ${highlightedIndex === index ? classes.highlighted : ""}
                `}
                onClick={() => handleAddItem(item)}
                tabIndex={-1}
              >
                {item}
              </button>
            ))}
          </>
        ) : (
          <div data-testid="no-data">No data</div>
        )}
      </div>
    </div>
  );
};

SelectTags.displayName = "SelectTags";
