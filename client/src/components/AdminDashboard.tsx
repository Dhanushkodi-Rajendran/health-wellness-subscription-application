import { Link } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';

type User = {
  _id: string;
  fullName: string;
  email: string;
  age: number;
  country: string;
  plan: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const { data: users, isLoading, error } = useUsers();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              All registered users from completed onboarding sessions
            </p>
          </div>
          <Link
            to="/onboarding"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            Go to App
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Total Users</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{users?.length ?? '—'}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Latest Signup</p>
            <p className="text-base font-bold text-slate-800 mt-1 truncate">
              {users?.[0]?.fullName ?? '—'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Most Popular Plan</p>
            <p className="text-base font-bold text-slate-800 mt-1">
              {users?.length
                ? (() => {
                    const counts: Record<string, number> = {};
                    users.forEach((u: User) => { counts[u.plan] = (counts[u.plan] || 0) + 1; });
                    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
                  })()
                : '—'}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="mt-4 text-slate-500 font-medium">Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-500 font-medium">Failed to load users. Please try again.</p>
            </div>
          ) : !users?.length ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">👤</div>
              <p className="text-slate-500 font-medium text-lg">No users yet</p>
              <p className="text-slate-400 text-sm mt-1">Users will appear here after completing onboarding.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">#</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Name</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Email</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Age</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Country</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Plan</th>
                    <th className="px-5 py-3 text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user: User, i: number) => (
                    <tr key={user._id} className="hover:bg-blue-50/40 transition-colors duration-150">
                      <td className="px-5 py-3 text-[13px] text-slate-400 font-mono">{i + 1}</td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-sm text-slate-800">{user.fullName}</span>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-slate-600">{user.email}</td>
                      <td className="px-5 py-3 text-[13px] text-slate-600">{user.age}</td>
                      <td className="px-5 py-3 text-[13px] text-slate-600">{user.country}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                          user.plan === 'Annual'
                            ? 'bg-green-100 text-green-700'
                            : user.plan === 'Quarterly'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
