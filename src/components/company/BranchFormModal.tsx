"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "@/hooks/company/useBranches";
import { getApiErrorMessage } from "@/lib/errors";
import type {
  Branch,
  CreateBranchPayload,
  UpdateBranchPayload,
} from "@/services/company/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FieldError from "./FieldError";
import SelectInput from "./SelectInput";
import TextArea from "./TextArea";

interface BranchFormModalProps {
  isOpen: boolean;
  companyId: number | null;
  branch?: Branch | null;
  onClose: () => void;
}

interface BranchFormValues {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  manager_name: string;
  timezone: string;
  is_head_office: string;
  is_active: string;
  description: string;
}

const emptyToNull = (value: string) => (value.trim() ? value.trim() : null);

const toNumberOrNull = (value: string) => {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const toFormValues = (branch?: Branch | null): BranchFormValues => ({
  name: branch?.name ?? "",
  code: branch?.code ?? "",
  email: branch?.email ?? "",
  phone: branch?.phone ?? "",
  address: branch?.address ?? "",
  city: branch?.city ?? "",
  state: branch?.state ?? "",
  country: branch?.country ?? "",
  postal_code: branch?.postal_code ?? "",
  latitude: branch?.latitude ?? "",
  longitude: branch?.longitude ?? "",
  manager_name: branch?.manager_name ?? "",
  timezone: branch?.timezone ?? "",
  is_head_office: String(branch?.is_head_office ?? false),
  is_active: String(branch?.is_active ?? true),
  description: branch?.description ?? "",
});

const BranchFormModal: React.FC<BranchFormModalProps> = ({
  isOpen,
  companyId,
  branch,
  onClose,
}) => {
  const t = useTranslations("companyManagement");
  const createMutation = useCreateBranchMutation();
  const updateMutation = useUpdateBranchMutation();
  const isEditing = Boolean(branch);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormValues>({ defaultValues: toFormValues(branch) });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(branch));
    }
  }, [branch, isOpen, reset]);

  const onSubmit = (values: BranchFormValues) => {
    const payload: UpdateBranchPayload = {
      name: values.name.trim(),
      code: values.code.trim(),
      email: emptyToNull(values.email),
      phone: emptyToNull(values.phone),
      address: emptyToNull(values.address),
      city: emptyToNull(values.city),
      state: emptyToNull(values.state),
      country: emptyToNull(values.country),
      postal_code: emptyToNull(values.postal_code),
      latitude: toNumberOrNull(values.latitude),
      longitude: toNumberOrNull(values.longitude),
      manager_name: emptyToNull(values.manager_name),
      timezone: emptyToNull(values.timezone),
      is_head_office: values.is_head_office === "true",
      is_active: values.is_active === "true",
      description: emptyToNull(values.description),
    };

    if (branch) {
      updateMutation.mutate(
        { branchId: branch.id, payload },
        { onSuccess: onClose },
      );
      return;
    }

    if (companyId === null) {
      return;
    }

    const createPayload: CreateBranchPayload = {
      ...payload,
      company_id: companyId,
    };

    createMutation.mutate(createPayload, { onSuccess: onClose });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="custom-scrollbar m-4 max-h-[90vh] max-w-2xl overflow-y-auto p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing ? t("branches.editTitle") : t("branches.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("common.requiredHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="branch-name">
              {t("common.name")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="branch-name"
              {...register("name", { required: t("validation.required") })}
              error={Boolean(errors.name)}
            />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="branch-code">
              {t("common.code")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="branch-code"
              {...register("code", { required: t("validation.required") })}
              error={Boolean(errors.code)}
            />
            <FieldError message={errors.code?.message} />
          </div>

          <div>
            <Label htmlFor="branch-email">{t("common.email")}</Label>
            <Input
              id="branch-email"
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
            <Label htmlFor="branch-phone">{t("common.phone")}</Label>
            <Input id="branch-phone" {...register("phone")} />
          </div>

          <div>
            <Label htmlFor="branch-manager">{t("common.managerName")}</Label>
            <Input id="branch-manager" {...register("manager_name")} />
          </div>

          <div>
            <Label htmlFor="branch-timezone">{t("common.timezone")}</Label>
            <Input
              id="branch-timezone"
              placeholder="UTC"
              {...register("timezone")}
            />
          </div>

          <div>
            <Label htmlFor="branch-city">{t("common.city")}</Label>
            <Input id="branch-city" {...register("city")} />
          </div>

          <div>
            <Label htmlFor="branch-state">{t("common.state")}</Label>
            <Input id="branch-state" {...register("state")} />
          </div>

          <div>
            <Label htmlFor="branch-country">{t("common.country")}</Label>
            <Input id="branch-country" {...register("country")} />
          </div>

          <div>
            <Label htmlFor="branch-postal">{t("common.postalCode")}</Label>
            <Input id="branch-postal" {...register("postal_code")} />
          </div>

          <div>
            <Label htmlFor="branch-latitude">Latitude</Label>
            <Input
              id="branch-latitude"
              type="number"
              step={0.000001}
              {...register("latitude")}
            />
          </div>

          <div>
            <Label htmlFor="branch-longitude">Longitude</Label>
            <Input
              id="branch-longitude"
              type="number"
              step={0.000001}
              {...register("longitude")}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="branch-address">{t("common.address")}</Label>
            <TextArea id="branch-address" rows={2} {...register("address")} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="branch-description">
              {t("common.description")}
            </Label>
            <TextArea
              id="branch-description"
              rows={2}
              {...register("description")}
            />
          </div>

          <div>
            <Label htmlFor="branch-head-office">
              {t("common.headOffice")}
            </Label>
            <SelectInput
              id="branch-head-office"
              options={[
                { value: "true", label: t("common.yes") },
                { value: "false", label: t("common.no") },
              ]}
              {...register("is_head_office")}
            />
          </div>

          <div>
            <Label htmlFor="branch-active">{t("common.status")}</Label>
            <SelectInput
              id="branch-active"
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

export default BranchFormModal;
