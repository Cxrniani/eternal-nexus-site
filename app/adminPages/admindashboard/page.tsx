import AdminDashboard from '@/components/AdminDashboard';
import AdminRoute from '@/components/AdminRoute';
import React from 'react'

const AdminDashboardPage = () => {
    return (
        <><AdminRoute>
            <AdminDashboard/>
        </AdminRoute>
        </>
    );
};

export default AdminDashboardPage;