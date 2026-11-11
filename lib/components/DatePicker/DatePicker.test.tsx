import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input/Input";
import { DatePicker } from "./DatePicker";
import { parseTypedDate } from "./dateUtils";

const Controlled = ({
  initial = "",
  onValueChange,
  ...rest
}: {
  initial?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <DatePicker
      aria-label="Data"
      lang="it"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      {...rest}
    />
  );
};

const field = () => screen.getByLabelText("Data") as HTMLInputElement;
const openCalendar = () =>
  fireEvent.click(screen.getByRole("button", { name: "Apri calendario" }));

describe("parseTypedDate", () => {
  it("reads the accepted formats and rejects impossible days", () => {
    expect(parseTypedDate("15/01/2026")).toEqual({ y: 2026, m: 0, d: 15 });
    expect(parseTypedDate("15012026")).toEqual({ y: 2026, m: 0, d: 15 });
    expect(parseTypedDate("1.2.2026")).toEqual({ y: 2026, m: 1, d: 1 });
    expect(parseTypedDate("2026-01-15")).toEqual({ y: 2026, m: 0, d: 15 });
    expect(parseTypedDate("31/02/2026")).toBeNull();
    expect(parseTypedDate("15/01/20")).toBeNull();
  });
});

describe("DatePicker", () => {
  it("shows an ISO value as dd/mm/yyyy", () => {
    render(<Controlled initial="2026-03-07" />);
    expect(field()).toHaveValue("07/03/2026");
    expect(field()).toHaveAttribute("type", "text");
  });

  it("masks typed digits and emits the ISO day once complete", () => {
    const onValueChange = vi.fn();
    render(<Controlled onValueChange={onValueChange} />);
    fireEvent.change(field(), { target: { value: "1503" } });
    expect(field()).toHaveValue("15/03");
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.change(field(), { target: { value: "15032026" } });
    expect(field()).toHaveValue("15/03/2026");
    expect(onValueChange).toHaveBeenLastCalledWith("2026-03-15");
  });

  it("accepts a pasted ISO date", () => {
    const onValueChange = vi.fn();
    render(<Controlled onValueChange={onValueChange} />);
    fireEvent.change(field(), { target: { value: "2026-11-10" } });
    expect(onValueChange).toHaveBeenLastCalledWith("2026-11-10");
    expect(field()).toHaveValue("10/11/2026");
  });

  it("goes back to the last valid day when left half typed, and clears on empty", () => {
    const onValueChange = vi.fn();
    render(<Controlled initial="2026-03-07" onValueChange={onValueChange} />);
    fireEvent.change(field(), { target: { value: "12/0" } });
    fireEvent.blur(field());
    expect(field()).toHaveValue("07/03/2026");
    fireEvent.change(field(), { target: { value: "" } });
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("opens on the selected month and picks a day from the calendar", () => {
    const onValueChange = vi.fn();
    render(<Controlled initial="2026-03-07" onValueChange={onValueChange} />);
    openCalendar();
    const grid = screen.getByRole("grid");
    expect(grid).toHaveAccessibleName(/marzo 2026/i);
    fireEvent.click(
      within(grid).getByRole("button", { name: / 20 marzo 2026/i }),
    );
    expect(onValueChange).toHaveBeenLastCalledWith("2026-03-20");
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    expect(field()).toHaveValue("20/03/2026");
  });

  it("moves between months with the header buttons", () => {
    render(<Controlled initial="2026-03-07" />);
    openCalendar();
    fireEvent.click(screen.getByRole("button", { name: "Mese successivo" }));
    expect(screen.getByRole("grid")).toHaveAccessibleName(/aprile 2026/i);
    fireEvent.click(screen.getByRole("button", { name: "Anno precedente" }));
    expect(screen.getByRole("grid")).toHaveAccessibleName(/aprile 2025/i);
  });

  it("is driven by the keyboard", () => {
    const onValueChange = vi.fn();
    render(<Controlled initial="2026-03-07" onValueChange={onValueChange} />);
    fireEvent.keyDown(field(), { key: "ArrowDown" });
    const grid = screen.getByRole("grid");
    expect(document.activeElement).toHaveAccessibleName(/ 7 marzo 2026/i);
    fireEvent.keyDown(grid, { key: "ArrowRight" });
    fireEvent.keyDown(grid, { key: "ArrowDown" });
    expect(document.activeElement).toHaveAccessibleName(/ 15 marzo 2026/i);
    fireEvent.keyDown(grid, { key: "PageDown" });
    expect(document.activeElement).toHaveAccessibleName(/ 15 aprile 2026/i);
    fireEvent.click(document.activeElement as HTMLElement);
    expect(onValueChange).toHaveBeenLastCalledWith("2026-04-15");
  });

  it("disables the days outside min and max", () => {
    render(
      <Controlled initial="2026-03-10" min="2026-03-05" max="2026-03-20" />,
    );
    openCalendar();
    const grid = screen.getByRole("grid");
    expect(
      within(grid).getByRole("button", { name: / 4 marzo 2026/i }),
    ).toBeDisabled();
    expect(
      within(grid).getByRole("button", { name: / 5 marzo 2026/i }),
    ).toBeEnabled();
    expect(
      within(grid).getByRole("button", { name: / 21 marzo 2026/i }),
    ).toBeDisabled();
  });

  it("clears from the footer", () => {
    const onValueChange = vi.fn();
    render(<Controlled initial="2026-03-07" onValueChange={onValueChange} />);
    openCalendar();
    fireEvent.click(screen.getByRole("button", { name: "Cancella" }));
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(field()).toHaveValue("");
  });
});

describe("DatePicker in forms and limits", () => {
  it("submits the ISO day under its name, once", () => {
    render(
      <form data-testid="form">
        <DatePicker
          aria-label="Data"
          lang="it"
          name="start"
          value="2026-03-07"
          onValueChange={vi.fn()}
        />
      </form>,
    );
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement);
    expect(data.getAll("start")).toEqual(["2026-03-07"]);
    expect(field()).not.toHaveAttribute("name");
  });

  it("does not apply a typed day outside min and max", () => {
    const onValueChange = vi.fn();
    render(
      <Controlled
        initial="2026-03-10"
        min="2026-03-05"
        max="2026-03-20"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.change(field(), { target: { value: "04/03/2026" } });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field()).toHaveAttribute("aria-invalid", "true");
    expect(field().validity.valid).toBe(false);
    fireEvent.blur(field());
    expect(field()).toHaveValue("10/03/2026");
    expect(field().validity.valid).toBe(true);
  });

  it("keeps keyboard focus on enabled days at the edge of the range", () => {
    render(<Controlled initial="2026-03-05" min="2026-03-05" />);
    fireEvent.keyDown(field(), { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("grid"), { key: "ArrowLeft" });
    expect(document.activeElement).toHaveAccessibleName(/ 5 marzo 2026/i);
  });

  it("closes an open calendar when it becomes disabled", () => {
    const { rerender } = render(
      <DatePicker aria-label="Data" lang="it" value="2026-03-07" />,
    );
    openCalendar();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    rerender(
      <DatePicker aria-label="Data" lang="it" value="2026-03-07" disabled />,
    );
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });
});

describe("Input type=date", () => {
  it("renders the library picker and keeps the change event contract", () => {
    const onChange = vi.fn();
    render(
      <Input
        type="date"
        aria-label="Inizio"
        name="start"
        lang="it"
        value=""
        onChange={onChange}
      />,
    );
    const input = screen.getByLabelText("Inizio");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("data-type", "date");
    fireEvent.change(input, { target: { value: "01/02/2026" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toMatchObject({
      value: "2026-02-01",
      name: "start",
    });
  });
});
