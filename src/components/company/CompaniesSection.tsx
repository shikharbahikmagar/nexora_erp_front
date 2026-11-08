"use client";

import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";
import { useFetchCompany } from "@/hooks/company/useFetchCompany";
import { useDeleteCompanyMutation } from "@/hooks/company/useCompany";
import { getApiErrorMessage } from "@/lib/errors";
import type { Company } from "@/services/company/types";
import { PencilIcon, PlusIcon, TrashBinIcon, EyeIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CompanyDetailModal from "./CompanyDetailModal";
import CompanyFormModal from "./CompanyFormModal";
import ConfirmDialog from "./ConfirmDialog";
import StatusBadge from "./StatusBadge";
import TablePagination from "./TablePagination";

const PER_PAGE = 10;

const CompaniesSection = () => {
  const t = useTranslations("companyManagement");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState<Company | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const formModal = useModal();

  const { data, isLoading, isError, error, refetch } = useFetchCompany(
    page,
    PER_PAGE,
  );
  const deleteMutation = useDeleteCompanyMutation();

  const companies = data?.data.data ?? [];
  const total = data?.data.total ?? 0;
  const lastPage = data?.data.last_page ?? 1;

  const openCreate = () => {
    setEditing(null);
    formModal.openModal();
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    formModal.openModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {t("companies.listTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("companies.listDesc")}
          </p>
        </div>
        <Button size="sm" startIcon={<PlusIcon />} onClick={openCreate}>
          {t("actions.addCompany")}
        </Button>
      </div>

      <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.company")}
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.email")}
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.city")}
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.status")}
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-end text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.actions")}
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell className="px-6 py-10 text-center" colSpan={5}>
                  <p className="text-sm text-error-500">
                    {getApiErrorMessage(error, t("errors.load"))}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => refetch()}
                  >
                    {t("actions.retry")}
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && companies.length === 0 && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  {t("companies.empty")}
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              companies.map((company) => (
                <TableRow
                  key={company.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {company.name}
                    </p>
                    <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {company.code}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.email ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {company.city ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <StatusBadge active={company.is_active} />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={t("actions.view")}
                        onClick={() => setViewingId(company.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <EyeIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.edit")}
                        onClick={() => openEdit(company)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.delete")}
                        onClick={() => setDeleting(company)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/15"
                      >
                        <TrashBinIcon className="size-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={page}
        lastPage={lastPage}
        total={total}
        onPageChange={setPage}
      />

      <CompanyFormModal
        isOpen={formModal.isOpen}
        company={editing}
        onClose={formModal.closeModal}
      />

      <CompanyDetailModal
        isOpen={viewingId !== null}
        companyId={viewingId}
        onClose={() => setViewingId(null)}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title={t("companies.deleteTitle")}
        message={t("companies.deleteMessage", { name: deleting?.name ?? "" })}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          if (!deleting) {
            return;
          }

          deleteMutation.mutate(deleting.id, {
            onSuccess: () => setDeleting(null),
          });
        }}
      />
    </div>
  );
};

export default CompaniesSection;
