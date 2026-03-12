export type Role = 'ADMIN' | 'CLIENT';

export type AttendanceStatus = 'yes' | 'no' | 'maybe';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

export interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Wedding {
  id: number;
  slug: string;
  coupleName: string;
  monogram?: string;
  heroMessage?: string;
  eventDate: string;
  ceremonyVenueName?: string;
  ceremonyVenueAddress?: string;
  ceremonyTime?: string;
  venueName: string;
  venueAddress: string;
  receptionTime?: string;
  dressCode: string;
  mapUrl: string;
  groomName?: string;
  groomFullName?: string;
  groomDescription?: string;
  groomImageUrl?: string;
  groomParents?: string;
  groomBank?: string;
  groomBankAccount?: string;
  groomBankName?: string;
  brideName?: string;
  brideFullName?: string;
  brideDescription?: string;
  brideImageUrl?: string;
  brideParents?: string;
  brideBank?: string;
  brideBankAccount?: string;
  brideBankName?: string;
  videoId?: string;
  isPublished: boolean;
  ownerId: number;
  owner?: { id: number; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPhoto {
  id: number;
  imageUrl: string;
  alt?: string;
  order: number;
  weddingId: number;
}

export interface LoveStoryEvent {
  id: number;
  dateLabel: string;
  title: string;
  description: string;
  order: number;
  weddingId: number;
}

export interface Rsvp {
  id: number;
  requestId: string;
  fullName: string;
  phone: string;
  attending: AttendanceStatus;
  guestCount: number;
  message?: string;
  weddingId: number;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalWeddings: number;
  publishedWeddings: number;
  unpublishedWeddings: number;
  totalRsvps: number;
  rsvpsByStatus: { status: AttendanceStatus; count: number }[];
}
