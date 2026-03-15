import React, { useMemo } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Image as ImageIcon,
  Briefcase,
  Home,
  Banknote,
  Shield,
  Calendar,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserApplicationservice } from "@/api/user/user.loan.application";

const StatusBadge = ({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED";
}) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {status === "PENDING" && <Clock className="w-3 h-3 mr-1" />}
      {status === "APPROVED" && <CheckCircle2 className="w-3 h-3 mr-1" />}
      {status === "REJECTED" && <Circle className="w-3 h-3 mr-1" />}
      {status}
    </span>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
    <span className="text-sm font-medium text-gray-500 w-1/3 shrink-0">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-900 mt-1 sm:mt-0 text-left sm:text-right">
      {value}
    </span>
  </div>
);

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

export const UserApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userApplicationDetail", id],
    queryFn: () => UserApplicationservice.getApplicationDetail(id as string),
    enabled: !!id,
  });
  console.log("gggkggggggg",data, "the data of the application details");
  console.log("ooooooooo",data?.loanMongoId, "loan mongo id from application detail");

  const formattedDate = useMemo(() => {
    if (!data?.appliedDate) return "";
    return new Date(data.appliedDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [data?.appliedDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">
          Loading application details...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Circle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Failed to load details
          </h3>
          <p className="text-gray-500 mb-6">
            We couldn't fetch your application details at this time. Please try
            again later.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleViewEmi = () => {
    if (!data?.loanMongoId) return;
    navigate(`/user/emilist/${data.loanMongoId}`);
  };

  const renderLoanSpecificDetails = () => {
    switch (data.loanType) {
      case "PERSONAL":
        return (
          <SectionCard
            title="Personal Loan Details"
            icon={<Briefcase size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <InfoRow
                label="Employer Name"
                value={data.personalDetails?.employerName || "N/A"}
              />
              <InfoRow
                label="Years of Experience"
                value={
                  data.personalDetails?.yearsOfExperience
                    ? `${data.personalDetails.yearsOfExperience} Years`
                    : "N/A"
                }
              />
              <div className="md:col-span-2">
                <InfoRow
                  label="Loan Purpose"
                  value={data.personalDetails?.purpose || "N/A"}
                />
              </div>
            </div>
            {data.personalDetails?.salarySlipUrl && (
              <div className="mt-6 pt-6 border-t border-gray-50">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Salary Slip
                </h3>
                <a
                  href={data.personalDetails.salarySlipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors w-full sm:w-auto border border-blue-100"
                >
                  <FileText size={18} />
                  View Salary Slip
                </a>
              </div>
            )}
          </SectionCard>
        );
      case "GOLD":
        return (
          <SectionCard title="Gold Loan Details" icon={<Shield size={20} />}>
            <div className="mb-6">
              <InfoRow
                label="Gold Weight"
                value={
                  data.goldDetails?.goldWeight
                    ? `${data.goldDetails.goldWeight} Grams`
                    : "N/A"
                }
              />
            </div>
            {data.goldDetails?.goldImageUrl && (
              <div className="pt-4 border-t border-gray-50">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Gold Item Preview
                </h3>
                <div className="rounded-xl overflow-hidden border border-gray-200 inline-block bg-gray-50">
                  <img
                    src={data.goldDetails.goldImageUrl}
                    alt="Gold Item"
                    className="h-48 w-auto object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            )}
          </SectionCard>
        );
      case "HOME":
        return (
          <SectionCard title="Home Loan Details" icon={<Home size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <InfoRow
                label="Property Value"
                value={
                  data.homeDetails?.propertyValue
                    ? `₹ ${data.homeDetails.propertyValue.toLocaleString("en-IN")}`
                    : "N/A"
                }
              />
              <InfoRow
                label="Property Type"
                value={data.homeDetails?.propertyType || "N/A"}
              />
              <div className="md:col-span-2">
                <InfoRow
                  label="Property Location"
                  value={data.homeDetails?.propertyLocation || "N/A"}
                />
              </div>
            </div>
            {data.homeDetails?.propertyDocUrl && (
              <div className="mt-6 pt-6 border-t border-gray-50">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Property Document
                </h3>
                <a
                  href={data.homeDetails.propertyDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors w-full sm:w-auto border border-blue-100"
                >
                  <FileText size={18} />
                  View Document
                </a>
              </div>
            )}
          </SectionCard>
        );
      case "BUSINESS":
        return (
          <SectionCard
            title="Business Loan Details"
            icon={<Banknote size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <InfoRow
                label="Business Name"
                value={data.businessDetails?.businessName || "N/A"}
              />
              <InfoRow
                label="Business Type"
                value={data.businessDetails?.businessType || "N/A"}
              />
              <div className="md:col-span-2">
                <InfoRow
                  label="Annual Revenue"
                  value={
                    data.businessDetails?.annualRevenue
                      ? `₹ ${data.businessDetails.annualRevenue.toLocaleString("en-IN")}`
                      : "N/A"
                  }
                />
              </div>
            </div>
            {data.businessDetails?.registrationDocUrl && (
              <div className="mt-6 pt-6 border-t border-gray-50">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Registration Document
                </h3>
                <a
                  href={data.businessDetails.registrationDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors w-full sm:w-auto border border-blue-100"
                >
                  <FileText size={18} />
                  View Document
                </a>
              </div>
            )}
          </SectionCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-fit flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mt-2">
                Application Details
              </h1>
              <p className="text-gray-500 mt-1">
                View the complete details of your submitted loan application
              </p>
            </div>
          </div>

          {data.status === "APPROVED" && (
            <button
              onClick={handleViewEmi}
              className="w-fit flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm mt-3 sm:mt-11"
            >
              <Calendar size={18} />
              View EMI Schedule
            </button>
          )}
        </div>

        {/* Information Box */}
        {data.status === "PENDING" && (
          <div className="bg-blue-50/80 border border-blue-200/60 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="mt-0.5 text-blue-600 bg-white p-2 rounded-full shadow-sm">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-base font-semibold text-blue-900">
                Application Under Review
              </h4>
              <p className="text-sm text-blue-700/80 mt-1 leading-relaxed">
                Your application is currently being reviewed by our team. We
                will notify you once your vendor updates the status.
              </p>
            </div>
          </div>
        )}

        {data.status === "REJECTED" && data.rejectionReason && (
          <div className="bg-rose-50/80 border border-rose-200/60 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-sm relative overflow-hidden mb-6">
            <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="mt-0.5 text-rose-600 bg-white p-2 rounded-full shadow-sm shrink-0">
              <Circle size={20} />
            </div>
            <div>
              <h4 className="text-base font-semibold text-rose-900">
                Application Rejected
              </h4>
              <p className="text-sm text-rose-700/80 mt-1 leading-relaxed">
                <span className="font-semibold">Reason:</span>{" "}
                {data.rejectionReason}
              </p>
            </div>
          </div>
        )}

        {/* Application Progress Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">
          <h2 className="text-lg font-bold text-gray-800 mb-8">
            Application Progress
          </h2>
          <div className="relative max-w-2xl mx-auto">
            {/* Connecting Line Tracker */}
            <div className="absolute left-[1.1rem] top-4 bottom-4 w-1 bg-gray-100 sm:left-4 sm:top-[1.1rem] sm:w-[calc(100%-2rem)] sm:h-1 sm:bottom-auto rounded-full overflow-hidden">
              <div
                className={`h-full sm:h-full w-full bg-emerald-400 transition-all ${
                  data.status === "APPROVED"
                    ? "sm:w-full h-full"
                    : data.status === "REJECTED"
                      ? "sm:w-full h-full !bg-rose-400"
                      : "h-1/2 sm:w-1/2"
                }`}
              ></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-6 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-3 bg-white pl-1 sm:px-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border-4 border-white shadow-sm shrink-0 relative z-10">
                  <CheckCircle2 size={20} />
                </div>
                <div className="pt-1.5 sm:pt-0">
                  <p className="text-base font-bold text-gray-900 sm:text-center">
                    Applied
                  </p>
                  <p className="text-sm text-gray-500 sm:text-center mt-0.5">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-3 bg-white pl-1 sm:px-2">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 relative z-10 transition-colors ${
                    data.status !== "PENDING"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {data.status !== "PENDING" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
                  )}
                </div>
                <div className="pt-1.5 sm:pt-0">
                  <p
                    className={`text-base font-bold sm:text-center ${data.status !== "PENDING" ? "text-gray-900" : "text-blue-700"}`}
                  >
                    Under Review
                  </p>
                  {data.status === "PENDING" && (
                    <p className="text-sm text-blue-500 font-medium sm:text-center mt-0.5">
                      Current Phase
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-3 bg-white pl-1 sm:px-2">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 relative z-10 transition-colors ${
                    data.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-600"
                      : data.status === "REJECTED"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {data.status === "APPROVED" ? (
                    <CheckCircle2 size={20} />
                  ) : data.status === "REJECTED" ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Circle className="fill-current opacity-30" size={12} />
                  )}
                </div>
                <div className="pt-1.5 sm:pt-0">
                  <p
                    className={`text-base font-bold sm:text-center ${
                      data.status === "APPROVED"
                        ? "text-gray-900"
                        : data.status === "REJECTED"
                          ? "text-rose-700"
                          : "text-gray-400"
                    }`}
                  >
                    {data.status === "PENDING"
                      ? "Decision"
                      : data.status === "APPROVED"
                        ? "Approved"
                        : "Rejected"}
                  </p>
                  {data.status === "APPROVED" && (
                    <p className="text-sm text-emerald-500 font-medium sm:text-center mt-0.5">
                      Completed
                    </p>
                  )}
                  {data.status === "REJECTED" && (
                    <p className="text-sm text-rose-500 font-medium sm:text-center mt-0.5">
                      Declined
                    </p>
                  )}
                  {data.status === "PENDING" && (
                    <p className="text-sm text-gray-400 sm:text-center mt-0.5">
                      Pending
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Application Summary Card */}
            <SectionCard
              title="Application Summary"
              icon={<FileText size={20} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1">
                {data.applicationNumber && (
                  <InfoRow
                    label="Application Number"
                    value={
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                        {data.applicationNumber}
                      </span>
                    }
                  />
                )}
                <InfoRow
                  label="Application ID"
                  value={
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 text-xs">
                      {data.applicationId}
                    </span>
                  }
                />
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-3 border-b border-gray-100 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                  <span className="text-sm font-medium text-gray-500 mt-1">
                    Status
                  </span>
                  <div className="mt-2 sm:mt-0">
                    <StatusBadge
                      status={
                        data.status as "PENDING" | "APPROVED" | "REJECTED"
                      }
                    />
                  </div>
                </div>
                <InfoRow label="Applied Date" value={formattedDate} />
                <InfoRow
                  label="Loan Type"
                  value={
                    <span className="capitalize font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {data.loanType?.toLowerCase()} Loan
                    </span>
                  }
                />
                <InfoRow
                  label="Loan Amount"
                  value={
                    <span className="text-lg font-black text-emerald-600 bg-emerald-50 px-2 rounded-md">
                      ₹ {data.loanAmount?.toLocaleString("en-IN") || 0}
                    </span>
                  }
                />
                <InfoRow
                  label="Loan Tenure"
                  value={`${data.loanTenure || 0} Months`}
                />
                <InfoRow
                  label="Monthly Income"
                  value={`₹ ${data.monthlyIncome?.toLocaleString("en-IN") || 0}`}
                />
                <InfoRow
                  label="Phone Number"
                  value={data.phoneNumber || "N/A"}
                />
                {data.employmentType && (
                  <InfoRow
                    label="Employment Type"
                    value={
                      <span className="capitalize">
                        {data.employmentType.toLowerCase()}
                      </span>
                    }
                  />
                )}
              </div>
            </SectionCard>

            {/* Dynamic Loan Specific Section */}
            {renderLoanSpecificDetails()}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Additional sidebar items can go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApplicationDetail;
