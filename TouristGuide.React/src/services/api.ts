import {
  AuthResponse,
  CountryDetail,
  CountrySummary,
  CreateTripEntryRequest,
  PlaceDetail,
  PlaceSummary,
  TripEntry,
  TripStats,
  UpdateTripEntryRequest,
  User
} from '../types';

const API_BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('tg_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Auth
  async login(credentials: { usernameOrEmail: string; password: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(data: { username: string; email: string; password: string; fullName?: string; homeCountry?: string }): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(): Promise<User> {
    return request<User>('/auth/me');
  },

  async updateProfile(data: { fullName?: string; avatarUrl?: string; bio?: string; homeCountry?: string }): Promise<User> {
    return request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Countries
  async getCountries(): Promise<CountrySummary[]> {
    return request<CountrySummary[]>('/countries');
  },

  async getCountryById(id: number): Promise<CountryDetail> {
    return request<CountryDetail>(`/countries/${id}`);
  },

  async getCountryByCode(code: string): Promise<CountryDetail> {
    return request<CountryDetail>(`/countries/code/${code}`);
  },

  // Places
  async getPlaces(params?: {
    countryId?: number;
    countryCode?: string;
    category?: string;
    searchTerm?: string;
    maxTicketPrice?: number;
    minRating?: number;
    sortBy?: string;
  }): Promise<PlaceSummary[]> {
    const query = new URLSearchParams();
    if (params?.countryId) query.set('countryId', params.countryId.toString());
    if (params?.countryCode) query.set('countryCode', params.countryCode);
    if (params?.category) query.set('category', params.category);
    if (params?.searchTerm) query.set('searchTerm', params.searchTerm);
    if (params?.maxTicketPrice) query.set('maxTicketPrice', params.maxTicketPrice.toString());
    if (params?.minRating) query.set('minRating', params.minRating.toString());
    if (params?.sortBy) query.set('sortBy', params.sortBy);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<PlaceSummary[]>(`/places${queryString}`);
  },

  async getTopRatedPlaces(count = 6): Promise<PlaceSummary[]> {
    return request<PlaceSummary[]>(`/places/top-rated?count=${count}`);
  },

  async getPlaceById(id: number): Promise<PlaceDetail> {
    return request<PlaceDetail>(`/places/${id}`);
  },

  async addReview(placeId: number, data: { rating: number; comment: string }) {
    return request(`/places/${placeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Trips (Trip History & Itinerary)
  async getUserTrips(): Promise<TripEntry[]> {
    return request<TripEntry[]>('/trips');
  },

  async getTripStats(): Promise<TripStats> {
    return request<TripStats>('/trips/stats');
  },

  async addToTrips(entry: CreateTripEntryRequest): Promise<TripEntry> {
    return request<TripEntry>('/trips', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  },

  async updateTrip(id: number, entry: UpdateTripEntryRequest): Promise<TripEntry> {
    return request<TripEntry>(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entry),
    });
  },

  async deleteTrip(id: number): Promise<void> {
    await request<void>(`/trips/${id}`, {
      method: 'DELETE',
    });
  },

  // Utilities
  async getCurrencyRates(): Promise<{ baseCurrency: string; updatedAt: string; rates: Record<string, number> }> {
    return request('/travelutilities/currencies');
  },

  async getWeather(city: string): Promise<{ city: string; country: string; tempC: number; condition: string; humidity: number; windKmh: number; icon: string }> {
    return request(`/travelutilities/weather/${encodeURIComponent(city)}`);
  }
};
