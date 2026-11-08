"use client";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  isPending = false,
  onClose,
  onConfirm,
}) => {
  const t = useTranslations("companyManagement.actions");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-md p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          {t("cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          className="bg-error-500 hover:bg-error-600"
        >
          {isPending ? t("deleting") : t("delete")}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
