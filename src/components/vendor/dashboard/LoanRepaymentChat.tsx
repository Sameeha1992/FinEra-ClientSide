
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Principal', value: 100000, fill: '#3B82F6' },
  { name: 'Interest', value: 25000, fill: '#A78BFA' },
  { name: 'Penalty', value: 3919, fill: '#F97316' },
];

export default function LoanRepaymentChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Loan Repayment Graph</h3>
        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">Monthly</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="text-sm font-medium text-gray-700">Total Amount Received</div>
        <div className="text-3xl font-bold text-gray-900">₹128,919</div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-xs">
            <div className="text-gray-500">Principal</div>
            <div className="font-semibold text-gray-900">₹100,000</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-500">Interest</div>
            <div className="font-semibold text-purple-600">₹25,000</div>
          </div>
          <div className="text-xs">
            <div className="text-gray-500">Penalty</div>
            <div className="font-semibold text-orange-600">₹3,919</div>
          </div>
        </div>
      </div>
    </div>
  );
}
