"use client";

import SelectInput from "@/components/company/SelectInput";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAssignRoleMutation } from "@/hooks/user/useAssignRole";
import { getApiErrorMessage } from "@/lib/errors";
import type { CompanyUser } from "@/services/company/types";
import { USER_ROLES, type UserRole } from "@/services/employee/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AssignRoleModalProps {
  isOpen: boolean;
  companyUser: CompanyUser | null;
  onClose: () => void;
}

interface AssignRoleFormValues {
  role: UserRole;
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  companyUser,
  onClose,
}) => {
  const t = useTranslations("companyManagement");
  const mutation = useAssignRoleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignRoleFormValues>({
    defaultValues: { role: "employee" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ role: "employee" });
    }
  }, [isOpen, reset]);

  const onSubmit = (values: AssignRoleFormValues) => {
    if (!companyUser) {
      return;
    }

    mutation.mutate(
      { userId: companyUser.user.id, payload: values },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-md p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {t("users.assignRoleTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {companyUser?.user.name} · {companyUser?.user.email}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="assign-role">
            {t("common.role")} <span className="text-error-500">*</span>
          </Label>
          <SelectInput
            id="assign-role"
            placeholder={t("common.selectRole")}
            options={USER_ROLES.map((role) => ({
              value: role,
              label: t(`roles.${role}`),
            }))}
            {...register("role", { required: t("validation.required") })}
            error={Boolean(errors.role)}
          />
        </div>

        {mutation.error && (
          <p className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
            {getApiErrorMessage(mutation.error, t("errors.save"))}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            {t("actions.cancel")}
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? t("actions.saving")
              : t("actions.assignRole")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignRoleModal;
