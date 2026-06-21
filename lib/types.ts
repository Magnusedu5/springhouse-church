export interface Sermon {
  id: number;
  title: string;
  slug: string;
  series: string;
  speaker: string;
  date: string;
  duration: string;
  thumbnail: string;
  audio_url: string;
  video_url: string;
  description: string;
  scripture_ref: string;
  is_featured: boolean;
  created_at: string;
}

export interface ChurchEvent {
  id: number;
  title: string;
  slug: string;
  date: string;
  end_date: string | null;
  time: string;
  location: string;
  is_virtual: boolean;
  virtual_link: string;
  description: string;
  image: string;
  category: 'service' | 'prayer' | 'outreach' | 'conference' | 'youth' | 'special';
  is_featured: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  author_image: string;
  published_date: string | null;
  category: 'devotional' | 'teaching' | 'testimony' | 'missions' | 'general';
  tags: string;
  featured_image: string;
  read_time: string;
  is_published: boolean;
}

export interface Ministry {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  leader_name: string;
  leader_title: string;
  image: string;
  color_accent: string;
  meeting_schedule: string;
  order: number;
}

export interface PrayerRequest {
  id?: number;
  name: string;
  email?: string;
  request_text: string;
  submitted_at?: string;
  is_prayed_over?: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  prayer_request: string;
  submitted_at: string;
  is_read: boolean;
}

export interface OnlineMember {
  id: number;
  name: string;
  email: string;
  country: string;
  city: string;
  how_found_us: string;
  registered_at: string;
}

export interface LiveStreamConfig {
  is_live: boolean;
  stream_url: string;
  stream_title: string;
  updated_at?: string;
}

export interface AdminStats {
  total_sermons: number;
  upcoming_events: number;
  unread_prayers: number;
  total_online_members: number;
  unread_messages: number;
  new_ministry_interests: number;
}

export interface MinistryInterest {
  id: number;
  name: string;
  phone: string;
  email: string;
  ministry: string;
  message: string;
  submitted_at: string;
}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: 'male' | 'female' | 'prefer_not_to_say' | '';
  marital_status: 'single' | 'married' | 'widowed' | 'divorced' | '';
  photo: string;
  address: string;
  city: string;
  state: string;
  occupation: string;
  employer: string;
  baptism_status: 'yes' | 'no' | 'na' | '';
  ministry_interests: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  member_type: 'new' | 'existing' | 'official';
  how_heard: 'friend_family' | 'social_media' | 'website' | 'walked_in' | 'church_event' | 'other' | '';
  notes: string;
  registered_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type GalleryDestination =
  | 'hero_home' | 'hero_about' | 'hero_sermons' | 'hero_events'
  | 'hero_blog' | 'hero_contact' | 'hero_give' | 'hero_ministries'
  | 'bg_who_we_are' | 'bg_give' | 'bg_our_story' | 'bg_article' | 'bg_pastor'
  | 'our_story_image' | 'who_we_are_image'
  | 'logo' | 'pastor_photo'
  | 'leadership_1_photo' | 'leadership_2_photo' | 'leadership_3_photo'
  | 'congregation'
  | 'ministry_children' | 'ministry_youth' | 'ministry_men'
  | 'ministry_women' | 'ministry_missions' | 'ministry_worship'
  | 'event' | 'sermon';

export interface GalleryLinkedRecord {
  id: number;
  title: string;
}

export interface ChurchPhoto {
  id: number;
  title: string;
  image: string;
  media_type: 'image' | 'video';
  destination: GalleryDestination;
  event: GalleryLinkedRecord | null;
  sermon: GalleryLinkedRecord | null;
  is_active: boolean;
  order: number;
  uploaded_at: string;
}
