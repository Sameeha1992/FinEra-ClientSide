import { useQuery } from "@tanstack/react-query";
import { TransactionsService } from "@/api/transaction/transactions";

export const useUserTransactions = (page: number, limit: number, search: string = "") => {
  return useQuery({
    queryKey: ["user-transactions", page, limit, search],
    queryFn: () => TransactionsService.getUserTransaction(page, limit, search),
  });
};

export const useVendorTransactions = (page: number, limit: number, search: string = "") => {
  return useQuery({
    queryKey: ["vendor-transactions", page, limit, search],
    queryFn: () => TransactionsService.getVendorTransaction(page, limit, search),
  });
};
