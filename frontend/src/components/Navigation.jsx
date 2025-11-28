// frontend/src/components/Navigation.jsx
import { Link, NavLink, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Admin' },
  { to: '/doctor', label: 'Doctor' },
  { to: '/patient', label: 'Patient' }
];

export default function Navigation() {
  const location = useLocation();
  const hideNav = ['/login', '/register', '/'].includes(location.pathname);

  if (hideNav) return null;

  return (
    <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/admin" className="text-lg font-semibold text-slate-900">
          HealthTech
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1 transition ${
                  isActive ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <Link
          to="/login"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Sign out
        </Link>
      </div>
    </nav>
  );
}

