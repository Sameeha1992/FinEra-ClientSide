import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import EmiDetailsModal from "../EmiDetailsModal";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const emiId = searchParams.get("emiId"); // Assuming we pass the emiId in the URL
  const loanId = localStorage.getItem("lastPaidEmiLoanId");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-gray-100 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
          ✓
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          Your EMI payment was completed successfully.
        </p>

        {sessionId && (
          <p className="text-xs text-gray-400 break-all mb-6">
            Session ID: {sessionId}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {emiId && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100"
            >
              View EMI Details
            </button>
          )}
          <Link
            to="/user/home"
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            Go to Home
          </Link>
          {loanId && (
            <Link
              to={`/user/emilist/${loanId}`}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-100"
            >
              Go to EMI List
            </Link>
          )}
        </div>
      </div>

      {emiId && (
        <EmiDetailsModal
          emiId={emiId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PaymentSuccess;