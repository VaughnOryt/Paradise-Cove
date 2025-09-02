
export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
}

export interface Booking {
  id: string;
  guestName: string;
  email: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  accommodationId: string;
  accommodationName: string;
}

export type LanguageCode = 'en' | 'ar' | 'ja' | 'ko' | 'zh';
export type MultilingualString = Partial<Record<LanguageCode, string>>;

export interface Accommodation {
  id: string;
  name: MultilingualString;
  description: MultilingualString;
  image: string;
  features: MultilingualString[];
  longDescription: MultilingualString;
  gallery: string[];
  price: number;
  occupancy: MultilingualString;
  amenities: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  category: string;
  alt: MultilingualString;
}

export interface Offer {
  id: string;
  title: MultilingualString;
  description: MultilingualString;
  image: string;
  category: 'Exclusive' | 'Seasonal';
  details: MultilingualString[];
  cta: MultilingualString;
}

export interface MenuItem {
  category: MultilingualString;
  items: MultilingualString[];
}

export interface Review {
  name: string;
  rating: number;
  comment: MultilingualString;
}

export interface DiningOption {
  id: string;
  name: MultilingualString;
  description: MultilingualString;
  gallery: string[];
  cuisine: MultilingualString;
  ambiance: MultilingualString;
  dressCode: MultilingualString;
  longDescription: MultilingualString;
  menu: MenuItem[];
  reviews: Review[];
}

export interface EventPackage {
  name: MultilingualString;
  description: MultilingualString;
  features: MultilingualString[];
}

export interface Venue {
  name: MultilingualString;
  description: MultilingualString;
  capacity: string;
  image: string;
}

export interface EventInfo {
  id: string;
  type: 'Weddings' | 'Corporate' | 'Social';
  title: MultilingualString;
  description: MultilingualString;
  image: string;
  packages: EventPackage[];
  venues: Venue[];
}

export interface Testimonial {
    id: string;
    quote: MultilingualString;
    name: string;
    location: string;
    image: string;
}

export interface Amenity {
    id: string;
    name: MultilingualString;
    description: MultilingualString;
    icon: 'SparklesIcon' | 'TagIcon' | 'WifiIcon' | 'SunIcon' | 'BookOpenIcon' | 'UsersGroupIcon' | 'CurrencyDollarIcon' | 'BriefcaseIcon' | 'RingIcon' | 'StarIcon' | 'GiftIcon' | 'MapPinIcon' | 'MusicalNoteIcon' | 'LifebuoyIcon';
}

export interface HomePageContent {
    hero: {
        title: MultilingualString;
        subtitle: MultilingualString;
        backgroundImages: string[];
    };
    story: {
        title: MultilingualString;
        paragraph1: MultilingualString;
        paragraph2: MultilingualString;
        image: string;
    };
    video: {
        title: MultilingualString;
        subtitle: MultilingualString;
        thumbnailUrl: string;
        videoUrl: string;
    };
    location: {
        title: MultilingualString;
        subtitle: MultilingualString;
        address: MultilingualString;
        embedUrl: string;
    };
}