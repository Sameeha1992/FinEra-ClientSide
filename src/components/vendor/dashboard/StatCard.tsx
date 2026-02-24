import React from 'react';

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  items?: { label: string; value: string | number }[];
  actionButton?: { label: string; onClick: () => void; variant?: 'primary' | 'danger' };
}

export default function StatCard({ title, icon, iconBg, items, actionButton }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
      </div>

      {items && (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className={`w-full mt-4 py-2 rounded-lg font-medium transition-all ${
            actionButton.variant === 'danger'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-teal-500 text-white hover:bg-teal-600'
          }`}
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
}
