import type React from "react";
import { ChevronDownIcon } from "@/icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  wrapperClassName?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  options,
  placeholder,
  error = false,
  wrapperClassName = "",
  className = "",
  ...props
}) => {
  const baseClasses =
    "h-11 w-full appearance-none rounded-lg border bg-transparent px-4 py-2.5 pe-10 text-sm shadow-theme-xs focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90";
  const stateClasses = error
    ? "border-error-500 text-gray-800 focus:border-error-300 focus:ring-error-500/20 dark:border-error-500 dark:focus:border-error-800"
    : "border-gray-300 text-gray-800 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800";

  return (
    <div className={`relative ${wrapperClassName}`}>
      <select
        className={`${baseClasses} ${stateClasses} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" className="text-gray-700 dark:bg-gray-900">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-e-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
        <ChevronDownIcon />
      </span>
    </div>
  );
};

export default SelectInput;
