import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    HomeIcon, BuildingOffice2Icon, ChatBubbleLeftRightIcon,
    PlusCircleIcon, ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';

const nav = [
    { to: '/agent',              label: 'Dashboard',  icon: HomeIcon,                   end: true },
    { to: '/agent/properties',   label: 'Properti Saya', icon: BuildingOffice2Icon },
    { to: '/agent/properties/add', label: 'Tambah Properti', icon: PlusCircleIcon },
    { to: '/agent/inquiries',    label: 'Pesan Masuk', icon: ChatBubbleLeftRightIcon },
];

export default function AgentLayout() {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();
    const [open, setOpen]  = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const Sidebar = () => (
        <aside className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
                <span className="text-xl font-bold text-blue-600">🏠 PropSpace</span>
            </div>
            <div className="px-4 py-4 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Agen</p>
                <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                {nav.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to} to={to} end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                        }
                        onClick={() => setOpen(false)}
                    >
                        <Icon className="w-5 h-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>
            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Keluar
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Mobile sidebar */}
            {open && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
                    <div className="relative z-10">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col">
                <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                    <span className="font-bold text-blue-600">🏠 PropSpace Agen</span>
                    <button onClick={() => setOpen(true)}>
                        <Bars3Icon className="w-6 h-6 text-gray-600" />
                    </button>
                </header>
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
