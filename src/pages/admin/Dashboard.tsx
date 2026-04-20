import {
  Users,
  Building2,
  ShieldCheck,
  ShieldX,
  FileText,
  CheckCircle2,
  IndianRupee,
  PieChart as PieChartIcon,
} from "lucide-react";
import AdminLayout from "@/components/layout/Adminlayout";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";

/* ─── Custom Tooltip for Chart ──────────────────────────────── */

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
        <p className="text-sm font-semibold text-slate-700">
          {payload[0].name}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Count:{" "}
          <span className="font-bold text-slate-900">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/* ─── Component ──────────────────────────────────────────────── */

const AdminDashboard = () => {
  const { data, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 text-slate-600">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  if (isError || !data) {
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">Failed to load dashboard data</div>
      </AdminLayout>
    );
  }

  const summary = data.summary;
  const vendorStatus = data.vendorStatusOverview;

  const summaryCards = [
    {
      label: "Total Users",
      value: summary.totalUsers,
      icon: <Users size={22} />,
      accent: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Vendors",
      value: summary.totalVendors,
      icon: <Building2 size={22} />,
      accent: "bg-violet-50 text-violet-600",
    },
    {
      label: "Verified Vendors",
      value: summary.verifiedVendors,
      icon: <ShieldCheck size={22} />,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Not Verified Vendors",
      value: summary.nonVerifiedVendors,
      icon: <ShieldX size={22} />,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Loan Applications",
      value: summary.totalLoanApplications,
      icon: <FileText size={22} />,
      accent: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "Approved Loans",
      value: summary.approvedLoans,
      icon: <CheckCircle2 size={22} />,
      accent: "bg-teal-50 text-teal-600",
    },
    {
      label: "Total Revenue",
      value: `₹${summary.totalRevenue}`,
      icon: <IndianRupee size={22} />,
      accent: "bg-rose-50 text-rose-600",
    },
  ];

  const vendorStatusData = [
    {
      name: "Approved Vendors",
      value: vendorStatus.approved,
      color: "#10b981",
    },
    {
      name: "Pending Vendors",
      value: vendorStatus.pending,
      color: "#f59e0b",
    },
    {
      name: "Rejected Vendors",
      value: vendorStatus.rejected,
      color: "#ef4444",
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Platform performance and vendor metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`flex items-center justify-center w-11 h-11 rounded-lg shrink-0 ${card.accent}`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {card.label}
              </p>
              <p className="text-xl font-semibold text-slate-800 mt-1">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Vendor Status Overview
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Distribution of vendor verification results
              </p>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
              <PieChartIcon size={20} />
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendorStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vendorStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-slate-600 font-medium ml-2">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {vendorStatusData.map((item) => (
            <div
              key={item.name}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-slate-700">
                  {item.name}
                </span>
              </div>
              <span className="text-lg font-bold text-slate-900">
                {item.value}
              </span>
            </div>
          ))}

          <div className="bg-teal-50 p-5 rounded-xl border border-teal-100 flex flex-col justify-center h-full">
            <p className="text-sm text-teal-700 font-medium">
              Quick Suggestion
            </p>
            <p className="text-xs text-teal-600 mt-1">
              You have {vendorStatus.pending} pending vendor requests. Review
              them in the verification section to expedite onboarding.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;