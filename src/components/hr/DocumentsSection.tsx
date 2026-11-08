"use client";

import ConfirmDialog from "@/components/company/ConfirmDialog";
import TablePagination from "@/components/company/TablePagination";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteEmployeeDocumentMutation,
  useFetchEmployeeDocuments,
} from "@/hooks/employee/useEmployeeDocuments";
import { useModal } from "@/hooks/useModal";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import type { EmployeeDocument } from "@/services/employee/types";
import { PencilIcon, PlusIcon, TrashBinIcon } from "@/icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import DocumentFormModal from "./DocumentFormModal";
import EmployeeSelect from "./EmployeeSelect";

const DocumentsSection = () => {
  const t = useTranslations("hrManagement");
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<EmployeeDocument | null>(null);
  const [deleting, setDeleting] = useState<EmployeeDocument | null>(null);
  const formModal = useModal();

  const query = useFetchEmployeeDocuments(employeeId, page);
  const deleteMutation = useDeleteEmployeeDocumentMutation();
  const documents = query.data?.data.data ?? [];

  const openCreate = () => {
    setEditing(null);
    formModal.openModal();
  };

  const openEdit = (document: EmployeeDocument) => {
    setEditing(document);
    formModal.openModal();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {t("documents.listTitle")}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("documents.listDesc")}
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
            {t("actions.addDocument")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              {[
                t("common.documentType"),
                t("common.documentUrl"),
                t("common.createdAt"),
                t("common.actions"),
              ].map((label, index) => (
                <TableCell
                  key={label}
                  isHeader
                  className={`px-6 py-3 text-theme-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400 ${
                    index === 3 ? "text-end" : "text-start"
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
                  colSpan={4}
                >
                  {t("documents.selectEmployee")}
                </TableCell>
              </TableRow>
            )}

            {employeeId && query.isLoading && (
              <TableRow>
                <TableCell
                  className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  colSpan={4}
                >
                  {t("common.loading")}
                </TableCell>
              </TableRow>
            )}

            {employeeId && query.isError && (
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

            {employeeId &&
              !query.isLoading &&
              !query.isError &&
              documents.length === 0 && (
                <TableRow>
                  <TableCell
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    colSpan={4}
                  >
                    {t("documents.empty")}
                  </TableCell>
                </TableRow>
              )}

            {!query.isLoading &&
              !query.isError &&
              documents.map((document) => (
                <TableRow
                  key={document.id}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <TableCell className="px-6 py-4 text-sm font-medium text-gray-800 capitalize dark:text-white/90">
                    {document.document_type}
                  </TableCell>
                  <TableCell className="max-w-72 px-6 py-4">
                    <a
                      href={document.document}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-sm text-brand-500 hover:underline"
                    >
                      {document.document}
                    </a>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(document.created_at)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={t("actions.edit")}
                        onClick={() => openEdit(document)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <PencilIcon className="size-5" />
                      </button>
                      <button
                        type="button"
                        title={t("actions.delete")}
                        onClick={() => setDeleting(document)}
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

      <DocumentFormModal
        isOpen={formModal.isOpen}
        employeeId={employeeId}
        document={editing}
        onClose={formModal.closeModal}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title={t("documents.deleteTitle")}
        message={t("documents.deleteMessage", {
          type: deleting?.document_type ?? "",
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

export default DocumentsSection;
