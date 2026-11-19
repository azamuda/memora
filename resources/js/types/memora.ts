export interface Moment {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  aspect: 'square' | 'portrait' | 'landscape';
  category: 'liburan' | 'sahabat' | 'petualangan' | 'favorit';
  isFavorite?: boolean;
  caption?: string;
  polaroidNote?: string;
  rotation?: string;
}

export interface Album {
  id: string;
  title: string;
  momentCount: number;
  coverUrl: string;
  tagColor: string;
  style: 'polaroid' | 'film' | 'stacked';
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  storageUsed: number; // in GB
  storageTotal: number; // in GB
  avatarUrl: string;
}
