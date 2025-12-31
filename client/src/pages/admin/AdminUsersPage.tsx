import { Users } from 'lucide-react';

const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-500">Manage registered customers</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
          <Users size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
          View customer details, order history, and manage roles using this
          module. Coming soon.
        </p>
      </div>
    </div>
  );
};

export default AdminUsersPage;
