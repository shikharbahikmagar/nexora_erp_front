import type { ApiResponse, Paginated } from "@/services/company/types";

export type { ApiResponse, Paginated };

export const EMPLOYMENT_STATUSES = [
  "active",
  "probation",
  "on_leave",
  "suspended",
  "notice_period",
  "terminated",
  "resigned",
  "retired",
] as const;

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const ATTENDANCE_STATUSES = [
  "present",
  "absent",
  "late",
  "half_day",
  "on_leave",
] as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const CONTRACT_TYPES = [
  "permanent",
  "temporary",
  "internship",
  "freelance",
  "part_time",
  "contract",
] as const;

export type ContractType = (typeof CONTRACT_TYPES)[number];

export const CONTRACT_STATUSES = [
  "draft",
  "active",
  "expired",
  "terminated",
] as const;

export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const SALARY_TYPES = ["hourly", "daily", "monthly", "annual"] as const;

export type SalaryType = (typeof SALARY_TYPES)[number];

export const USER_ROLES = [
  "super_admin",
  "company_admin",
  "hr",
  "employee",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface Employee {
  id: number;
  company_user_id: number;
  branch_id: number | null;
  employee_code: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  marital_status: string | null;
  nationality: string | null;
  profile_photo: string | null;
  personal_email: string | null;
  phone: string | null;
  alternate_phone: string | null;
  joining_date: string;
  employment_type: string;
  employment_status: EmploymentStatus;
  probation_end_date: string | null;
  confirmation_date: string | null;
  resignation_date: string | null;
  termination_date: string | null;
  termination_reason: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface CreateEmployeePayload {
  company_user_id: number;
  branch_id?: number | null;
  employee_code: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  nationality?: string | null;
  profile_photo?: string | null;
  personal_email?: string | null;
  phone?: string | null;
  alternate_phone?: string | null;
  joining_date: string;
  employment_type: string;
  employment_status?: string;
  probation_end_date?: string | null;
  confirmation_date?: string | null;
  resignation_date?: string | null;
  termination_date?: string | null;
  termination_reason?: string | null;
  notes?: string | null;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

export interface EmployeeContract {
  id: number;
  employee_id: number;
  contract_number: string;
  contract_type: ContractType;
  start_date: string;
  end_date: string | null;
  probation_start_date: string | null;
  probation_end_date: string | null;
  designation: string | null;
  department_id: number | null;
  branch_id: number | null;
  employment_status: ContractStatus;
  salary: string;
  salary_type: SalaryType;
  working_hours_per_week: string | null;
  work_schedule: string | null;
  notice_period_days: number | null;
  termination_date: string | null;
  termination_reason: string | null;
  notes: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface CreateEmployeeContractPayload {
  employee_id: number;
  contract_number: string;
  contract_type: ContractType;
  start_date: string;
  end_date?: string | null;
  probation_start_date?: string | null;
  probation_end_date?: string | null;
  designation?: string | null;
  department_id?: number | null;
  branch_id?: number | null;
  employment_status: ContractStatus;
  salary: number;
  salary_type: SalaryType;
  working_hours_per_week?: number | null;
  work_schedule?: string | null;
  notice_period_days?: number | null;
  termination_date?: string | null;
  termination_reason?: string | null;
  notes?: string | null;
}

export type UpdateEmployeeContractPayload = Omit<
  CreateEmployeeContractPayload,
  "employee_id"
>;

export interface EmployeeDocument {
  id: number;
  employee_id: number;
  document_type: string;
  document: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateEmployeeDocumentPayload {
  document_type: string;
  document: string;
}

export type UpdateEmployeeDocumentPayload = CreateEmployeeDocumentPayload;

export interface Attendance {
  id: number;
  employee_id: number;
  branch_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: AttendanceStatus;
  late_minutes: number | null;
  early_leave_minutes: number | null;
  worked_minutes: number | null;
  overtime_minutes: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateAttendancePayload {
  employee_id: number;
  branch_id: number;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: AttendanceStatus;
  late_minutes?: number | null;
  early_leave_minutes?: number | null;
  worked_minutes?: number | null;
  overtime_minutes?: number | null;
  notes?: string | null;
}

export type UpdateAttendancePayload = Omit<
  CreateAttendancePayload,
  "employee_id"
>;

export interface AssignRolePayload {
  role: UserRole;
}

export interface AuthProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}
