import React, { useState, ReactNode, useMemo, useCallback } from "react";

import { Toast, ToastProps } from "lib/components/Toast/Toast";
import { type ToastVariantProps } from "@styled/recipes";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { ToastContext } from "./ToastContext";
import { nanoid } from "nanoid";
import "./toast.css";

type TToastPosition = ToastVariantProps["position"];

export interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
}: ToastProviderProps) => {
  const [position, setPosition] = useState<TToastPosition>("bottom-right");
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const classValue = useMemo(() => {
    return `toast-container toast-container--${position}`;
  }, [position]);

  /**
   * @param props - The props of the toast
   */
  const showToast = (props: ToastProps) => {
    const id = nanoid();

    // eslint-disable-next-line react/prop-types
    if (props.position) setPosition(props.position);
    setToasts((prevToasts) => [...prevToasts, { ...props, id, open: true }]);

    return id;
  };

  /**
   * It does set the open property of the toast to false, which will trigger the closing animation.
   * @param id - The id of the toast to close, if not provided all toasts will be closed
   */
  const closeToast = useCallback((id?: string) => {
    if (id) {
      setToasts((prevToasts) =>
        prevToasts.map((toast) =>
          toast.id === id ? { ...toast, open: false } : toast,
        ),
      );
    } else {
      setToasts((prevToasts) =>
        prevToasts.map((toast) => ({ ...toast, open: false })),
      );
    }
  }, []);

  /**
   * @param id - The id of the toast to remove
   */
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const handleOpenChange = useCallback(
    (open: boolean, toastProps: ToastProps) => {
      if (!open) closeToast(toastProps.id);
      if (toastProps.onOpenChange) toastProps.onOpenChange(open);
    },
    [closeToast],
  );

  const contextValue = useMemo(() => {
    return { showToast, closeToast };
  }, [closeToast]);

  return (
    <ToastPrimitive.Provider>
      <ToastContext.Provider value={contextValue}>
        {children}
        {toasts.map((toastProps) => (
          <Toast
            key={toastProps.id}
            {...toastProps}
            onOpenChange={(open) => handleOpenChange(open, toastProps)}
            onAnimationEnd={() => removeToast(toastProps.id!)}
          />
        ))}
        <ToastPrimitive.Viewport className={classValue} />
      </ToastContext.Provider>
    </ToastPrimitive.Provider>
  );
};
