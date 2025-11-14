import AdminDashboardLayout from './AdminDashboardLayout';
import DashboardSwitcher from '../../../components/common/DashboardSwitcher';

const AdminDashboard = () => {
  console.log('AdminDashboard component rendered');
  return (
    <div className="relative">
      <AdminDashboardLayout />
      <DashboardSwitcher />
    </div>
  );
};

export default AdminDashboard;