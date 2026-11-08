"use client";

import FieldError from "@/components/company/FieldError";
import SelectInput from "@/components/company/SelectInput";
import TextArea from "@/components/company/TextArea";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  useCreateEmployeeContractMutation,
  useUpdateEmployeeContractMutation,
} from "@/hooks/employee/useEmployeeContracts";
import { getApiErrorMessage } from "@/lib/errors";
import { toDateInputValue } from "@/lib/format";
import type {
  ContractStatus,
  ContractType,
  CreateEmployeeContractPayload,
  EmployeeContract,
  SalaryType,
  UpdateEmployeeContractPayload,
} from "@/services/employee/types";
import {
  CONTRACT_STATUSES,
  CONTRACT_TYPES,
  SALARY_TYPES,
} from "@/services/employee/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ContractFormModalProps {
  isOpen: boolean;
  employeeId: number | null;
  contract?: EmployeeContract | null;
  onClose: () => void;
}

interface ContractFormValues {
  contract_number: string;
  contract_type: ContractType;
  start_date: string;
  end_date: string;
  probation_start_date: string;
  probation_end_date: string;
  designation: string;
  department_id: string;
  branch_id: string;
  employment_status: ContractStatus;
  salary: string;
  salary_type: SalaryType;
  working_hours_per_week: string;
  work_schedule: string;
  notice_period_days: string;
  termination_date: string;
  termination_reason: string;
  notes: string;
}

const emptyToNull = (value: string) => (value.trim() ? value.trim() : null);

const toNumberOrNull = (value: string) => {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const toFormValues = (
  contract?: EmployeeContract | null,
): ContractFormValues => ({
  contract_number: contract?.contract_number ?? "",
  contract_type: contract?.contract_type ?? "permanent",
  start_date: toDateInputValue(contract?.start_date),
  end_date: toDateInputValue(contract?.end_date),
  probation_start_date: toDateInputValue(contract?.probation_start_date),
  probation_end_date: toDateInputValue(contract?.probation_end_date),
  designation: contract?.designation ?? "",
  department_id: contract?.department_id ? String(contract.department_id) : "",
  branch_id: contract?.branch_id ? String(contract.branch_id) : "",
  employment_status: contract?.employment_status ?? "draft",
  salary: contract?.salary ?? "",
  salary_type: contract?.salary_type ?? "monthly",
  working_hours_per_week: contract?.working_hours_per_week ?? "",
  work_schedule: contract?.work_schedule ?? "",
  notice_period_days: contract?.notice_period_days
    ? String(contract.notice_period_days)
    : "",
  termination_date: toDateInputValue(contract?.termination_date),
  termination_reason: contract?.termination_reason ?? "",
  notes: contract?.notes ?? "",
});

const ContractFormModal: React.FC<ContractFormModalProps> = ({
  isOpen,
  employeeId,
  contract,
  onClose,
}) => {
  const t = useTranslations("hrManagement");
  const createMutation = useCreateEmployeeContractMutation();
  const updateMutation = useUpdateEmployeeContractMutation();
  const isEditing = Boolean(contract);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const resolvedEmployeeId = contract?.employee_id ?? employeeId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractFormValues>({ defaultValues: toFormValues(contract) });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(contract));
    }
  }, [contract, isOpen, reset]);

  const onSubmit = (values: ContractFormValues) => {
    const payload: UpdateEmployeeContractPayload = {
      contract_number: values.contract_number.trim(),
      contract_type: values.contract_type,
      start_date: values.start_date,
      end_date: emptyToNull(values.end_date),
      probation_start_date: emptyToNull(values.probation_start_date),
      probation_end_date: emptyToNull(values.probation_end_date),
      designation: emptyToNull(values.designation),
      department_id: toNumberOrNull(values.department_id),
      branch_id: toNumberOrNull(values.branch_id),
      employment_status: values.employment_status,
      salary: Number(values.salary),
      salary_type: values.salary_type,
      working_hours_per_week: toNumberOrNull(values.working_hours_per_week),
      work_schedule: emptyToNull(values.work_schedule),
      notice_period_days: toNumberOrNull(values.notice_period_days),
      termination_date: emptyToNull(values.termination_date),
      termination_reason: emptyToNull(values.termination_reason),
      notes: emptyToNull(values.notes),
    };

    if (contract) {
      updateMutation.mutate(
        { contractId: contract.id, payload },
        { onSuccess: onClose },
      );
      return;
    }

    if (!resolvedEmployeeId) {
      return;
    }

    const createPayload: CreateEmployeeContractPayload = {
      ...payload,
      employee_id: resolvedEmployeeId,
    };

    createMutation.mutate(
      { employeeId: resolvedEmployeeId, payload: createPayload },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="custom-scrollbar m-4 max-h-[90vh] max-w-3xl overflow-y-auto p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing
          ? t("contracts.editTitle")
          : t("contracts.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("common.requiredHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="contract-number">
              {t("common.contractNumber")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <Input
              id="contract-number"
              {...register("contract_number", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.contract_number)}
            />
            <FieldError message={errors.contract_number?.message} />
          </div>

          <div>
            <Label htmlFor="contract-type">
              {t("common.contractType")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <SelectInput
              id="contract-type"
              options={CONTRACT_TYPES.map((type) => ({
                value: type,
                label: t(`contractTypes.${type}`),
              }))}
              {...register("contract_type", {
                required: t("validation.required"),
              })}
            />
          </div>

          <div>
            <Label htmlFor="contract-start">
              {t("common.startDate")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="contract-start"
              type="date"
              {...register("start_date", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.start_date)}
            />
            <FieldError message={errors.start_date?.message} />
          </div>

          <div>
            <Label htmlFor="contract-end">{t("common.endDate")}</Label>
            <Input id="contract-end" type="date" {...register("end_date")} />
          </div>

          <div>
            <Label htmlFor="contract-probation-start">
              {t("common.probationStartDate")}
            </Label>
            <Input
              id="contract-probation-start"
              type="date"
              {...register("probation_start_date")}
            />
          </div>

          <div>
            <Label htmlFor="contract-probation-end">
              {t("common.probationEndDate")}
            </Label>
            <Input
              id="contract-probation-end"
              type="date"
              {...register("probation_end_date")}
            />
          </div>

          <div>
            <Label htmlFor="contract-designation">
              {t("common.designation")}
            </Label>
            <Input id="contract-designation" {...register("designation")} />
          </div>

          <div>
            <Label htmlFor="contract-department">
              {t("common.departmentId")}
            </Label>
            <Input
              id="contract-department"
              type="number"
              min={1}
              {...register("department_id")}
            />
          </div>

          <div>
            <Label htmlFor="contract-branch">{t("common.branchId")}</Label>
            <Input
              id="contract-branch"
              type="number"
              min={1}
              {...register("branch_id")}
            />
          </div>

          <div>
            <Label htmlFor="contract-status">
              {t("common.contractStatus")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <SelectInput
              id="contract-status"
              options={CONTRACT_STATUSES.map((status) => ({
                value: status,
                label: t(`contractStatuses.${status}`),
              }))}
              {...register("employment_status", {
                required: t("validation.required"),
              })}
            />
          </div>

          <div>
            <Label htmlFor="contract-salary">
              {t("common.salary")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="contract-salary"
              type="number"
              min={0}
              step={0.01}
              {...register("salary", {
                required: t("validation.required"),
                min: { value: 0, message: t("validation.positive") },
              })}
              error={Boolean(errors.salary)}
            />
            <FieldError message={errors.salary?.message} />
          </div>

          <div>
            <Label htmlFor="contract-salary-type">
              {t("common.salaryType")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <SelectInput
              id="contract-salary-type"
              options={SALARY_TYPES.map((type) => ({
                value: type,
                label: t(`salaryTypes.${type}`),
              }))}
              {...register("salary_type", {
                required: t("validation.required"),
              })}
            />
          </div>

          <div>
            <Label htmlFor="contract-hours">
              {t("common.workingHoursPerWeek")}
            </Label>
            <Input
              id="contract-hours"
              type="number"
              min={0}
              max={168}
              step={0.5}
              {...register("working_hours_per_week")}
            />
          </div>

          <div>
            <Label htmlFor="contract-schedule">
              {t("common.workSchedule")}
            </Label>
            <Input id="contract-schedule" {...register("work_schedule")} />
          </div>

          <div>
            <Label htmlFor="contract-notice">
              {t("common.noticePeriodDays")}
            </Label>
            <Input
              id="contract-notice"
              type="number"
              min={0}
              {...register("notice_period_days")}
            />
          </div>

          <div>
            <Label htmlFor="contract-termination">
              {t("common.terminationDate")}
            </Label>
            <Input
              id="contract-termination"
              type="date"
              {...register("termination_date")}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="contract-termination-reason">
              {t("common.terminationReason")}
            </Label>
            <TextArea
              id="contract-termination-reason"
              rows={2}
              {...register("termination_reason")}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="contract-notes">{t("common.notes")}</Label>
            <TextArea id="contract-notes" rows={2} {...register("notes")} />
          </div>
        </div>

        {mutationError && (
          <p className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
            {getApiErrorMessage(mutationError, t("errors.save"))}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t("actions.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isPending || resolvedEmployeeId === null}
          >
            {isPending
              ? isEditing
                ? t("actions.saving")
                : t("actions.creating")
              : isEditing
                ? t("actions.save")
                : t("actions.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ContractFormModal;
