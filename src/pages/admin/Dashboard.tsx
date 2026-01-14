import React from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Example cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl mt-2">120</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Total Vendors</h2>
            <p className="text-2xl mt-2">35</p>
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Pending Verifications</h2>
            <p className="text-2xl mt-2">8</p>
          </div>
        </div>

        {/* Placeholder for charts or tables */}
        <div className="mt-8">
          <div className="bg-white shadow rounded p-4 h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart / Analytics Placeholder</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
