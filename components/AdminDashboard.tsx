import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './admin/AdminSidebar';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;