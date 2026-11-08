"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useFetchCompanyUsers } from "@/hooks/company/useCompanyUsers";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/hooks/employee/useEmployees";
import { getApiErrorMessage } from "@/lib/errors";
import { toDateInputValue } from "@/lib/format";
import type {
  CreateEmployeePayload,
  Employee,
} from "@/services/employee/types";
import { EMPLOYMENT_STATUSES } from "@/services/employee/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FieldError from "@/components/company/FieldError";
import SelectInput from "@/components/company/SelectInput";
import TextArea from "@/components/company/TextArea";

interface EmployeeFormModalProps {
  isOpen: boolean;
  employee?: Employee | null;
  onClose: () => void;
}

interface EmployeeFormValues {
  company_user_id: string;
  branch_id: string;
  employee_code: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  nationality: string;
  profile_photo: string;
  personal_email: string;
  phone: string;
  alternate_phone: string;
  joining_date: string;
  employment_type: string;
  employment_status: string;
  probation_end_date: string;
  confirmation_date: string;
  resignation_date: string;
  termination_date: string;
  termination_reason: string;
  notes: string;
}

const emptyToNull = (value: string) => (value.trim() ? value.trim() : null);

const toFormValues = (employee?: Employee | null): EmployeeFormValues => ({
  company_user_id: employee ? String(employee.company_user_id) : "",
  branch_id: employee?.branch_id ? String(employee.branch_id) : "",
  employee_code: employee?.employee_code ?? "",
  first_name: employee?.first_name ?? "",
  middle_name: employee?.middle_name ?? "",
  last_name: employee?.last_name ?? "",
  date_of_birth: toDateInputValue(employee?.date_of_birth),
  gender: employee?.gender ?? "",
  marital_status: employee?.marital_status ?? "",
  nationality: employee?.nationality ?? "",
  profile_photo: employee?.profile_photo ?? "",
  personal_email: employee?.personal_email ?? "",
  phone: employee?.phone ?? "",
  alternate_phone: employee?.alternate_phone ?? "",
  joining_date: toDateInputValue(employee?.joining_date),
  employment_type: employee?.employment_type ?? "",
  employment_status: employee?.employment_status ?? "active",
  probation_end_date: toDateInputValue(employee?.probation_end_date),
  confirmation_date: toDateInputValue(employee?.confirmation_date),
  resignation_date: toDateInputValue(employee?.resignation_date),
  termination_date: toDateInputValue(employee?.termination_date),
  termination_reason: employee?.termination_reason ?? "",
  notes: employee?.notes ?? "",
});

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  employee,
  onClose,
}) => {
  const t = useTranslations("hrManagement");
  const companyUsersQuery = useFetchCompanyUsers();
  const companyUsers = companyUsersQuery.data?.data ?? [];
  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const isEditing = Boolean(employee);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({ defaultValues: toFormValues(employee) });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(employee));
    }
  }, [employee, isOpen, reset]);

  const onSubmit = (values: EmployeeFormValues) => {
    const payload: CreateEmployeePayload = {
      company_user_id: Number(values.company_user_id),
      branch_id: values.branch_id ? Number(values.branch_id) : null,
      employee_code: values.employee_code.trim(),
      first_name: values.first_name.trim(),
      middle_name: emptyToNull(values.middle_name),
      last_name: values.last_name.trim(),
      date_of_birth: emptyToNull(values.date_of_birth),
      gender: emptyToNull(values.gender),
      marital_status: emptyToNull(values.marital_status),
      nationality: emptyToNull(values.nationality),
      profile_photo: emptyToNull(values.profile_photo),
      personal_email: emptyToNull(values.personal_email),
      phone: emptyToNull(values.phone),
      alternate_phone: emptyToNull(values.alternate_phone),
      joining_date: values.joining_date,
      employment_type: values.employment_type.trim(),
      employment_status: values.employment_status,
      probation_end_date: emptyToNull(values.probation_end_date),
      confirmation_date: emptyToNull(values.confirmation_date),
      resignation_date: emptyToNull(values.resignation_date),
      termination_date: emptyToNull(values.termination_date),
      termination_reason: emptyToNull(values.termination_reason),
      notes: emptyToNull(values.notes),
    };

    if (employee) {
      updateMutation.mutate(
        { employeeId: employee.id, payload },
        { onSuccess: onClose },
      );
      return;
    }

    createMutation.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="custom-scrollbar m-4 max-h-[90vh] max-w-3xl overflow-y-auto p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing ? t("employees.editTitle") : t("employees.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("common.requiredHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="employee-company-user">
              {t("common.companyUser")} <span className="text-error-500">*</span>
            </Label>
            <SelectInput
              id="employee-company-user"
              placeholder={t("common.selectCompanyUser")}
              options={companyUsers.map((companyUser) => ({
                value: String(companyUser.id),
                label: `${companyUser.user.name} — ${companyUser.company.name}`,
              }))}
              {...register("company_user_id", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.company_user_id)}
            />
            <FieldError message={errors.company_user_id?.message} />
          </div>

          <div>
            <Label htmlFor="employee-code">
              {t("common.employeeCode")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="employee-code"
              {...register("employee_code", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.employee_code)}
            />
            <FieldError message={errors.employee_code?.message} />
          </div>

          <div>
            <Label htmlFor="employee-first-name">
              {t("common.firstName")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="employee-first-name"
              {...register("first_name", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.first_name)}
            />
            <FieldError message={errors.first_name?.message} />
          </div>

          <div>
            <Label htmlFor="employee-last-name">
              {t("common.lastName")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="employee-last-name"
              {...register("last_name", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.last_name)}
            />
            <FieldError message={errors.last_name?.message} />
          </div>

          <div>
            <Label htmlFor="employee-middle-name">
              {t("common.middleName")}
            </Label>
            <Input id="employee-middle-name" {...register("middle_name")} />
          </div>

          <div>
            <Label htmlFor="employee-branch">
              {t("common.branchId")}
            </Label>
            <Input
              id="employee-branch"
              type="number"
              min={1}
              {...register("branch_id")}
            />
          </div>

          <div>
            <Label htmlFor="employee-dob">{t("common.dateOfBirth")}</Label>
            <Input
              id="employee-dob"
              type="date"
              {...register("date_of_birth")}
            />
          </div>

          <div>
            <Label htmlFor="employee-gender">{t("common.gender")}</Label>
            <Input id="employee-gender" {...register("gender")} />
          </div>

          <div>
            <Label htmlFor="employee-marital">
              {t("common.maritalStatus")}
            </Label>
            <Input id="employee-marital" {...register("marital_status")} />
          </div>

          <div>
            <Label htmlFor="employee-nationality">
              {t("common.nationality")}
            </Label>
            <Input id="employee-nationality" {...register("nationality")} />
          </div>

          <div>
            <Label htmlFor="employee-personal-email">
              {t("common.personalEmail")}
            </Label>
            <Input
              id="employee-personal-email"
              type="email"
              {...register("personal_email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("validation.email"),
                },
              })}
              error={Boolean(errors.personal_email)}
            />
            <FieldError message={errors.personal_email?.message} />
          </div>

          <div>
            <Label htmlFor="employee-phone">{t("common.phone")}</Label>
            <Input id="employee-phone" {...register("phone")} />
          </div>

          <div>
            <Label htmlFor="employee-alt-phone">
              {t("common.alternatePhone")}
            </Label>
            <Input id="employee-alt-phone" {...register("alternate_phone")} />
          </div>

          <div>
            <Label htmlFor="employee-photo">{t("common.profilePhoto")}</Label>
            <Input id="employee-photo" {...register("profile_photo")} />
          </div>

          <div>
            <Label htmlFor="employee-joining">
              {t("common.joiningDate")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <Input
              id="employee-joining"
              type="date"
              {...register("joining_date", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.joining_date)}
            />
            <FieldError message={errors.joining_date?.message} />
          </div>

          <div>
            <Label htmlFor="employee-employment-type">
              {t("common.employmentType")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <Input
              id="employee-employment-type"
              {...register("employment_type", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.employment_type)}
              placeholder="permanent"
            />
            <FieldError message={errors.employment_type?.message} />
          </div>

          <div>
            <Label htmlFor="employee-status">{t("common.employmentStatus")}</Label>
            <SelectInput
              id="employee-status"
              options={EMPLOYMENT_STATUSES.map((status) => ({
                value: status,
                label: t(`statuses.${status}`),
              }))}
              {...register("employment_status")}
            />
          </div>

          <div>
            <Label htmlFor="employee-probation">
              {t("common.probationEndDate")}
            </Label>
            <Input
              id="employee-probation"
              type="date"
              {...register("probation_end_date")}
            />
          </div>

          <div>
            <Label htmlFor="employee-confirmation">
              {t("common.confirmationDate")}
            </Label>
            <Input
              id="employee-confirmation"
              type="date"
              {...register("confirmation_date")}
            />
          </div>

          <div>
            <Label htmlFor="employee-resignation">
              {t("common.resignationDate")}
            </Label>
            <Input
              id="employee-resignation"
              type="date"
              {...register("resignation_date")}
            />
          </div>

          <div>
            <Label htmlFor="employee-termination">
              {t("common.terminationDate")}
            </Label>
            <Input
              id="employee-termination"
              type="date"
              {...register("termination_date")}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="employee-termination-reason">
              {t("common.terminationReason")}
            </Label>
            <TextArea
              id="employee-termination-reason"
              rows={2}
              {...register("termination_reason")}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="employee-notes">{t("common.notes")}</Label>
            <TextArea id="employee-notes" rows={2} {...register("notes")} />
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
          <Button type="submit" disabled={isPending}>
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

export default EmployeeFormModal;
