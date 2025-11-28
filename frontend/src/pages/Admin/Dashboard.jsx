import { useEffect, useMemo, useState } from 'react';
import api from '../../api/api';
import Pagination from '../../components/Pagination.jsx';

const stats = [
  { label: 'Total Patients', value: '1,284', trend: '+6.4%' },
  { label: 'Active Doctors', value: '64', trend: '+2 this week' },
  { label: 'Pending Approvals', value: '12', trend: 'Review today' },
  { label: 'Invoices Due', value: '$42.8K', trend: 'Next 7 days' }
];

const recentActivities = [
  { title: 'Dr. Smith approved', time: '5 min ago' },
  { title: 'New patient: Amanda Lee', time: '12 min ago' },
  { title: 'Invoice #INV-204 paid', time: '45 min ago' },
  { title: 'System backup completed', time: '1 hour ago' }
];

const roles = ['admin', 'doctor', 'patient', 'receptionist'];
const initialForm = {
  name: '',
  email: '',
  role: 'doctor',
  phone: '',
  password: '',
  approved: true
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 6 });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingUser, setEditingUser] = useState(null);

  const limit = 6;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (roleFilter !== 'all') params.role = roleFilter;
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCreate = () => {
    setEditingUser(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = user => {
    setEditingUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      phone: user.phone || '',
      password: '',
      approved: user.approved ?? true
    });
    setModalOpen(true);
  };

  const handleDelete = async user => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (editingUser) {
        await api.put(`/admin/users/${editingUser._id}`, payload);
      } else {
        if (!form.password) {
          setError('Password is required for new users');
          setSaving(false);
          return;
        }
        await api.post('/admin/users', payload);
      }
      setModalOpen(false);
      setForm(initialForm);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const tableBody = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
            Loading users...
          </td>
        </tr>
      );
    }

    if (!users.length) {
      return (
        <tr>
          <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
            No users found
          </td>
        </tr>
      );
    }

    return users.map(user => (
      <tr key={user._id} className="border-b border-slate-100">
        <td className="py-4 text-sm font-semibold text-slate-900">{user.name}</td>
        <td className="py-4 text-sm text-slate-600">{user.email}</td>
        <td className="py-4 text-sm capitalize text-slate-600">{user.role}</td>
        <td className="py-4 text-sm text-slate-600">{user.phone || '—'}</td>
        <td className="py-4 text-sm text-slate-600">
          {user.approved ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Approved
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Pending
            </span>
          )}
        </td>
        <td className="py-4 text-right text-sm">
          <button
            onClick={() => handleOpenEdit(user)}
            className="rounded-full px-3 py-1 text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="rounded-full px-3 py-1 text-rose-600 transition hover:bg-rose-50"
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  }, [loading, users]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">
          Admin Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, Admin</h1>
        <p className="mt-1 text-slate-600">
          Here&apos;s a quick snapshot of what needs your attention today.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(card => (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-2 text-sm text-emerald-600">{card.trend}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">System Health</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
              All services operational
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">API uptime</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">99.98%</p>
              <p className="mt-1 text-xs text-slate-500">Rolling 30-day window</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Average response time</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">182 ms</p>
              <p className="mt-1 text-xs text-slate-500">-14% vs last week</p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <ul className="mt-6 space-y-4">
            {recentActivities.map(item => (
              <li key={item.title} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
            <p className="text-sm text-slate-500">Search, paginate, and manage the care team</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800"
          >
            Add user
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/2">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
              ⌕
            </span>
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 md:w-auto"
          >
            <option value="all">All roles</option>
            {roles.map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">{tableBody}</tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onPageChange={setPage}
        />
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingUser ? 'Update user' : 'Add new user'}
                </h3>
                <p className="text-sm text-slate-500">
                  {editingUser ? 'Modify account details' : 'Create a new account'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-600">Role</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Password {editingUser && <span className="text-slate-400">(leave blank to keep)</span>}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={editingUser ? '••••••••' : 'Minimum 6 characters'}
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  required={!editingUser}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="approved"
                  type="checkbox"
                  checked={form.approved}
                  onChange={e => setForm(prev => ({ ...prev, approved: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="approved" className="text-sm text-slate-600">
                  Approved
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingUser ? 'Update user' : 'Create user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

