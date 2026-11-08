"use client";

import { useMyCompany } from "@/hooks/company/useCompany";
import { GroupIcon, MailIcon } from "@/icons";
import { useTranslations } from "next-intl";
import StatusBadge from "./StatusBadge";

const MyCompanyCard = () => {
  const t = useTranslations("companyManagement");
  const { data, isLoading, isError } = useMyCompany();

  if (isError) {
    return null;
  }

  const company = data?.data;
  const branchCount = Array.isArray(company?.branches)
    ? company.branches.length
    : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          <div className="h-4 w-64 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
              <GroupIcon className="size-6" />
            </div>
            <div>
              <p className="text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                {t("myCompany.title")}
              </p>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {company?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {company?.code}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {company?.contact.email && (
              <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MailIcon className="size-4" />
                {company.contact.email}
              </span>
            )}
            {branchCount !== null && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t("myCompany.branchCount", { count: branchCount })}
              </span>
            )}
            <StatusBadge active={company?.is_active} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCompanyCard;
