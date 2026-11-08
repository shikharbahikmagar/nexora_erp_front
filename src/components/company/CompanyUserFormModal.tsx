"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  useCreateCompanyUserMutation,
  useUpdateCompanyUserMutation,
} from "@/hooks/company/useCompanyUsers";
import { getApiErrorMessage } from "@/lib/errors";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import type { Company, CompanyUser } from "@/services/company/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FieldError from "./FieldError";
import SelectInput from "./SelectInput";

interface CompanyUserFormModalProps {
  isOpen: boolean;
  companies: Company[];
  companyUser?: CompanyUser | null;
  onClose: () => void;
}

interface CompanyUserFormValues {
  company_id: string;
  name: string;
  email: string;
  password: string;
  user_id: string;
  is_active: string;
}

const toFormValues = (
  companyUser?: CompanyUser | null,
): CompanyUserFormValues => ({
  company_id: companyUser ? String(companyUser.company.id) : "",
  name: companyUser?.user.name ?? "",
  email: companyUser?.user.email ?? "",
  password: "",
  user_id: companyUser ? String(companyUser.user.id) : "",
  is_active: String(companyUser?.is_active ?? true),
});

const CompanyUserFormModal: React.FC<CompanyUserFormModalProps> = ({
  isOpen,
  companies,
  companyUser,
  onClose,
}) => {
  const t = useTranslations("companyManagement");
  const [showPassword, setShowPassword] = useState(false);
  const createMutation = useCreateCompanyUserMutation();
  const updateMutation = useUpdateCompanyUserMutation();
  const isEditing = Boolean(companyUser);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyUserFormValues>({
    defaultValues: toFormValues(companyUser),
  });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(companyUser));
    }
  }, [companyUser, isOpen, reset]);

  const onSubmit = (values: CompanyUserFormValues) => {
    if (companyUser) {
      updateMutation.mutate(
        {
          companyUserId: companyUser.id,
          payload: {
            user_id: Number(values.user_id),
            is_active: values.is_active === "true",
          },
        },
        { onSuccess: onClose },
      );
      return;
    }

    const companyId = Number(values.company_id);

    if (!companyId) {
      return;
    }

    createMutation.mutate(
      {
        companyId,
        payload: {
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          is_active: values.is_active === "true",
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="custom-scrollbar m-4 max-h-[90vh] max-w-xl overflow-y-auto p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing ? t("users.editTitle") : t("users.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {isEditing ? t("common.requiredHint") : t("users.createHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {isEditing ? (
          <div>
            <Label>{t("common.company")}</Label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {companyUser?.company.name}
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="company-user-company">
              {t("common.company")} <span className="text-error-500">*</span>
            </Label>
            <SelectInput
              id="company-user-company"
              placeholder={t("common.selectCompany")}
              options={companies.map((company) => ({
                value: String(company.id),
                label: company.name,
              }))}
              {...register("company_id", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.company_id)}
            />
            <FieldError message={errors.company_id?.message} />
          </div>
        )}

        <div>
          <Label htmlFor="company-user-name">
            {t("common.name")} <span className="text-error-500">*</span>
          </Label>
          <Input
            id="company-user-name"
            {...register("name", { required: t("validation.required") })}
            error={Boolean(errors.name)}
            disabled={isEditing}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="company-user-email">
            {t("common.email")} <span className="text-error-500">*</span>
          </Label>
          <Input
            id="company-user-email"
            type="email"
            {...register("email", {
              required: t("validation.required"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("validation.email"),
              },
            })}
            error={Boolean(errors.email)}
            disabled={isEditing}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {isEditing ? (
          <div>
            <Label htmlFor="company-user-user">
              {t("common.userId")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="company-user-user"
              type="number"
              min={1}
              {...register("user_id", {
                required: t("validation.required"),
                min: { value: 1, message: t("validation.positive") },
              })}
              error={Boolean(errors.user_id)}
            />
            <FieldError message={errors.user_id?.message} />
          </div>
        ) : (
          <div>
            <Label htmlFor="company-user-password">
              {t("common.password")} <span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="company-user-password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: t("validation.required"),
                  minLength: {
                    value: 8,
                    message: t("validation.passwordMin"),
                  },
                })}
                error={Boolean(errors.password)}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
            <FieldError message={errors.password?.message} />
          </div>
        )}

        <div>
          <Label htmlFor="company-user-active">{t("common.status")}</Label>
          <SelectInput
            id="company-user-active"
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
          <Button
            type="submit"
            disabled={isPending || (!isEditing && companies.length === 0)}
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

export default CompanyUserFormModal;
