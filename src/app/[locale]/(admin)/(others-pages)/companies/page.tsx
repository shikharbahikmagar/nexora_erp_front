import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompanyManagement from "@/components/company/CompanyManagement";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Company Management | TailAdmin",
  description:
    "Manage companies, branches, departments and company users through the API.",
};

export default async function CompaniesPage() {
  const t = await getTranslations("companyManagement");

  return (
    <div>
      <PageBreadcrumb pageTitle={t("title")} />
      <CompanyManagement />
    </div>
  );
}
