"use client";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import BranchesSection from "./BranchesSection";
import CompaniesSection from "./CompaniesSection";
import CompanyUsersSection from "./CompanyUsersSection";
import DepartmentsSection from "./DepartmentsSection";
import MyCompanyCard from "./MyCompanyCard";

const tabs = ["companies", "branches", "departments", "users"] as const;

type TabKey = (typeof tabs)[number];

const CompanyManagement = () => {
  const t = useTranslations("companyManagement");
  const [activeTab, setActiveTab] = useState<TabKey>("companies");

  return (
    <div className="space-y-6">
      <MyCompanyCard />

      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-1 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-800 dark:bg-white/3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition",
                activeTab === tab
                  ? "bg-brand-500 text-white shadow-theme-xs"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
              )}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "companies" && <CompaniesSection />}
      {activeTab === "branches" && <BranchesSection />}
      {activeTab === "departments" && <DepartmentsSection />}
      {activeTab === "users" && <CompanyUsersSection />}
    </div>
  );
};

export default CompanyManagement;
