import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserDashboard } from "@/api/user/user.dashboard";
import type { 
  DashboardSummary, 
  ActiveLoanCard, 
  RejectedApplication 
} from "@/interfaces/user/dashboard/user.dashboard";
import { useQuery } from "@tanstack/react-query";

// --- Helper ---

const formatCompletionDate = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

// Maps loan type (lowercase) → user-facing form route
const loanTypeToRoute: Record<string, string> = {
  personal: "personal-loan",
  home: "home-loan",
  business: "business-loan",
  gold: "gold-loan",
};

// --- Sub-components ---

const DashboardSummaryCards = ({ summary }: { summary: DashboardSummary }) => {
  const summaryStats = [
    { label: "Total Loans", value: String(summary.totalLoans), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Loans", value: String(summary.activeLoans), icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Total Remaining Due", value: `₹${summary.totalRemainingDues.toLocaleString()}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Rejected Apps", value: String(summary.rejectedApplications), icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {summaryStats.map((stat, index) => (
        <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const LoanCard = ({ loan }: { loan: ActiveLoanCard }) => (
  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group">
    <div className="h-1 bg-teal-600 w-full" />
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <CardTitle className="font-bold text-lg text-gray-900 group-hover:text-teal-700 transition-colors uppercase tracking-tight">
          {loan.bankName}
        </CardTitle>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="text-[10px] font-bold text-teal-700 bg-teal-50 border-teal-200">
             {loan.loanType}
           </Badge>
           <Badge className="text-[10px] bg-green-100 text-green-700 hover:bg-green-100 border-none">
             Active
           </Badge>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-gray-400">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </CardHeader>
    <CardContent className="pt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400">Total Amount</p>
          <p className="font-bold text-gray-900">₹{loan.loanAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-gray-400">Remaining Due</p>
          <p className="font-bold text-teal-600">₹{loan.remainingDueAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500 font-medium">Repayment Progress</span>
          <span className="font-bold text-teal-700">{loan.completionPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-600 rounded-full transition-all duration-1000" 
            style={{ width: `${loan.completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Next EMI</p>
          <p className="text-sm font-bold text-gray-800">
            {loan.nextEmiAmount != null ? `₹${loan.nextEmiAmount.toLocaleString()}` : "—"}
          </p>
          <p className="text-[10px] text-gray-500">{loan.nextEmiDate ?? "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Completion</p>
          <p className="text-sm font-bold text-gray-800">{formatCompletionDate(loan.expectedDueDate)}</p>
          <p className="text-[10px] text-gray-500">{loan.expectedDueDate ?? "—"}</p>
        </div>
      </div>

    </CardContent>
  </Card>
);

const RejectedLoanSection = ({ rejectedApplications }: { rejectedApplications: RejectedApplication[] }) => {
  const navigate = useNavigate();

  const handleReapply = (app: RejectedApplication) => {
    const typeKey = app.loanType.toLowerCase();
    const route = loanTypeToRoute[typeKey];
    if (route) {
      const params = new URLSearchParams({
        applicationId: app.applicationId,
        loanType: app.loanType.toUpperCase(),
      });
      navigate(`/user/${route}?${params.toString()}`);
    } else {
      navigate(`/user/loans?type=${typeKey}`);
    }
  };

  return (
  <div className="mt-12">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        Rejected Applications
        <Badge variant="destructive" className="rounded-full px-2 py-0 h-5">
          {rejectedApplications.length}
        </Badge>
      </h2>
    </div>

    {rejectedApplications.length > 0 ? (
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400">
              <th className="px-6 py-4">Bank / Vendor</th>
              <th className="px-6 py-4">Loan Type</th>
              <th className="px-6 py-4">Requested Amount</th>
              <th className="px-6 py-4">Rejection Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rejectedApplications.map((app) => (
              <tr key={app.applicationId} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900">{app.bankName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.loanType}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{app.requestedAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                    {app.rejectionReason}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="destructive" className="text-[10px] uppercase font-bold">
                    {app.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button onClick={() => handleReapply(app)} variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase border-gray-200 hover:bg-gray-900 hover:text-white group-hover:border-gray-900 transition-all">
                    Reapply
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
           <AlertCircle className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium tracking-tight">No rejected applications found</p>
        <p className="text-xs text-gray-400 mt-1">Your application history is clean!</p>
      </div>
    )}
  </div>
  );
};

// --- Main Page ---

const UserDashboardPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDashboard"],
    queryFn: () => UserDashboard.getUserDashbaord(),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[500px]">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Failed to Load Dashboard</h3>
        <p className="text-gray-500">{error instanceof Error ? error.message : "Something went wrong"}</p>
      </div>
    );
  }

  const { summary, activeLoanCards, rejectedApplications } = data!;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Track your loans, EMIs, due dates, and rejected applications
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <DashboardSummaryCards summary={summary} />

      {/* Active Loans Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Active Loans
            <span className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeLoanCards.length}
            </span>
          </h2>
          <Button variant="link" className="text-teal-600 text-sm font-bold hover:no-underline hover:text-teal-800">
            View All Loans
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeLoanCards.map((loan) => (
            <LoanCard key={loan.loanId} loan={loan} />
          ))}
        </div>
      </div>

      {/* Rejected Loans Section */}
      <RejectedLoanSection rejectedApplications={rejectedApplications} />
      
      {/* Footer Info */}
      <div className="pt-12 pb-8 text-center border-t border-gray-100">
         <p className="text-xs text-gray-400 font-medium">FinEra Loan Management Dashboard • {new Date().getFullYear()}</p>
      </div>
    </div>
  );
};

export default UserDashboardPage;
