import React from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { EmiService } from "@/api/emi/emi";

type EmiItem = {
  emiNumber: number;
  dueDate: string | Date;
  amount: number;
  status: "PENDING" | "PAID" | "UPCOMING";
};

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 mb-6 transition-all hover:shadow-md">
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
      {icon && (
        <div className="p-2 bg-blue-50/80 text-blue-600 rounded-xl">{icon}</div>
      )}
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const EmiListing: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();

  console.log(loanId, "loan id from emi page");

  const {
    data: emiData,
    isLoading: emiLoading,
    isError,
  } = useQuery({
    queryKey: ["loanEmis", loanId],
    queryFn: () => EmiService.getEmisByLoanId(loanId as string),
    enabled: !!loanId,
    retry: false,
  });

  const nextPendingEmi = emiData?.find((emi) => emi.status === "PENDING");
  if (!loanId) {
    return (
      <SectionCard title="EMI Schedule" icon={<Calendar size={20} />}>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Loan details are not available yet.
        </div>
      </SectionCard>
    );
  }

  if (emiLoading) {
    return (
      <SectionCard title="EMI Schedule" icon={<Calendar size={20} />}>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </SectionCard>
    );
  }

  const hasRealData = !!emiData && emiData.length > 0;
  const tenure = hasRealData ? emiData.length : 12;

  const displayData: EmiItem[] = hasRealData
    ? emiData
    : Array.from({ length: 6 }).map((_, i) => ({
        emiNumber: i + 1,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
        amount: 0,
        status: i === 0 ? "PENDING" : "UPCOMING",
      }));

  return (
    <SectionCard
      title={hasRealData ? "EMI Schedule" : "EMI Schedule (Preview)"}
      icon={<Calendar size={20} />}
    >
      <div className="space-y-4">
        {nextPendingEmi && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 mb-6">
            <p className="text-sm font-medium text-blue-700">
              EMI to be paid now
            </p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              ₹ {nextPendingEmi.amount.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Due on{" "}
              {new Date(nextPendingEmi.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        )}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-500">
            Total Tenure
          </span>
          <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
            {tenure} Months
          </span>
        </div>

        {isError && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Could not fetch EMI data.
          </div>
        )}

        <div className="space-y-3 relative overflow-x-auto">
          <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              EMI No.
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Due Date
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Amount
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Action
            </span>
          </div>

          <div className="space-y-3">
            {displayData.slice(0, 6).map((emi, index, arr) => {
              const firstPendingIndex = arr.findIndex(
                (e) => e.status === "PENDING",
              );
              const isFirstPending = index === firstPendingIndex;

              return (
                <div
                  key={emi.emiNumber}
                  className="flex flex-col sm:grid sm:grid-cols-5 sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-blue-100 transition-all hover:-translate-y-0.5 group"
                >
                  <div className="flex items-center gap-3 col-span-1">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {emi.emiNumber}
                    </div>
                    <span className="sm:hidden text-sm font-bold text-gray-900">
                      EMI {emi.emiNumber}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-between sm:block">
                    <span className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {new Date(emi.dueDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-between sm:block">
                    <span className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </span>
                    <span className="text-sm font-black text-gray-900">
                      ₹ {emi.amount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-between sm:block">
                    <span className="sm:hidden text-xs font-medium text-gray-500 uppercase">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${
                        emi.status === "PENDING"
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : emi.status === "PAID"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-blue-50 text-blue-600 border-blue-200"
                      }`}
                    >
                      {emi.status}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-50 sm:border-0 relative">
                    {emi.status === "PAID" ? (
                      <span className="text-xs font-semibold text-gray-400 flex items-center justify-center w-full sm:w-auto px-3 py-1.5">
                        —
                      </span>
                    ) : isFirstPending ? (
                      <button
                        className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors w-full sm:w-auto justify-center shadow-sm shadow-blue-200"
                        onClick={() => console.log("Pay EMI", emi.emiNumber)}
                      >
                        Pay Now
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <span
                        className="text-xs font-semibold text-gray-400 flex items-center justify-center w-full sm:w-auto px-3 py-1.5 cursor-not-allowed"
                        title="Please pay previous EMIs first"
                      >
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {tenure > 6 && (
          <div className="text-center pt-3 pb-1">
            <div className="inline-flex items-center justify-center w-full relative">
              <hr className="w-full border-gray-100" />
              <span className="absolute px-3 bg-white text-xs font-medium text-gray-400">
                + {tenure - 6} more installments
              </span>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default EmiListing;
