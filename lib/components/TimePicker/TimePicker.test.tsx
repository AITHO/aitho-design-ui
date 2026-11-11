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

describe("TimePicker in forms and limits", () => {
  it("submits HH:mm under its name, once", () => {
    render(
      <form data-testid="form">
        <TimePicker aria-label="Ora" name="at" value="10:30" />
      </form>,
    );
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement);
    expect(data.getAll("at")).toEqual(["10:30"]);
  });

  it("does not apply a typed time outside min and max", () => {
    const onValueChange = vi.fn();
    render(
      <TimePicker
        aria-label="Ora"
        lang="it"
        value="10:00"
        min="09:00"
        max="18:00"
        onValueChange={onValueChange}
      />,
    );
    const field = screen.getByLabelText("Ora") as HTMLInputElement;
    fireEvent.change(field, { target: { value: "0830" } });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.validity.valid).toBe(false);
    fireEvent.blur(field);
    expect(field).toHaveValue("10:00");
  });

  it("closes an open list when it becomes read-only", () => {
    const { rerender } = render(
      <TimePicker aria-label="Ora" lang="it" value="10:00" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Scegli l'ora" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    rerender(<TimePicker aria-label="Ora" lang="it" value="10:00" readOnly />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

const ControlledDateTime = ({
  initial = "",
  onChange,
  ...rest
}: {
  initial?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <>
      <Input
        type="datetime-local"
        label="Inizio"
        lang="it"
        name="when"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          onChange?.(event.target.value);
        }}
        {...rest}
      />
      <button type="button" onClick={() => setValue("")}>
        reset
      </button>
    </>
  );
};

const dayField = () =>
  document.querySelector('input[data-type="date"]') as HTMLInputElement;
const timeField = () =>
  document.querySelector('input[data-type="time"]') as HTMLInputElement;

describe("Input date, time and datetime-local in forms", () => {
  it("submits each type in its native format, once", () => {
    render(
      <form data-testid="form">
        <Input type="date" name="day" value="2026-03-07" onChange={vi.fn()} />
        <Input type="time" name="at" value="10:30" onChange={vi.fn()} />
        <Input
          type="datetime-local"
          name="when"
          value="2026-03-07T10:30"
          onChange={vi.fn()}
        />
      </form>,
    );
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement);
    expect(data.getAll("day")).toEqual(["2026-03-07"]);
    expect(data.getAll("at")).toEqual(["10:30"]);
    expect(data.getAll("when")).toEqual(["2026-03-07T10:30"]);
  });

  it("hands onChange a real input of the native type", () => {
    const onChange = vi.fn();
    render(<Input type="date" name="day" value="" onChange={onChange} />);
    fireEvent.change(dayField(), { target: { value: "01/02/2026" } });
    const target = onChange.mock.calls[0][0].target;
    expect(target).toBeInstanceOf(HTMLInputElement);
    expect(target.type).toBe("date");
    expect(target.value).toBe("2026-02-01");
  });
});

describe("Input datetime-local", () => {
  it("names the time part after the field", () => {
    render(<ControlledDateTime />);
    expect(screen.getByRole("textbox", { name: "Inizio, ora" })).toBe(
      timeField(),
    );
  });

  it("applies the time limits on the first allowed day", () => {
    const onChange = vi.fn();
    render(<ControlledDateTime min="2026-03-05T10:00" onChange={onChange} />);
    fireEvent.change(dayField(), { target: { value: "05/03/2026" } });
    fireEvent.change(timeField(), { target: { value: "0900" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(timeField()).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(timeField(), { target: { value: "1100" } });
    expect(onChange).toHaveBeenLastCalledWith("2026-03-05T11:00");
  });

  it("empties both parts when the value is reset from outside", () => {
    render(<ControlledDateTime initial="2026-03-07T10:30" />);
    expect(dayField()).toHaveValue("07/03/2026");
    fireEvent.click(screen.getByRole("button", { name: "reset" }));
    expect(dayField()).toHaveValue("");
    expect(timeField()).toHaveValue("");
  });

  it("emits an empty value when only the time is cleared, keeping the day", () => {
    const onChange = vi.fn();
    render(
      <ControlledDateTime initial="2026-03-07T10:30" onChange={onChange} />,
    );
    fireEvent.change(timeField(), { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith("");
    expect(dayField()).toHaveValue("07/03/2026");
    fireEvent.change(timeField(), { target: { value: "1145" } });
    expect(onChange).toHaveBeenLastCalledWith("2026-03-07T11:45");
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
