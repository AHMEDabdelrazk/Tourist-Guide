import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Coins, 
  CloudSun, 
  ArrowRightLeft, 
  Sun, 
  Wind, 
  Droplets, 
  PhoneCall, 
  Clock, 
  Globe 
} from 'lucide-react';

export const TravelToolsTab: React.FC = () => {
  // Currency State
  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1.0,
    EUR: 0.92,
    EGP: 49.50,
    CHF: 0.88,
    AED: 3.67,
    GBP: 0.79,
    JPY: 152.4
  });
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');

  // Weather State
  const [selectedCity, setSelectedCity] = useState<string>('Paris');
  const [weather, setWeather] = useState<{
    city: string;
    country: string;
    tempC: number;
    condition: string;
    humidity: number;
    windKmh: number;
  } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);

  useEffect(() => {
    api.getCurrencyRates()
      .then((data) => {
        if (data.rates) setRates(data.rates);
      })
      .catch((err) => console.warn('Using default currency rates', err));

    loadWeather('Paris');
  }, []);

  const loadWeather = async (city: string) => {
    try {
      setLoadingWeather(true);
      const data = await api.getWeather(city);
      setWeather(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    loadWeather(city);
  };

  // Convert Math
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  const convertedResult = (amount / fromRate) * toRate;

  const quickCities = [
    { name: 'Paris', country: 'France', flag: '🇫🇷' },
    { name: 'Cairo', country: 'Egypt', flag: '🇪🇬' },
    { name: 'Berlin', country: 'Germany', flag: '🇩🇪' },
    { name: 'Zermatt', country: 'Switzerland', flag: '🇨🇭' },
    { name: 'New York', country: 'USA', flag: '🇺🇸' },
    { name: 'Dubai', country: 'UAE', flag: '🇦🇪' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20 inline-block mb-2">
          Real-Time Travel Utilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Currency Converter & Weather Radar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Instant multi-currency exchange rates and destination weather for France, Egypt, Germany, Switzerland, USA, and UAE
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Currency Converter Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Live Currency Converter</h2>
              <p className="text-xs text-slate-400">Exchange rates for tourist travel expenses</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Amount
              </label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base font-bold text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  From Currency
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="USD">USD - United States Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="EGP">EGP - Egyptian Pound (E£)</option>
                  <option value="CHF">CHF - Swiss Franc (Fr.)</option>
                  <option value="AED">AED - UAE Dirham (د.إ)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  To Currency
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="EGP">EGP - Egyptian Pound (E£)</option>
                  <option value="CHF">CHF - Swiss Franc (Fr.)</option>
                  <option value="AED">AED - UAE Dirham (د.إ)</option>
                  <option value="USD">USD - United States Dollar ($)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                </select>
              </div>
            </div>

            {/* Conversion Output Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 p-5 rounded-2xl border border-sky-500/20 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                {amount} {fromCurrency} equals approximately
              </span>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                {convertedResult.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
              </div>
              <span className="text-[10px] text-slate-500 block mt-2">
                1 {fromCurrency} = {(toRate / fromRate).toFixed(4)} {toCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Destination Weather Radar Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Destination Weather Forecast</h2>
              <p className="text-xs text-slate-400">Current temperature & atmospheric conditions</p>
            </div>
          </div>

          {/* Quick city selector buttons */}
          <div className="grid grid-cols-3 gap-2">
            {quickCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCityChange(city.name)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                  selectedCity === city.name
                    ? 'bg-sky-500 text-white border-transparent shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{city.flag}</span>
                <span>{city.name}</span>
              </button>
            ))}
          </div>

          {/* Weather Display */}
          {loadingWeather ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 rounded-full border-3 border-sky-500 border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-slate-500 text-xs">Querying weather satellite...</p>
            </div>
          ) : weather ? (
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">{weather.city}</h3>
                  <p className="text-xs text-slate-400">{weather.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-8 h-8 text-amber-400" />
                  <span className="text-4xl font-black text-white">{weather.tempC}°C</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 bg-sky-950/40 p-2.5 rounded-xl border border-sky-800/40">
                <span>Condition:</span>
                <strong>{weather.condition}</strong>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <span>Humidity: <strong>{weather.humidity}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-emerald-400" />
                  <span>Wind: <strong>{weather.windKmh} km/h</strong></span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Emergency contacts fast card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <PhoneCall className="w-4 h-4" />
              <span>EU & Worldwide Emergency:</span>
            </div>
            <span className="font-mono font-extrabold text-white bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 rounded-lg">
              Dial 112 or 911
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
