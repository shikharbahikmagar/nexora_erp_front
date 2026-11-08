import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import HrManagement from "@/components/hr/HrManagement";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "HR Management | TailAdmin",
  description:
    "Manage employees, contracts, documents and attendance through the API.",
};

export default async function EmployeesPage() {
  const t = await getTranslations("hrManagement");

  return (
    <div>
      <PageBreadcrumb pageTitle={t("title")} />
      <HrManagement />
    </div>
  );
}
