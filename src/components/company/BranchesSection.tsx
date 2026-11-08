"use client";

import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteBranchMutation, useFetchBranches } from "@/hooks/company/useBranches";
import { useFetchCompany } from "@/hooks/company/useFetchCompany";
import { useModal } from "@/hooks/useModal";
import { getApiErrorMessage } from "@/lib/errors";
import type { Branch } from "@/services/company/types";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import BranchFormModal from "./BranchFormModal";
import ConfirmDialog from "./ConfirmDialog";
import SelectInput from "./SelectInput";
import StatusBadge from "./StatusBadge";
import TablePagination from "./TablePagination";

const PER_PAGE = 10;

const BranchesSection = () => {
  const t = useTranslations("companyManagement");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [deleting, setDeleting] = useState<Branch | null>(null);
  const formModal = useModal();

  const companiesQuery = useFetchCompany(1, 100);
  const companies = companiesQuery.data?.data.data ?? [];
  const companyId = selectedCompanyId ?? companies[0]?.id ?? null;

  const branchesQuery = useFetchBranches(companyId, page, PER_PAGE);
  const deleteMutation = useDeleteBranchMutation();

  const branches = branchesQuery.data?.data.data ?? [];
  const total = branchesQuery.data?.data.total ?? 0;
  const lastPage = branchesQuery.data?.data.last_page ?? 1;

  const openCreate = () => {
    setEditing(null);
    formModal.openModal();
  };

  const openEdit = (branch: Branch) => {
    setEditing(branch);
    formModal.openModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {t("branches.listTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("branches.listDesc")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SelectInput
            wrapperClassName="min-w-52"
            value={companyId ?? ""}
            onChange={(event) => {
              setSelectedCompanyId(Number(event.target.value));
              setPage(1);
            }}
            placeholder={t("common.selectCompany")}
            options={companies.map((company) => ({
              value: String(company.id),
              label: company.name,
            }))}
          />
          <Button
            size="sm"
            startIcon={<PlusIcon />}
            onClick={openCreate}
            disabled={companyId === null}
          >
            {t("actions.addBranch")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.name")}
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
                {t("common.headOffice")}
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
            {branchesQuery.isLoading && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={6}
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            )}

            {branchesQuery.isError && (
              <TableRow>
                <TableCell className="px-6 py-10 text-center" colSpan={6}>
                  <p className="text-sm text-error-500">
                    {getApiErrorMessage(branchesQuery.error, t("errors.load"))}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => branchesQuery.refetch()}
                  >
                    {t("actions.retry")}
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {!branchesQuery.isLoading &&
              !branchesQuery.isError &&
              branches.length === 0 && (
                <TableRow>
                  <TableCell
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    colSpan={6}
                  >
                    {companyId === null
                      ? t("branches.selectHint")
                      : t("branches.empty")}
                  </TableCell>
                </TableRow>
              )}

            {!branchesQuery.isLoading &&
              !branchesQuery.isError &&
              branches.map((branch) => (
                <TableRow
                  key={branch.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {branch.name}
                    </p>
                    <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {branch.code}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {branch.email ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {branch.city ?? "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {branch.is_head_office ? t("common.yes") : t("common.no")}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <StatusBadge active={branch.is_active} />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={t("actions.edit")}
                        onClick={() => openEdit(branch)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.delete")}
                        onClick={() => setDeleting(branch)}
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

      <BranchFormModal
        isOpen={formModal.isOpen}
        companyId={companyId}
        branch={editing}
        onClose={formModal.closeModal}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title={t("branches.deleteTitle")}
        message={t("branches.deleteMessage", { name: deleting?.name ?? "" })}
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

export default BranchesSection;
