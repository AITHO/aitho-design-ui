import {
  AllHTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ImgHTMLAttributes,
} from "react";

interface HTMLElementAttributes {
  button: ButtonHTMLAttributes<HTMLButtonElement>;
  input: InputHTMLAttributes<HTMLInputElement>;
  select: SelectHTMLAttributes<HTMLSelectElement>;
  textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
  img: ImgHTMLAttributes<HTMLImageElement>;
  div: AllHTMLAttributes<HTMLDivElement>;
}

const REACT_PROPS = new Set([
  "className",
  "dangerouslySetInnerHTML",
  "defaultValue",
  "defaultChecked",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",

  "onClick",
  "onChange",
  "onSubmit",
  "onBlur",
  "onFocus",
  "onKeyDown",
  "onKeyUp",
  "onKeyPress",
  "onMouseDown",
  "onMouseUp",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onTouchStart",
  "onTouchEnd",
  "onTouchMove",
  "onDoubleClick",
  "onDrag",
  "onDragEnd",
  "onDragEnter",
  "onDragExit",
  "onDragLeave",
  "onDragOver",
  "onDragStart",
  "onDrop",
  "onMouseOver",
  "onMouseOut",
  "onSelect",
  "onTouchCancel",
  "onAnimationStart",
  "onAnimationEnd",
  "onAnimationIteration",
  "onTransitionEnd",
  "onToggle",
]);
export function filterValidHtmlProps<
  T extends object,
  E extends keyof HTMLElementAttributes,
>(props: T, elementType: E): HTMLElementAttributes[E] {
  const element = document.createElement(elementType);
  const filteredProps = Object.entries(props).reduce(
    (acc, [key, value]) => {
      if (
        key.startsWith("data-") ||
        key.startsWith("aria-") ||
        REACT_PROPS.has(key) ||
        key in element
      ) {
        acc[key as keyof HTMLElementAttributes[E]] = value;
      }
      return acc;
    },
    {} as HTMLElementAttributes[E],
  );

  return filteredProps;
}
