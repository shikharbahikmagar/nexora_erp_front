"use client";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useFetchCompanyDetail } from "@/hooks/company/useCompany";
import { getApiErrorMessage } from "@/lib/errors";
import { useTranslations } from "next-intl";
import StatusBadge from "./StatusBadge";

interface CompanyDetailModalProps {
  isOpen: boolean;
  companyId: number | null;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-end text-sm font-medium text-gray-800 dark:text-white/90">
      {value ?? "-"}
    </span>
  </div>
);

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  isOpen,
  companyId,
  onClose,
}) => {
  const t = useTranslations("companyManagement");
  const { data, isLoading, isError, error } =
    useFetchCompanyDetail(isOpen ? companyId : null);
  const company = data?.data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="custom-scrollbar m-4 max-h-[90vh] max-w-xl overflow-y-auto p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {t("companies.viewTitle")}
      </h3>

      {isLoading && (
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          {t("common.loading")}
        </p>
      )}

      {isError && (
        <p className="mt-6 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
          {getApiErrorMessage(error, t("errors.load"))}
        </p>
      )}

      {company && (
        <div className="mt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-800 dark:text-white/90">
                {company.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {company.code}
              </p>
            </div>
            <StatusBadge active={company.is_active} />
          </div>

          <DetailRow label={t("common.legalName")} value={company.legal_name} />
          <DetailRow
            label={t("common.registrationNumber")}
            value={company.registration_number}
          />
          <DetailRow label={t("common.taxNumber")} value={company.tax_number} />
          <DetailRow label={t("common.email")} value={company.contact.email} />
          <DetailRow label={t("common.phone")} value={company.contact.phone} />
          <DetailRow
            label={t("common.website")}
            value={company.contact.website}
          />
          <DetailRow
            label={t("common.address")}
            value={[
              company.address.address,
              company.address.city,
              company.address.state,
              company.address.country,
              company.address.postal_code,
            ]
              .filter(Boolean)
              .join(", ")}
          />

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/90">
              {t("myCompany.branches")}
            </p>
            {company.branches.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("common.noData")}
              </p>
            ) : (
              <ul className="space-y-2">
                {company.branches.map((branch) => (
                  <li
                    key={branch.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-800"
                  >
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {branch.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {branch.code}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          {t("actions.close")}
        </Button>
      </div>
    </Modal>
  );
};

export default CompanyDetailModal;
