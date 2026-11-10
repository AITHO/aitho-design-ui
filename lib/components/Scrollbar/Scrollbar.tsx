import React, { useEffect, useRef } from "react";
import { scrollbar } from "@styled/recipes";

export interface ScrollbarProps {
  /** The element that scrolls. Render the Scrollbar next to it, inside the same positioned parent. */
  targetRef: React.RefObject<HTMLElement | null>;
}

// Gap between the thumb's travel and the target's top and bottom edges.
const INSET = 4;
const MIN_THUMB = 24;

/**
 * A vertical scrollbar we draw ourselves over `targetRef`, in place of the browser's: the same in
 * every browser, and always visible while the content overflows (Firefox can't be restyled like
 * this, and macOS hides idle native bars). While it overflows the target gets `data-overflowing`,
 * so it can make room for the thumb.
 *
 * @param targetRef - The scrolling element.
 */
export const Scrollbar: React.FC<ScrollbarProps> = ({ targetRef }) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const classes = scrollbar();

  useEffect(() => {
    const target = targetRef.current;
    const thumb = thumbRef.current;
    if (!target || !thumb) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = target;
      const overflow = scrollHeight - clientHeight;
      target.toggleAttribute("data-overflowing", overflow > 0);
      thumb.hidden = overflow <= 0;
      if (overflow <= 0) return;

      const track = clientHeight - 2 * INSET;
      const height = Math.max(MIN_THUMB, (track * clientHeight) / scrollHeight);
      thumb.style.height = `${height}px`;
      thumb.style.top = `${target.offsetTop + INSET + ((track - height) * scrollTop) / overflow}px`;
      thumb.style.left = `${target.offsetLeft + target.offsetWidth - thumb.offsetWidth}px`;
    };

    target.setAttribute("data-aitho-scrollbar", "");
    update();
    target.addEventListener("scroll", update, { passive: true });
    // Size changes, and options added or filtered out while the size stays the same.
    const resize =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(update);
    resize?.observe(target);
    const mutation = new MutationObserver(update);
    mutation.observe(target, { childList: true, subtree: true });

    return () => {
      target.removeEventListener("scroll", update);
      resize?.disconnect();
      mutation.disconnect();
      target.removeAttribute("data-aitho-scrollbar");
      target.removeAttribute("data-overflowing");
    };
  }, [targetRef]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = targetRef.current;
    if (!target || event.button !== 0) return;
    // Keeps the focus where it is (the search field, the open list) and selects no text.
    event.preventDefault();

    const thumb = event.currentTarget;
    const startY = event.clientY;
    const startTop = target.scrollTop;
    const travel = target.clientHeight - 2 * INSET - thumb.offsetHeight;
    const ratio =
      (target.scrollHeight - target.clientHeight) / Math.max(travel, 1);

    const move = (e: PointerEvent) => {
      target.scrollTop = startTop + (e.clientY - startY) * ratio;
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
