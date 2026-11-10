import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input/Input";
import { TimePicker } from "./TimePicker";
import { maskTypedTime, parseTypedTime } from "./timeUtils";

describe("timeUtils", () => {
  it("masks and parses typed times", () => {
    expect(maskTypedTime("093")).toBe("09:3");
    expect(maskTypedTime("0930")).toBe("09:30");
    expect(parseTypedTime("09:30")).toBe(570);
    expect(parseTypedTime("9:30")).toBe(570);
    expect(parseTypedTime("0930")).toBe(570);
    expect(parseTypedTime("25:00")).toBeNull();
  });
});

const Controlled = ({
  onValueChange,
}: {
  onValueChange?: (v: string) => void;
}) => {
  const [value, setValue] = useState("09:00");
  return (
    <TimePicker
      aria-label="Ora"
      lang="it"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
};

describe("TimePicker", () => {
  it("emits typed times and picks from the list", () => {
    const onValueChange = vi.fn();
    render(<Controlled onValueChange={onValueChange} />);
    const field = screen.getByLabelText("Ora");
    expect(field).toHaveValue("09:00");
    fireEvent.change(field, { target: { value: "1745" } });
    expect(onValueChange).toHaveBeenLastCalledWith("17:45");
    fireEvent.click(screen.getByRole("button", { name: "Scegli l'ora" }));
    const list = screen.getByRole("listbox", { name: "Orari" });
    fireEvent.click(within(list).getByRole("option", { name: "08:15" }));
    expect(onValueChange).toHaveBeenLastCalledWith("08:15");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("moves through the list with the keyboard", () => {
    const onValueChange = vi.fn();
    render(<Controlled onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByLabelText("Ora"), { key: "ArrowDown" });
    const list = screen.getByRole("listbox");
    expect(document.activeElement).toHaveTextContent("09:00");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("09:15");
    fireEvent.click(document.activeElement as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith("09:15");
  });
});

describe("Input time and datetime-local", () => {
  it("uses the library time picker for type=time", () => {
    const onChange = vi.fn();
    render(
      <Input type="time" aria-label="Inizio" value="" onChange={onChange} />,
    );
    const field = screen.getByLabelText("Inizio");
    expect(field).toHaveAttribute("data-type", "time");
    fireEvent.change(field, { target: { value: "0830" } });
    expect(onChange.mock.calls[0][0].target.value).toBe("08:30");
  });

  it("combines day and time for type=datetime-local", () => {
    const onChange = vi.fn();
    render(
      <Input
        type="datetime-local"
        aria-label="Quando"
        lang="it"
        value=""
        onChange={onChange}
      />,
    );
    const day = screen.getByLabelText("Quando");
    fireEvent.change(day, { target: { value: "10/11/2026" } });
    expect(onChange).not.toHaveBeenCalled();
    const time = document.querySelector(
      'input[data-type="time"]',
    ) as HTMLInputElement;
    fireEvent.change(time, { target: { value: "2230" } });
    expect(
      onChange.mock.calls[onChange.mock.calls.length - 1][0].target.value,
    ).toBe("2026-11-10T22:30");
  });
});
