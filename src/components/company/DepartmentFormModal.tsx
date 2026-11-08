"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "@/hooks/company/useDepartments";
import { getApiErrorMessage } from "@/lib/errors";
import type {
  CreateDepartmentPayload,
  Department,
} from "@/services/company/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FieldError from "./FieldError";
import SelectInput from "./SelectInput";
import TextArea from "./TextArea";

interface DepartmentFormModalProps {
  isOpen: boolean;
  companyId: number | null;
  department?: Department | null;
  onClose: () => void;
}

interface DepartmentFormValues {
  name: string;
  code: string;
  description: string;
  is_active: string;
}

const emptyToNull = (value: string) => (value.trim() ? value.trim() : null);

const toFormValues = (department?: Department | null): DepartmentFormValues => ({
  name: department?.name ?? "",
  code: department?.code ?? "",
  description: department?.description ?? "",
  is_active: String(department?.is_active ?? true),
});

const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  isOpen,
  companyId,
  department,
  onClose,
}) => {
  const t = useTranslations("companyManagement");
  const createMutation = useCreateDepartmentMutation();
  const updateMutation = useUpdateDepartmentMutation();
  const isEditing = Boolean(department);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    defaultValues: toFormValues(department),
  });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(department));
    }
  }, [department, isOpen, reset]);

  const onSubmit = (values: DepartmentFormValues) => {
    const payload = {
      name: values.name.trim(),
      code: emptyToNull(values.code),
      description: emptyToNull(values.description),
      is_active: values.is_active === "true",
    };

    if (department) {
      updateMutation.mutate(
        { departmentId: department.id, payload },
        { onSuccess: onClose },
      );
      return;
    }

    if (companyId === null) {
      return;
    }

    const createPayload: CreateDepartmentPayload = {
      ...payload,
      company_id: companyId,
    };

    createMutation.mutate(createPayload, { onSuccess: onClose });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-xl p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing
          ? t("departments.editTitle")
          : t("departments.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("common.requiredHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="department-name">
            {t("common.name")} <span className="text-error-500">*</span>
          </Label>
          <Input
            id="department-name"
            {...register("name", { required: t("validation.required") })}
            error={Boolean(errors.name)}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="department-code">{t("common.code")}</Label>
          <Input id="department-code" {...register("code")} />
        </div>

        <div>
          <Label htmlFor="department-description">
            {t("common.description")}
          </Label>
          <TextArea
            id="department-description"
            rows={3}
            {...register("description")}
          />
        </div>

        <div>
          <Label htmlFor="department-active">{t("common.status")}</Label>
          <SelectInput
            id="department-active"
            options={[
              { value: "true", label: t("common.active") },
              { value: "false", label: t("common.inactive") },
            ]}
            {...register("is_active")}
          />
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
          <Button type="submit" disabled={isPending || companyId === null}>
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

export default DepartmentFormModal;
