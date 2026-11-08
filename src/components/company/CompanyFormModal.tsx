"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} from "@/hooks/company/useCompany";
import { getApiErrorMessage } from "@/lib/errors";
import type { Company, CreateCompanyPayload } from "@/services/company/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FieldError from "./FieldError";
import SelectInput from "./SelectInput";
import TextArea from "./TextArea";

interface CompanyFormModalProps {
  isOpen: boolean;
  company?: Company | null;
  onClose: () => void;
}

interface CompanyFormValues {
  name: string;
  code: string;
  legal_name: string;
  registration_number: string;
  tax_number: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  logo: string;
  is_active: string;
}

const emptyToNull = (value: string) => (value.trim() ? value.trim() : null);

const toFormValues = (company?: Company | null): CompanyFormValues => ({
  name: company?.name ?? "",
  code: company?.code ?? "",
  legal_name: company?.legal_name ?? "",
  registration_number: company?.registration_number ?? "",
  tax_number: company?.tax_number ?? "",
  email: company?.email ?? "",
  phone: company?.phone ?? "",
  website: company?.website ?? "",
  address: company?.address ?? "",
  city: company?.city ?? "",
  state: company?.state ?? "",
  country: company?.country ?? "",
  postal_code: company?.postal_code ?? "",
  logo: company?.logo ?? "",
  is_active: String(company?.is_active ?? true),
});

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  isOpen,
  company,
  onClose,
}) => {
  const t = useTranslations("companyManagement");
  const createMutation = useCreateCompanyMutation();
  const updateMutation = useUpdateCompanyMutation();
  const isEditing = Boolean(company);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({ defaultValues: toFormValues(company) });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(company));
    }
  }, [company, isOpen, reset]);

  const onSubmit = (values: CompanyFormValues) => {
    const payload: CreateCompanyPayload = {
      name: values.name.trim(),
      code: values.code.trim(),
      legal_name: emptyToNull(values.legal_name),
      registration_number: emptyToNull(values.registration_number),
      tax_number: emptyToNull(values.tax_number),
      email: emptyToNull(values.email),
      phone: emptyToNull(values.phone),
      website: emptyToNull(values.website),
      address: emptyToNull(values.address),
      city: emptyToNull(values.city),
      state: emptyToNull(values.state),
      country: emptyToNull(values.country),
      postal_code: emptyToNull(values.postal_code),
      logo: emptyToNull(values.logo),
      is_active: values.is_active === "true",
    };

    if (company) {
      updateMutation.mutate(
        { companyId: company.id, payload },
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
      className="custom-scrollbar m-4 max-h-[90vh] max-w-2xl overflow-y-auto p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing ? t("companies.editTitle") : t("companies.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("common.requiredHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="company-name">
              {t("common.name")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="company-name"
              {...register("name", { required: t("validation.required") })}
              error={Boolean(errors.name)}
              placeholder="Acme Inc."
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="company-code">
              {t("common.code")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="company-code"
              {...register("code", { required: t("validation.required") })}
              error={Boolean(errors.code)}
              placeholder="ACME"
            />
            <FieldError message={errors.code?.message} />
          </div>

          <div>
            <Label htmlFor="company-legal-name">{t("common.legalName")}</Label>
            <Input id="company-legal-name" {...register("legal_name")} />
          </div>

          <div>
            <Label htmlFor="company-registration">
              {t("common.registrationNumber")}
            </Label>
            <Input
              id="company-registration"
              {...register("registration_number")}
            />
          </div>

          <div>
            <Label htmlFor="company-tax">{t("common.taxNumber")}</Label>
            <Input id="company-tax" {...register("tax_number")} />
          </div>

          <div>
            <Label htmlFor="company-email">{t("common.email")}</Label>
            <Input
              id="company-email"
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("validation.email"),
                },
              })}
              error={Boolean(errors.email)}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="company-phone">{t("common.phone")}</Label>
            <Input id="company-phone" {...register("phone")} />
          </div>

          <div>
            <Label htmlFor="company-website">{t("common.website")}</Label>
            <Input
              id="company-website"
              {...register("website", {
                pattern: {
                  value: /^https?:\/\/.+/i,
                  message: t("validation.url"),
                },
              })}
              error={Boolean(errors.website)}
              placeholder="https://example.com"
            />
            <FieldError message={errors.website?.message} />
          </div>

          <div>
            <Label htmlFor="company-city">{t("common.city")}</Label>
            <Input id="company-city" {...register("city")} />
          </div>

          <div>
            <Label htmlFor="company-state">{t("common.state")}</Label>
            <Input id="company-state" {...register("state")} />
          </div>

          <div>
            <Label htmlFor="company-country">{t("common.country")}</Label>
            <Input id="company-country" {...register("country")} />
          </div>

          <div>
            <Label htmlFor="company-postal">{t("common.postalCode")}</Label>
            <Input id="company-postal" {...register("postal_code")} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="company-address">{t("common.address")}</Label>
            <TextArea id="company-address" rows={2} {...register("address")} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="company-logo">{t("common.logo")}</Label>
            <Input id="company-logo" {...register("logo")} />
          </div>

          <div>
            <Label htmlFor="company-active">{t("common.status")}</Label>
            <SelectInput
              id="company-active"
              options={[
                { value: "true", label: t("common.active") },
                { value: "false", label: t("common.inactive") },
              ]}
              {...register("is_active")}
            />
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

export default CompanyFormModal;
