import React, { useEffect, useRef } from "react";
import { scrollbar } from "@styled/recipes";

export interface ScrollbarProps {
  /** The element that scrolls. Render the Scrollbar next to it, inside the same positioned parent. */
  targetRef: React.RefObject<HTMLElement | null>;

  /** *(optional)*
   * The axis the bar scrolls: up and down along the right edge, or sideways along the bottom.
   * @default "vertical"
   */
  orientation?: "vertical" | "horizontal";
}

const THICKNESS = 6;
const MIN_THUMB = 24;
// Gap between the thumb's travel and the target's ends. Vertical: 1px, the transparent edge of the
// select options, so the thumb starts and ends level with the first and last row. Horizontal: clear
// of the rounded corners of a table frame.
const INSET = { vertical: 1, horizontal: 6 };
// Horizontal bar: distance from the target's bottom edge, or from the bottom of the screen.
const BOTTOM_GAP = 2;

// Nearest ancestor that scrolls vertically: its bottom edge is where a tall table stops being visible.
const scrollParentOf = (element: HTMLElement) => {
  for (let node = element.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(node).overflowY))
      return node;
  }
  return null;
};

/**
 * A scrollbar we draw ourselves over `targetRef`, in place of the browser's: the same in every
 * browser, and always visible while the content overflows (Firefox can't be restyled like this, and
 * macOS hides idle native bars). While a vertical one overflows the target gets `data-overflowing`,
 * so it can make room for the thumb. A horizontal one stays at the bottom of the screen while a
 * table taller than the screen is in view; `--aitho-scrollbar-bottom` on the target lifts it above
 * something pinned there (a totals bar).
 *
 * @param targetRef - The scrolling element.
 * @param orientation - *(optional)* The axis the bar scrolls. Options: 'vertical', 'horizontal'.
 */
export const Scrollbar: React.FC<ScrollbarProps> = ({
  targetRef,
  orientation = "vertical",
}) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const classes = scrollbar();
  const vertical = orientation === "vertical";
  const inset = INSET[orientation];

  useEffect(() => {
    const target = targetRef.current;
    const thumb = thumbRef.current;
    if (!target || !thumb) return;
    const scrollParent = vertical ? null : scrollParentOf(target);

    const update = () => {
      const position = vertical ? target.scrollTop : target.scrollLeft;
      const size = vertical ? target.scrollHeight : target.scrollWidth;
      const visible = vertical ? target.clientHeight : target.clientWidth;
      const overflow = size - visible;
      if (vertical) target.toggleAttribute("data-overflowing", overflow > 0);
      thumb.hidden = overflow <= 0;
      if (overflow <= 0) return;

      const track = visible - 2 * inset;
      const length = Math.max(MIN_THUMB, (track * visible) / size);
      const offset = inset + ((track - length) * position) / overflow;
      // The target's inner box, inside any border it has.
      const left = target.offsetLeft + target.clientLeft;
      const top = target.offsetTop + target.clientTop;

      if (vertical) {
        thumb.style.width = `${THICKNESS}px`;
        thumb.style.height = `${length}px`;
        thumb.style.left = `${left + target.clientWidth - THICKNESS}px`;
        thumb.style.top = `${top + offset}px`;
      } else {
        // Lifted from the table's bottom edge to the visible bottom while that edge is off screen.
        const visibleBottom =
          Math.min(
            window.innerHeight,
            scrollParent?.getBoundingClientRect().bottom ?? Infinity,
          ) -
          (parseFloat(
            getComputedStyle(target).getPropertyValue(
              "--aitho-scrollbar-bottom",
            ),
          ) || 0);
        const innerBottom =
          target.getBoundingClientRect().top +
          target.clientTop +
          target.clientHeight;
        const lift = Math.min(
          Math.max(innerBottom - visibleBottom, 0),
          target.clientHeight - THICKNESS - 2 * BOTTOM_GAP,
        );
        thumb.style.width = `${length}px`;
        thumb.style.height = `${THICKNESS}px`;
        thumb.style.left = `${left + offset}px`;
        thumb.style.top = `${top + target.clientHeight - THICKNESS - BOTTOM_GAP - lift}px`;
      }
    };

    target.setAttribute("data-aitho-scrollbar", "");
    update();
    target.addEventListener("scroll", update, { passive: true });
    // Size changes of the box and of what it holds (a table getting wider), and options added or
    // filtered out while the sizes stay the same.
    const resize =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    resize?.observe(target);
    Array.from(target.children).forEach((child) => resize?.observe(child));
    const mutation = new MutationObserver(update);
    mutation.observe(target, { childList: true, subtree: true });
    // The page scrolling moves the visible bottom along the table.
    if (!vertical) {
      document.addEventListener("scroll", update, {
        capture: true,
        passive: true,
      });
      window.addEventListener("resize", update);
    }

    return () => {
      target.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
      resize?.disconnect();
      mutation.disconnect();
      target.removeAttribute("data-aitho-scrollbar");
      target.removeAttribute("data-overflowing");
    };
  }, [targetRef, vertical, inset]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = targetRef.current;
    if (!target || event.button !== 0) return;
    // Keeps the focus where it is (the search field, the open list) and selects no text.
    event.preventDefault();

    const thumb = event.currentTarget;
    const start = vertical ? event.clientY : event.clientX;
    const startScroll = vertical ? target.scrollTop : target.scrollLeft;
    const visible = vertical ? target.clientHeight : target.clientWidth;
    const size = vertical ? target.scrollHeight : target.scrollWidth;
    const length = vertical ? thumb.offsetHeight : thumb.offsetWidth;
    const ratio = (size - visible) / Math.max(visible - 2 * inset - length, 1);

    const move = (e: PointerEvent) => {
      const scroll =
        startScroll + ((vertical ? e.clientY : e.clientX) - start) * ratio;
      if (vertical) target.scrollTop = scroll;
      else target.scrollLeft = scroll;
    };
    const stop = () => {
      thumb.removeEventListener("pointermove", move);
      thumb.removeEventListener("pointerup", stop);
      thumb.removeEventListener("pointercancel", stop);
      thumb.removeAttribute("data-dragging");
    };

    thumb.setPointerCapture(event.pointerId);
    thumb.setAttribute("data-dragging", "");
    thumb.addEventListener("pointermove", move);
    thumb.addEventListener("pointerup", stop);
    thumb.addEventListener("pointercancel", stop);
  };

  return (
    <div
      ref={thumbRef}
      aria-hidden="true"
      hidden
      className={`${classes.thumb} scrollbar-thumb`}
      onPointerDown={startDrag}
    />
  );
};

Scrollbar.displayName = "Scrollbar";
