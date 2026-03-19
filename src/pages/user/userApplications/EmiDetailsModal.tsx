import React from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Receipt, Calendar, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { EmiService } from "@/api/emi/emi";

type EmiDetailsModalProps = {
  emiId: string;
  isOpen: boolean;
  onClose: () => void;
};

const EmiDetailsModal: React.FC<EmiDetailsModalProps> = ({ emiId, isOpen, onClose }) => {
  const { data: emiDetails, isLoading, isError } = useQuery({
    queryKey: ["emiDetails", emiId],
    queryFn: () => EmiService.getEmiDetails(emiId),
    enabled: isOpen && !!emiId,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Receipt className="text-emerald-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">EMI Details</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-100 border-t-emerald-600" />
            </div>
          ) : isError || !emiDetails ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-red-500">
              <AlertCircle size={32} />
              <p className="text-sm font-medium">Failed to load details</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-bold text-emerald-600">
                  <CheckCircle2 size={16} />
                  {emiDetails.status}
                </div>
              </div>

              {/* Amount Display */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-500">Amount Paid</p>
                <p className="text-4xl font-black text-gray-900">
                  ₹ {emiDetails.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="h-px w-full bg-gray-100" />

              {/* Details Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Receipt size={16} />
                    <span className="text-sm font-medium">EMI Number</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {emiDetails.emiNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Due Date</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {new Date(emiDetails.dueDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>

                {emiDetails.paidAt && (
                   <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-gray-500">
                     <CreditCard size={16} />
                     <span className="text-sm font-medium">Paid On</span>
                   </div>
                   <span className="text-sm font-bold text-gray-900">
                     {new Date(emiDetails.paidAt).toLocaleDateString("en-GB", {
                       day: "numeric",
                       month: "short",
                       year: "numeric"
                     })}
                   </span>
                 </div>
                )}
                
                {emiDetails.penalty ? (
                   <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-gray-500">
                     <AlertCircle size={16} className="text-amber-500" />
                     <span className="text-sm font-medium">Penalty</span>
                   </div>
                   <span className="text-sm font-bold text-amber-600">
                     ₹ {emiDetails.penalty.toLocaleString("en-IN")}
                   </span>
                 </div>
                ): null}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmiDetailsModal;
