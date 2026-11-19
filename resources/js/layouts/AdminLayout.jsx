import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    HomeIcon, BuildingOffice2Icon, UsersIcon,
    TagIcon, ArrowLeftOnRectangleIcon, Bars3Icon
} from '@heroicons/react/24/outline';

const nav = [
    { to: '/admin',             label: 'Dashboard',   icon: HomeIcon,              end: true },
    { to: '/admin/properties',  label: 'Properti',    icon: BuildingOffice2Icon },
    { to: '/admin/users',       label: 'Pengguna',    icon: UsersIcon },
    { to: '/admin/categories',  label: 'Kategori',    icon: TagIcon },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();
    const [open, setOpen]  = useState(false);

    const handleLogout = async () => { await logout(); navigate('/login'); };

    const Sidebar = () => (
        <aside className="flex flex-col w-64 bg-gray-900 text-white min-h-screen">
            <div className="px-6 py-5 border-b border-gray-700">
                <span className="text-xl font-bold">🏠 PropSpace</span>
                <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded">Admin</span>
            </div>
            <div className="px-4 py-4 border-b border-gray-700">
                <p className="font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                {nav.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to} to={to} end={end}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>
            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Keluar
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="hidden lg:flex"><Sidebar /></div>
            {open && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
                    <div className="relative z-10"><Sidebar /></div>
                </div>
            )}
            <div className="flex-1 flex flex-col">
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
                    <span className="font-bold">🏠 PropSpace Admin</span>
                    <button onClick={() => setOpen(true)}><Bars3Icon className="w-6 h-6" /></button>
                </header>
                <main className="flex-1 p-6"><Outlet /></main>
            </div>
        </div>
    );
}
