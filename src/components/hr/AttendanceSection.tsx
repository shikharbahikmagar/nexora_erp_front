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
import { useFetchEmployees } from "@/hooks/employee/useEmployees";
import {
  useDeleteAttendanceMutation,
  useFetchAttendances,
} from "@/hooks/employee/useAttendances";
import { useModal } from "@/hooks/useModal";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDate, formatDateTime } from "@/lib/format";
import type { Attendance, AttendanceStatus } from "@/services/employee/types";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AttendanceFormModal from "./AttendanceFormModal";

const statusColor = (status: AttendanceStatus) => {
  if (status === "present") {
    return "success" as const;
  }

  if (status === "late" || status === "half_day" || status === "on_leave") {
    return "warning" as const;
  }

  return "error" as const;
};

const AttendanceSection = () => {
  const t = useTranslations("hrManagement");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Attendance | null>(null);
  const [deleting, setDeleting] = useState<Attendance | null>(null);
  const formModal = useModal();

  const query = useFetchAttendances(page);
  const employeesQuery = useFetchEmployees(100);
  const deleteMutation = useDeleteAttendanceMutation();
  const attendances = query.data?.data.data ?? [];

  const employeesById = new Map(
    (employeesQuery.data?.data ?? []).map((employee) => [employee.id, employee]),
  );

  const openCreate = () => {
    setEditing(null);
    formModal.openModal();
  };

  const openEdit = (attendance: Attendance) => {
    setEditing(attendance);
    formModal.openModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {t("attendance.listTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("attendance.listDesc")}
          </p>
        </div>
        <Button size="sm" startIcon={<PlusIcon />} onClick={openCreate}>
          {t("actions.addAttendance")}
        </Button>
      </div>

      <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                t("common.employee"),
                t("common.date"),
                t("common.checkInOut"),
                t("common.workedMinutes"),
                t("common.status"),
                t("common.actions"),
              ].map((label, index) => (
                <TableCell
                  key={label}
                  isHeader
                  className={`px-6 py-3 text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400 ${
                    index === 5 ? "text-end" : "text-start"
                  }`}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isLoading && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={6}
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            )}

            {query.isError && (
              <TableRow>
                <TableCell className="px-6 py-10 text-center" colSpan={6}>
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

            {!query.isLoading &&
              !query.isError &&
              attendances.length === 0 && (
                <TableRow>
                  <TableCell
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    colSpan={6}
                  >
                    {t("attendance.empty")}
                  </TableCell>
                </TableRow>
              )}

            {!query.isLoading &&
              !query.isError &&
              attendances.map((attendance) => {
                const employee = employeesById.get(attendance.employee_id);

                return (
                  <TableRow
                    key={attendance.id}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {employee
                          ? `${employee.first_name} ${employee.last_name}`
                          : `#${attendance.employee_id}`}
                      </p>
                      <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {employee?.employee_code ?? `#${attendance.employee_id}`}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(attendance.date)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <p>{formatDateTime(attendance.check_in)}</p>
                      <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(attendance.check_out)}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {attendance.worked_minutes ?? "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge color={statusColor(attendance.status)} size="sm">
                        {t(`attendanceStatuses.${attendance.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title={t("actions.edit")}
                          onClick={() => openEdit(attendance)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                        <button
                          type="button"
                          title={t("actions.delete")}
                          onClick={() => setDeleting(attendance)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/15"
                        >
                          <TrashBinIcon className="size-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={query.data?.data.current_page ?? page}
        lastPage={query.data?.data.last_page ?? 1}
        total={query.data?.data.total ?? 0}
        onPageChange={setPage}
      />

      <AttendanceFormModal
        isOpen={formModal.isOpen}
        attendance={editing}
        onClose={formModal.closeModal}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title={t("attendance.deleteTitle")}
        message={t("attendance.deleteMessage", {
          date: deleting ? formatDate(deleting.date) : "",
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

export default AttendanceSection;
