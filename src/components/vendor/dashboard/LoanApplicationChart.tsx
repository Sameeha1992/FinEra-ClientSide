
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', 'Total Applications': 8, 'Approved': 0, 'Rejected': 0 },
  { month: 'Feb', 'Total Applications': 6, 'Approved': 5, 'Rejected': 1 },
  { month: 'Mar', 'Total Applications': 8, 'Approved': 3, 'Rejected': 5 },
  { month: 'Apr', 'Total Applications': 7, 'Approved': 6, 'Rejected': 1 },
  { month: 'May', 'Total Applications': 5, 'Approved': 4, 'Rejected': 1 },
  { month: 'Jun', 'Total Applications': 7, 'Approved': 2, 'Rejected': 5 },
  { month: 'Jul', 'Total Applications': 8, 'Approved': 5, 'Rejected': 3 },
  { month: 'Aug', 'Total Applications': 6, 'Approved': 4, 'Rejected': 2 },
  { month: 'Sep', 'Total Applications': 5, 'Approved': 2, 'Rejected': 3 },
  { month: 'Oct', 'Total Applications': 7, 'Approved': 3, 'Rejected': 4 },
  { month: 'Nov', 'Total Applications': 8, 'Approved': 6, 'Rejected': 2 },
  { month: 'Dec', 'Total Applications': 6, 'Approved': 4, 'Rejected': 2 },
];

export default function LoanApplicationsChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Applications Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="Total Applications" fill="#7C3AED" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Approved" fill="#10B981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Rejected" fill="#F97316" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
