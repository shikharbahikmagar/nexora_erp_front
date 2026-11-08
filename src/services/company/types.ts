export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string | null;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface Company {
  id: number;
  name: string;
  code: string;
  legal_name: string | null;
  registration_number: string | null;
  tax_number: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  logo: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface CompanyDetail {
  id: number;
  name: string;
  code: string;
  legal_name: string | null;
  registration_number: string | null;
  tax_number: string | null;
  contact: {
    email: string | null;
    phone: string | null;
    website: string | null;
  };
  address: {
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postal_code: string | null;
  };
  logo: string | null;
  is_active: boolean;
  branches: { id: number; name: string; code: string }[];
  created_at: string | null;
  updated_at: string | null;
}

export interface Branch {
  id: number;
  company_id: number;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postal_code: string | null;
  latitude: string | null;
  longitude: string | null;
  manager_name: string | null;
  timezone: string;
  is_head_office: boolean;
  is_active: boolean;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Department {
  id: number;
  company_id: number;
  name: string;
  code: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CompanyUser {
  id: number;
  company: {
    id: number;
    name: string;
    code: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateCompanyPayload {
  name: string;
  code: string;
  legal_name?: string | null;
  registration_number?: string | null;
  tax_number?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  logo?: string | null;
  is_active?: boolean;
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;

export interface CreateBranchPayload {
  company_id: number;
  name: string;
  code: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  manager_name?: string | null;
  timezone?: string | null;
  is_head_office?: boolean;
  is_active?: boolean;
  description?: string | null;
}

export type UpdateBranchPayload = Omit<CreateBranchPayload, "company_id">;

export interface CreateDepartmentPayload {
  company_id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  is_active?: boolean;
}

export type UpdateDepartmentPayload = Omit<CreateDepartmentPayload, "company_id">;

export interface CreateCompanyUserPayload {
  name: string;
  email: string;
  password: string;
  is_active?: boolean;
}

export interface UpdateCompanyUserPayload {
  user_id?: number;
  is_active?: boolean;
}
