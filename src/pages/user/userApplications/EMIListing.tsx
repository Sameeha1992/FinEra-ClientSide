import React from "react";
import { Calendar, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { EmiService } from "@/api/emi/emi";
import { EmiPaymentService } from "@/api/emi/emi.payment.service";
import EmiDetailsModal from "./EmiDetailsModal";
import toast from "react-hot-toast";

type EmiItem = {
  emiId?: string;
  emiNumber: number;
  dueDate: string | Date;
  amount: number;
  penalty?: number;
  totalAmount?: number;
  status: "PENDING" | "PAID" | "UPCOMING" | "OVERDUE" | "PAYMENT_IN_PROGRESS";
};

type SectionCardProps = {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const SectionCard = ({ title, icon, children }: SectionCardProps) => (
  <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
    <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
      {icon && (
        <div className="rounded-xl bg-blue-50/80 p-2 text-blue-600">{icon}</div>
      )}
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    {children}
  </div>
);

const EmiListing: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const [selectedEmiId, setSelectedEmiId] = React.useState<string | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  const {
    data: emiData = [],
    isLoading: emiLoading,
    isError,
  } = useQuery({
    queryKey: ["loanEmis", loanId],
    queryFn: () => EmiService.getEmisByLoanId(loanId as string),
    enabled: !!loanId,
    retry: false,
  });

  const paymentMutation = useMutation({
    mutationFn: (emiId: string) =>
      EmiPaymentService.createPaymentSession(emiId),
    onSuccess: (data) => {
      if (data?.checkoutUrl) {
        if (loanId) localStorage.setItem("lastPaidEmiLoanId", loanId);
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Checkout URL not received");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Failed to create payment session";

      if (message.includes("already in progress")) {
        toast.error(
          "A payment attempt is already active. Please wait 1 minute if you need to retry.",
          { id: "payment-progress", duration: 5000 }
        );
      } else {
        toast.error(message);
      }
    },
  });

  console.log("paymnet mutation", paymentMutation);

  const handlePayNow = (emiId?: string) => {
    if (!emiId) {
      toast.error("EMI ID is missing");
      return;
    }

    paymentMutation.mutate(emiId);
  };

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
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      </SectionCard>
    );
  }

  const hasRealData = emiData.length > 0;
  const tenure = hasRealData ? emiData.length : 12;

  const displayData: EmiItem[] = hasRealData
    ? emiData
    : Array.from({ length: 6 }, (_, i) => ({
      emiNumber: i + 1,
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + i + 1)),
      amount: 0,
      status: i === 0 ? "PENDING" : "UPCOMING",
    }));

  const nextPendingEmi = emiData.find(
    (emi: EmiItem) =>
      emi.status === "PENDING" ||
      emi.status === "OVERDUE" ||
      emi.status === "PAYMENT_IN_PROGRESS",
  );

  const firstPendingIndex = displayData.findIndex(
    (emi) =>
      emi.status === "PENDING" ||
      emi.status === "OVERDUE" ||
      emi.status === "PAYMENT_IN_PROGRESS",
  );

  return (
    <SectionCard
      title={hasRealData ? "EMI Schedule" : "EMI Schedule (Preview)"}
      icon={<Calendar size={20} />}
    >
      <div className="space-y-4">
        {nextPendingEmi && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 ${nextPendingEmi.status === "OVERDUE" ? "border-rose-200 bg-rose-50" : "border-blue-200 bg-blue-50"}`}
          >
            <p
              className={`text-sm font-medium ${nextPendingEmi.status === "OVERDUE" ? "text-rose-700" : "text-blue-700"}`}
            >
              {nextPendingEmi.status === "OVERDUE"
                ? "Overdue EMI to be paid now"
                : "EMI to be paid now"}
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${nextPendingEmi.status === "OVERDUE" ? "text-rose-900" : "text-blue-900"}`}
            >
              ₹ {nextPendingEmi.amount.toLocaleString("en-IN")}
            </p>
            <p
              className={`mt-1 text-sm ${nextPendingEmi.status === "OVERDUE" ? "text-rose-600" : "text-blue-600"}`}
            >
              Due on{" "}
              {new Date(nextPendingEmi.dueDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-sm font-medium text-gray-500">
            Total Tenure
          </span>
          <span className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold text-gray-900">
            {tenure} Months
          </span>
        </div>

        {isError && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Could not fetch EMI data.
          </div>
        )}

        <div className="relative space-y-3 overflow-x-auto">
          <div className="mb-2 hidden grid-cols-5 gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 sm:grid">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              EMI No.
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Due Date
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Amount
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </span>
            <span className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
              Action
            </span>
          </div>

          <div className="space-y-3">
            {(showAll ? displayData : displayData.slice(0, 6)).map((emi, index) => {
              const isFirstPending = index === firstPendingIndex;

              return (
                <div
                  key={emi.emiId ?? emi.emiNumber}
                  className="group flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:grid sm:grid-cols-5 sm:items-center sm:gap-4"
                >
                  <div className="col-span-1 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-sm font-bold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      {emi.emiNumber}
                    </div>
                    <span className="text-sm font-bold text-gray-900 sm:hidden">
                      EMI {emi.emiNumber}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-between sm:block">
                    <span className="text-xs font-medium uppercase text-gray-500 sm:hidden">
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
                    <span className="text-xs font-medium uppercase text-gray-500 sm:hidden">
                      Amount
                    </span>
                    <div>
                      <span className="text-sm font-black text-gray-900">
                        ₹ {(emi.totalAmount ?? emi.amount).toLocaleString("en-IN")}
                      </span>
                      {(emi.penalty ?? 0) > 0 && (
                        <p className="text-[10px] font-medium text-rose-500">
                          incl. ₹{emi.penalty?.toLocaleString("en-IN")} penalty
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1 flex justify-between sm:block">
                    <span className="text-xs font-medium uppercase text-gray-500 sm:hidden">
                      Status
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${emi.status === "PENDING"
                        ? "border-amber-200 bg-amber-50 text-amber-600"
                        : emi.status === "OVERDUE"
                          ? "border-rose-200 bg-rose-50 text-rose-600"
                          : emi.status === "PAID"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : emi.status === "PAYMENT_IN_PROGRESS"
                              ? "border-sky-200 bg-sky-50 text-sky-600"
                              : "border-blue-200 bg-blue-50 text-blue-600"
                        }`}
                    >
                      {emi.status}
                    </span>
                  </div>

                  <div className="relative col-span-1 mt-2 flex justify-end border-t border-gray-50 pt-3 sm:mt-0 sm:border-0 sm:pt-0">
                    {emi.status === "PAID" ? (
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-600 border border-emerald-200 shadow-sm transition-colors hover:bg-emerald-100 hover:text-emerald-700 sm:w-auto"
                        onClick={() => {
                          if (emi.emiId) setSelectedEmiId(emi.emiId);
                        }}
                      >
                        Details
                        <ChevronRight size={14} />
                      </button>
                    ) : isFirstPending ? (
                      <button
                        type="button"
                        className={`flex w-full items-center justify-center gap-1 rounded-lg px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors sm:w-auto disabled:cursor-not-allowed disabled:opacity-60 ${emi.status === "PAYMENT_IN_PROGRESS"
                            ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                            : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                          }`}
                        onClick={() => handlePayNow(emi.emiId)}
                        disabled={paymentMutation.isPending}
                      >
                        {paymentMutation.isPending ? (
                          "Processing..."
                        ) : emi.status === "PAYMENT_IN_PROGRESS" ? (
                          "Retry Payment"
                        ) : (
                          "Pay Now"
                        )}
                        {!paymentMutation.isPending && (
                          <ChevronRight size={14} />
                        )}
                      </button>
                    ) : (
                      <span
                        className="flex w-full cursor-not-allowed items-center justify-center px-3 py-1.5 text-xs font-semibold text-gray-400 sm:w-auto"
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
          <div className="pb-1 pt-3 text-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Show All {tenure} EMIs <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {selectedEmiId && (
        <EmiDetailsModal
          emiId={selectedEmiId}
          isOpen={!!selectedEmiId}
          onClose={() => setSelectedEmiId(null)}
        />
      )}
    </SectionCard>
  );
};

export default EmiListing;
