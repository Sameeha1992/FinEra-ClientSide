import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/vendor/dashboard/shared/Sidebar';
import StatCard from '@/components/vendor/dashboard/StatCard';
import LoanRepaymentChart from '@/components/vendor/dashboard/LoanRepaymentChat';
import LoanApplicationsChart from '@/components/vendor/dashboard/LoanApplicationChart';
import FinancialReports from '@/components/vendor/dashboard/FinanceReport';

export default function DashboardPage() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="ml-56 flex-1">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Pending Applications"
              icon={<DollarSign size={24} className="text-blue-500" />}
              iconBg="bg-blue-100"
              items={[
                { label: '10 Pending', value: '' },
                { label: 'Loan Types', value: '' },
                { label: '2 Personal', value: '' },
                { label: '5 Agricultural', value: '' },
                { label: '3 Home', value: '' },
              ]}
            />

            <StatCard
              title="Active Loans"
              icon={<TrendingUp size={24} className="text-orange-500" />}
              iconBg="bg-orange-100"
              items={[{ label: '142 Active', value: '' }]}
            />

            <StatCard
              title="Overdue EMI's"
              icon={<AlertCircle size={24} className="text-green-500" />}
              iconBg="bg-green-100"
              items={[
                { label: '3 Overdue', value: '' },
                { label: '50 Pendings', value: '' },
              ]}
              actionButton={{
                label: 'Send Reminder',
                onClick: () => console.log('Reminder sent'),
                variant: 'danger',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <LoanRepaymentChart />
            <LoanApplicationsChart />
          </div>

          <FinancialReports />
        </main>
      </div>
    </div>
  );
}
