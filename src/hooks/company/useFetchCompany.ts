"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "@/services/company/company.service";

export const useFetchCompany = (page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["companies", { page, perPage }],
    queryFn: () => fetchCompanies(page, perPage),
  });
};
