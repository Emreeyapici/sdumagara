'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ForumTopic, EventItem, Cave, Equipment, CaveSafetyLog, Comment, UserRole, BoardMember, FAQItem, GuideArticle } from '@/types';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_TOPICS,
  INITIAL_EVENTS,
  INITIAL_CAVES,
  INITIAL_EQUIPMENT,
  INITIAL_SAFETY_WATCH,
  INITIAL_BOARD_MEMBERS,
  INITIAL_FAQS,
  INITIAL_GUIDES,
} from '@/lib/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  isAdmin: boolean; // Sadece admin mi? (Emre Yapıcı)
  canViewPrivateSections: boolean; // admin, yonetim veya egitmen mi? (Mağara atlası, ekipman, canlı takip görebilir)

  login: (email: string, password: string) => { success: boolean; message?: string };
  register: (userData: {
    name: string;
    email: string;
    password: string;
    studentNo: string;
    bloodType: User['bloodType'];
    phone?: string;
    bio?: string;
  }) => { success: boolean; message?: string };
  changeUserRole: (userId: string, newRole: UserRole) => boolean;
  deleteUser: (userId: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  logout: () => void;

  // Forum
  topics: ForumTopic[];
  addTopic: (data: { categoryId: string; title: string; content: string; tags: string[]; isAnnouncement?: boolean; images?: string[] }) => string;
  updateTopic: (topicId: string, data: Partial<ForumTopic>) => boolean;
  deleteTopic: (topicId: string) => boolean;
  likeTopic: (topicId: string) => void;
  addComment: (topicId: string, content: string) => void;
  deleteComment: (topicId: string, commentId: string) => boolean;
  likeComment: (topicId: string, commentId: string) => void;

  // Events
  events: EventItem[];
  registerForEvent: (eventId: string) => void;
  cancelEventRegistration: (eventId: string) => void;
  addEvent: (eventData: Omit<EventItem, 'id' | 'registeredUserIds'>) => void;
  updateEvent: (eventId: string, data: Partial<EventItem>) => boolean;
  deleteEvent: (eventId: string) => boolean;

  // Caves (Mağara Atlası CRUD)
  caves: Cave[];
  addCave: (caveData: Omit<Cave, 'id'>) => void;
  updateCave: (caveId: string, data: Partial<Cave>) => boolean;
  deleteCave: (caveId: string) => boolean;

  // Equipment
  equipment: Equipment[];
  addEquipment: (data: Omit<Equipment, 'id'>) => void;
  updateEquipment: (equipmentId: string, data: Partial<Equipment>) => boolean;
  deleteEquipment: (equipmentId: string) => boolean;
  assignEquipment: (equipmentId: string, userName: string) => void;
  returnEquipment: (equipmentId: string) => void;

  // Badges & Member management by Admin
  addUserBadge: (userId: string, badgeName: string) => boolean;
  removeUserBadge: (userId: string, badgeName: string) => boolean;
  updateUserByAdmin: (userId: string, data: Partial<User>) => boolean;

  // Safety watch
  safetyLogs: CaveSafetyLog[];
  addSafetyLog: (log: Omit<CaveSafetyLog, 'id'>) => void;
  updateSafetyStatus: (logId: string, status: CaveSafetyLog['status']) => void;
  updateSafetyLog: (logId: string, data: Partial<CaveSafetyLog>) => boolean;
  deleteSafetyLog: (logId: string) => boolean;

  // Board & Desks (Kulüp Yönetimi & Masalar - Max 20)
  boardMembers: BoardMember[];
  addBoardMember: (data: Omit<BoardMember, 'id'>) => { success: boolean; message?: string };
  updateBoardMember: (id: string, data: Partial<BoardMember>) => boolean;
  deleteBoardMember: (id: string) => boolean;

  // FAQ (Sıkça Sorulan Sorular)
  faqs: FAQItem[];
  addFAQ: (data: Omit<FAQItem, 'id'>) => boolean;
  updateFAQ: (id: string, data: Partial<FAQItem>) => boolean;
  deleteFAQ: (id: string) => boolean;

  // Member Guides & Critical Information (Önemli Bilgiler & Üye Rehberi)
  guides: GuideArticle[];
  addGuide: (data: Omit<GuideArticle, 'id' | 'updatedAt'>) => string;
  updateGuide: (id: string, data: Partial<GuideArticle>) => boolean;
  deleteGuide: (id: string) => boolean;

  // Headlamp mode (Kafa Feneri Modu)
  headlampMode: boolean;
  toggleHeadlampMode: () => void;

  // Hydration status
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>(INITIAL_TOPICS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [caves, setCaves] = useState<Cave[]>(INITIAL_CAVES);
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [safetyLogs, setSafetyLogs] = useState<CaveSafetyLog[]>(INITIAL_SAFETY_WATCH);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(INITIAL_BOARD_MEMBERS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [guides, setGuides] = useState<GuideArticle[]>(INITIAL_GUIDES);
  const [headlampMode, setHeadlampMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Strictly check roles:
  const isAdmin = currentUser?.role === 'admin';
  const canViewPrivateSections = !!(
    currentUser &&
    (currentUser.role === 'admin' || currentUser.role === 'yonetim' || currentUser.role === 'egitmen')
  );

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('sdumak_users_v2');
      let currentUsersList = INITIAL_USERS;

      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        // Ensure Emre Yapıcı admin is always present and updated
        const hasEmre = parsed.some((u: User) => u.email.toLowerCase() === 'emre4821@outlook.com');
        if (!hasEmre) {
          currentUsersList = [...INITIAL_USERS, ...parsed];
        } else {
          // ensure Emre is always admin with correct password
          currentUsersList = parsed.map((u: User) =>
            u.email.toLowerCase() === 'emre4821@outlook.com'
              ? { ...u, role: 'admin' as UserRole, password: 'Luciddreams4090', name: 'Emre Yapıcı' }
              : u
          );
        }
      }
      setUsers(currentUsersList);

      const savedUser = localStorage.getItem('sdumak_current_user_v2');
      if (savedUser) {
        const found = currentUsersList.find((u) => u.id === savedUser);
        if (found) setCurrentUser(found);
      }

      const savedTopics = localStorage.getItem('sdumak_topics_v2');
      if (savedTopics) setTopics(JSON.parse(savedTopics));

      const savedEvents = localStorage.getItem('sdumak_events_v2');
      if (savedEvents) setEvents(JSON.parse(savedEvents));

      const savedCaves = localStorage.getItem('sdumak_caves_v2');
      if (savedCaves) setCaves(JSON.parse(savedCaves));

      const savedEquipment = localStorage.getItem('sdumak_equipment_v2');
      if (savedEquipment) setEquipment(JSON.parse(savedEquipment));

      const savedSafety = localStorage.getItem('sdumak_safety_v2');
      if (savedSafety) setSafetyLogs(JSON.parse(savedSafety));

      const savedBoard = localStorage.getItem('sdumak_board_v2');
      if (savedBoard) setBoardMembers(JSON.parse(savedBoard));

      const savedFaqs = localStorage.getItem('sdumak_faqs_v2');
      if (savedFaqs) setFaqs(JSON.parse(savedFaqs));

      const savedGuides = localStorage.getItem('sdumak_guides_v2');
      if (savedGuides) setGuides(JSON.parse(savedGuides));

      const savedHeadlamp = localStorage.getItem('sdumak_headlamp');
      if (savedHeadlamp) setHeadlampMode(JSON.parse(savedHeadlamp));
    } catch {
      // Safe fallback
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_users_v2', JSON.stringify(users));
    } catch {}
  }, [users, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_topics_v2', JSON.stringify(topics));
    } catch {}
  }, [topics, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_events_v2', JSON.stringify(events));
    } catch {}
  }, [events, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_caves_v2', JSON.stringify(caves));
    } catch {}
  }, [caves, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_equipment_v2', JSON.stringify(equipment));
    } catch {}
  }, [equipment, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_safety_v2', JSON.stringify(safetyLogs));
    } catch {}
  }, [safetyLogs, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_board_v2', JSON.stringify(boardMembers));
    } catch {}
  }, [boardMembers, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_faqs_v2', JSON.stringify(faqs));
    } catch {}
  }, [faqs, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('sdumak_guides_v2', JSON.stringify(guides));
    } catch {}
  }, [guides, isInitialized]);

  // Real Password-Protected Login
  const login = (email: string, password: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, message: 'Bu e-posta adresine ait kayıtlı üye bulunamadı.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Hatalı şifre girdiniz. Lütfen tekrar deneyin.' };
    }

    setCurrentUser(found);
    try {
      localStorage.setItem('sdumak_current_user_v2', found.id);
    } catch {}
    return { success: true };
  };

  // Real Registration (New users start as 'caylak', only Admin can grant higher roles!)
  const register = (data: {
    name: string;
    email: string;
    password: string;
    studentNo: string;
    bloodType: User['bloodType'];
    phone?: string;
    bio?: string;
  }): { success: boolean; message?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, message: 'Bu e-posta adresiyle zaten kayıtlı bir üye var.' };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'Şifreniz en az 6 karakter olmalıdır.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password,
      studentNo: data.studentNo.trim(),
      phone: data.phone?.trim() || '',
      bloodType: data.bloodType,
      role: 'caylak', // New users are ALWAYS registered as caylak!
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      bio: data.bio?.trim() || 'SDÜMAK Topluluğu Yeni Üyesi',
      badges: ['Yeni Üye (2026)', 'Çaylak'],
      cavingCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    try {
      localStorage.setItem('sdumak_current_user_v2', newUser.id);
    } catch {}
    return { success: true };
  };

  // Admin-Only Role Assignment
  const changeUserRole = (targetUserId: string, newRole: UserRole): boolean => {
    if (!isAdmin) return false;
    setUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === targetUserId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    return true;
  };

  // Admin-Only User Deletion
  const deleteUser = (targetUserId: string): boolean => {
    if (!isAdmin) return false;
    // Cannot delete the main admin
    const target = users.find((u) => u.id === targetUserId);
    if (target?.email.toLowerCase() === 'emre4821@outlook.com') {
      return false;
    }
    setUsers((prev) => prev.filter((u) => u.id !== targetUserId));
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    // Prevent normal user from changing their own role to admin
    const safeData = { ...data };
    if (!isAdmin) {
      delete safeData.role;
    }
    const updated = { ...currentUser, ...safeData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    try {
      localStorage.setItem('sdumak_current_user_v2', updated.id);
    } catch {}
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sdumak_current_user_v2');
    } catch {}
  };

  // Forum Actions - Strictly Admin Only can add/delete topics!
  const addTopic = (data: {
    categoryId: string;
    title: string;
    content: string;
    tags: string[];
    isAnnouncement?: boolean;
    images?: string[];
  }): string => {
    if (!isAdmin || !currentUser) return ''; // Only admin can create topics & news!
    const newTopicId = `topic-${Date.now()}`;
    const newTopic: ForumTopic = {
      id: newTopicId,
      categoryId: data.categoryId,
      author: currentUser,
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      likesCount: 0,
      likedBy: [],
      commentsCount: 0,
      isPinned: false,
      isAnnouncement: data.isAnnouncement || false,
      tags: data.tags.length > 0 ? data.tags : ['Genel'],
      images: data.images || [],
      comments: [],
    };
    setTopics((prev) => [newTopic, ...prev]);
    return newTopicId;
  };

  const deleteTopic = (topicId: string): boolean => {
    if (!isAdmin) return false; // Only admin can delete topics!
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    return true;
  };

  const updateTopic = (topicId: string, data: Partial<ForumTopic>): boolean => {
    if (!isAdmin) return false;
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, ...data } : t))
    );
    return true;
  };

  const likeTopic = (topicId: string) => {
    if (!currentUser) return;
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const hasLiked = t.likedBy.includes(currentUser.id);
        const newLikedBy = hasLiked
          ? t.likedBy.filter((id) => id !== currentUser.id)
          : [...t.likedBy, currentUser.id];
        return {
          ...t,
          likedBy: newLikedBy,
          likesCount: newLikedBy.length,
        };
      })
    );
  };

  // Comments (Logged in members can comment)
  const addComment = (topicId: string, content: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      topicId,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const currentComments = t.comments || [];
        return {
          ...t,
          comments: [...currentComments, newComment],
          commentsCount: currentComments.length + 1,
        };
      })
    );
  };

  const deleteComment = (topicId: string, commentId: string): boolean => {
    if (!currentUser) return false;
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const currentComments = t.comments || [];
        const commentToDelete = currentComments.find((c) => c.id === commentId);
        if (!commentToDelete) return t;

        // Admin or the comment author can delete
        if (!isAdmin && commentToDelete.author.id !== currentUser.id) {
          return t;
        }

        const filtered = currentComments.filter((c) => c.id !== commentId);
        return {
          ...t,
          comments: filtered,
          commentsCount: filtered.length,
        };
      })
    );
    return true;
  };

  const likeComment = (topicId: string, commentId: string) => {
    if (!currentUser) return;
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const currentComments = t.comments || [];
        return {
          ...t,
          comments: currentComments.map((c) => {
            if (c.id !== commentId) return c;
            const hasLiked = c.likedBy.includes(currentUser.id);
            const newLikedBy = hasLiked
              ? c.likedBy.filter((id) => id !== currentUser.id)
              : [...c.likedBy, currentUser.id];
            return {
              ...c,
              likedBy: newLikedBy,
              likes: newLikedBy.length,
            };
          }),
        };
      })
    );
  };

  // Events Actions - Strictly Admin Only can add/delete events!
  const registerForEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        if (ev.registeredUserIds.includes(currentUser.id)) return ev;
        return {
          ...ev,
          registeredUserIds: [...ev.registeredUserIds, currentUser.id],
        };
      })
    );
  };

  const cancelEventRegistration = (eventId: string) => {
    if (!currentUser) return;
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        return {
          ...ev,
          registeredUserIds: ev.registeredUserIds.filter((id) => id !== currentUser.id),
        };
      })
    );
  };

  const addEvent = (eventData: Omit<EventItem, 'id' | 'registeredUserIds'>) => {
    if (!isAdmin) return; // Only Admin can add events!
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredUserIds: [],
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const deleteEvent = (eventId: string): boolean => {
    if (!isAdmin) return false; // Only Admin can delete events!
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    return true;
  };

  const updateEvent = (eventId: string, data: Partial<EventItem>): boolean => {
    if (!isAdmin) return false;
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, ...data } : ev))
    );
    return true;
  };

  // Caves CRUD - Strictly Admin Only
  const addCave = (caveData: Omit<Cave, 'id'>) => {
    if (!isAdmin) return;
    const newCave: Cave = {
      ...caveData,
      id: `cave-${Date.now()}`,
    };
    setCaves((prev) => [newCave, ...prev]);
  };

  const updateCave = (caveId: string, data: Partial<Cave>): boolean => {
    if (!isAdmin) return false;
    setCaves((prev) =>
      prev.map((c) => (c.id === caveId ? { ...c, ...data } : c))
    );
    return true;
  };

  const deleteCave = (caveId: string): boolean => {
    if (!isAdmin) return false;
    setCaves((prev) => prev.filter((c) => c.id !== caveId));
    return true;
  };

  // Equipment Actions - Admin / Leaders
  const addEquipment = (data: Omit<Equipment, 'id'>) => {
    if (!isAdmin) return;
    const newEq: Equipment = {
      ...data,
      id: `eq-${Date.now()}`,
    };
    setEquipment((prev) => [newEq, ...prev]);
  };

  const updateEquipment = (equipmentId: string, data: Partial<Equipment>): boolean => {
    if (!canViewPrivateSections) return false;
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === equipmentId ? { ...eq, ...data } : eq))
    );
    return true;
  };

  const deleteEquipment = (equipmentId: string): boolean => {
    if (!isAdmin) return false;
    setEquipment((prev) => prev.filter((eq) => eq.id !== equipmentId));
    return true;
  };

  const assignEquipment = (equipmentId: string, userName: string) => {
    if (!canViewPrivateSections) return; // Only admin, yonetim, or egitmen can assign gear!
    setEquipment((prev) =>
      prev.map((eq) => {
        if (eq.id !== equipmentId) return eq;
        return {
          ...eq,
          status: 'Zimmette',
          assignedTo: userName,
          assignedDate: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const returnEquipment = (equipmentId: string) => {
    setEquipment((prev) =>
      prev.map((eq) => {
        if (eq.id !== equipmentId) return eq;
        return {
          ...eq,
          status: 'Kulüp Deposunda',
          assignedTo: undefined,
          assignedDate: undefined,
          lastInspectionDate: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  // Safety actions
  const addSafetyLog = (log: Omit<CaveSafetyLog, 'id'>) => {
    if (!canViewPrivateSections) return;
    const newLog: CaveSafetyLog = {
      ...log,
      id: `safe-${Date.now()}`,
    };
    setSafetyLogs((prev) => [newLog, ...prev]);
  };

  const updateSafetyStatus = (logId: string, status: CaveSafetyLog['status']) => {
    if (!canViewPrivateSections) return;
    setSafetyLogs((prev) =>
      prev.map((s) => (s.id === logId ? { ...s, status } : s))
    );
  };

  const updateSafetyLog = (logId: string, data: Partial<CaveSafetyLog>): boolean => {
    if (!isAdmin) return false;
    setSafetyLogs((prev) =>
      prev.map((s) => (s.id === logId ? { ...s, ...data } : s))
    );
    return true;
  };

  const deleteSafetyLog = (logId: string): boolean => {
    if (!isAdmin) return false;
    setSafetyLogs((prev) => prev.filter((s) => s.id !== logId));
    return true;
  };

  // Badges & Member editing by Admin
  const addUserBadge = (userId: string, badgeName: string): boolean => {
    if (!isAdmin) return false;
    const cleanBadge = badgeName.trim();
    if (!cleanBadge) return false;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const currentBadges = u.badges || [];
        if (currentBadges.includes(cleanBadge)) return u;
        return {
          ...u,
          badges: [...currentBadges, cleanBadge],
        };
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const currentBadges = prev.badges || [];
        if (currentBadges.includes(cleanBadge)) return prev;
        return { ...prev, badges: [...currentBadges, cleanBadge] };
      });
    }
    return true;
  };

  const removeUserBadge = (userId: string, badgeName: string): boolean => {
    if (!isAdmin) return false;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        return {
          ...u,
          badges: (u.badges || []).filter((b) => b !== badgeName),
        };
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          badges: (prev.badges || []).filter((b) => b !== badgeName),
        };
      });
    }
    return true;
  };

  const updateUserByAdmin = (userId: string, data: Partial<User>): boolean => {
    if (!isAdmin) return false;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
    return true;
  };

  // Board & Desks management (Admin Only, Max 20)
  const addBoardMember = (data: Omit<BoardMember, 'id'>): { success: boolean; message?: string } => {
    if (!isAdmin) return { success: false, message: 'Bu işlem için Admin yetkisi gereklidir.' };
    if (boardMembers.length >= 20) {
      return { success: false, message: 'Maksimum 20 yönetim/masa üyesi eklenebilir.' };
    }
    const newMember: BoardMember = {
      ...data,
      id: `bm-${Date.now()}`,
      avatar: data.avatar || '/images/sdumak-logo.png',
    };
    setBoardMembers((prev) => [...prev, newMember]);
    return { success: true };
  };

  const updateBoardMember = (id: string, data: Partial<BoardMember>): boolean => {
    if (!isAdmin) return false;
    setBoardMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
    return true;
  };

  const deleteBoardMember = (id: string): boolean => {
    if (!isAdmin) return false;
    setBoardMembers((prev) => prev.filter((m) => m.id !== id));
    return true;
  };

  // FAQ management (Admin Only)
  const addFAQ = (data: Omit<FAQItem, 'id'>): boolean => {
    if (!isAdmin) return false;
    const newFaq: FAQItem = {
      ...data,
      id: `faq-${Date.now()}`,
    };
    setFaqs((prev) => [...prev, newFaq]);
    return true;
  };

  const updateFAQ = (id: string, data: Partial<FAQItem>): boolean => {
    if (!isAdmin) return false;
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...data } : f))
    );
    return true;
  };

  const deleteFAQ = (id: string): boolean => {
    if (!isAdmin) return false;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    return true;
  };

  // Member Guides management (Admin Only)
  const addGuide = (data: Omit<GuideArticle, 'id' | 'updatedAt'>): string => {
    if (!isAdmin) return '';
    const newId = `guide-${Date.now()}`;
    const newGuide: GuideArticle = {
      ...data,
      id: newId,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setGuides((prev) => [newGuide, ...prev]);
    return newId;
  };

  const updateGuide = (id: string, data: Partial<GuideArticle>): boolean => {
    if (!isAdmin) return false;
    setGuides((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : g
      )
    );
    return true;
  };

  const deleteGuide = (id: string): boolean => {
    if (!isAdmin) return false;
    setGuides((prev) => prev.filter((g) => g.id !== id));
    return true;
  };

  const toggleHeadlampMode = () => {
    setHeadlampMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        canViewPrivateSections,
        login,
        register,
        changeUserRole,
        deleteUser,
        updateProfile,
        logout,
        topics,
        addTopic,
        updateTopic,
        deleteTopic,
        likeTopic,
        addComment,
        deleteComment,
        likeComment,
        events,
        registerForEvent,
        cancelEventRegistration,
        addEvent,
        updateEvent,
        deleteEvent,
        caves,
        addCave,
        updateCave,
        deleteCave,
        equipment,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        assignEquipment,
        returnEquipment,
        addUserBadge,
        removeUserBadge,
        updateUserByAdmin,
        safetyLogs,
        addSafetyLog,
        updateSafetyStatus,
        updateSafetyLog,
        deleteSafetyLog,
        boardMembers,
        addBoardMember,
        updateBoardMember,
        deleteBoardMember,
        faqs,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        guides,
        addGuide,
        updateGuide,
        deleteGuide,
        headlampMode,
        toggleHeadlampMode,
        isInitialized,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
