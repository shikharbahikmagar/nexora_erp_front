"use client";

import SelectInput from "@/components/company/SelectInput";
import { useFetchEmployees } from "@/hooks/employee/useEmployees";
import { useTranslations } from "next-intl";

interface EmployeeSelectProps {
  value: number | null;
  onChange: (employeeId: number | null) => void;
  wrapperClassName?: string;
  disabled?: boolean;
}

const EmployeeSelect: React.FC<EmployeeSelectProps> = ({
  value,
  onChange,
  wrapperClassName = "min-w-52",
  disabled = false,
}) => {
  const t = useTranslations("hrManagement");
  const { data, isLoading } = useFetchEmployees(100);
  const employees = data?.data ?? [];

  return (
    <SelectInput
      wrapperClassName={wrapperClassName}
      value={value ?? ""}
      disabled={disabled}
      onChange={(event) => {
        const nextValue = event.target.value;
        onChange(nextValue ? Number(nextValue) : null);
      }}
      placeholder={
        isLoading ? t("common.loading") : t("common.selectEmployee")
      }
      options={employees.map((employee) => ({
        value: String(employee.id),
        label: `${employee.first_name} ${employee.last_name} (${employee.employee_code})`,
      }))}
    />
  );
};

export default EmployeeSelect;
