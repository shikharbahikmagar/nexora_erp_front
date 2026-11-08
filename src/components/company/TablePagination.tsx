"use client";

import { useTranslations } from "next-intl";

interface TablePaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  lastPage,
  total,
  onPageChange,
}) => {
  const t = useTranslations("companyManagement.common");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("total", { count: total })} ·{" "}
        {t("page", { page: currentPage, lastPage })}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3"
        >
          {t("previous")}
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
