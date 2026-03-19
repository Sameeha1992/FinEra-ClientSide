import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-gray-100 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
          !
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Your EMI payment was cancelled. You can try again anytime.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;