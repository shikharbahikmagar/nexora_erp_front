"use client";

import FieldError from "@/components/company/FieldError";
import SelectInput from "@/components/company/SelectInput";
import TextArea from "@/components/company/TextArea";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import {
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
} from "@/hooks/employee/useAttendances";
import { getApiErrorMessage } from "@/lib/errors";
import { toDateInputValue } from "@/lib/format";
import type {
  Attendance,
  AttendanceStatus,
  CreateAttendancePayload,
  UpdateAttendancePayload,
} from "@/services/employee/types";
import { ATTENDANCE_STATUSES } from "@/services/employee/types";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import EmployeeSelect from "./EmployeeSelect";

interface AttendanceFormModalProps {
  isOpen: boolean;
  attendance?: Attendance | null;
  onClose: () => void;
}

interface AttendanceFormValues {
  employee_id: string;
  branch_id: string;
  date: string;
  check_in: string;
  check_out: string;
  status: AttendanceStatus;
  late_minutes: string;
  early_leave_minutes: string;
  worked_minutes: string;
  overtime_minutes: string;
  notes: string;
}

const emptyToNull = (value: string) => (value.trim() ? value.trim() : null);

const toNumberOrNull = (value: string) => {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const toDateTimeLocal = (value?: string | null) => {
  if (!value) {
    return "";
  }

  return (value.includes("T") ? value : value.replace(" ", "T")).slice(0, 16);
};

const toFormValues = (
  attendance?: Attendance | null,
): AttendanceFormValues => ({
  employee_id: attendance ? String(attendance.employee_id) : "",
  branch_id: attendance ? String(attendance.branch_id) : "",
  date: toDateInputValue(attendance?.date),
  check_in: toDateTimeLocal(attendance?.check_in),
  check_out: toDateTimeLocal(attendance?.check_out),
  status: attendance?.status ?? "present",
  late_minutes: attendance?.late_minutes
    ? String(attendance.late_minutes)
    : "",
  early_leave_minutes: attendance?.early_leave_minutes
    ? String(attendance.early_leave_minutes)
    : "",
  worked_minutes: attendance?.worked_minutes
    ? String(attendance.worked_minutes)
    : "",
  overtime_minutes: attendance?.overtime_minutes
    ? String(attendance.overtime_minutes)
    : "",
  notes: attendance?.notes ?? "",
});

const AttendanceFormModal: React.FC<AttendanceFormModalProps> = ({
  isOpen,
  attendance,
  onClose,
}) => {
  const t = useTranslations("hrManagement");
  const createMutation = useCreateAttendanceMutation();
  const updateMutation = useUpdateAttendanceMutation();
  const isEditing = Boolean(attendance);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<AttendanceFormValues>({
    defaultValues: toFormValues(attendance),
  });

  useEffect(() => {
    if (isOpen) {
      reset(toFormValues(attendance));
    }
  }, [attendance, isOpen, reset]);

  const employeeId = useWatch({ control, name: "employee_id" });

  const onSubmit = (values: AttendanceFormValues) => {
    const basePayload = {
      branch_id: Number(values.branch_id),
      date: values.date,
      check_in: emptyToNull(values.check_in),
      check_out: emptyToNull(values.check_out),
      status: values.status,
      late_minutes: toNumberOrNull(values.late_minutes),
      early_leave_minutes: toNumberOrNull(values.early_leave_minutes),
      worked_minutes: toNumberOrNull(values.worked_minutes),
      overtime_minutes: toNumberOrNull(values.overtime_minutes),
      notes: emptyToNull(values.notes),
    };

    if (attendance) {
      const payload: UpdateAttendancePayload = basePayload;
      updateMutation.mutate(
        { attendanceId: attendance.id, payload },
        { onSuccess: onClose },
      );
      return;
    }

    const payload: CreateAttendancePayload = {
      ...basePayload,
      employee_id: Number(values.employee_id),
    };

    createMutation.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="custom-scrollbar m-4 max-h-[90vh] max-w-2xl overflow-y-auto p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        {isEditing
          ? t("attendance.editTitle")
          : t("attendance.createTitle")}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t("common.requiredHint")}
      </p>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="attendance-employee">
              {t("common.employee")} <span className="text-error-500">*</span>
            </Label>
            <EmployeeSelect
              wrapperClassName=""
              value={employeeId ? Number(employeeId) : null}
              disabled={isEditing}
              onChange={(nextEmployeeId) =>
                setValue("employee_id", nextEmployeeId ? String(nextEmployeeId) : "")
              }
            />
            <input
              type="hidden"
              {...register("employee_id", {
                required: t("validation.required"),
              })}
            />
            <FieldError message={errors.employee_id?.message} />
          </div>

          <div>
            <Label htmlFor="attendance-branch">
              {t("common.branchId")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="attendance-branch"
              type="number"
              min={1}
              {...register("branch_id", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.branch_id)}
            />
            <FieldError message={errors.branch_id?.message} />
          </div>

          <div>
            <Label htmlFor="attendance-date">
              {t("common.date")} <span className="text-error-500">*</span>
            </Label>
            <Input
              id="attendance-date"
              type="date"
              {...register("date", {
                required: t("validation.required"),
              })}
              error={Boolean(errors.date)}
            />
            <FieldError message={errors.date?.message} />
          </div>

          <div>
            <Label htmlFor="attendance-status">
              {t("common.attendanceStatus")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <SelectInput
              id="attendance-status"
              options={ATTENDANCE_STATUSES.map((status) => ({
                value: status,
                label: t(`attendanceStatuses.${status}`),
              }))}
              {...register("status", { required: t("validation.required") })}
            />
          </div>

          <div>
            <Label htmlFor="attendance-check-in">
              {t("common.checkIn")}
            </Label>
            <Input
              id="attendance-check-in"
              type="datetime-local"
              {...register("check_in")}
            />
          </div>

          <div>
            <Label htmlFor="attendance-check-out">
              {t("common.checkOut")}
            </Label>
            <Input
              id="attendance-check-out"
              type="datetime-local"
              {...register("check_out")}
            />
          </div>

          <div>
            <Label htmlFor="attendance-late">
              {t("common.lateMinutes")}
            </Label>
            <Input
              id="attendance-late"
              type="number"
              min={0}
              {...register("late_minutes")}
            />
          </div>

          <div>
            <Label htmlFor="attendance-early">
              {t("common.earlyLeaveMinutes")}
            </Label>
            <Input
              id="attendance-early"
              type="number"
              min={0}
              {...register("early_leave_minutes")}
            />
          </div>

          <div>
            <Label htmlFor="attendance-worked">
              {t("common.workedMinutes")}
            </Label>
            <Input
              id="attendance-worked"
              type="number"
              min={0}
              {...register("worked_minutes")}
            />
          </div>

          <div>
            <Label htmlFor="attendance-overtime">
              {t("common.overtimeMinutes")}
            </Label>
            <Input
              id="attendance-overtime"
              type="number"
              min={0}
              {...register("overtime_minutes")}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="attendance-notes">{t("common.notes")}</Label>
            <TextArea
              id="attendance-notes"
              rows={2}
              {...register("notes")}
            />
          </div>
        </div>

        {mutationError && (
          <p className="rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600 dark:bg-error-500/15 dark:text-error-500">
            {getApiErrorMessage(mutationError, t("errors.save"))}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            {t("actions.cancel")}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditing
                ? t("actions.saving")
                : t("actions.creating")
              : isEditing
                ? t("actions.save")
                : t("actions.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AttendanceFormModal;
