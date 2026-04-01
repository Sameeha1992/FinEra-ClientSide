import { useQuery } from "@tanstack/react-query";
import { TransactionsService } from "@/api/transaction/transactions";

export const useUserTransactions = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["user-transactions", page, limit],
    queryFn: () => TransactionsService.getUserTransaction(page, limit),
  });
};

export const useVendorTransactions = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["vendor-transactions", page, limit],
    queryFn: () => TransactionsService.getVendorTransaction(page, limit),
  });
};



export const useDownloadVendorReport = () => {
  const download = async (startDate?: string, endDate?: string) => {
    const blob = await TransactionsService.downloadVendorTransactionReport(
      startDate,
      endDate
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "vendor-transaction-report.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return { download };
};
