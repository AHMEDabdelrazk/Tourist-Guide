export type TripStatus = 'Planned' | 'Visited' | 'BucketList';

export type PlaceCategory = 
  | 'Historical'
  | 'Nature'
  | 'Adventure'
  | 'Cultural'
  | 'Urban'
  | 'Beach'
  | 'WonderOfTheWorld';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: string;
  bio?: string;
  homeCountry?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

export interface PlaceSummary {
  id: number;
  countryId: number;
  countryName: string;
  countryCode: string;
  flagEmoji: string;
  name: string;
  city: string;
  category: PlaceCategory;
  categoryName: string;
  summary: string;
  howToGoThere: string;
  ticketPriceUSD: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  bestTimeToVisit: string;
  recommendedDuration: string;
}

export interface Review {
  id: number;
  placeId: number;
  userId: number;
  username: string;
  userAvatarUrl: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PlaceDetail extends PlaceSummary {
  description: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  galleryImages: string[];
  highlights: string[];
  travelTips: string;
  reviews: Review[];
}

export interface CountrySummary {
  id: number;
  name: string;
  code: string;
  continent: string;
  capital: string;
  currency: string;
  language: string;
  flagEmoji: string;
  flagImageUrl: string;
  heroImageUrl: string;
  description: string;
  bestTimeToVisit: string;
  averageDailyBudgetUSD: number;
  placesCount: number;
}

export interface CountryDetail extends CountrySummary {
  timeZone: string;
  emergencyContact: string;
  places: PlaceSummary[];
}

export interface TripEntry {
  id: number;
  userId: number;
  placeId: number;
  placeName: string;
  city: string;
  countryId: number;
  countryName: string;
  countryCode: string;
  flagEmoji: string;
  imageUrl: string;
  categoryName: string;
  status: TripStatus;
  statusName: string;
  visitDate?: string;
  notes?: string;
  userRating?: number;
  actualCostUSD?: number;
  travelMode?: string;
  travelBuddy?: string;
  createdAt: string;
}

export interface CreateTripEntryRequest {
  placeId: number;
  status: TripStatus;
  visitDate?: string;
  notes?: string;
  userRating?: number;
  actualCostUSD?: number;
  travelMode?: string;
  travelBuddy?: string;
}

export interface UpdateTripEntryRequest {
  status: TripStatus;
  visitDate?: string;
  notes?: string;
  userRating?: number;
  actualCostUSD?: number;
  travelMode?: string;
  travelBuddy?: string;
}

export interface TripStats {
  totalTrips: number;
  visitedCount: number;
  plannedCount: number;
  bucketListCount: number;
  countriesExplored: number;
  totalExpenditureUSD: number;
  averageUserRating: number;
  countriesVisitedList: string[];
}
