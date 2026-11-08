export type UserRole = 'admin' | 'yonetim' | 'egitmen' | 'uye' | 'caylak';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  studentNo?: string;
  phone?: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';
  role: UserRole;
  avatar: string;
  bio?: string;
  badges: string[];
  cavingCount: number;
  joinedAt: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  iconName: string;
  color: string;
  postCount: number;
}

export interface Comment {
  id: string;
  topicId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}

export interface ForumTopic {
  id: string;
  categoryId: string;
  author: User;
  title: string;
  content: string;
  createdAt: string;
  viewsCount: number;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  isAnnouncement?: boolean;
  tags: string[];
  images?: string[];
  comments?: Comment[];
}

export type EventDifficulty = 'Basit / Yatay Mağara' | 'Orta Seviye' | 'İleri / Dikey Mağara (SRT Zorunlu)';
export type EventStatus = 'Planlandı' | 'Kayıtlar Açık' | 'Kayıtlar Kapandı' | 'Tamamlandı';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  caveName: string;
  startDate: string;
  endDate: string;
  quota: number;
  difficulty: EventDifficulty;
  status: EventStatus;
  organizer: string;
  leaders: string[];
  requirements: string[];
  registeredUserIds: string[];
  coverImage: string;
  images?: string[];
}

export interface Cave {
  id: string;
  name: string;
  district: string;
  depth: number;
  length: number;
  difficulty: 'Kolay' | 'Orta' | 'Dikey/Zor' | 'Ekstrem';
  coordinates: {
    lat: number;
    lng: number;
  };
  surveyAvailable: boolean;
  surveyImageUrl?: string;
  waterStatus: 'Kuru' | 'Mevsimsel Sulu' | 'Aktif Yeraltı Nehri';
  verticalDrops: string;
  description: string;
  images: string[];
}

export interface Equipment {
  id: string;
  name: string;
  brandModel: string;
  category: 'İp & Halat' | 'Kişisel Dikey Ekipman' | 'Kask & Aydınlatma' | 'Emniyet & Ankraj' | 'Ortak Kamp Malzemesi';
  serialNo: string;
  status: 'Kulüp Deposunda' | 'Zimmette' | 'Bakımda / Kontrolde' | 'Hizmet Dışı';
  assignedTo?: string;
  assignedDate?: string;
  lastInspectionDate: string;
  condition: 'Mükemmel' | 'İyi' | 'Orta (Takip Gerektirir)' | 'Emekliye Ayrılmalı';
}

export interface CaveSafetyLog {
  id: string;
  caveName: string;
  teamLeader: string;
  surfaceWatchPerson: string;
  contactPhone: string;
  entryTime: string;
  estimatedExitTime: string;
  teamSize: number;
  status: 'Mağarada (Faaliyette)' | 'Güvenle Çıktı' | 'Gecikme Alarmı';
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  desk: string; // Hangi masa: Örn: "Yönetim Masası", "Eğitim & SRT Masası", "Lojistik & Malzeme Masası", "Basın Masası"
  avatar?: string;
  contact?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  icon?: string;
  updatedAt: string;
  isImportant?: boolean;
}
