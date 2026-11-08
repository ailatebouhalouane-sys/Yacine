/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ALL_LOCATIONS, LocationDetail, findClosestAlgerianLocation, ALGIERS_SUBURBS } from './data/algeriaData';
import { calculatePrayerTimes, getNextPrayer, getHijriDate, PrayerKey } from './utils/prayerTimes';
import { adhanEngine, sendPrayerNotification } from './utils/sound';
import { Navbar } from './components/Navbar';
import { HeroPrayerCountdown } from './components/HeroPrayerCountdown';
import { PrayerTimesGrid } from './components/PrayerTimesGrid';
import { AlgeriaLocationPicker } from './components/AlgeriaLocationPicker';
import { InteractiveMosquesMap } from './components/InteractiveMosquesMap';
import { CustomAlertsSettings, CustomAlertsState } from './components/CustomAlertsSettings';
import { AdhkarAndTasbeeh } from './components/AdhkarAndTasbeeh';
import { QiblaCompass } from './components/QiblaCompass';
import { MonthlyPrayerCalendar } from './components/MonthlyPrayerCalendar';
import { MapPin, Bell, BookOpen, Compass, Calendar, Building2, Sliders, Volume2, Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'suburbs' | 'map' | 'alerts' | 'adhkar' | 'qibla' | 'calendar'>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme_mode') !== 'light';
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Selected Algerian Location (Wilaya or Algiers Suburb)
  const [currentLocation, setCurrentLocation] = useState<LocationDetail>(() => {
    const saved = localStorage.getItem('selected_algeria_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Default to Greater Algiers (الجزائر العاصمة)
    return ALGIERS_SUBURBS[0];
  });

  const [userGpsCoords, setUserGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Enabled Alerts per prayer
  const [enabledAlerts, setEnabledAlerts] = useState<Record<PrayerKey, boolean>>({
    imsak: true,
    fajr: true,
    sunrise: false,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });

  // Current live time (updates every second)
  const [now, setNow] = useState<Date>(new Date());

  // Track prayers alerted today to prevent repeated alerts
  const lastAlertedPrayerRef = useRef<string | null>(null);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }
  }, [isDarkMode]);

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save selected location
  const handleSelectLocation = (loc: LocationDetail) => {
    setCurrentLocation(loc);
    localStorage.setItem('selected_algeria_location', JSON.stringify(loc));
  };

  // HTML5 Geolocation
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert('خدمة تحديد الموقع الجغرافي غير مدعومة في متصفحك.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserGpsCoords(coords);
        const closest = findClosestAlgerianLocation(coords.lat, coords.lng);
        handleSelectLocation(closest);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Calculate live prayer times for current date & location
  const prayerTimes = useMemo(() => {
    return calculatePrayerTimes(now, currentLocation.lat, currentLocation.lng);
  }, [now, currentLocation]);

  const nextPrayer = useMemo(() => {
    return getNextPrayer(prayerTimes, now);
  }, [prayerTimes, now]);

  // Check and dispatch automatic Adhan audio & browser notification
  useEffect(() => {
    // Read user custom alert config from localStorage if present
    let alertSound = 'full_algerian';
    try {
      const cfgStr = localStorage.getItem('algeria_prayer_alerts_config');
      if (cfgStr) {
        const cfg: CustomAlertsState = JSON.parse(cfgStr);
        const prayerCfg = cfg.prayers[nextPrayer.nextKey];
        if (prayerCfg && !prayerCfg.enabled) {
          return;
        }
        if (prayerCfg?.sound) {
          alertSound = prayerCfg.sound;
        }
      }
    } catch {
      // default
    }

    // Trigger alert when remaining time is 0 (or within 2 seconds)
    const alertKey = `${nextPrayer.nextKey}-${now.toDateString()}-${now.getHours()}:${now.getMinutes()}`;
    if (nextPrayer.remainingSeconds <= 1 && lastAlertedPrayerRef.current !== alertKey) {
      lastAlertedPrayerRef.current = alertKey;

      if (!isMuted) {
        if (alertSound === 'quiet_chime') {
          adhanEngine.playChime(0.6);
        } else if (alertSound === 'takbirat') {
          adhanEngine.playTakbirat(0.7);
        } else if (alertSound === 'madina') {
          adhanEngine.playRealAdhan('/audio/adhan_madina.mp3', 0.85);
        } else if (alertSound === 'alaqsa') {
          adhanEngine.playRealAdhan('/audio/adhan_alaqsa.mp3', 0.85);
        } else if (alertSound === 'fajr_real' || nextPrayer.nextKey === 'fajr') {
          adhanEngine.playRealAdhan('/audio/adhan_fajr.mp3', 0.85);
        } else if (alertSound === 'mishary') {
          adhanEngine.playRealAdhan('/audio/adhan_mishary.mp3', 0.85);
        } else {
          // Check for custom uploaded audio
          const customAudio = localStorage.getItem('custom_user_adhan_audio');
          if (alertSound === 'custom_uploaded' && customAudio) {
            adhanEngine.playRealAdhan(customAudio, 0.85);
          } else {
            adhanEngine.playRealAdhan('/audio/adhan_makkah.mp3', 0.85);
          }
        }
      }

      sendPrayerNotification(nextPrayer.nextNameAr, currentLocation.nameAr);
    }
  }, [nextPrayer, now, isMuted, currentLocation]);

  // Format dates
  const hijriDateStr = useMemo(() => {
    return getHijriDate(now).formattedAr;
  }, [now]);

  const gregorianDateStr = useMemo(() => {
    return new Intl.DateTimeFormat('ar-DZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
  }, [now]);

  const toggleAlert = (key: PrayerKey) => {
    setEnabledAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab as any}
        setActiveTab={(tab) => setActiveTab(tab)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSettings={() => setActiveTab('alerts')}
        onOpenLocationPicker={() => setActiveTab('suburbs')}
        currentLocationName={currentLocation.nameAr}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Navigation Sub-bar for mobile and quick tabs */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
          {[
            { id: 'home', label: 'المواقيت اليومية' },
            { id: 'suburbs', label: 'الجزائر وضواحيها' },
            { id: 'map', label: 'خريطة المساجد' },
            { id: 'alerts', label: 'نظام التنبيهات' },
            { id: 'adhkar', label: 'الأذكار والمسبحة' },
            { id: 'qibla', label: 'اتجاه القبلة' },
            { id: 'calendar', label: 'إمساكية الشهر' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Home Dashboard */}
        {activeTab === 'home' && (
          <>
            <HeroPrayerCountdown
              nextPrayer={nextPrayer}
              currentLocation={currentLocation}
              hijriDateStr={hijriDateStr}
              gregorianDateStr={gregorianDateStr}
              onAutoLocate={handleAutoLocate}
              isLocating={isLocating}
              onOpenLocationPicker={() => setActiveTab('suburbs')}
              isMuted={isMuted}
              soundType="full"
            />

            <PrayerTimesGrid
              prayerTimes={prayerTimes}
              nextPrayer={nextPrayer}
              enabledAlerts={enabledAlerts}
              onToggleAlert={toggleAlert}
              isMuted={isMuted}
            />

            {/* Quick Feature Spotlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <button
                onClick={() => setActiveTab('map')}
                className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-right transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  خريطة مساجد الجزائر وضواحيها
                </h3>
                <p className="text-xs text-slate-400">
                  ابحث عن أقرب مسجد إليك بالعاصمة أو أي ولاية، مع مواقيت الإقامة واتجاهات GPS المباشرة.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('alerts')}
                className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-right transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  نظام التنبيهات المخصص
                </h3>
                <p className="text-xs text-slate-400">
                  تحديد صوت الأذان، وتوقيت التنبيه المسبق (5، 10، 15 دقيقة) وتذكير الإقامة لكل صلاة بشكل مستقل.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('adhkar')}
                className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-right transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  الأذكار اليومية والمسبحة
                </h3>
                <p className="text-xs text-slate-400">
                  أذكار الصباح والمساء، أذكار ما بعد الصلاة المكتوبة، وأدعية مأثورة مع عداد تسبيح تفاعلي.
                </p>
              </button>
            </div>
          </>
        )}

        {/* Tab 2: Suburbs & Wilayas Explorer */}
        {activeTab === 'suburbs' && (
          <AlgeriaLocationPicker
            currentLocation={currentLocation}
            onSelectLocation={handleSelectLocation}
            onAutoLocate={handleAutoLocate}
            isLocating={isLocating}
          />
        )}

        {/* Tab 3: Interactive Mosques Map */}
        {activeTab === 'map' && (
          <InteractiveMosquesMap
            currentLocation={currentLocation}
            userCoords={userGpsCoords}
          />
        )}

        {/* Tab 4: Custom Alerts Settings */}
        {activeTab === 'alerts' && (
          <CustomAlertsSettings
            currentLocationName={currentLocation.nameAr}
          />
        )}

        {/* Tab 5: Adhkar & Digital Tasbeeh */}
        {activeTab === 'adhkar' && <AdhkarAndTasbeeh />}

        {/* Tab 6: Qibla Compass */}
        {activeTab === 'qibla' && <QiblaCompass currentLocation={currentLocation} />}

        {/* Tab 7: Monthly Calendar */}
        {activeTab === 'calendar' && <MonthlyPrayerCalendar currentLocation={currentLocation} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">
              مواقيت صلاتي بالجزائر وضواحيها
            </span>
            <span aria-hidden="true">·</span>
            <span>معتمد على معايير وزارة الشؤون الدينية والأوقاف الجزائرية</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>زاوية الفجر: 18°</span>
            <span aria-hidden="true">·</span>
            <span>زاوية العشاء: 17°</span>
            <span aria-hidden="true">·</span>
            <span>المذهب الفقهي: الإمام مالك (العصر: ظل المثل)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
