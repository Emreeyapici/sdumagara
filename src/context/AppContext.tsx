'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ForumTopic,
  EventItem,
  Cave,
  Equipment,
  CaveSafetyLog,
  Comment,
  UserRole,
  BoardMember,
  FAQItem,
  GuideArticle,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_TOPICS,
  INITIAL_EVENTS,
  INITIAL_CAVES,
  INITIAL_EQUIPMENT,
  INITIAL_SAFETY_WATCH,
  INITIAL_BOARD_MEMBERS,
  INITIAL_FAQS,
  INITIAL_GUIDES,
} from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  fetchTopicsFromDb,
  syncTopicToDb,
  deleteTopicFromDb,
  fetchUsersFromDb,
  syncUserToDb,
  deleteUserFromDb,
  fetchEventsFromDb,
  syncEventToDb,
  deleteEventFromDb,
  fetchCavesFromDb,
  syncCaveToDb,
  deleteCaveFromDb,
  fetchEquipmentFromDb,
  syncEquipmentToDb,
  deleteEquipmentFromDb,
  fetchSafetyFromDb,
  syncSafetyToDb,
  deleteSafetyFromDb,
  fetchBoardFromDb,
  syncBoardToDb,
  deleteBoardFromDb,
  fetchFaqsFromDb,
  syncFaqToDb,
  deleteFaqFromDb,
  fetchGuidesFromDb,
  syncGuideToDb,
  deleteGuideFromDb,
} from '@/lib/supabaseService';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  isAdmin: boolean;
  canViewPrivateSections: boolean;
  isSupabaseActive: boolean;

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
  addTopic: (data: {
    categoryId: string;
    title: string;
    content: string;
    tags: string[];
    isAnnouncement?: boolean;
    images?: string[];
  }) => string;
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

  // Board & Desks (Kulüp Yönetimi & Masalar)
  boardMembers: BoardMember[];
  addBoardMember: (data: Omit<BoardMember, 'id'>) => { success: boolean; message?: string };
  updateBoardMember: (id: string, data: Partial<BoardMember>) => boolean;
  deleteBoardMember: (id: string) => boolean;

  // FAQ
  faqs: FAQItem[];
  addFAQ: (data: Omit<FAQItem, 'id'>) => boolean;
  updateFAQ: (id: string, data: Partial<FAQItem>) => boolean;
  deleteFAQ: (id: string) => boolean;

  // Member Guides (Rehber)
  guides: GuideArticle[];
  addGuide: (data: Omit<GuideArticle, 'id' | 'updatedAt'>) => string;
  updateGuide: (id: string, data: Partial<GuideArticle>) => boolean;
  deleteGuide: (id: string) => boolean;

  // Headlamp mode
  headlampMode: boolean;
  toggleHeadlampMode: () => void;

  // Hydration status
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Start with empty arrays to prevent flashing un-hydrated mock data
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [caves, setCaves] = useState<Cave[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [safetyLogs, setSafetyLogs] = useState<CaveSafetyLog[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [guides, setGuides] = useState<GuideArticle[]>([]);
  const [headlampMode, setHeadlampMode] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  // Strictly check roles:
  const isAdmin = currentUser?.role === 'admin';
  const canViewPrivateSections = !!(
    currentUser &&
    (currentUser.role === 'admin' || currentUser.role === 'yonetim' || currentUser.role === 'egitmen')
  );

  // Initialize Data: Check Supabase First, Fallback to localStorage
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      // 1. Check if Supabase is connected
      if (isSupabaseConfigured() && supabase) {
        setIsSupabaseActive(true);
        try {
          const [dbTopics, dbUsers, dbEvents, dbCaves, dbEquipment, dbSafety, dbBoard, dbFaqs, dbGuides] =
            await Promise.all([
              fetchTopicsFromDb(),
              fetchUsersFromDb(),
              fetchEventsFromDb(),
              fetchCavesFromDb(),
              fetchEquipmentFromDb(),
              fetchSafetyFromDb(),
              fetchBoardFromDb(),
              fetchFaqsFromDb(),
              fetchGuidesFromDb(),
            ]);

          // If Supabase responded (not null), SUPABASE IS OUR SINGLE SOURCE OF TRUTH!
          if (dbUsers !== null && dbTopics !== null) {
            if (isMounted) {
              // 1. Users
              if (dbUsers.length > 0) {
                setUsers(dbUsers);
              } else {
                setUsers(INITIAL_USERS);
                INITIAL_USERS.forEach((u) => syncUserToDb(u));
              }

              // 2. Topics - If table is completely fresh (0 rows) and not yet seeded, seed once:
              const topicsSeeded = localStorage.getItem('sdumak_topics_seeded_v3');
              if (dbTopics.length === 0 && !topicsSeeded) {
                setTopics(INITIAL_TOPICS);
                INITIAL_TOPICS.forEach((t) => syncTopicToDb(t));
                localStorage.setItem('sdumak_topics_seeded_v3', 'true');
              } else {
                // Supabase holds the exact truth (including deleted topics)
                setTopics(dbTopics);
              }

              // 3. Events
              const eventsSeeded = localStorage.getItem('sdumak_events_seeded_v3');
              if (dbEvents && dbEvents.length === 0 && !eventsSeeded) {
                setEvents(INITIAL_EVENTS);
                INITIAL_EVENTS.forEach((e) => syncEventToDb(e));
                localStorage.setItem('sdumak_events_seeded_v3', 'true');
              } else if (dbEvents) {
                setEvents(dbEvents);
              }

              // 4. Caves
              const cavesSeeded = localStorage.getItem('sdumak_caves_seeded_v3');
              if (dbCaves && dbCaves.length === 0 && !cavesSeeded) {
                setCaves(INITIAL_CAVES);
                INITIAL_CAVES.forEach((c) => syncCaveToDb(c));
                localStorage.setItem('sdumak_caves_seeded_v3', 'true');
              } else if (dbCaves) {
                setCaves(dbCaves);
              }

              // 5. Equipment
              const eqSeeded = localStorage.getItem('sdumak_eq_seeded_v3');
              if (dbEquipment && dbEquipment.length === 0 && !eqSeeded) {
                setEquipment(INITIAL_EQUIPMENT);
                INITIAL_EQUIPMENT.forEach((eq) => syncEquipmentToDb(eq));
                localStorage.setItem('sdumak_eq_seeded_v3', 'true');
              } else if (dbEquipment) {
                setEquipment(dbEquipment);
              }

              // 6. Safety Logs
              if (dbSafety) {
                setSafetyLogs(dbSafety);
              }

              // 7. Board Members
              const boardSeeded = localStorage.getItem('sdumak_board_seeded_v3');
              if (dbBoard && dbBoard.length === 0 && !boardSeeded) {
                setBoardMembers(INITIAL_BOARD_MEMBERS);
                INITIAL_BOARD_MEMBERS.forEach((b) => syncBoardToDb(b));
                localStorage.setItem('sdumak_board_seeded_v3', 'true');
              } else if (dbBoard) {
                setBoardMembers(dbBoard);
              }

              // 8. FAQs
              const faqsSeeded = localStorage.getItem('sdumak_faqs_seeded_v3');
              if (dbFaqs && dbFaqs.length === 0 && !faqsSeeded) {
                setFaqs(INITIAL_FAQS);
                INITIAL_FAQS.forEach((f) => syncFaqToDb(f));
                localStorage.setItem('sdumak_faqs_seeded_v3', 'true');
              } else if (dbFaqs) {
                setFaqs(dbFaqs);
              }

              // 9. Guides
              const guidesSeeded = localStorage.getItem('sdumak_guides_seeded_v3');
              if (dbGuides && dbGuides.length === 0 && !guidesSeeded) {
                setGuides(INITIAL_GUIDES);
                INITIAL_GUIDES.forEach((g) => syncGuideToDb(g));
                localStorage.setItem('sdumak_guides_seeded_v3', 'true');
              } else if (dbGuides) {
                setGuides(dbGuides);
              }

              // Restore session
              const savedUserId = localStorage.getItem('sdumak_current_user_v2');
              if (savedUserId) {
                const list = dbUsers.length > 0 ? dbUsers : INITIAL_USERS;
                const found = list.find((u) => u.id === savedUserId);
                if (found) setCurrentUser(found);
              }

              setIsInitialized(true);
            }

            // Realtime subscriptions
            const liveChannel = supabase
              .channel('sdumak-shared-realtime')
              .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, async () => {
                const fresh = await fetchTopicsFromDb();
                if (fresh && isMounted) setTopics(fresh);
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, async () => {
                const fresh = await fetchEventsFromDb();
                if (fresh && isMounted) setEvents(fresh);
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'safety_logs' }, async () => {
                const fresh = await fetchSafetyFromDb();
                if (fresh && isMounted) setSafetyLogs(fresh);
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'board_members' }, async () => {
                const fresh = await fetchBoardFromDb();
                if (fresh && isMounted) setBoardMembers(fresh);
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'guides' }, async () => {
                const fresh = await fetchGuidesFromDb();
                if (fresh && isMounted) setGuides(fresh);
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, async () => {
                const fresh = await fetchEquipmentFromDb();
                if (fresh && isMounted) setEquipment(fresh);
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'caves' }, async () => {
                const fresh = await fetchCavesFromDb();
                if (fresh && isMounted) setCaves(fresh);
              })
              .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, async () => {
                const fresh = await fetchFaqsFromDb();
                if (fresh && isMounted) setFaqs(fresh);
              })
              .subscribe();

            return () => {
              if (supabase) supabase.removeChannel(liveChannel);
            };
          }
        } catch (e) {
          console.error('[Supabase Init Exception]:', e);
        }
      }

      // ONLY REACHED IF SUPABASE IS NOT CONFIGURED OR TOTALLY DOWN:
      setIsSupabaseActive(false);
      try {
        const savedUsers = localStorage.getItem('sdumak_users_v2');
        let currentUsersList = INITIAL_USERS;

        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          const hasEmre = parsed.some((u: User) => u.email.toLowerCase() === 'emre4821@outlook.com');
          if (!hasEmre) {
            currentUsersList = [...INITIAL_USERS, ...parsed];
          } else {
            currentUsersList = parsed.map((u: User) =>
              u.email.toLowerCase() === 'emre4821@outlook.com'
                ? { ...u, role: 'admin' as UserRole, password: 'Luciddreams4090', name: 'Emre Yapıcı' }
                : u
            );
          }
        }
        if (isMounted) setUsers(currentUsersList);

        const savedUser = localStorage.getItem('sdumak_current_user_v2');
        if (savedUser && isMounted) {
          const found = currentUsersList.find((u) => u.id === savedUser);
          if (found) setCurrentUser(found);
        }

        const savedTopics = localStorage.getItem('sdumak_topics_v2');
        if (savedTopics && isMounted) {
          setTopics(JSON.parse(savedTopics));
        } else if (isMounted) {
          setTopics(INITIAL_TOPICS);
        }

        const savedEvents = localStorage.getItem('sdumak_events_v2');
        if (savedEvents && isMounted) {
          setEvents(JSON.parse(savedEvents));
        } else if (isMounted) {
          setEvents(INITIAL_EVENTS);
        }

        const savedCaves = localStorage.getItem('sdumak_caves_v2');
        if (savedCaves && isMounted) {
          setCaves(JSON.parse(savedCaves));
        } else if (isMounted) {
          setCaves(INITIAL_CAVES);
        }

        const savedEquipment = localStorage.getItem('sdumak_equipment_v2');
        if (savedEquipment && isMounted) {
          setEquipment(JSON.parse(savedEquipment));
        } else if (isMounted) {
          setEquipment(INITIAL_EQUIPMENT);
        }

        const savedSafety = localStorage.getItem('sdumak_safety_v2');
        if (savedSafety && isMounted) {
          setSafetyLogs(JSON.parse(savedSafety));
        } else if (isMounted) {
          setSafetyLogs(INITIAL_SAFETY_WATCH);
        }

        const savedBoard = localStorage.getItem('sdumak_board_v2');
        if (savedBoard && isMounted) {
          setBoardMembers(JSON.parse(savedBoard));
        } else if (isMounted) {
          setBoardMembers(INITIAL_BOARD_MEMBERS);
        }

        const savedFaqs = localStorage.getItem('sdumak_faqs_v2');
        if (savedFaqs && isMounted) {
          setFaqs(JSON.parse(savedFaqs));
        } else if (isMounted) {
          setFaqs(INITIAL_FAQS);
        }

        const savedGuides = localStorage.getItem('sdumak_guides_v2');
        if (savedGuides && isMounted) {
          setGuides(JSON.parse(savedGuides));
        } else if (isMounted) {
          setGuides(INITIAL_GUIDES);
        }
      } catch {
      } finally {
        if (isMounted) setIsInitialized(true);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save to LocalStorage as secondary cache
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

  // Login
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

  // Register
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
      role: 'caylak',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      bio: data.bio?.trim() || 'SDÜMAK Topluluğu Yeni Üyesi',
      badges: ['Yeni Üye (2026)', 'Çaylak'],
      cavingCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    syncUserToDb(newUser);

    try {
      localStorage.setItem('sdumak_current_user_v2', newUser.id);
    } catch {}
    return { success: true };
  };

  const changeUserRole = (targetUserId: string, newRole: UserRole): boolean => {
    if (!isAdmin) return false;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== targetUserId) return u;
        const updated = { ...u, role: newRole };
        syncUserToDb(updated);
        return updated;
      })
    );
    if (currentUser?.id === targetUserId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
    return true;
  };

  const deleteUser = (targetUserId: string): boolean => {
    if (!isAdmin) return false;
    const target = users.find((u) => u.id === targetUserId);
    if (target?.email.toLowerCase() === 'emre4821@outlook.com') {
      return false;
    }
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== targetUserId);
      try {
        localStorage.setItem('sdumak_users_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteUserFromDb(targetUserId);
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const safeData = { ...data };
    if (!isAdmin) {
      delete safeData.role;
    }
    const updated = { ...currentUser, ...safeData };
    setCurrentUser(updated);
    setUsers((prev) => {
      const upList = prev.map((u) => (u.id === updated.id ? updated : u));
      try {
        localStorage.setItem('sdumak_users_v2', JSON.stringify(upList));
      } catch {}
      return upList;
    });
    syncUserToDb(updated);

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

  // Forum Actions
  const addTopic = (data: {
    categoryId: string;
    title: string;
    content: string;
    tags: string[];
    isAnnouncement?: boolean;
    images?: string[];
  }): string => {
    if (!isAdmin || !currentUser) return '';
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
    setTopics((prev) => {
      const updated = [newTopic, ...prev];
      try {
        localStorage.setItem('sdumak_topics_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncTopicToDb(newTopic);
    return newTopicId;
  };

  const deleteTopic = (topicId: string): boolean => {
    if (!isAdmin) return false;
    setTopics((prev) => {
      const updated = prev.filter((t) => t.id !== topicId);
      try {
        localStorage.setItem('sdumak_topics_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteTopicFromDb(topicId);
    return true;
  };

  const updateTopic = (topicId: string, data: Partial<ForumTopic>): boolean => {
    if (!isAdmin) return false;
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== topicId) return t;
        const up = { ...t, ...data };
        syncTopicToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_topics_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const likeTopic = (topicId: string) => {
    if (!currentUser) return;
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== topicId) return t;
        const hasLiked = t.likedBy.includes(currentUser.id);
        const newLikedBy = hasLiked
          ? t.likedBy.filter((id) => id !== currentUser.id)
          : [...t.likedBy, currentUser.id];
        const up = {
          ...t,
          likedBy: newLikedBy,
          likesCount: newLikedBy.length,
        };
        syncTopicToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_topics_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

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

    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== topicId) return t;
        const currentComments = t.comments || [];
        const up = {
          ...t,
          comments: [...currentComments, newComment],
          commentsCount: currentComments.length + 1,
        };
        syncTopicToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_topics_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteComment = (topicId: string, commentId: string): boolean => {
    if (!currentUser) return false;
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== topicId) return t;
        const currentComments = t.comments || [];
        const commentToDelete = currentComments.find((c) => c.id === commentId);
        if (!commentToDelete) return t;

        if (!isAdmin && commentToDelete.author.id !== currentUser.id) {
          return t;
        }

        const filtered = currentComments.filter((c) => c.id !== commentId);
        const up = {
          ...t,
          comments: filtered,
          commentsCount: filtered.length,
        };
        syncTopicToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_topics_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const likeComment = (topicId: string, commentId: string) => {
    if (!currentUser) return;
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== topicId) return t;
        const currentComments = t.comments || [];
        const up = {
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
        syncTopicToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_topics_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Events Actions
  const registerForEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        if (ev.registeredUserIds.includes(currentUser.id)) return ev;
        const up = {
          ...ev,
          registeredUserIds: [...ev.registeredUserIds, currentUser.id],
        };
        syncEventToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_events_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const cancelEventRegistration = (eventId: string) => {
    if (!currentUser) return;
    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const up = {
          ...ev,
          registeredUserIds: ev.registeredUserIds.filter((id) => id !== currentUser.id),
        };
        syncEventToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_events_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addEvent = (eventData: Omit<EventItem, 'id' | 'registeredUserIds'>) => {
    if (!isAdmin) return;
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredUserIds: [],
    };
    setEvents((prev) => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem('sdumak_events_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncEventToDb(newEvent);
  };

  const deleteEvent = (eventId: string): boolean => {
    if (!isAdmin) return false;
    setEvents((prev) => {
      const updated = prev.filter((ev) => ev.id !== eventId);
      try {
        localStorage.setItem('sdumak_events_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteEventFromDb(eventId);
    return true;
  };

  const updateEvent = (eventId: string, data: Partial<EventItem>): boolean => {
    if (!isAdmin) return false;
    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const up = { ...ev, ...data };
        syncEventToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_events_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  // Caves CRUD
  const addCave = (caveData: Omit<Cave, 'id'>) => {
    if (!isAdmin) return;
    const newCave: Cave = {
      ...caveData,
      id: `cave-${Date.now()}`,
    };
    setCaves((prev) => {
      const updated = [newCave, ...prev];
      try {
        localStorage.setItem('sdumak_caves_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncCaveToDb(newCave);
  };

  const updateCave = (caveId: string, data: Partial<Cave>): boolean => {
    if (!isAdmin) return false;
    setCaves((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== caveId) return c;
        const up = { ...c, ...data };
        syncCaveToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_caves_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const deleteCave = (caveId: string): boolean => {
    if (!isAdmin) return false;
    setCaves((prev) => {
      const updated = prev.filter((c) => c.id !== caveId);
      try {
        localStorage.setItem('sdumak_caves_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteCaveFromDb(caveId);
    return true;
  };

  // Equipment Actions
  const addEquipment = (data: Omit<Equipment, 'id'>) => {
    if (!isAdmin) return;
    const newEq: Equipment = {
      ...data,
      id: `eq-${Date.now()}`,
    };
    setEquipment((prev) => {
      const updated = [newEq, ...prev];
      try {
        localStorage.setItem('sdumak_equipment_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncEquipmentToDb(newEq);
  };

  const updateEquipment = (equipmentId: string, data: Partial<Equipment>): boolean => {
    if (!canViewPrivateSections) return false;
    setEquipment((prev) => {
      const updated = prev.map((eq) => {
        if (eq.id !== equipmentId) return eq;
        const up = { ...eq, ...data };
        syncEquipmentToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_equipment_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const deleteEquipment = (equipmentId: string): boolean => {
    if (!isAdmin) return false;
    setEquipment((prev) => {
      const updated = prev.filter((eq) => eq.id !== equipmentId);
      try {
        localStorage.setItem('sdumak_equipment_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteEquipmentFromDb(equipmentId);
    return true;
  };

  const assignEquipment = (equipmentId: string, userName: string) => {
    if (!canViewPrivateSections) return;
    setEquipment((prev) => {
      const updated = prev.map((eq) => {
        if (eq.id !== equipmentId) return eq;
        const up = {
          ...eq,
          status: 'Zimmette' as const,
          assignedTo: userName,
          assignedDate: new Date().toISOString().split('T')[0],
        };
        syncEquipmentToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_equipment_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const returnEquipment = (equipmentId: string) => {
    setEquipment((prev) => {
      const updated = prev.map((eq) => {
        if (eq.id !== equipmentId) return eq;
        const up = {
          ...eq,
          status: 'Kulüp Deposunda' as const,
          assignedTo: undefined,
          assignedDate: undefined,
          lastInspectionDate: new Date().toISOString().split('T')[0],
        };
        syncEquipmentToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_equipment_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Safety actions
  const addSafetyLog = (log: Omit<CaveSafetyLog, 'id'>) => {
    if (!canViewPrivateSections) return;
    const newLog: CaveSafetyLog = {
      ...log,
      id: `safe-${Date.now()}`,
    };
    setSafetyLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('sdumak_safety_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncSafetyToDb(newLog);
  };

  const updateSafetyStatus = (logId: string, status: CaveSafetyLog['status']) => {
    if (!canViewPrivateSections) return;
    setSafetyLogs((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== logId) return s;
        const up = { ...s, status };
        syncSafetyToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_safety_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateSafetyLog = (logId: string, data: Partial<CaveSafetyLog>): boolean => {
    if (!isAdmin) return false;
    setSafetyLogs((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== logId) return s;
        const up = { ...s, ...data };
        syncSafetyToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_safety_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const deleteSafetyLog = (logId: string): boolean => {
    if (!isAdmin) return false;
    setSafetyLogs((prev) => {
      const updated = prev.filter((s) => s.id !== logId);
      try {
        localStorage.setItem('sdumak_safety_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteSafetyFromDb(logId);
    return true;
  };

  // Badges & Member editing by Admin
  const addUserBadge = (userId: string, badgeName: string): boolean => {
    if (!isAdmin) return false;
    const cleanBadge = badgeName.trim();
    if (!cleanBadge) return false;

    setUsers((prev) => {
      const updatedList = prev.map((u) => {
        if (u.id !== userId) return u;
        const currentBadges = u.badges || [];
        if (currentBadges.includes(cleanBadge)) return u;
        const up = {
          ...u,
          badges: [...currentBadges, cleanBadge],
        };
        syncUserToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_users_v2', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });

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
    setUsers((prev) => {
      const updatedList = prev.map((u) => {
        if (u.id !== userId) return u;
        const up = {
          ...u,
          badges: (u.badges || []).filter((b) => b !== badgeName),
        };
        syncUserToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_users_v2', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });

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
    setUsers((prev) => {
      const updatedList = prev.map((u) => {
        if (u.id !== userId) return u;
        const up = { ...u, ...data };
        syncUserToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_users_v2', JSON.stringify(updatedList));
      } catch {}
      return updatedList;
    });
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
    return true;
  };

  // Board & Desks management
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
    setBoardMembers((prev) => {
      const updated = [...prev, newMember];
      try {
        localStorage.setItem('sdumak_board_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncBoardToDb(newMember);
    return { success: true };
  };

  const updateBoardMember = (id: string, data: Partial<BoardMember>): boolean => {
    if (!isAdmin) return false;
    setBoardMembers((prev) => {
      const updated = prev.map((m) => {
        if (m.id !== id) return m;
        const up = { ...m, ...data };
        syncBoardToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_board_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const deleteBoardMember = (id: string): boolean => {
    if (!isAdmin) return false;
    setBoardMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem('sdumak_board_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteBoardFromDb(id);
    return true;
  };

  // FAQ management
  const addFAQ = (data: Omit<FAQItem, 'id'>): boolean => {
    if (!isAdmin) return false;
    const newFaq: FAQItem = {
      ...data,
      id: `faq-${Date.now()}`,
    };
    setFaqs((prev) => {
      const updated = [...prev, newFaq];
      try {
        localStorage.setItem('sdumak_faqs_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncFaqToDb(newFaq);
    return true;
  };

  const updateFAQ = (id: string, data: Partial<FAQItem>): boolean => {
    if (!isAdmin) return false;
    setFaqs((prev) => {
      const updated = prev.map((f) => {
        if (f.id !== id) return f;
        const up = { ...f, ...data };
        syncFaqToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_faqs_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const deleteFAQ = (id: string): boolean => {
    if (!isAdmin) return false;
    setFaqs((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem('sdumak_faqs_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteFaqFromDb(id);
    return true;
  };

  // Member Guides management
  const addGuide = (data: Omit<GuideArticle, 'id' | 'updatedAt'>): string => {
    if (!isAdmin) return '';
    const newId = `guide-${Date.now()}`;
    const newGuide: GuideArticle = {
      ...data,
      id: newId,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setGuides((prev) => {
      const updated = [newGuide, ...prev];
      try {
        localStorage.setItem('sdumak_guides_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncGuideToDb(newGuide);
    return newId;
  };

  const updateGuide = (id: string, data: Partial<GuideArticle>): boolean => {
    if (!isAdmin) return false;
    setGuides((prev) => {
      const updated = prev.map((g) => {
        if (g.id !== id) return g;
        const up = { ...g, ...data, updatedAt: new Date().toISOString().split('T')[0] };
        syncGuideToDb(up);
        return up;
      });
      try {
        localStorage.setItem('sdumak_guides_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    return true;
  };

  const deleteGuide = (id: string): boolean => {
    if (!isAdmin) return false;
    setGuides((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      try {
        localStorage.setItem('sdumak_guides_v2', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    deleteGuideFromDb(id);
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
        isSupabaseActive,
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
