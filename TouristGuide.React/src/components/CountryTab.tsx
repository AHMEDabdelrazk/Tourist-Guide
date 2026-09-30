import React, { useState, useEffect } from 'react';
import { CountrySummary, CountryDetail } from '../types';
import { api } from '../services/api';
import { 
  Globe, 
  MapPin, 
  DollarSign, 
  Navigation, 
  Star, 
  ArrowLeft, 
  Search, 
  PlusCircle, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Languages, 
  Building2 
} from 'lucide-react';

interface CountryTabProps {
  onSelectPlace: (placeId: number) => void;
  onOpenAddToTrip: (placeId: number) => void;
}

export const CountryTab: React.FC<CountryTabProps> = ({ onSelectPlace, onOpenAddToTrip }) => {
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await api.getCountries();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCountry = async (countryId: number) => {
    try {
      setLoadingDetail(true);
      const detail = await api.getCountryById(countryId);
      setSelectedCountry(detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error loading country detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const continents = ['All', 'Europe', 'Africa', 'North America', 'Asia / Middle East'];

  const filteredCountries = countries.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.capital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent = selectedContinent === 'All' || c.continent.toLowerCase().includes(selectedContinent.toLowerCase());
    return matchesSearch && matchesContinent;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* If a country is selected, show its deep-dive and top places */}
      {selectedCountry ? (
        <div className="space-y-8">
          
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCountry(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-bold shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Countries</span>
            </button>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-bold bg-sky-950/60 border border-sky-800/60 px-3.5 py-1.5 rounded-xl">
              <span>{selectedCountry.places.length} Featured Places</span>
            </div>
          </div>

          {/* Country Hero Showcase */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedCountry.heroImageUrl}
                alt={selectedCountry.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              
              {/* Flag & Title */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl drop-shadow-md">{selectedCountry.flagEmoji}</span>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-sky-400 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-sky-500/30">
                      {selectedCountry.continent}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                    {selectedCountry.name}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-slate-300">
                    <span className="text-slate-400 block text-[10px]">Capital:</span>
                    <strong>{selectedCountry.capital}</strong>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-slate-300">
                    <span className="text-slate-400 block text-[10px]">Currency:</span>
                    <strong>{selectedCountry.currency}</strong>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-emerald-400 font-bold">
                    <span className="text-slate-400 block text-[10px] font-normal">Daily Budget:</span>
                    ${selectedCountry.averageDailyBudgetUSD}/day
                  </div>
                </div>
              </div>
            </div>

            {/* Country Description & Travel Facts */}
            <div className="p-6 sm:p-8 bg-slate-950 border-t border-slate-800/80">
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {selectedCountry.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-900 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Best Season to Visit:</span>
                    <span>{selectedCountry.bestTimeToVisit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Languages className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Official Language:</span>
                    <span>{selectedCountry.language}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Emergency Hotline:</span>
                    <span>{selectedCountry.emergencyContact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: List of Top Places in this country */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Top Places in {selectedCountry.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hand-curated top attractions with full transit guides & how to go there
                </p>
              </div>
            </div>

            {selectedCountry.places.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
                <p className="text-slate-400 text-sm">No places listed yet for this country.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedCountry.places.map((place) => (
                  <div
                    key={place.id}
                    className="group bg-slate-900 rounded-3xl border border-slate-800 hover:border-sky-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image header */}
                      <div className="relative h-56 w-full overflow-hidden">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-amber-500/30">
                            {place.categoryName}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-xs font-bold text-amber-400 border border-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{place.rating.toFixed(1)}</span>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4">
                          <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{place.city}</span>
                          </div>
                          <h3 className="text-lg font-black text-white drop-shadow-md truncate">
                            {place.name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {place.summary}
                        </p>

                        {/* HOW TO GO THERE PREVIEW BOX */}
                        <div className="bg-sky-950/30 border border-sky-500/20 rounded-2xl p-3.5 text-xs">
                          <div className="flex items-center gap-2 text-sky-400 font-bold mb-1.5">
                            <Navigation className="w-3.5 h-3.5 text-sky-400" />
                            <span className="uppercase tracking-wider text-[10px]">How to Go There:</span>
                          </div>
                          <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed">
                            {place.howToGoThere}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-slate-200 font-semibold">
                              {place.ticketPriceUSD === 0 ? 'Free' : `$${place.ticketPriceUSD.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{place.recommendedDuration}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-5 pt-0 flex gap-2">
                      <button
                        onClick={() => onSelectPlace(place.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all text-center"
                      >
                        View Full Guide
                      </button>
                      <button
                        onClick={() => onOpenAddToTrip(place.id)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add to Trips</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Default View: Country Catalog Grid */
        <div className="space-y-8">
          
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
            <div className="max-w-2xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 inline-block mb-3">
                Curated Travel Catalog
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                Explore Destinations & Travel Guides
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Discover top destinations across <strong>France, Egypt, Germany, Switzerland, USA, and UAE</strong>. 
                Browse verified attractions, detailed transit instructions, and add to your personal trip history.
              </p>
            </div>
          </div>

          {/* Search & Continent Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search country or capital..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
              />
            </div>

            {/* Continent Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {continents.map((cont) => (
                <button
                  key={cont}
                  onClick={() => setSelectedContinent(cont)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedContinent === cont
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cont}
                </button>
              ))}
            </div>
          </div>

          {/* Countries Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-sky-500 border-t-transparent animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-xs">Loading world destinations...</p>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-sm">No countries found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCountries.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectCountry(c.id)}
                  className="group bg-slate-900 rounded-3xl border border-slate-800 hover:border-sky-500/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Country Card Cover Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={c.heroImageUrl}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                      
                      {/* Flag and Places Count */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 shadow-md">
                        <span className="text-xl">{c.flagEmoji}</span>
                        <span className="text-xs font-bold text-white">{c.name}</span>
                      </div>

                      <div className="absolute top-3 right-3 bg-sky-500/90 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
                        {c.placesCount} Places
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Capital: <strong>{c.capital}</strong></span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{c.continent}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <div className="text-slate-400">
                          <span className="block text-[10px]">Currency:</span>
                          <span className="font-semibold text-slate-200">{c.currency}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] text-slate-400">Avg Budget:</span>
                          <span className="font-bold text-emerald-400">${c.averageDailyBudgetUSD}/day</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="p-5 pt-0">
                    <button className="w-full py-2.5 px-4 rounded-xl bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-600 text-slate-200 group-hover:text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5">
                      <span>Explore {c.name} Places</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
