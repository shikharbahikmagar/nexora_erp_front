"use client";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";

export const isTruthy = (value: unknown) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  value === "true" ||
  value === "active";

interface StatusBadgeProps {
  active: unknown;
  className?: string;
  children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  active,
  className,
  children,
}) => {
  const t = useTranslations("companyManagement.common");
  const isActive = isTruthy(active);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-theme-xs font-medium",
        isActive
          ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
          : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500",
        className,
      )}
    >
      {children ?? (isActive ? t("active") : t("inactive"))}
    </span>
  );
};

export default StatusBadge;
