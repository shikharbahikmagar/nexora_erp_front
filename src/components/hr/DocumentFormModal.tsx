"use client";

import FieldError from "@/components/company/FieldError";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  useCreateEmployeeDocumentMutation,
  useUpdateEmployeeDocumentMutation,
} from "@/hooks/employee/useEmployeeDocuments";
import { getApiErrorMessage } from "@/lib/errors";
import type { EmployeeDocument } from "@/services/employee/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface DocumentFormModalProps {
  isOpen: boolean;
  employeeId: number | null;
  document?: EmployeeDocument | null;
  onClose: () => void;
}

interface DocumentFormValues {
  document_type: string;
  document: string;
}

const DocumentFormModal: React.FC<DocumentFormModalProps> = ({
  isOpen,
  employeeId,
  document,
  onClose,
}) => {
  const t = useTranslations("hrManagement");
  const createMutation = useCreateEmployeeDocumentMutation();
  const updateMutation = useUpdateEmployeeDocumentMutation();
  const isEditing = Boolean(document);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const resolvedEmployeeId = document?.employee_id ?? employeeId;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentFormValues>({
    defaultValues: {
      document_type: document?.document_type ?? "",
      document: document?.document ?? "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        document_type: document?.document_type ?? "",
        document: document?.document ?? "",
      });
    }
  }, [document, isOpen, reset]);

  const onSubmit = (values: DocumentFormValues) => {
    const payload = {
      document_type: values.document_type.trim(),
      document: values.document.trim(),
    };

    if (document) {
      updateMutation.mutate(
        { documentId: document.id, payload },
        { onSuccess: onClose },
      );
      return;
    }

    if (!resolvedEmployeeId) {
      return;
    }

    createMutation.mutate(
      { employeeId: resolvedEmployeeId, payload },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-xl p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing
          ? t("documents.editTitle")
          : t("documents.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("common.requiredHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="document-type">
            {t("common.documentType")}{" "}
            <span className="text-error-500">*</span>
          </Label>
          <Input
            id="document-type"
            placeholder="passport, contract, certificate…"
            {...register("document_type", {
              required: t("validation.required"),
            })}
            error={Boolean(errors.document_type)}
          />
          <FieldError message={errors.document_type?.message} />
        </div>

        <div>
          <Label htmlFor="document-url">
            {t("common.documentUrl")}{" "}
            <span className="text-error-500">*</span>
          </Label>
          <Input
            id="document-url"
            placeholder="https://…"
            {...register("document", {
              required: t("validation.required"),
            })}
            error={Boolean(errors.document)}
          />
          <FieldError message={errors.document?.message} />
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

export default DocumentFormModal;
