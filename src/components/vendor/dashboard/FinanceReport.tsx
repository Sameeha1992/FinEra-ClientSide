'use client';

import { useState } from 'react';
import { Download} from 'lucide-react';

export default function FinancialReports() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for dates:', fromDate, toDate);
  };

  const handleDownloadExcel = () => {
    console.log('Downloading Excel for dates:', fromDate, toDate);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Download Financial Reports</h3>

      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="mm/dd/yyyy"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="mm/dd/yyyy"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
          >
            <Download size={18} />
            Download PDF
          </button>

          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-all font-medium"
          >
            <Download size={18} />
            Download Excel
          </button>
        </div>
      </div>
    </div>
  );
}
