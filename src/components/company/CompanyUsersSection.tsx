"use client";

import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchCompany } from "@/hooks/company/useFetchCompany";
import {
  useDeleteCompanyUserMutation,
  useFetchCompanyUsers,
} from "@/hooks/company/useCompanyUsers";
import { useModal } from "@/hooks/useModal";
import { getApiErrorMessage } from "@/lib/errors";
import type { CompanyUser } from "@/services/company/types";
import AssignRoleModal from "@/components/user/AssignRoleModal";
import { PencilIcon, PlusIcon, TrashBinIcon, UserCircleIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CompanyUserFormModal from "./CompanyUserFormModal";
import ConfirmDialog from "./ConfirmDialog";
import StatusBadge from "./StatusBadge";

const CompanyUsersSection = () => {
  const t = useTranslations("companyManagement");
  const [editing, setEditing] = useState<CompanyUser | null>(null);
  const [deleting, setDeleting] = useState<CompanyUser | null>(null);
  const [roleTarget, setRoleTarget] = useState<CompanyUser | null>(null);
  const formModal = useModal();

  const companiesQuery = useFetchCompany(1, 100);
  const companies = companiesQuery.data?.data.data ?? [];

  const query = useFetchCompanyUsers();
  const deleteMutation = useDeleteCompanyUserMutation();
  const companyUsers = query.data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    formModal.openModal();
  };

  const openEdit = (companyUser: CompanyUser) => {
    setEditing(companyUser);
    formModal.openModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {t("users.listTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("users.listDesc")}
          </p>
        </div>
        <Button size="sm" startIcon={<PlusIcon />} onClick={openCreate}>
          {t("actions.addUser")}
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
                {t("common.user")}
              </TableCell>
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
            {query.isLoading && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={4}
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            )}

            {query.isError && (
              <TableRow>
                <TableCell className="px-6 py-10 text-center" colSpan={4}>
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

            {!query.isLoading && !query.isError && companyUsers.length === 0 && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={4}
                >
                  {t("users.empty")}
                </TableCell>
              </TableRow>
            )}

            {!query.isLoading &&
              !query.isError &&
              companyUsers.map((companyUser) => (
                <TableRow
                  key={companyUser.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {companyUser.user.name}
                    </p>
                    <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {companyUser.user.email}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-sm text-gray-800 dark:text-white/90">
                      {companyUser.company.name}
                    </p>
                    <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                      {companyUser.company.code}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <StatusBadge active={companyUser.is_active} />
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={t("actions.assignRole")}
                        onClick={() => setRoleTarget(companyUser)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <UserCircleIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.edit")}
                        onClick={() => openEdit(companyUser)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.delete")}
                        onClick={() => setDeleting(companyUser)}
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

      <AssignRoleModal
        isOpen={roleTarget !== null}
        companyUser={roleTarget}
        onClose={() => setRoleTarget(null)}
      />

      <CompanyUserFormModal
        isOpen={formModal.isOpen}
        companies={companies}
        companyUser={editing}
        onClose={formModal.closeModal}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title={t("users.deleteTitle")}
        message={t("users.deleteMessage", {
          name: deleting?.user.name ?? "",
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

export default CompanyUsersSection;
