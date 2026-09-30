import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CountrySummary, TripStats } from '../types';
import { 
  Calculator, 
  DollarSign, 
  Globe2, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Percent 
} from 'lucide-react';

export const TravelAnalyticsTab: React.FC = () => {
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [stats, setStats] = useState<TripStats | null>(null);

  // Budget Calculator State
  const [selectedCountryId, setSelectedCountryId] = useState<number>(1);
  const [tripDays, setTripDays] = useState<number>(7);
  const [travelStyle, setTravelStyle] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [flightCost, setFlightCost] = useState<number>(450);

  useEffect(() => {
    Promise.all([
      api.getCountries(),
      api.getTripStats().catch(() => null)
    ]).then(([cData, sData]) => {
      setCountries(cData);
      if (cData.length > 0) setSelectedCountryId(cData[0].id);
      if (sData) setStats(sData);
    });
  }, []);

  const activeCountry = countries.find(c => c.id === selectedCountryId) || countries[0];

  const multiplier = travelStyle === 'budget' ? 0.7 : travelStyle === 'luxury' ? 2.2 : 1.0;
  const dailyRate = activeCountry ? activeCountry.averageDailyBudgetUSD * multiplier : 150;
  const accommodationAndFoodTotal = dailyRate * tripDays;
  const estimatedActivities = 35 * tripDays;
  const totalCalculatedTripCost = accommodationAndFoodTotal + estimatedActivities + flightCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 inline-block mb-2">
          Travel Analytics & Planning
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Smart Travel Budget Estimator & Passport Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate real-world travel costs across destinations and track your world coverage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Interactive Budget Calculator */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Trip Cost & Budget Estimator</h2>
              <p className="text-xs text-slate-400">Plan accommodation, meals, transit and flight budgets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Country Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Destination Country
              </label>
              <select
                value={selectedCountryId}
                onChange={(e) => setSelectedCountryId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flagEmoji} {c.name} (${c.averageDailyBudgetUSD}/day base)
                  </option>
                ))}
              </select>
            </div>

            {/* Trip Days */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Trip Duration (Days): <span className="text-sky-400">{tripDays} Days</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={tripDays}
                onChange={(e) => setTripDays(Number(e.target.value))}
                className="w-full accent-sky-500 mt-2"
              />
            </div>
          </div>

          {/* Travel Style Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Travel Comfort Tier
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'budget', label: 'Backpacker / Hostels 🎒', desc: '0.7x avg spend' },
                { id: 'moderate', label: 'Comfort / 3-4★ Hotels 🏨', desc: '1.0x avg spend' },
                { id: 'luxury', label: 'Luxury & 5★ Resorts ✨', desc: '2.2x avg spend' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setTravelStyle(tier.id as any)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    travelStyle === tier.id
                      ? 'bg-sky-500/10 border-sky-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="text-xs font-bold mb-0.5">{tier.label}</p>
                  <p className="text-[10px] text-slate-400">{tier.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Flight estimate */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Roundtrip Flight Budget ($)
            </label>
            <input
              type="number"
              value={flightCost}
              onChange={(e) => setFlightCost(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 max-w-xs"
            />
          </div>

          {/* Cost Breakdown Display */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Estimated Total for {tripDays} Days in {activeCountry?.name}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Daily Living & Hotel (${dailyRate.toFixed(0)}/day × {tripDays} days):</span>
                <span className="text-slate-200 font-semibold">${accommodationAndFoodTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Activities, Museum Tickets & Metro:</span>
                <span className="text-slate-200 font-semibold">${estimatedActivities.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Roundtrip Airfare:</span>
                <span className="text-slate-200 font-semibold">${flightCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Estimated Trip Cost:</span>
                <span className="text-emerald-400 text-base font-black">
                  ${totalCalculatedTripCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Passport Stamps & Milestones */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-black text-white">Digital Travel Passport</h2>
            </div>
            
            <p className="text-xs text-slate-400">
              Collect passport stamps as you mark places visited in your travel history.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'France', code: 'FR', emoji: '🇫🇷' },
                { name: 'Egypt', code: 'EG', emoji: '🇪🇬' },
                { name: 'Germany', code: 'DE', emoji: '🇩🇪' },
                { name: 'Switzerland', code: 'CH', emoji: '🇨🇭' },
                { name: 'USA', code: 'US', emoji: '🇺🇸' },
                { name: 'UAE', code: 'AE', emoji: '🇦🇪' }
              ].map((c) => {
                const isVisited = stats?.countriesVisitedList?.includes(c.name);

                return (
                  <div
                    key={c.code}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      isVisited
                        ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{c.emoji}</span>
                    <span className="text-xs font-bold text-white block">{c.name}</span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block mt-1 ${
                      isVisited ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {isVisited ? 'Stamped ✈️' : 'Unexplored'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Travel Tip Alert */}
          <div className="bg-gradient-to-br from-sky-950/40 via-indigo-950/30 to-slate-900 p-5 rounded-3xl border border-sky-500/20 text-xs text-sky-200">
            <div className="flex items-center gap-2 text-sky-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart Travel Recommendation</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              When booking international train passes in Europe (like SBB in Switzerland or DB in Germany), book at least 6 weeks in advance to unlock Supersaver fare discounts up to 50%.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
