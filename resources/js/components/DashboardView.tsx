import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import {
  Search,
  Bell,
  ChevronDown,
  Home,
  Image as ImageIcon,
  BookOpen,
  Heart,
  Users,
  Settings,
  Sparkles,
  Upload,
  ArrowRight,
  Plus,
  ArrowLeft,
  X,
  MapPin,
  Calendar,
  Check,
  Menu,
  Trash2,
  Edit3,
  LogOut,
  User,
  Share2,
  Filter,
  ExternalLink,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Moment, Album, UserProfile } from '../types/memora';

interface DashboardViewProps {
  onBackToLanding: () => void;
  user?: { name: string; email: string };
}

const DEFAULT_MOMENTS: Moment[] = [
  {
    id: 'm1',
    title: 'Langit biru Pantai Timang',
    location: 'Gunungkidul, Jogja',
    date: '16 Juni 2024',
    imageUrl: '/images/jogja-friends.jpg',
    aspect: 'portrait',
    category: 'sahabat',
    isFavorite: true,
    polaroidNote: 'Jogja ‘24 ♡',
    rotation: '-rotate-[1deg]',
  },
  {
    id: 'm2',
    title: 'Debur ombak sore Parangtritis',
    location: 'Bantul, Jogja',
    date: '15 Juni 2024',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    aspect: 'landscape',
    category: 'liburan',
    isFavorite: true,
    polaroidNote: 'Senja jingga & debur ombak',
    rotation: 'rotate-0',
  },
  {
    id: 'm3',
    title: 'Kesejukan Kaliurang',
    location: 'Sleman, Jogja',
    date: '12 Juni 2024',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    aspect: 'portrait',
    category: 'sahabat',
    isFavorite: false,
    polaroidNote: 'Menikmati udara sejuk Merapi',
    rotation: 'rotate-[2deg]',
  },
  {
    id: 'm4',
    title: 'Santai di Tepi Pantai Pok Tunggal',
    location: 'Tepus, Jogja',
    date: '10 Juni 2024',
    imageUrl: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    aspect: 'landscape',
    category: 'petualangan',
    isFavorite: true,
    polaroidNote: 'Teduh di bawah pohon rindang',
    rotation: '-rotate-[1.5deg]',
  },
];

const DEFAULT_ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Liburan Jogja',
    momentCount: 124,
    coverUrl: '/images/jogja-friends.jpg',
    tagColor: '#E8703D',
    style: 'polaroid',
  },
  {
    id: '2',
    title: 'Sahabat Selamanya',
    momentCount: 86,
    coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
    tagColor: '#5C7A5E',
    style: 'stacked',
  },
  {
    id: '3',
    title: 'Petualangan',
    momentCount: 42,
    coverUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
    tagColor: '#20231F',
    style: 'film',
  },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  onBackToLanding,
  user = { name: 'Alya Putri', email: 'alya.putri@email.com' },
}) => {
  // Navigation active tab
  const [activeMenu, setActiveMenu] = useState<'beranda' | 'semua' | 'album' | 'favorit' | 'dibagikan' | 'pengaturan'>('beranda');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile dropdown state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // User profile state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('memora_user_profile');
      return saved ? JSON.parse(saved) : { name: user.name, email: user.email, bio: 'Pecinta fotografi analog & perjalanan hangat.' };
    } catch {
      return { name: user.name, email: user.email, bio: 'Pecinta fotografi analog & perjalanan hangat.' };
    }
  });

  // Filter pills for "Momen terbaru"
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Liburan' | 'Sahabat' | 'Petualangan' | 'Favorit'>('Semua');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [isEditingMoment, setIsEditingMoment] = useState(false);

  // Upload Form State
  const [newCaption, setNewCaption] = useState('');
  const [newLocation, setNewLocation] = useState('Jogja');
  const [newCategory, setNewCategory] = useState<'liburan' | 'sahabat' | 'petualangan' | 'favorit'>('liburan');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCategory, setEditCategory] = useState<'liburan' | 'sahabat' | 'petualangan' | 'favorit'>('liburan');

  // New Album Form State
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumColor, setNewAlbumColor] = useState('#E8703D');

  // Moments state with localStorage persistence
  const [moments, setMoments] = useState<Moment[]>(() => {
    try {
      const saved = localStorage.getItem('memora_moments');
      return saved ? JSON.parse(saved) : DEFAULT_MOMENTS;
    } catch {
      return DEFAULT_MOMENTS;
    }
  });

  // Albums state with localStorage persistence
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem('memora_albums');
      return saved ? JSON.parse(saved) : DEFAULT_ALBUMS;
    } catch {
      return DEFAULT_ALBUMS;
    }
  });

  // Save to localStorage whenever moments or albums change
  useEffect(() => {
    try {
      localStorage.setItem('memora_moments', JSON.stringify(moments));
    } catch (e) {
      console.warn('Storage quota exceeded or error saving moments', e);
    }
  }, [moments]);

  useEffect(() => {
    try {
      localStorage.setItem('memora_albums', JSON.stringify(albums));
    } catch (e) {
      console.warn('Error saving albums', e);
    }
  }, [albums]);

  useEffect(() => {
    try {
      localStorage.setItem('memora_user_profile', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Error saving user profile', e);
    }
  }, [currentUser]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Operations for Moments
  const toggleFavorite = (id: string) => {
    setMoments((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
    if (selectedMoment && selectedMoment.id === id) {
      setSelectedMoment((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const deleteMoment = (id: string) => {
    if (window.confirm('Apakah kamu yakin ingin menghapus momen berharga ini?')) {
      setMoments((prev) => prev.filter((m) => m.id !== id));
      if (selectedMoment?.id === id) {
        setSelectedMoment(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage =
      uploadedImagePreview ||
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

    const rotations = ['-rotate-[1deg]', 'rotate-0', 'rotate-[1.5deg]', '-rotate-[2deg]'];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    const newMoment: Moment = {
      id: `m_${Date.now()}`,
      title: newCaption || 'Kenangan Indah Baru',
      location: newLocation || 'Jogja',
      date: 'Hari ini',
      imageUrl: finalImage,
      aspect: 'landscape',
      category: newCategory,
      isFavorite: false,
      polaroidNote: newCaption || 'Momen baru yang hangat',
      rotation: randomRotation,
    };

    setMoments([newMoment, ...moments]);
    setIsUploadOpen(false);
    setNewCaption('');
    setNewLocation('Jogja');
    setUploadedImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartEdit = (moment: Moment) => {
    setEditTitle(moment.polaroidNote || moment.title);
    setEditLocation(moment.location);
    setEditCategory(moment.category);
    setIsEditingMoment(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMoment) return;
    setMoments((prev) =>
      prev.map((m) =>
        m.id === selectedMoment.id
          ? {
              ...m,
              title: editTitle,
              polaroidNote: editTitle,
              location: editLocation,
              category: editCategory,
            }
          : m
      )
    );
    setSelectedMoment((prev) =>
      prev
        ? {
            ...prev,
            title: editTitle,
            polaroidNote: editTitle,
            location: editLocation,
            category: editCategory,
          }
        : null
    );
    setIsEditingMoment(false);
  };

  // CRUD Operations for Albums
  const handleCreateAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    const newAlbum: Album = {
      id: `alb_${Date.now()}`,
      title: newAlbumTitle.trim(),
      momentCount: 0,
      coverUrl:
        uploadedImagePreview ||
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
      tagColor: newAlbumColor,
      style: 'polaroid',
    };

    setAlbums([...albums, newAlbum]);
    setNewAlbumTitle('');
    setIsCreateAlbumOpen(false);
  };

  const handleDeleteAlbum = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Hapus album ini?')) {
      setAlbums((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Reset to demo defaults
  const handleResetData = () => {
    if (window.confirm('Kembalikan semua data ke sampel awal?')) {
      setMoments(DEFAULT_MOMENTS);
      setAlbums(DEFAULT_ALBUMS);
      localStorage.removeItem('memora_moments');
      localStorage.removeItem('memora_albums');
    }
  };

  // Filter moments
  const filteredMoments = moments.filter((m) => {
    if (activeFilter === 'Semua') return true;
    if (activeFilter === 'Favorit') return m.isFavorite;
    return m.category.toLowerCase() === activeFilter.toLowerCase();
  });

  // Search filtered items
  const searchedMoments = moments.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      (m.polaroidNote && m.polaroidNote.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F7F3EB] text-[#20231F] flex flex-col font-sans select-none">
      {/* Top Banner: Quick switch back to Landing Page */}
      <div className="bg-[#242720] text-white px-4 py-2 text-xs flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E8703D] animate-ping" />
          <span className="font-medium text-[#CACCC4]">
            Memora Live Workspace • Mode Interaktif Lengkap
          </span>
        </div>
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8703D] hover:bg-[#D66130] text-white rounded-[4px] font-semibold transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Utama</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* ================= SIDEBAR NAVIGASI STANDAR & ELEGAN ================= */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-50
            w-64 bg-[#F7F3EB] border-r border-[#E8E2D4]
            flex flex-col justify-between
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            shadow-xl md:shadow-none
          `}
        >
          {/* Top Section */}
          <div className="p-5 flex-1 flex flex-col overflow-y-auto">
            {/* Header: Logo & Mobile Close */}
            <div className="flex items-center justify-between mb-8 px-2">
              <Logo variant="dark" size="md" />
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 text-[#64665F] hover:text-[#20231F] hover:bg-[#EAE4D7] rounded-md transition-colors"
                title="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action in Sidebar */}
            <button
              onClick={() => {
                setIsUploadOpen(true);
                setSidebarOpen(false);
              }}
              className="w-full mb-6 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#E8703D] hover:bg-[#D66130] text-white rounded-[5px] text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Foto Baru</span>
            </button>

            {/* Main Navigation Menu */}
            <nav className="space-y-1.5">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A8C84] px-3 mb-2">
                Menu Utama
              </div>

              <button
                onClick={() => {
                  setActiveMenu('beranda');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-sm font-semibold transition-all cursor-pointer ${
                  activeMenu === 'beranda'
                    ? 'bg-[#EAE4D7] text-[#20231F] shadow-xs'
                    : 'text-[#64665F] hover:bg-[#F0ECE1] hover:text-[#20231F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className={`w-4 h-4 ${activeMenu === 'beranda' ? 'text-[#E8703D]' : ''}`} />
                  <span>Beranda</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveMenu('semua');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-sm font-semibold transition-all cursor-pointer ${
                  activeMenu === 'semua'
                    ? 'bg-[#EAE4D7] text-[#20231F] shadow-xs'
                    : 'text-[#64665F] hover:bg-[#F0ECE1] hover:text-[#20231F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className={`w-4 h-4 ${activeMenu === 'semua' ? 'text-[#E8703D]' : ''}`} />
                  <span>Semua Foto</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E3DDCF] text-[#20231F]">
                  {moments.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveMenu('album');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-sm font-semibold transition-all cursor-pointer ${
                  activeMenu === 'album'
                    ? 'bg-[#EAE4D7] text-[#20231F] shadow-xs'
                    : 'text-[#64665F] hover:bg-[#F0ECE1] hover:text-[#20231F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-4 h-4 ${activeMenu === 'album' ? 'text-[#E8703D]' : ''}`} />
                  <span>Album</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E3DDCF] text-[#20231F]">
                  {albums.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveMenu('favorit');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-sm font-semibold transition-all cursor-pointer ${
                  activeMenu === 'favorit'
                    ? 'bg-[#EAE4D7] text-[#20231F] shadow-xs'
                    : 'text-[#64665F] hover:bg-[#F0ECE1] hover:text-[#20231F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className={`w-4 h-4 ${activeMenu === 'favorit' ? 'text-[#E8703D]' : ''}`} />
                  <span>Favorit</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E3DDCF] text-[#20231F]">
                  {moments.filter((m) => m.isFavorite).length}
                </span>
              </button>

              {/* Group Separator */}
              <div className="pt-4 mt-4 border-t border-[#E8E2D4]">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A8C84] px-3 mb-2">
                  Lainnya
                </div>

                <button
                  onClick={() => {
                    setActiveMenu('dibagikan');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] text-sm font-semibold transition-all cursor-pointer ${
                    activeMenu === 'dibagikan'
                      ? 'bg-[#EAE4D7] text-[#20231F] shadow-xs'
                      : 'text-[#64665F] hover:bg-[#F0ECE1] hover:text-[#20231F]'
                  }`}
                >
                  <Users className={`w-4 h-4 ${activeMenu === 'dibagikan' ? 'text-[#E8703D]' : ''}`} />
                  <span>Dibagikan</span>
                </button>

                <button
                  onClick={() => {
                    setActiveMenu('pengaturan');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] text-sm font-semibold transition-all cursor-pointer ${
                    activeMenu === 'pengaturan'
                      ? 'bg-[#EAE4D7] text-[#20231F] shadow-xs'
                      : 'text-[#64665F] hover:bg-[#F0ECE1] hover:text-[#20231F]'
                  }`}
                >
                  <Settings className={`w-4 h-4 ${activeMenu === 'pengaturan' ? 'text-[#E8703D]' : ''}`} />
                  <span>Pengaturan</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Bottom Storage Widget (Sesuai Referensi Gambar) */}
          <div className="p-5 border-t border-[#E8E2D4] bg-[#F4EFE3]/50">
            <div className="flex items-center justify-between text-xs mb-2 font-medium">
              <span className="text-[#64665F]">Kapasitas Simpan</span>
              <span className="text-[#20231F] font-semibold">1.2 GB / 5 GB</span>
            </div>
            {/* Progress bar with orange accent */}
            <div className="w-full bg-[#E5DFCE] h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-[#E8703D] h-full rounded-full w-[24%]" />
            </div>
            <p className="text-[11px] text-[#8A8C84]">
              Tersisa 3.8 GB ruang cerita gratis.
            </p>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Top Bar Header */}
          <header className="px-5 sm:px-8 py-3.5 border-b border-[#E8E2D4] bg-[#F7F3EB]/95 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between gap-4">
            {/* Mobile Sidebar Toggle Button */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-[#EAE4D7] text-[#20231F] transition-colors"
                title="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search Bar with ⌘K */}
              <div
                onClick={() => setIsSearchOpen(true)}
                className="w-full pl-3 pr-3 sm:pr-8 py-2 bg-[#F1ECE0]/70 border border-[#DDD7C8] hover:border-[#20231F] rounded-[6px] text-xs sm:text-sm text-[#64665F] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-4 h-4 text-[#8A8C84] shrink-0" />
                  <span className="truncate">Cari momen, tempat, atau tanggal...</span>
                </div>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white/80 border border-[#D0C9BA] rounded text-[10px] text-[#64665F] font-mono">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right: Notifications & Profile Pill with Functional Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Tidak ada notifikasi baru saat ini.')}
                className="p-2 rounded-full text-[#64665F] hover:text-[#20231F] hover:bg-[#EAE4D7] transition-colors relative"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#E8703D] absolute top-1.5 right-1.5" />
              </button>

              {/* Profile Pill with Dropdown Container */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-full hover:bg-[#EAE4D7] transition-all cursor-pointer group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D8D2C2]"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-[#20231F] leading-tight group-hover:text-[#E8703D]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-[#8A8C84] leading-tight">
                      Pribadi
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#8A8C84] transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FBFAF6] border border-[#DDD7C8] rounded-[8px] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-[#E8E2D4]">
                      <div className="text-xs font-bold text-[#20231F]">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-[#8A8C84] truncate">
                        {currentUser.email}
                      </div>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#EAE4D7] text-[#20231F] text-[9px] font-semibold rounded">
                        Akun Gratis • 5 GB
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveMenu('pengaturan');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-[#20231F] hover:bg-[#EAE4D7] flex items-center gap-2.5 transition-colors text-left"
                      >
                        <User className="w-3.5 h-3.5 text-[#64665F]" />
                        <span>Profil Saya</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveMenu('pengaturan');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-[#20231F] hover:bg-[#EAE4D7] flex items-center gap-2.5 transition-colors text-left"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#64665F]" />
                        <span>Pengaturan Akun</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsStudioOpen(true);
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-[#20231F] hover:bg-[#EAE4D7] flex items-center gap-2.5 transition-colors text-left"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E8703D]" />
                        <span>Buka Studio Cetak</span>
                      </button>
                    </div>

                    <div className="border-t border-[#E8E2D4] pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onBackToLanding();
                        }}
                        className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ================= DYNAMIC TAB CONTENT ================= */}
          <main className="p-5 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto space-y-10 flex-1">
            {/* 1. TAB: BERANDA */}
            {activeMenu === 'beranda' && (
              <>
                {/* Top Greeting & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <div className="text-[11px] font-bold tracking-widest uppercase text-[#E8703D] font-sans mb-1">
                      SENIN, 16 JUNI 2025
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl text-[#20231F] leading-tight mb-2">
                      Selamat pagi, {currentUser.name.split(' ')[0]}.
                    </h1>
                    <p className="inline-block text-sm sm:text-base text-[#20231F] bg-[#FCECE3] px-2 py-0.5 rounded-[3px] border border-[#F8D5C2]">
                      Ada banyak momen indah yang menunggumu hari ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsStudioOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D9D3C5] hover:border-[#20231F] text-[#20231F] text-sm font-semibold rounded-[5px] shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#E8703D]" />
                      <span>Buka studio</span>
                    </button>

                    <button
                      onClick={() => setIsUploadOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E8703D] hover:bg-[#D66130] text-white text-sm font-semibold rounded-[5px] shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Unggah momen</span>
                    </button>
                  </div>
                </div>

                {/* Highlight Memory Hero Banner (Dengan Foto Sahabat Jogja & Caption Jogja '24) */}
                <div className="relative rounded-[8px] overflow-hidden shadow-polaroid min-h-[260px] sm:min-h-[300px] flex items-center justify-between p-7 sm:p-10 group">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
                    alt="Pantai Jogja"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 brightness-[0.75]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />

                  {/* Banner Left Content */}
                  <div className="relative z-10 max-w-lg text-white">
                    <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#F5D879] mb-3">
                      <span>✦ HARI INI, SETAHUN LALU</span>
                    </div>

                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight mb-2">
                      Pantai, tawa, dan senja yang sama.
                    </h2>

                    <p className="text-xs sm:text-sm text-[#CACCC4] mb-6">
                      12 foto dari Jogja • 16 Juni 2024
                    </p>

                    <button
                      onClick={() => {
                        const m = moments[0];
                        if (m) setSelectedMoment(m);
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white underline underline-offset-4 hover:text-[#F5D879] transition-colors cursor-pointer"
                    >
                      <span>Lihat kenangan</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Banner Right Overlaid Polaroid (Menggunakan foto yang diberikan user & caption Jogja '24 ♡) */}
                  <div
                    onClick={() => {
                      const m = moments[0];
                      if (m) setSelectedMoment(m);
                    }}
                    className="hidden lg:block relative z-10 w-52 bg-white p-2.5 pb-5 rounded-xs shadow-2xl rotate-[6deg] hover:rotate-0 transition-transform duration-300 cursor-pointer"
                  >
                    <div className="aspect-[3/4] w-full rounded-xs overflow-hidden bg-[#242720]">
                      <img
                        src="/images/jogja-friends.jpg"
                        alt="Sahabat Jogja '24"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-['Caveat',cursive] text-lg text-[#20231F] font-bold">
                        Jogja ‘24 ♡
                      </span>
                    </div>
                  </div>
                </div>

                {/* Album Pilihan */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl text-[#20231F]">
                        Album pilihan
                      </h3>
                      <p className="text-xs sm:text-sm text-[#64665F]">
                        Kumpulan cerita yang paling sering kamu kunjungi.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveMenu('album')}
                      className="text-xs sm:text-sm font-semibold text-[#20231F] hover:text-[#E8703D] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat semua ({albums.length})</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Albums Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {albums.map((album) => (
                      <div
                        key={album.id}
                        onClick={() => {
                          setActiveFilter('Semua');
                          setActiveMenu('semua');
                        }}
                        className="bg-[#FBFAF6] p-4 rounded-[6px] border border-[#E8E2D4] shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5 truncate">
                          <div className="relative w-14 h-14 rounded-[4px] overflow-hidden bg-[#242720] shrink-0 border border-[#D9D3C5] shadow-xs">
                            <img
                              src={album.coverUrl}
                              alt={album.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div
                              className="absolute top-0 left-0 w-3 h-3"
                              style={{ backgroundColor: album.tagColor }}
                            />
                          </div>

                          <div className="truncate">
                            <h4 className="font-display text-base text-[#20231F] font-normal leading-snug group-hover:text-[#E8703D] transition-colors truncate">
                              {album.title}
                            </h4>
                            <span className="text-xs text-[#8A8C84]">
                              {album.momentCount} momen
                            </span>
                          </div>
                        </div>

                        <span className="text-xs text-[#8A8C84] group-hover:text-[#20231F] group-hover:translate-x-0.5 transition-all">
                          ›
                        </span>
                      </div>
                    ))}

                    {/* Card: "+ Buat album baru" */}
                    <div
                      onClick={() => setIsCreateAlbumOpen(true)}
                      className="bg-[#F1ECE0]/60 hover:bg-[#FBFAF6] border border-dashed border-[#CFC9BB] hover:border-[#E8703D] p-4 rounded-[6px] transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[80px]"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-[#D9D3C5] flex items-center justify-center text-[#20231F] group-hover:bg-[#E8703D] group-hover:text-white transition-colors mb-1.5 shadow-xs">
                        <Plus className="w-4 h-4" />
                      </div>
                      <h4 className="font-display text-sm text-[#20231F] font-normal">
                        Buat album baru
                      </h4>
                      <span className="text-[11px] text-[#8A8C84]">
                        Susun cerita versimu
                      </span>
                    </div>
                  </div>
                </div>

                {/* Momen Terbaru Section */}
                <div className="space-y-5 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl text-[#20231F]">
                        Momen terbaru
                      </h3>
                      <span className="text-xs text-[#8A8C84]">
                        {filteredMoments.length} momen ditemukan
                      </span>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-[#EAE4D7]/80 p-1 rounded-[6px]">
                      {(['Semua', 'Liburan', 'Sahabat', 'Petualangan', 'Favorit'] as const).map(
                        (filter) => (
                          <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1 text-xs font-semibold rounded-[4px] transition-all cursor-pointer ${
                              activeFilter === filter
                                ? 'bg-white text-[#20231F] shadow-xs'
                                : 'text-[#64665F] hover:text-[#20231F]'
                            }`}
                          >
                            {filter}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Photo Polaroid Grid */}
                  {filteredMoments.length === 0 ? (
                    <div className="text-center py-16 bg-[#FBFAF6] rounded-[8px] border border-dashed border-[#DDD7C8]">
                      <Heart className="w-8 h-8 text-[#8A8C84] mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium text-[#64665F]">
                        Belum ada momen untuk kategori ini.
                      </p>
                      <button
                        onClick={() => setIsUploadOpen(true)}
                        className="mt-3 px-4 py-2 bg-[#E8703D] text-white text-xs font-semibold rounded-[5px]"
                      >
                        Unggah Momen Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMoments.map((moment) => (
                        <div
                          key={moment.id}
                          className={`bg-white p-3.5 pb-6 rounded-xs shadow-polaroid border border-[#EDE8DC] hover:shadow-polaroid-lg transition-all duration-300 group cursor-pointer relative ${moment.rotation || 'rotate-0'}`}
                          onClick={() => setSelectedMoment(moment)}
                        >
                          {/* Washi tape deco */}
                          <div className="w-16 h-3.5 washi-tape opacity-75 mx-auto -mt-5 mb-2 rotate-[-1deg]" />

                          {/* Image container */}
                          <div className="relative aspect-[4/3] w-full rounded-xs overflow-hidden bg-[#242720]">
                            <img
                              src={moment.imageUrl}
                              alt={moment.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 saturate-[1.08]"
                            />

                            {/* Action Buttons on Hover */}
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(moment.id);
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                                  moment.isFavorite
                                    ? 'bg-[#E8703D] text-white'
                                    : 'bg-black/40 text-white hover:bg-black/60'
                                }`}
                                title={moment.isFavorite ? 'Hapus favorit' : 'Tandai favorit'}
                              >
                                <Heart
                                  className={`w-4 h-4 ${moment.isFavorite ? 'fill-white' : ''}`}
                                />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMoment(moment.id);
                                }}
                                className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                                title="Hapus foto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Handwritten polaroid caption */}
                          <div className="mt-3 px-1 flex items-center justify-between">
                            <div>
                              <span className="block font-['Caveat',cursive] text-lg text-[#20231F] font-bold leading-tight">
                                {moment.polaroidNote || moment.title}
                              </span>
                              <span className="text-[11px] text-[#8A8C84] flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-[#E8703D]" />
                                <span>{moment.location}</span>
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[#8A8C84]">
                              {moment.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 2. TAB: SEMUA FOTO */}
            {activeMenu === 'semua' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D4] pb-5">
                  <div>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#20231F]">
                      Semua Foto Kenangan
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64665F]">
                      Total {moments.length} momen tersimpan dalam album pribadimu.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8703D] hover:bg-[#D66130] text-white text-xs font-semibold rounded-[5px] shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Unggah Momen Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moments.map((moment) => (
                    <div
                      key={moment.id}
                      onClick={() => setSelectedMoment(moment)}
                      className="bg-white p-3.5 pb-6 rounded-xs shadow-polaroid border border-[#EDE8DC] hover:shadow-polaroid-lg transition-all duration-300 group cursor-pointer relative"
                    >
                      <div className="relative aspect-[4/3] w-full rounded-xs overflow-hidden bg-[#242720]">
                        <img
                          src={moment.imageUrl}
                          alt={moment.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(moment.id);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                              moment.isFavorite ? 'bg-[#E8703D] text-white' : 'bg-black/40 text-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${moment.isFavorite ? 'fill-white' : ''}`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMoment(moment.id);
                            }}
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 px-1 flex items-center justify-between">
                        <div>
                          <span className="block font-['Caveat',cursive] text-lg text-[#20231F] font-bold">
                            {moment.polaroidNote || moment.title}
                          </span>
                          <span className="text-[11px] text-[#8A8C84] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#E8703D]" />
                            {moment.location}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8A8C84]">
                          {moment.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TAB: ALBUM */}
            {activeMenu === 'album' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D4] pb-5">
                  <div>
                    <h2 className="font-display text-3xl sm:text-4xl text-[#20231F]">
                      Album Koleksi
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64665F]">
                      Kelompokkan foto berdasarkan tema perjalanan dan sahabatmu.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreateAlbumOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8703D] hover:bg-[#D66130] text-white text-xs font-semibold rounded-[5px] shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Album Baru</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {albums.map((album) => (
                    <div
                      key={album.id}
                      className="bg-[#FBFAF6] rounded-[8px] border border-[#DDD7C8] overflow-hidden shadow-xs hover:shadow-md transition-all group"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#242720]">
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                          style={{ backgroundColor: album.tagColor }}
                        >
                          Album
                        </div>
                        <button
                          onClick={(e) => handleDeleteAlbum(album.id, e)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all"
                          title="Hapus album"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-display text-lg text-[#20231F]">
                            {album.title}
                          </h4>
                          <p className="text-xs text-[#8A8C84]">
                            {album.momentCount} kenangan tersimpan
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveMenu('semua');
                          }}
                          className="px-3 py-1.5 bg-[#EAE4D7] hover:bg-[#20231F] hover:text-white text-[#20231F] rounded-[4px] text-xs font-semibold transition-all"
                        >
                          Buka
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TAB: FAVORIT */}
            {activeMenu === 'favorit' && (
              <div className="space-y-6">
                <div className="border-b border-[#E8E2D4] pb-5">
                  <h2 className="font-display text-3xl sm:text-4xl text-[#20231F]">
                    Foto Favorit
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64665F]">
                    Kenangan yang paling kamu cintai dan tandai dengan bintang hati.
                  </p>
                </div>

                {moments.filter((m) => m.isFavorite).length === 0 ? (
                  <div className="text-center py-20 bg-[#FBFAF6] rounded-[8px] border border-dashed border-[#DDD7C8]">
                    <Heart className="w-10 h-10 text-[#8A8C84] mx-auto mb-3 opacity-40" />
                    <h3 className="font-display text-lg text-[#20231F] mb-1">
                      Belum ada foto favorit
                    </h3>
                    <p className="text-xs text-[#64665F] max-w-sm mx-auto mb-4">
                      Klik tanda hati pada foto mana pun di beranda untuk menambahkannya ke koleksi favorit.
                    </p>
                    <button
                      onClick={() => setActiveMenu('beranda')}
                      className="px-4 py-2 bg-[#20231F] text-white text-xs font-semibold rounded-[5px]"
                    >
                      Jelajahi Beranda
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {moments
                      .filter((m) => m.isFavorite)
                      .map((moment) => (
                        <div
                          key={moment.id}
                          onClick={() => setSelectedMoment(moment)}
                          className="bg-white p-3.5 pb-6 rounded-xs shadow-polaroid border border-[#EDE8DC] hover:shadow-polaroid-lg transition-all cursor-pointer relative"
                        >
                          <div className="relative aspect-[4/3] w-full rounded-xs overflow-hidden bg-[#242720]">
                            <img
                              src={moment.imageUrl}
                              alt={moment.title}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(moment.id);
                              }}
                              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#E8703D] text-white flex items-center justify-center"
                            >
                              <Heart className="w-4 h-4 fill-white" />
                            </button>
                          </div>
                          <div className="mt-3 px-1 flex items-center justify-between">
                            <div>
                              <span className="block font-['Caveat',cursive] text-lg text-[#20231F] font-bold">
                                {moment.polaroidNote || moment.title}
                              </span>
                              <span className="text-[11px] text-[#8A8C84] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#E8703D]" />
                                {moment.location}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-[#8A8C84]">
                              {moment.date}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. TAB: DIBAGIKAN */}
            {activeMenu === 'dibagikan' && (
              <div className="space-y-6">
                <div className="border-b border-[#E8E2D4] pb-5">
                  <h2 className="font-display text-3xl sm:text-4xl text-[#20231F]">
                    Album & Momen Dibagikan
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64665F]">
                    Kolaborasi album foto bersama sahabat dan keluarga terdekat.
                  </p>
                </div>

                <div className="bg-[#FBFAF6] p-8 rounded-[8px] border border-[#DDD7C8] text-center max-w-lg mx-auto my-10">
                  <div className="w-12 h-12 rounded-full bg-[#EAE4D7] text-[#E8703D] flex items-center justify-center mx-auto mb-4">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl text-[#20231F] mb-2">
                    Bagikan Momen Tanpa Batas
                  </h3>
                  <p className="text-xs text-[#64665F] leading-relaxed mb-6">
                    Buat tautan aman untuk mengundang teman-temanmu agar dapat menambahkan foto mereka ke dalam satu album liburan bersama.
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert('Tautan album kolaboratif berhasil disalin ke clipboard!');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8703D] hover:bg-[#D66130] text-white text-xs font-semibold rounded-[5px] transition-all cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Salin Tautan Berbagi</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. TAB: PENGATURAN */}
            {activeMenu === 'pengaturan' && (
              <div className="space-y-8 max-w-2xl">
                <div className="border-b border-[#E8E2D4] pb-5">
                  <h2 className="font-display text-3xl sm:text-4xl text-[#20231F]">
                    Pengaturan Akun & Profil
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64665F]">
                    Kelola informasi pribadi, preferensi tampilan, dan penyimpanan.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Pengaturan profil berhasil disimpan!');
                  }}
                  className="bg-[#FBFAF6] p-6 rounded-[8px] border border-[#DDD7C8] space-y-5"
                >
                  <h3 className="font-display text-lg text-[#20231F] border-b border-[#E8E2D4] pb-2">
                    Informasi Profil
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#20231F] mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={currentUser.name}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D9D3C5] focus:border-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20231F] mb-1">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={currentUser.email}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D9D3C5] focus:border-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20231F] mb-1">
                      Bio Singkat
                    </label>
                    <textarea
                      rows={3}
                      value={currentUser.bio}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, bio: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-white border border-[#D9D3C5] focus:border-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-[4px] transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Data Demo</span>
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2 bg-[#E8703D] hover:bg-[#D66130] text-white text-xs font-semibold rounded-[5px] shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= MODAL 1: UNGGAH MOMEN BARU ================= */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FBFAF6] rounded-[8px] max-w-md w-full p-6 shadow-2xl border border-[#DDD7C8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D4] mb-4">
              <h3 className="font-display text-xl text-[#20231F]">
                Unggah Momen Baru
              </h3>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadedImagePreview('');
                }}
                className="text-[#64665F] hover:text-[#20231F] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Dropzone & Hidden Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D5CEBF] hover:border-[#E8703D] rounded-[6px] p-4 text-center bg-[#F4EFE3] cursor-pointer transition-colors relative overflow-hidden group min-h-[140px] flex flex-col items-center justify-center"
              >
                {uploadedImagePreview ? (
                  <div className="relative w-full h-36 rounded overflow-hidden">
                    <img
                      src={uploadedImagePreview}
                      alt="Pratinjau Foto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-white font-semibold">
                        Klik untuk ganti foto
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#E8703D] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-[#20231F] block">
                      Pilih foto dari perangkat
                    </span>
                    <span className="text-[11px] text-[#8A8C84]">
                      Mendukung JPG, PNG, HEIC dengan kualitas asli
                    </span>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20231F] mb-1">
                  Catatan Polaroid / Judul
                </label>
                <input
                  type="text"
                  required
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Contoh: Senja manis di Malioboro..."
                  className="w-full px-3 py-2 bg-white border border-[#D9D3C5] focus:border-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#20231F] mb-1">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Jogja"
                    className="w-full px-3 py-2 bg-white border border-[#D9D3C5] focus:border-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20231F] mb-1">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D9D3C5] focus:border-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none"
                  >
                    <option value="liburan">Liburan</option>
                    <option value="sahabat">Sahabat</option>
                    <option value="petualangan">Petualangan</option>
                    <option value="favorit">Favorit</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadOpen(false);
                    setUploadedImagePreview('');
                  }}
                  className="px-4 py-2 border border-[#D9D3C5] rounded-[5px] text-xs font-semibold text-[#64665F] hover:bg-[#EAE4D7] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E8703D] hover:bg-[#D66130] text-white rounded-[5px] text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Simpan Momen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: BUAT ALBUM BARU ================= */}
      {isCreateAlbumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FBFAF6] rounded-[8px] max-w-sm w-full p-6 shadow-2xl border border-[#DDD7C8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D4] mb-4">
              <h3 className="font-display text-xl text-[#20231F]">
                Buat Album Baru
              </h3>
              <button
                onClick={() => setIsCreateAlbumOpen(false)}
                className="text-[#64665F] hover:text-[#20231F] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbumSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#20231F] mb-1">
                  Nama Album
                </label>
                <input
                  type="text"
                  required
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="Contoh: Perjalanan Jogja '24"
                  className="w-full px-3 py-2 bg-white border border-[#D9D3C5] focus:border-[#E8703D] rounded-[5px] text-sm text-[#20231F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20231F] mb-2">
                  Pilih Warna Tag Sudut
                </label>
                <div className="flex items-center gap-3">
                  {['#E8703D', '#5C7A5E', '#20231F', '#F5D879', '#4A90E2'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewAlbumColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newAlbumColor === color ? 'scale-125 ring-2 ring-offset-2 ring-[#20231F]' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateAlbumOpen(false)}
                  className="px-4 py-2 border border-[#D9D3C5] rounded-[5px] text-xs font-semibold text-[#64665F] hover:bg-[#EAE4D7] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E8703D] hover:bg-[#D66130] text-white rounded-[5px] text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Buat Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: DETAIL / EDIT FOTO POLAROID ================= */}
      {selectedMoment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white p-4 pb-8 rounded-xs shadow-2xl max-w-lg w-full relative">
            <button
              onClick={() => {
                setSelectedMoment(null);
                setIsEditingMoment(false);
              }}
              className="absolute -top-10 right-0 text-white hover:text-[#E8703D] p-1 cursor-pointer"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Washi tape on modal */}
            <div className="w-20 h-4 washi-tape opacity-80 mx-auto -mt-6 mb-3" />

            <div className="aspect-[4/3] w-full rounded-xs overflow-hidden bg-[#242720]">
              <img
                src={selectedMoment.imageUrl}
                alt={selectedMoment.title}
                className="w-full h-full object-cover saturate-[1.1]"
              />
            </div>

            {isEditingMoment ? (
              <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 px-1">
                <div>
                  <label className="block text-xs font-semibold text-[#20231F] mb-1">
                    Judul / Catatan
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#D9D3C5] rounded text-sm text-[#20231F]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#20231F] mb-1">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#D9D3C5] rounded text-sm text-[#20231F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#20231F] mb-1">
                      Kategori
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e: any) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-1.5 border border-[#D9D3C5] rounded text-sm text-[#20231F]"
                    >
                      <option value="liburan">Liburan</option>
                      <option value="sahabat">Sahabat</option>
                      <option value="petualangan">Petualangan</option>
                      <option value="favorit">Favorit</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingMoment(false)}
                    className="px-3 py-1 border text-xs rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-[#E8703D] text-white text-xs rounded font-semibold"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-4 px-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Caveat',cursive] text-2xl text-[#20231F] font-bold">
                    {selectedMoment.polaroidNote || selectedMoment.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(selectedMoment)}
                      className="p-1.5 text-[#64665F] hover:text-[#20231F] rounded hover:bg-[#EAE4D7]"
                      title="Edit foto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedMoment.id)}
                      className="text-[#E8703D] p-1.5 hover:scale-110 transition-transform"
                      title="Favorit"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          selectedMoment.isFavorite ? 'fill-[#E8703D]' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => deleteMoment(selectedMoment.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Hapus foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#64665F] font-sans">
                  <span>📍 {selectedMoment.location}</span>
                  <span>•</span>
                  <span>📅 {selectedMoment.date}</span>
                  <span>•</span>
                  <span className="capitalize px-2 py-0.5 bg-[#F1ECE0] rounded text-[10px] font-semibold text-[#20231F]">
                    {selectedMoment.category}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 4: STUDIO SCRAPBOOK ================= */}
      {isStudioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#F7F3EB] rounded-[8px] max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-[#DDD7C8] flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D4]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E8703D]" />
                <h3 className="font-display text-2xl text-[#20231F]">
                  Studio Scrapbook Editorial
                </h3>
              </div>
              <button
                onClick={() => setIsStudioOpen(false)}
                className="text-[#64665F] hover:text-[#20231F] p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 p-8 bg-[#FBFAF6] border-2 border-dashed border-[#D9D3C5] rounded-[8px] min-h-[360px] relative flex flex-col items-center justify-center text-center">
              <div className="flex -space-x-4 mb-6">
                <div className="w-44 bg-white p-2.5 pb-6 rounded-xs shadow-polaroid -rotate-[4deg]">
                  <img
                    src="/images/jogja-friends.jpg"
                    alt="Jogja"
                    className="w-full h-28 object-cover rounded-xs"
                  />
                  <span className="font-['Caveat',cursive] text-sm text-[#20231F] font-bold block mt-2">
                    Jogja ‘24 ♡
                  </span>
                </div>
                <div className="w-44 bg-white p-2.5 pb-6 rounded-xs shadow-polaroid rotate-[5deg] z-10">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
                    alt="Friends"
                    className="w-full h-28 object-cover rounded-xs"
                  />
                  <span className="font-['Caveat',cursive] text-sm text-[#20231F] font-bold block mt-2">
                    Sahabat sejati ★
                  </span>
                </div>
              </div>

              <div className="w-64 p-3 bg-[#F5D879] text-[#20231F] rounded-xs shadow-sticky rotate-[2deg] mb-4">
                <p className="font-display italic text-sm">
                  “Setiap momen berharga berhak mendapatkan halaman indahnya sendiri.”
                </p>
              </div>

              <p className="text-xs text-[#64665F] max-w-sm">
                Seret foto, tambahkan washi tape, dan susun kenangan analog untuk dicetak menjadi buku fisik berkualitas tinggi.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D4]">
              <span className="text-xs text-[#8A8C84]">
                Format Scrapbook: 300 DPI Siap Cetak
              </span>
              <button
                onClick={() => {
                  alert('Album tersimpan! Siap dicetak di Studio Memora.');
                  setIsStudioOpen(false);
                }}
                className="px-5 py-2.5 bg-[#20231F] hover:bg-[#343831] text-white text-xs font-semibold rounded-[5px] cursor-pointer"
              >
                Selesai & Simpan Album
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: PENCARIAN CEPAT (⌘K) ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FBFAF6] rounded-[8px] max-w-lg w-full p-4 shadow-2xl border border-[#DDD7C8]">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-[#E8E2D4]">
              <Search className="w-4 h-4 text-[#8A8C84]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari foto, lokasi (Jogja, Pantai, Sahabat)..."
                className="w-full bg-transparent text-sm text-[#20231F] outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-[#8A8C84] hover:text-[#20231F] text-xs font-mono cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8C84] px-2 block">
                Hasil Pencarian ({searchedMoments.length})
              </span>
              {searchedMoments.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8A8C84]">
                  Tidak ada momen yang cocok.
                </div>
              ) : (
                searchedMoments.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedMoment(item);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-[5px] hover:bg-[#F2EDE1] cursor-pointer transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#20231F] block">
                        {item.polaroidNote || item.title}
                      </span>
                      <span className="text-[11px] text-[#8A8C84]">
                        {item.location} • {item.date}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
