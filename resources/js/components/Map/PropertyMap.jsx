import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix Leaflet icon default issue dengan webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const customIcon = new L.DivIcon({
    html: `<div style="background:#2563eb;color:white;border-radius:50% 50% 50% 0;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)">
        <span style="transform:rotate(45deg)">🏠</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
    className: '',
});

function formatPrice(price) {
    const n = Number(price);
    if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
    if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(0)} Jt`;
    return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function PropertyMap({ properties = [], center = [-6.2088, 106.8456], zoom = 11, height = '400px' }) {
    const validProperties = properties.filter(p => p.latitude && p.longitude);

    if (validProperties.length === 0) {
        return (
            <div
                className="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400"
                style={{ height }}
            >
                <div className="text-center">
                    <p className="text-4xl mb-2">🗺️</p>
                    <p className="text-sm">Lokasi tidak tersedia</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height }}>
            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {validProperties.map(p => (
                    <Marker
                        key={p.id}
                        position={[p.latitude, p.longitude]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="text-sm min-w-[180px]">
                                <p className="font-semibold text-gray-900 mb-1 leading-tight">{p.title}</p>
                                <p className="text-blue-600 font-bold mb-1">{formatPrice(p.price)}</p>
                                <p className="text-gray-500 text-xs mb-2">📍 {p.city}</p>
                                <Link
                                    to={`/properties/${p.slug}`}
                                    className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                    Lihat Detail →
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
