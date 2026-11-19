import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { EnvelopeOpenIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function AgentInquiries() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [selected, setSelected]   = useState(null);

    useEffect(() => {
        api.get('/my-inquiries')
            .then(r => setInquiries(r.data.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    const openInquiry = (inquiry) => {
        setSelected(inquiry);
        if (!inquiry.is_read) {
            api.patch(`/inquiries/${inquiry.id}/read`)
                .then(() => {
                    setInquiries(prev => prev.map(i => i.id === inquiry.id ? { ...i, is_read: true } : i));
                });
        }
    };

    const unreadCount = inquiries.filter(i => !i.is_read).length;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pesan Masuk</h1>
                {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                        {unreadCount} baru
                    </span>
                )}
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Inbox list */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center text-gray-400 animate-pulse">Memuat...</div>
                    ) : inquiries.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📭</p>
                            <p className="text-gray-500 text-sm">Belum ada pesan masuk</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                            {inquiries.map(inq => (
                                <button
                                    key={inq.id}
                                    onClick={() => openInquiry(inq)}
                                    className={`w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors ${
                                        selected?.id === inq.id ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 flex-shrink-0 ${inq.is_read ? 'text-gray-300' : 'text-blue-500'}`}>
                                            {inq.is_read
                                                ? <EnvelopeOpenIcon className="w-5 h-5" />
                                                : <EnvelopeIcon className="w-5 h-5" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm truncate ${inq.is_read ? 'font-normal text-gray-700' : 'font-semibold text-gray-900'}`}>
                                                {inq.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate mt-0.5">{inq.property?.title}</p>
                                            <p className="text-xs text-gray-400 truncate mt-1">{inq.message}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6">
                    {!selected ? (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                            <EnvelopeOpenIcon className="w-12 h-12 text-gray-200 mb-3" />
                            <p className="text-gray-400 text-sm">Pilih pesan untuk melihat detailnya</p>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-5 pb-5 border-b border-gray-100">
                                <h2 className="font-bold text-gray-900 text-lg">{selected.name}</h2>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <span>✉️ {selected.email}</span>
                                    {selected.phone && <span>📞 {selected.phone}</span>}
                                </div>
                            </div>

                            <div className="mb-5">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Properti</p>
                                <p className="text-sm font-semibold text-blue-600">{selected.property?.title}</p>
                            </div>

                            <div className="mb-6">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Pesan</p>
                                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selected.message}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={`mailto:${selected.email}?subject=Re: ${selected.property?.title}`}
                                    className="flex-1 py-2.5 text-center text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    ✉️ Balas via Email
                                </a>
                                {selected.phone && (
                                    <a
                                        href={`https://wa.me/${selected.phone.replace(/^0/, '62').replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2.5 text-center text-sm font-semibold bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                    >
                                        📱 WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
