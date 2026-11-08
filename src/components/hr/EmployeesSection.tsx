"use client";

import ConfirmDialog from "@/components/company/ConfirmDialog";
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
  useDeleteEmployeeMutation,
  useFetchEmployees,
} from "@/hooks/employee/useEmployees";
import { useModal } from "@/hooks/useModal";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import type { Employee } from "@/services/employee/types";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import EmployeeFormModal from "./EmployeeFormModal";

const statusColor = (status: string) => {
  if (status === "active") {
    return "success" as const;
  }

  if (["probation", "on_leave", "notice_period", "suspended"].includes(status)) {
    return "warning" as const;
  }

  return "error" as const;
};

const EmployeesSection = () => {
  const t = useTranslations("hrManagement");
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const formModal = useModal();

  const query = useFetchEmployees(100);
  const deleteMutation = useDeleteEmployeeMutation();
  const employees = query.data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    formModal.openModal();
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    formModal.openModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {t("employees.listTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("employees.listDesc")}
          </p>
        </div>
        <Button size="sm" startIcon={<PlusIcon />} onClick={openCreate}>
          {t("actions.addEmployee")}
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
                {t("common.employee")}
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.contact")}
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.employment")}
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-start text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
              >
                {t("common.joiningDate")}
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
            {query.isLoading && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            )}

            {query.isError && (
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

            {!query.isLoading && !query.isError && employees.length === 0 && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={5}
                >
                  {t("employees.empty")}
                </TableCell>
              </TableRow>
            )}

            {!query.isLoading &&
              !query.isError &&
              employees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {employee.first_name} {employee.last_name}
                    </p>
                    <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {employee.employee_code}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {employee.personal_email ?? "-"}
                    </p>
                    <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {employee.phone ?? "-"}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-600 capitalize dark:text-gray-400">
                        {employee.employment_type}
                      </span>
                      <Badge color={statusColor(employee.employment_status)} size="sm">
                        {t(`statuses.${employee.employment_status}`)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(employee.joining_date)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={t("actions.edit")}
                        onClick={() => openEdit(employee)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.delete")}
                        onClick={() => setDeleting(employee)}
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

      <EmployeeFormModal
        isOpen={formModal.isOpen}
        employee={editing}
        onClose={formModal.closeModal}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title={t("employees.deleteTitle")}
        message={t("employees.deleteMessage", {
          name: deleting
            ? `${deleting.first_name} ${deleting.last_name}`
            : "",
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

export default EmployeesSection;
