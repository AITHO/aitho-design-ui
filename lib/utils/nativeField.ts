import type React from "react";

/**
 * A detached input of a native type (`date`, `time`, `datetime-local`) holding the canonical
 * value, to stand in as the target of the pickers' events: callers read `name` and a
 * `YYYY-MM-DD` / `HH:mm` value from it, as from a native field.
 */
export const nativeFieldTarget = (
  type: string,
  value: string,
  name = "",
  id = "",
) => {
  const target = document.createElement("input");
  target.type = type;
  target.value = value;
  target.name = name;
  target.id = id;
  return target;
};

/** What is wrong with the text typed in a picker field, if anything. */
export type TypedProblem = "invalid" | "outOfRange" | null;

/**
 * An empty field is fine; text that is not a complete, real day or time (`31/02/2026`, `25:00`,
 * `12/0`) is invalid; a complete one outside min/max is out of range.
 */
export const typedProblem = <T>(
  text: string,
  typed: T | null,
  inRange: (value: T) => boolean,
): TypedProblem => {
  if (text.trim() === "") return null;
  if (typed === null) return "invalid";
  return inRange(typed) ? null : "outOfRange";
};

/**
 * Whether to show the field as wrong: a time or day out of range, or text as long as a complete
 * one that is still not real. Half typed text blocks a form but is not flagged while typing.
 */
export const showsProblem = (
  problem: TypedProblem,
  text: string,
  completeLength: number,
) =>
  problem === "outOfRange" ||
  (problem === "invalid" && text.length >= completeLength);

/** The same event, read through another target; its methods keep working on the original. */
export const withTarget = <E extends React.SyntheticEvent>(
  event: E,
  target: HTMLInputElement,
): E =>
  Object.create(event, {
    target: { value: target },
    currentTarget: { value: target },
  });
