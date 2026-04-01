import React, { useState } from 'react';
import {
  FileText, Clock, TrendingUp, Briefcase, AlertTriangle,
  RefreshCcw, IndianRupee, BadgeAlert,
  LayoutDashboard, Users, MessageSquare,
  Settings, Package, LogOut, Download, Loader2,
  XCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import Sidebar from '@/components/vendor/dashboard/shared/Sidebar';
import { useVendorDashboard } from '@/hooks/vendor/useVendorDashboard';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);

const PIE_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 animate-pulse">
    <div className="w-10 h-10 bg-gray-100 rounded-xl" />
    <div>
      <div className="h-7 bg-gray-100 rounded w-20 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-32" />
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="h-5 bg-gray-100 rounded w-40 mb-2" />
    <div className="h-4 bg-gray-100 rounded w-56 mb-6" />
    <div className="h-64 bg-gray-50 rounded-xl" />
  </div>
);



// ─── Metric Card ──────────────────────────────────────────────────────────────

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  subtitle?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color, bgColor, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 font-poppins">{value}</p>
      <p className="text-sm font-medium text-gray-500 mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

// ─── Tooltips ─────────────────────────────────────────────────────────────────

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-2.5 text-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-500">{payload[0].value} applications</p>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-4 py-3 text-sm space-y-1">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const VendorDashboard: React.FC = () => {
  const { data, isLoading, isError, refetch, isFetching } = useVendorDashboard();

  const handleRefresh = () => refetch();

  

  const cards = data?.cards;
  const approvalRate = cards
    ? Math.round((cards.approvedApplications / (cards.totalApplications || 1)) * 100)
    : 0;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-56 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-10 py-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-poppins">Vendor Dashboard</h1>
              <p className="text-sm text-gray-400 mt-0.5">Real-time overview of your lending operations.</p>
            </div>
            <div className="flex items-center gap-3">
              
              <button
                onClick={handleRefresh}
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100"
                title="Refresh data"
              >
                <RefreshCcw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8">

          {/* Error Banner */}
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium">
              Failed to load dashboard data. Please refresh to try again.
            </div>
          )}

          {/* Metric Cards */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                <>
                  <DashboardCard
                    title="Total Applications"
                    value={cards?.totalApplications ?? 0}
                    icon={FileText}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    subtitle="Overall applications received"
                  />
                  <DashboardCard
                    title="Pending Applications"
                    value={cards?.pendingApplications ?? 0}
                    icon={Clock}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                    subtitle="Awaiting your review"
                  />
                  <DashboardCard
                    title="Approved Applications"
                    value={cards?.approvedApplications ?? 0}
                    icon={TrendingUp}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    subtitle="Successfully disbursed"
                  />
                  <DashboardCard
                    title="Rejected Applications"
                    value={data?.applicationStatusOverview.find(s => s.label === "Rejected")?.value ?? 0}
                    icon={XCircle}
                    color="text-rose-600"
                    bgColor="bg-rose-50"
                    subtitle="Not eligible for credit"
                  />
                  <DashboardCard
                    title="Total Loan Products"
                    value={cards?.totalLoanProducts ?? 0}
                    icon={Briefcase}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    subtitle="Active loan offerings"
                  />
                  <DashboardCard
                    title="Overdue Loans"
                    value={cards?.overdueLoans ?? 0}
                    icon={BadgeAlert}
                    color="text-rose-600"
                    bgColor="bg-rose-50"
                    subtitle="Missed EMI payments"
                  />
                  <DashboardCard
                    title="Total Active Loans"
                    value={cards?.totalActiveLoans ?? 0}
                    icon={FileText}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    subtitle="Currently disbursed"
                  />
                  <DashboardCard
                    title="Monthly Repayments"
                    value={formatCurrency(cards?.repaymentsThisMonth ?? 0)}
                    icon={IndianRupee}
                    color="text-teal-600"
                    bgColor="bg-teal-50"
                    subtitle="EMI collections this month"
                  />
                </>
              )}
            </div>
          </section>

          {/* Outstanding Penalty Banner */}
          {!isLoading && (cards?.outstandingPenalty ?? 0) > 0 && (
            <div className="flex items-center gap-4 bg-rose-50 border border-rose-200 rounded-2xl px-6 py-4">
              <div className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-800">Outstanding Penalty</p>
                <p className="text-xs text-rose-500 mt-0.5">Unpaid penalty charges across all overdue accounts</p>
              </div>
              <span className="text-xl font-bold text-rose-700 font-poppins">
                {formatCurrency(cards!.outstandingPenalty)}
              </span>
            </div>
          )}

          {/* Charts Row 1 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {isLoading ? (
              <>
                <SkeletonChart />
                <SkeletonChart />
              </>
            ) : (
              <>
                {/* Donut — Application Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-base font-bold text-gray-900 font-poppins mb-1">Application Status Overview</h3>
                  <p className="text-xs text-gray-400 mb-6">Distribution of all applications by current status</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={data?.applicationStatusOverview ?? []}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={3}
                      >
                        {(data?.applicationStatusOverview ?? []).map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                          <span className="text-xs text-gray-600 font-medium">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar — Loan Type Distribution */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-base font-bold text-gray-900 font-poppins mb-1">Loan Type Distribution</h3>
                  <p className="text-xs text-gray-400 mb-6">Applications received per loan product</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={data?.loanTypeDistribution ?? []}
                      layout="vertical"
                      margin={{ left: 10, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="label" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={95} />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: '#f9fafb' }} />
                      <Bar dataKey="value" name="Applications" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </section>

          {/* Monthly Trend */}
          {isLoading ? (
            <SkeletonChart />
          ) : (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-900 font-poppins mb-1">Monthly Application Trend</h3>
              <p className="text-xs text-gray-400 mb-6">Approved, rejected, and pending applications over the last 6 months</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data?.monthlyApplicationTrend ?? []} margin={{ left: 0, right: 10 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: '#f9fafb' }} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-gray-600 font-medium capitalize">{value}</span>
                    )}
                  />
                  <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" name="Rejected" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending"  name="Pending"  fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          )}

          {/* Quick Actions */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-6 font-poppins">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: '/vendor/add-loan',      icon: Briefcase,     label: 'Add New Loan',   hover: 'hover:bg-blue-50   hover:border-blue-100',   bg: 'bg-blue-100',   iconBg: 'group-hover:bg-blue-200',   color: 'text-blue-600'   },
                { href: '/vendor/user-loans',    icon: FileText,      label: 'Review Apps',    hover: 'hover:bg-emerald-50 hover:border-emerald-100', bg: 'bg-emerald-100', iconBg: 'group-hover:bg-emerald-200', color: 'text-emerald-600' },
                { href: '/vendor/conversations', icon: MessageSquare, label: 'Support Chat',   hover: 'hover:bg-purple-50  hover:border-purple-100',  bg: 'bg-purple-100', iconBg: 'group-hover:bg-purple-200',  color: 'text-purple-600' },
                { href: '/vendor/analytics',     icon: TrendingUp,    label: 'View Analytics', hover: 'hover:bg-amber-50   hover:border-amber-100',   bg: 'bg-amber-100',  iconBg: 'group-hover:bg-amber-200',   color: 'text-amber-600'  },
              ].map(({ href, icon: Icon, label, hover, bg, iconBg, color }) => (
                <a
                  key={label}
                  href={href}
                  className={`flex items-center gap-4 p-5 rounded-2xl border border-gray-100 ${hover} transition-all group`}
                >
                  <div className={`p-3 rounded-xl ${bg} ${iconBg} transition-colors`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">{label}</span>
                </a>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
