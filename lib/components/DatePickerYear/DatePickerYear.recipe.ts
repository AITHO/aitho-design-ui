import { defineSlotRecipe } from "@pandacss/dev";
import {
  pickerGridStyles,
  pickerPanelStyles,
} from "../DatePickerMonth/DatePickerMonth.recipe";

export const datePickerYearRecipe = defineSlotRecipe({
  className: "date-picker-year",
  slots: ["popoverContent", "header", "yearsGrid", "yearHeader", "clearButton"],
  base: {
    ...pickerPanelStyles,
    yearsGrid: {
      ...pickerGridStyles,
      "& > *:first-child": {
        gridColumnStart: 2,
      },
    },
  },
});
