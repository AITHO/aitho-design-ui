import { fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "../DatePicker/DatePicker";
import { Input } from "../Input/Input";
import { TimePicker } from "./TimePicker";
import {
  formatTime,
  maskTypedTime,
  parseTime,
  parseTypedTime,
  precisionOfValue,
} from "./timeUtils";

describe("timeUtils", () => {
  it("masks and parses typed times", () => {
    expect(maskTypedTime("093")).toBe("09:3");
    expect(maskTypedTime("0930")).toBe("09:30");
    expect(parseTypedTime("09:30")).toBe(34_200_000);
    expect(parseTypedTime("9:30")).toBe(34_200_000);
    expect(parseTypedTime("0930")).toBe(34_200_000);
    expect(parseTypedTime("25:00")).toBeNull();
  });

  it("keeps seconds and milliseconds by precision", () => {
    expect(parseTime("10:30:45")).toBe(37_845_000);
    expect(parseTime("10:30:45.123")).toBe(37_845_123);
    expect(formatTime(37_845_123, "milliseconds")).toBe("10:30:45.123");
    expect(formatTime(37_845_123, "seconds")).toBe("10:30:45");
    expect(formatTime(37_845_123)).toBe("10:30");
    expect(maskTypedTime("103045", "seconds")).toBe("10:30:45");
    expect(maskTypedTime("103045123", "milliseconds")).toBe("10:30:45.123");
    expect(parseTypedTime("103045", "seconds")).toBe(37_845_000);
    expect(parseTypedTime("10:30:45.123", "milliseconds")).toBe(37_845_123);
    expect(parseTypedTime("10:30:45")).toBeNull();
  });

  it("waits for a complete time in the field's precision while typing", () => {
    expect(parseTypedTime("10:30", "seconds")).toBeNull();
    expect(parseTypedTime("10:30:4", "seconds")).toBeNull();
    expect(parseTypedTime("10:30:45", "milliseconds")).toBeNull();
    expect(precisionOfValue("10:30")).toBe("minutes");
    expect(precisionOfValue("10:30:45")).toBe("seconds");
    expect(precisionOfValue("10:30:45.1")).toBe("milliseconds");
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

  it("marks an impossible time invalid and keeps it out of the form", () => {
    render(
      <form data-testid="form">
        <TimePicker aria-label="Ora" lang="it" name="at" value="10:00" />
      </form>,
    );
    const field = screen.getByLabelText("Ora") as HTMLInputElement;
    const form = screen.getByTestId("form") as HTMLFormElement;
    fireEvent.change(field, { target: { value: "2500" } });
    expect(field).toHaveValue("25:00");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.validity.valid).toBe(false);
    expect(new FormData(form).get("at")).toBe("");
    fireEvent.blur(field);
    expect(field).toHaveValue("10:00");
    expect(new FormData(form).get("at")).toBe("10:00");
  });

  it("keeps the seconds of a value that has them", () => {
    render(
      <form data-testid="form">
        <TimePicker aria-label="Ora" name="at" value="10:30:45" />
      </form>,
    );
    expect(screen.getByLabelText("Ora")).toHaveValue("10:30:45");
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).get("at")).toBe("10:30:45");
  });

  it("reports blur with the field name and the time", () => {
    const onBlur = vi.fn();
    render(
      <TimePicker aria-label="Ora" name="at" value="10:30" onBlur={onBlur} />,
    );
    fireEvent.blur(screen.getByLabelText("Ora"));
    expect(onBlur.mock.calls[0][0].target).toMatchObject({
      name: "at",
      value: "10:30",
    });
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

  it("leaves disabled fields out of the submitted form", () => {
    const fields = (disabled: boolean) => (
      <form data-testid="form">
        <Input
          type="date"
          name="day"
          value="2026-03-07"
          disabled={disabled}
          onChange={vi.fn()}
        />
        <Input
          type="time"
          name="at"
          value="10:30"
          disabled={disabled}
          onChange={vi.fn()}
        />
        <Input
          type="datetime-local"
          name="when"
          value="2026-03-07T10:30"
          disabled={disabled}
          onChange={vi.fn()}
        />
      </form>
    );
    const { rerender } = render(fields(false));
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).getAll("when")).toEqual(["2026-03-07T10:30"]);
    rerender(fields(true));
    const data = new FormData(form);
    expect(data.getAll("day")).toEqual([]);
    expect(data.getAll("at")).toEqual([]);
    expect(data.getAll("when")).toEqual([]);
  });

  it("keeps the visible fields tied to a form they sit outside of", () => {
    render(
      <>
        <form id="booking" data-testid="booking" />
        <DatePicker
          aria-label="Data"
          lang="it"
          form="booking"
          name="start"
          required
          value=""
        />
        <TimePicker
          aria-label="Ora"
          lang="it"
          form="booking"
          name="at"
          value="10:00"
          min="09:00"
        />
        <Input type="datetime-local" form="booking" name="when" value="" />
      </>,
    );
    const booking = screen.getByTestId("booking") as HTMLFormElement;
    const visible =
      document.querySelectorAll<HTMLInputElement>("input[data-type]");
    visible.forEach((field) => expect(field.form).toBe(booking));
    // The empty required day blocks that form, as a native field would.
    expect(booking.checkValidity()).toBe(false);
    fireEvent.change(screen.getByLabelText("Data"), {
      target: { value: "07/03/2026" },
    });
    expect(booking.checkValidity()).toBe(true);
    // So does a typed time outside min.
    fireEvent.change(screen.getByLabelText("Ora"), {
      target: { value: "0830" },
    });
    expect(booking.checkValidity()).toBe(false);
  });

  it("keeps seconds with a step under a minute, also in datetime-local", () => {
    const onChange = vi.fn();
    render(
      <form data-testid="form">
        <Input
          type="time"
          step={1}
          name="at"
          value="10:30:45"
          onChange={onChange}
        />
        <Input
          type="datetime-local"
          step={1}
          name="when"
          value="2026-03-07T10:30:45"
          onChange={vi.fn()}
        />
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    const data = new FormData(form);
    expect(data.get("at")).toBe("10:30:45");
    expect(data.get("when")).toBe("2026-03-07T10:30:45");
    const [time] = document.querySelectorAll<HTMLInputElement>(
      'input[data-type="time"]',
    );
    fireEvent.change(time, { target: { value: "103046" } });
    expect(onChange.mock.calls[0][0].target.value).toBe("10:30:46");
  });

  it("lets the seconds be typed in full before applying the time", () => {
    const onChange = vi.fn();
    render(<Input type="time" step={1} value="" onChange={onChange} />);
    const [field] = document.querySelectorAll<HTMLInputElement>(
      'input[data-type="time"]',
    );
    fireEvent.change(field, { target: { value: "1030" } });
    expect(field).toHaveValue("10:30");
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(field, { target: { value: "103045" } });
    expect(field).toHaveValue("10:30:45");
    expect(onChange.mock.calls[0][0].target.value).toBe("10:30:45");
  });

  it("takes a shorter time on leaving the field", () => {
    const onChange = vi.fn();
    render(<Input type="time" step={1} value="" onChange={onChange} />);
    const [field] = document.querySelectorAll<HTMLInputElement>(
      'input[data-type="time"]',
    );
    fireEvent.change(field, { target: { value: "1030" } });
    fireEvent.blur(field);
    expect(onChange.mock.calls[0][0].target.value).toBe("10:30:00");
    expect(field).toHaveValue("10:30:00");
  });

  it("keeps milliseconds with a step under a second", () => {
    const onChange = vi.fn();
    render(
      <form data-testid="form">
        <Input
          type="time"
          step={0.001}
          name="at"
          value="10:30:45.123"
          onChange={onChange}
        />
        <Input
          type="datetime-local"
          step={0.001}
          name="when"
          value="2026-03-07T10:30:45.123"
          onChange={vi.fn()}
        />
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).get("at")).toBe("10:30:45.123");
    expect(new FormData(form).get("when")).toBe("2026-03-07T10:30:45.123");
    const [field] = document.querySelectorAll<HTMLInputElement>(
      'input[data-type="time"]',
    );
    expect(field).toHaveValue("10:30:45.123");
    fireEvent.change(field, { target: { value: "103045124" } });
    expect(onChange.mock.calls[0][0].target.value).toBe("10:30:45.124");
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
  it("follows outside updates back to a value the user had picked", () => {
    const EchoDateTime = () => {
      const [value, setValue] = useState("");
      return (
        <form data-testid="form">
          <Input
            type="datetime-local"
            name="when"
            label="Inizio"
            lang="it"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button type="button" onClick={() => setValue("2026-03-08T12:00")}>
            B
          </button>
          <button type="button" onClick={() => setValue("2026-03-07T11:00")}>
            A
          </button>
        </form>
      );
    };
    render(<EchoDateTime />);
    fireEvent.change(dayField(), { target: { value: "07/03/2026" } });
    fireEvent.change(timeField(), { target: { value: "1100" } });
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(dayField()).toHaveValue("08/03/2026");
    expect(timeField()).toHaveValue("12:00");
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(dayField()).toHaveValue("07/03/2026");
    expect(timeField()).toHaveValue("11:00");
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).getAll("when")).toEqual(["2026-03-07T11:00"]);
  });

  it("reports blur with the field name and the whole value", () => {
    const onBlur = vi.fn();
    render(
      <Input
        type="datetime-local"
        name="when"
        lang="it"
        value="2026-03-07T10:30"
        onChange={vi.fn()}
        onBlur={onBlur}
      />,
    );
    fireEvent.blur(timeField());
    expect(onBlur.mock.calls[0][0].target).toMatchObject({
      name: "when",
      value: "2026-03-07T10:30",
    });
  });

  it("submits an empty value while a part holds wrong text", () => {
    render(
      <form data-testid="form">
        <Input
          type="datetime-local"
          name="when"
          lang="it"
          value="2026-03-07T10:30"
          onChange={vi.fn()}
        />
      </form>,
    );
    const form = screen.getByTestId("form") as HTMLFormElement;
    fireEvent.change(dayField(), { target: { value: "31/02/2026" } });
    expect(new FormData(form).get("when")).toBe("");
    fireEvent.blur(dayField());
    expect(new FormData(form).get("when")).toBe("2026-03-07T10:30");
  });

  it("compares limits by value, so 10:30:00 is within a 10:30 maximum", () => {
    const onChange = vi.fn();
    render(
      <Input
        type="datetime-local"
        step={1}
        lang="it"
        value=""
        max="2026-03-07T10:30"
        onChange={(event) => onChange(event.target.value)}
      />,
    );
    fireEvent.change(dayField(), { target: { value: "07/03/2026" } });
    fireEvent.change(timeField(), { target: { value: "103000" } });
    // Accepted, and written as a native datetime-local writes 10:30:00.
    expect(onChange).toHaveBeenLastCalledWith("2026-03-07T10:30");
    fireEvent.change(timeField(), { target: { value: "103001" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(timeField()).toHaveAttribute("aria-invalid", "true");
  });

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
