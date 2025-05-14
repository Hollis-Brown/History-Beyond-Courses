import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ProgressStepItem {
  id: string;
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface ProgressStepsProps {
  steps: ProgressStepItem[];
  currentStep: number;
  className?: string;
}

export function ProgressSteps({
  steps,
  currentStep,
  className,
}: ProgressStepsProps) {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isDisabled = index > currentStep;

        return (
          <div
            key={step.id}
            className={cn("flex flex-col items-center relative", {
              "flex-1": index < steps.length - 1,
            })}
          >
            {/* Step circle */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors z-10",
                {
                  "bg-primary": isCompleted || isCurrent,
                  "bg-neutral-medium": isDisabled,
                }
              )}
            >
              {Icon && <Icon className="text-white text-sm" />}
            </div>

            {/* Step label */}
            <span
              className={cn(
                "text-sm font-medium transition-colors text-center",
                {
                  "text-primary": isCurrent,
                  "text-neutral-dark": isCompleted,
                  "text-neutral-medium": isDisabled,
                }
              )}
            >
              {step.label}
            </span>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-1 absolute top-4 left-[50%] w-[calc(100%-1rem)] transition-colors",
                  {
                    "bg-primary": isCompleted,
                    "bg-neutral-medium": !isCompleted,
                  }
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
