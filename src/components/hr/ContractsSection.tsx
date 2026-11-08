"use client";

import ConfirmDialog from "@/components/company/ConfirmDialog";
import TablePagination from "@/components/company/TablePagination";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteEmployeeContractMutation,
  useFetchEmployeeContracts,
} from "@/hooks/employee/useEmployeeContracts";
import { useModal } from "@/hooks/useModal";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import type {
  ContractStatus,
  EmployeeContract,
} from "@/services/employee/types";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ContractFormModal from "./ContractFormModal";
import EmployeeSelect from "./EmployeeSelect";

const statusColor = (status: ContractStatus) => {
  if (status === "active") {
    return "success" as const;
  }

  if (status === "draft") {
    return "warning" as const;
  }

  return "error" as const;
};

const ContractsSection = () => {
  const t = useTranslations("hrManagement");
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<EmployeeContract | null>(null);
  const [deleting, setDeleting] = useState<EmployeeContract | null>(null);
  const formModal = useModal();

  const query = useFetchEmployeeContracts(employeeId, page);
  const deleteMutation = useDeleteEmployeeContractMutation();
  const contracts = query.data?.data.data ?? [];

  const openCreate = () => {
    setEditing(null);
    formModal.openModal();
  };

  const openEdit = (contract: EmployeeContract) => {
    setEditing(contract);
    formModal.openModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {t("contracts.listTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("contracts.listDesc")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <EmployeeSelect
            value={employeeId}
            onChange={(nextEmployeeId) => {
              setEmployeeId(nextEmployeeId);
              setPage(1);
            }}
          />
          <Button
            size="sm"
            startIcon={<PlusIcon />}
            onClick={openCreate}
            disabled={employeeId === null}
          >
            {t("actions.addContract")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                t("common.contractNumber"),
                t("common.contractType"),
                t("common.period"),
                t("common.salary"),
                t("common.actions"),
              ].map((label, index) => (
                <TableCell
                  key={label}
                  isHeader
                  className={`px-6 py-3 text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400 ${
                    index === 4 ? "text-end" : "text-start"
                  }`}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!employeeId && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  {t("contracts.selectEmployee")}
                </TableCell>
              </TableRow>
            )}

            {employeeId && query.isLoading && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            )}

            {employeeId && query.isError && (
              <TableRow>
                <TableCell className="px-6 py-10 text-center" colSpan={5}>
                  <p className="text-sm text-error-500">
                    {getApiErrorMessage(query.error, t("errors.load"))}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => query.refetch()}
                  >
                    {t("actions.retry")}
                  </Button>
                </TableCell>
              </TableRow>
            )}

            {employeeId &&
              !query.isLoading &&
              !query.isError &&
              contracts.length === 0 && (
                <TableRow>
                  <TableCell
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    colSpan={5}
                  >
                    {t("contracts.empty")}
                  </TableCell>
                </TableRow>
              )}

            {!query.isLoading &&
              !query.isError &&
              contracts.map((contract) => (
                <TableRow
                  key={contract.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {contract.contract_number}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-600 capitalize dark:text-gray-400">
                        {contract.contract_type.replace("_", " ")}
                      </span>
                      <Badge
                        color={statusColor(contract.employment_status)}
                        size="sm"
                      >
                        {t(`contractStatuses.${contract.employment_status}`)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(contract.start_date)}
                    {contract.end_date
                      ? ` - ${formatDate(contract.end_date)}`
                      : ` - ${t("common.ongoing")}`}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {contract.salary} / {t(`salaryTypes.${contract.salary_type}`)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={t("actions.edit")}
                        onClick={() => openEdit(contract)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.delete")}
                        onClick={() => setDeleting(contract)}
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

      {employeeId && (
        <TablePagination
          currentPage={query.data?.data.current_page ?? page}
          lastPage={query.data?.data.last_page ?? 1}
          total={query.data?.data.total ?? 0}
          onPageChange={setPage}
        />
      )}

      <ContractFormModal
        isOpen={formModal.isOpen}
        employeeId={employeeId}
        contract={editing}
        onClose={formModal.closeModal}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title={t("contracts.deleteTitle")}
        message={t("contracts.deleteMessage", {
          number: deleting?.contract_number ?? "",
        })}
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

export default ContractsSection;
