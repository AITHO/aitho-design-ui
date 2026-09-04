import { CheckIcon } from "@radix-ui/react-icons";
import { stepper, type StepperVariantProps } from "@styled/recipes";
import * as React from "react";

export interface StepContext {
  /** If step is active. */
  isActive: boolean;

  /** If step is complete. */
  isComplete: boolean;

  /** The number of the step. */
  step: number;
}

export interface StepStatusProps {
  /** *(optional)*
   * The content of the step when completed.
   */
  complete?: React.ReactNode | ((props: StepContext) => React.ReactNode);

  /** *(optional)*
   * The content of the step when incompleted.
   */
  incomplete?: React.ReactNode | ((props: StepContext) => React.ReactNode);

  /** *(optional)*
   * The content of the step when activated.
   */
  active?: React.ReactNode | ((props: StepContext) => React.ReactNode);
}

export type StepProps = StepStatusProps & {
  /** The content of the step. */
  children: React.ReactNode;
};

/**
 * A step of the stepper.
 *
 * @param children - The content of the step.
 * @param complete - *(optional)* The content of the step when completed.
 * @param incomplete - *(optional)* The content of the step when incompleted.
 * @param active - *(optional)* he content of the step when activated.
 */

export const Step = ({
  children,
}:
  | Pick<
      StepProps,
      "children"
    > /** Pick for SonarQube false positive workaround */
  | StepProps) => {
  return <>{children}</>;
};

Step.displayName = "Step";

export type StepperProps = Omit<StepperVariantProps, "status"> & {
  /** The active step index. */
  index: number;

  /** The content of the stepper. */
  children: React.ReactElement<StepProps>[];
};

/**
 * A navigation bar that guides users through the steps of a task.
 *
 * @param index - The active step index.
 * @param children - The content of the stepper.
 * @param orientation - *(optional)* The orientation of the stepper. Options: 'horizontal', 'vertical'.
 */

export const Stepper: React.FC<StepperProps> = ({
  index,
  children,
  orientation,
  ...props
}) => {
  const validChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<StepProps> =>
      React.isValidElement(child) && child.type === Step,
  );

  const baseClasses = stepper({ orientation }).root;

  const getStepStatus = (
    isActive: boolean,
    isComplete: boolean,
  ): StepperVariantProps["status"] => {
    if (isActive) {
      return "active";
    }
    if (isComplete) {
      return "complete";
    }
    return "incomplete";
  };

  return (
    <div className={baseClasses} data-testid="stepper-root" {...props}>
      {validChildren.map((child, i) => {
        const isLast = i === validChildren.length - 1;
        const isActive = i === index;
        const isComplete = i < index;
        const status = getStepStatus(isActive, isComplete);

        const stepClasses = stepper({ status, orientation });
        const context: StepContext = {
          isActive,
          isComplete,
          step: i + 1,
        };

        const renderProp = (
          prop:
            | React.ReactNode
            | ((props: StepContext) => React.ReactNode)
            | undefined,
          context: StepContext,
        ) => {
          if (!prop) return null;
          return typeof prop === "function" ? prop(context) : prop;
        };

        const renderStatus = () => {
          if (isComplete) {
            const complete = renderProp(child.props.complete, context);
            return complete || <CheckIcon />;
          }
          if (isActive) {
            const active = renderProp(child.props.active, context);
            return active || context.step;
          }
          const incomplete = renderProp(child.props.incomplete, context);
          return incomplete || context.step;
        };

        return (
          <React.Fragment key={`stepper-step-${child.key}`}>
            <div className={stepClasses.step} data-testid="stepper-step">
              <div
                className={stepClasses.indicator}
                data-testid={`stepper-indicator-${status}`}
                aria-current={isActive && "step"}
              >
                {renderStatus()}
              </div>
              <div
                className={stepClasses.content}
                data-testid="stepper-content"
              >
                {child.props.children}
              </div>
            </div>
            {!isLast && (
              <hr
                className={stepClasses.separator}
                data-testid="stepper-separator"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

Stepper.displayName = "Stepper";
