import { definePreset } from "@pandacss/dev";
import { accordionRecipe } from "./components/Accordion/Accordion.recipe";
import { avatarRecipe } from "./components/Avatar/Avatar.recipe";
import { badgeRecipe } from "./components/Badge/Badge.recipe";
import { bottomSheetRecipe } from "./components/BottomSheet/BottomSheet.recipe";
import { buttonRecipe } from "./components/Button/Button.recipe";
import { checkboxRecipe } from "./components/Checkbox/Checkbox.recipe";
import { codeBlockRecipe } from "./components/CodeBlock/CodeBlock.recipe";
import { datePickerMonthRecipe } from "./components/DatePickerMonth/DatePickerMonth.recipe";
import { datePickerYearRecipe } from "./components/DatePickerYear/DatePickerYear.recipe";
import { dialogRecipe } from "./components/Dialog/Dialog.recipe";
import { dropdownMenuRecipe } from "./components/DropdownMenu/DropdownMenu.recipe";
import { filterChipBarRecipe } from "./components/FilterChipBar/FilterChipBar.recipe";
import { inputRecipe } from "./components/Input/Input.recipe";
import { labelRecipe } from "./components/Label/Label.recipe";
import { listRecipe } from "./components/List/List.recipe";
import { monthStepperRecipe } from "./components/MonthStepper/MonthStepper.recipe";
import { numberStepperRecipe } from "./components/NumberStepper/NumberStepper.recipe";
import { paginationRecipe } from "./components/Pagination/Pagination.recipe";
import { popoverRecipe } from "./components/Popover/Popover.recipe";
import { progressRecipe } from "./components/Progress/Progress.recipe";
import { rangeDatePickerRecipe } from "./components/RangeDatePicker/RangeDatePicker.recipe";
import { selectRecipe } from "./components/Select/Select.recipe";
import { selectTagsRecipe } from "./components/SelectTags/SelectTags.recipe";
import { sidebarRecipe } from "./components/Sidebar/Sidebar.recipe";
import { spinnerRecipe } from "./components/Spinner/Spinner.recipe";
import { stepperRecipe } from "./components/Stepper/Stepper.recipe";
import { tabRecipe } from "./components/Tab/Tab.recipe";
import { tableRecipe } from "./components/Table/Table.recipe";
import { textAreaRecipe } from "./components/TextArea/TextArea.recipe";
import { toastRecipe } from "./components/Toast/Toast.recipe";
import { toggleSwitchRecipe } from "./components/ToggleSwitch/ToggleSwitch.recipe";
import { tooltipRecipe } from "./components/Tooltip/Tooltip.recipe";
import { fileUploadRecipe } from "./components/FileUpload/FileUpload.recipe";

export const preset = definePreset({
  name: "aitho",
  theme: {
    slotRecipes: {
      accordion: accordionRecipe,
      avatar: avatarRecipe,
      badge: badgeRecipe,
      bottomSheet: bottomSheetRecipe,
      button: buttonRecipe,
      checkbox: checkboxRecipe,
      codeBlock: codeBlockRecipe,
      datePickerMonth: datePickerMonthRecipe,
      datePickerYear: datePickerYearRecipe,
      dialog: dialogRecipe,
      dropdownMenu: dropdownMenuRecipe,
      filterChipBar: filterChipBarRecipe,
      input: inputRecipe,
      label: labelRecipe,
      list: listRecipe,
      monthStepper: monthStepperRecipe,
      numberStepper: numberStepperRecipe,
      pagination: paginationRecipe,
      popover: popoverRecipe,
      progress: progressRecipe,
      rangeDatePicker: rangeDatePickerRecipe,
      select: selectRecipe,
      selectTags: selectTagsRecipe,
      sidebar: sidebarRecipe,
      spinner: spinnerRecipe,
      stepper: stepperRecipe,
      tab: tabRecipe,
      table: tableRecipe,
      textArea: textAreaRecipe,
      toast: toastRecipe,
      toggleSwitch: toggleSwitchRecipe,
      tooltip: tooltipRecipe,
      fileUpload: fileUploadRecipe,
    },
  },
  staticCss: {
    recipes: {
      accordion: ["*"],
      avatar: ["*"],
      badge: ["*"],
      bottomSheet: ["*"],
      button: ["*"],
      checkbox: ["*"],
      codeBlock: ["*"],
      datePickerMonth: ["*"],
      datePickerYear: ["*"],
      dialog: ["*"],
      dropdownMenu: ["*"],
      filterChipBar: ["*"],
      input: ["*"],
      label: ["*"],
      list: ["*"],
      monthStepper: ["*"],
      numberStepper: ["*"],
      pagination: ["*"],
      popover: ["*"],
      progress: ["*"],
      rangeDatePicker: ["*"],
      select: ["*"],
      selectTags: ["*"],
      sidebar: ["*"],
      spinner: ["*"],
      stepper: ["*"],
      tab: ["*"],
      table: ["*"],
      textArea: ["*"],
      toast: ["*"],
      toggleSwitch: ["*"],
      tooltip: ["*"],
      fileUpload: ["*"],
    },
  },
});
