import type { ToastProps } from "../../components/Toast/Toast";
import { createContext } from "react";

export interface ToastContextType {
  /**
   * Show a toast with the provided props.
   *
   * @param props - toast properties.
   * @returns The id of the toast created.
   */
  showToast: (props: ToastProps) => string;

  /**
   * Remove a toast by id. If no id is provided, all toasts will be removed.
   *
   * @param id - The id of the toast to remove.
   */
  closeToast: (id?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);
