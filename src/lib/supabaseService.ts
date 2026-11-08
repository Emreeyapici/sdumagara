import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  User,
  ForumTopic,
  EventItem,
  Cave,
  Equipment,
  CaveSafetyLog,
  BoardMember,
  FAQItem,
  GuideArticle,
} from '@/types';

// ==========================================
// 1. TOPICS (Forum & Haberler)
// ==========================================
export const fetchTopicsFromDb = async (): Promise<ForumTopic[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any): ForumTopic => ({
      id: row.id,
      categoryId: row.category_id,
      author: row.author,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      viewsCount: row.views_count || 1,
      likesCount: row.likes_count || 0,
      likedBy: row.liked_by || [],
      commentsCount: row.comments_count || 0,
      isPinned: !!row.is_pinned,
      isLocked: !!row.is_locked,
      isAnnouncement: !!row.is_announcement,
      tags: row.tags || ['Genel'],
      images: row.images || [],
      comments: row.comments || [],
    }));
  } catch {
    return null;
  }
};

export const syncTopicToDb = async (topic: ForumTopic) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('topics').upsert({
      id: topic.id,
      category_id: topic.categoryId,
      author: topic.author,
      title: topic.title,
      content: topic.content,
      created_at: topic.createdAt,
      views_count: topic.viewsCount,
      likes_count: topic.likesCount,
      liked_by: topic.likedBy,
      comments_count: topic.commentsCount,
      is_pinned: topic.isPinned,
      is_locked: topic.isLocked,
      is_announcement: topic.isAnnouncement,
      tags: topic.tags,
      images: topic.images,
      comments: topic.comments || [],
    });
  } catch {}
};

export const deleteTopicFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('topics').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 2. USERS
// ==========================================
export const fetchUsersFromDb = async (): Promise<User[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data) return null;

    return data.map((row: any): User => ({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      studentNo: row.student_no || '',
      phone: row.phone || '',
      bloodType: row.blood_type || '0+',
      role: row.role || 'caylak',
      avatar: row.avatar || '',
      bio: row.bio || '',
      badges: row.badges || [],
      cavingCount: row.caving_count || 0,
      joinedAt: row.created_at || row.joined_at || new Date().toISOString().split('T')[0],
    }));
  } catch {
    return null;
  }
};

export const syncUserToDb = async (user: User) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('users').upsert({
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase(),
      password: user.password,
      student_no: user.studentNo,
      phone: user.phone,
      blood_type: user.bloodType,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      badges: user.badges,
      caving_count: user.cavingCount,
      joined_at: user.joinedAt,
    });
  } catch {}
};

export const deleteUserFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('users').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 3. EVENTS (Kamplar & Faaliyetler)
// ==========================================
export const fetchEventsFromDb = async (): Promise<EventItem[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('events').select('*').order('start_date', { ascending: true });
    if (error || !data) return null;

    return data.map((row: any): EventItem => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      location: row.location || '',
      caveName: row.cave_name || '',
      startDate: row.start_date || '',
      endDate: row.end_date || '',
      quota: row.quota || 25,
      difficulty: row.difficulty || 'Basit / Yatay Mağara',
      status: row.status || 'Kayıtlar Açık',
      organizer: row.organizer || 'SDÜMAK Yönetim Kurulu',
      leaders: row.leaders || ['Emre Yapıcı'],
      requirements: row.requirements || [],
      registeredUserIds: row.registered_user_ids || [],
      coverImage: row.cover_image || '',
      images: row.images || [],
    }));
  } catch {
    return null;
  }
};

export const syncEventToDb = async (event: EventItem) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('events').upsert({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      cave_name: event.caveName,
      start_date: event.startDate,
      end_date: event.endDate,
      quota: event.quota,
      difficulty: event.difficulty,
      status: event.status,
      organizer: event.organizer,
      leaders: event.leaders,
      requirements: event.requirements,
      registered_user_ids: event.registeredUserIds,
      cover_image: event.coverImage,
      images: event.images || [],
    });
  } catch {}
};

export const deleteEventFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('events').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 4. CAVES (Mağara Atlası)
// ==========================================
export const fetchCavesFromDb = async (): Promise<Cave[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('caves').select('*');
    if (error || !data) return null;

    return data.map((row: any): Cave => ({
      id: row.id,
      name: row.name,
      district: row.district || '',
      depth: row.depth || 0,
      length: row.length || 0,
      difficulty: row.difficulty || 'Orta',
      coordinates: row.coordinates || { lat: 37.8, lng: 30.8 },
      surveyAvailable: !!row.survey_available,
      surveyImageUrl: row.survey_image_url,
      waterStatus: row.water_status || 'Kuru',
      verticalDrops: row.vertical_drops || '',
      description: row.description || '',
      images: row.images || [],
    }));
  } catch {
    return null;
  }
};

export const syncCaveToDb = async (cave: Cave) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('caves').upsert({
      id: cave.id,
      name: cave.name,
      district: cave.district,
      depth: cave.depth,
      length: cave.length,
      difficulty: cave.difficulty,
      coordinates: cave.coordinates,
      survey_available: cave.surveyAvailable,
      survey_image_url: cave.surveyImageUrl,
      water_status: cave.waterStatus,
      vertical_drops: cave.verticalDrops,
      description: cave.description,
      images: cave.images || [],
    });
  } catch {}
};

export const deleteCaveFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('caves').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 5. EQUIPMENT (Ekipman Envanteri)
// ==========================================
export const fetchEquipmentFromDb = async (): Promise<Equipment[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('equipment').select('*');
    if (error || !data) return null;

    return data.map((row: any): Equipment => ({
      id: row.id,
      name: row.name,
      brandModel: row.brand_model || '',
      category: row.category,
      serialNo: row.serial_no || '',
      status: row.status,
      assignedTo: row.assigned_to,
      assignedDate: row.assigned_date,
      lastInspectionDate: row.last_inspection_date || '',
      condition: row.condition,
    }));
  } catch {
    return null;
  }
};

export const syncEquipmentToDb = async (item: Equipment) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('equipment').upsert({
      id: item.id,
      name: item.name,
      brand_model: item.brandModel,
      category: item.category,
      serial_no: item.serialNo,
      status: item.status,
      assigned_to: item.assignedTo,
      assigned_date: item.assignedDate,
      last_inspection_date: item.lastInspectionDate,
      condition: item.condition,
    });
  } catch {}
};

export const deleteEquipmentFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('equipment').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 6. SAFETY WATCH (Canlı Takip)
// ==========================================
export const fetchSafetyFromDb = async (): Promise<CaveSafetyLog[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('safety_logs').select('*');
    if (error || !data) return null;

    return data.map((row: any): CaveSafetyLog => ({
      id: row.id,
      caveName: row.cave_name,
      teamLeader: row.team_leader,
      surfaceWatchPerson: row.surface_watch_person,
      contactPhone: row.contact_phone,
      entryTime: row.entry_time,
      estimatedExitTime: row.estimated_exit_time,
      teamSize: row.team_size || 1,
      status: row.status,
    }));
  } catch {
    return null;
  }
};

export const syncSafetyToDb = async (log: CaveSafetyLog) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('safety_logs').upsert({
      id: log.id,
      cave_name: log.caveName,
      team_leader: log.teamLeader,
      surface_watch_person: log.surfaceWatchPerson,
      contact_phone: log.contactPhone,
      entry_time: log.entryTime,
      estimated_exit_time: log.estimatedExitTime,
      team_size: log.teamSize,
      status: log.status,
    });
  } catch {}
};

export const deleteSafetyFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('safety_logs').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 7. BOARD MEMBERS (Yönetim & Masalar)
// ==========================================
export const fetchBoardFromDb = async (): Promise<BoardMember[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('board_members').select('*');
    if (error || !data) return null;

    return data.map((row: any): BoardMember => ({
      id: row.id,
      name: row.name,
      role: row.role,
      desk: row.desk,
      avatar: row.avatar,
      contact: row.contact,
    }));
  } catch {
    return null;
  }
};

export const syncBoardToDb = async (member: BoardMember) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('board_members').upsert({
      id: member.id,
      name: member.name,
      role: member.role,
      desk: member.desk,
      avatar: member.avatar,
      contact: member.contact,
    });
  } catch {}
};

export const deleteBoardFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('board_members').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 8. FAQS (Sıkça Sorulan Sorular)
// ==========================================
export const fetchFaqsFromDb = async (): Promise<FAQItem[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('faqs').select('*');
    if (error || !data) return null;

    return data.map((row: any): FAQItem => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
    }));
  } catch {
    return null;
  }
};

export const syncFaqToDb = async (faq: FAQItem) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('faqs').upsert({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
  } catch {}
};

export const deleteFaqFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('faqs').delete().eq('id', id);
  } catch {}
};

// ==========================================
// 9. GUIDES (Rehber)
// ==========================================
export const fetchGuidesFromDb = async (): Promise<GuideArticle[] | null> => {
  if (!supabase || !isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase.from('guides').select('*');
    if (error || !data) return null;

    return data.map((row: any): GuideArticle => ({
      id: row.id,
      title: row.title,
      category: row.category,
      summary: row.summary,
      content: row.content,
      icon: row.icon,
      isImportant: !!row.is_important,
      updatedAt: row.updated_at || '',
    }));
  } catch {
    return null;
  }
};

export const syncGuideToDb = async (guide: GuideArticle) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('guides').upsert({
      id: guide.id,
      title: guide.title,
      category: guide.category,
      summary: guide.summary,
      content: guide.content,
      icon: guide.icon,
      is_important: guide.isImportant,
      updated_at: new Date().toISOString(),
    });
  } catch {}
};

export const deleteGuideFromDb = async (id: string) => {
  if (!supabase || !isSupabaseConfigured()) return;
  try {
    await supabase.from('guides').delete().eq('id', id);
  } catch {}
};
