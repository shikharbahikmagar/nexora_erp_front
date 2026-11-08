"use client";

import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AttendanceSection from "./AttendanceSection";
import ContractsSection from "./ContractsSection";
import DocumentsSection from "./DocumentsSection";
import EmployeesSection from "./EmployeesSection";

const tabs = ["employees", "contracts", "documents", "attendance"] as const;

type TabKey = (typeof tabs)[number];

const HrManagement = () => {
  const t = useTranslations("hrManagement");
  const [activeTab, setActiveTab] = useState<TabKey>("employees");

  return (
    <div className="space-y-6">
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

      {activeTab === "employees" && <EmployeesSection />}
      {activeTab === "contracts" && <ContractsSection />}
      {activeTab === "documents" && <DocumentsSection />}
      {activeTab === "attendance" && <AttendanceSection />}
    </div>
  );
};

export default HrManagement;
