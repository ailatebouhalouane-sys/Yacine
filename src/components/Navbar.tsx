import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Bell, MapPin } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'suburbs' | 'qibla' | 'calendar' | 'adhkar';
  setActiveTab: (tab: 'home' | 'suburbs' | 'qibla' | 'calendar' | 'adhkar') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  onOpenSettings: () => void;
  onOpenLocationPicker: () => void;
  currentLocationName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  isMuted,
  setIsMuted,
  onOpenSettings,
  onOpenLocationPicker,
  currentLocationName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="text-right group focus:outline-none"
          >
            <span className="text-lg md:text-xl font-bold tracking-tight text-emerald-400 group-hover:text-emerald-300 transition-colors block">
              مواقيت صلاتي بالجزائر
            </span>
          </button>

          {/* Quick Suburb / Location Indicator Button */}
          <button
            onClick={onOpenLocationPicker}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors shrink-0"
            title="تغيير الولاية أو الضاحية"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[150px]">{currentLocationName}</span>
          </button>
        </div>

        {/* Zone 2: Concise Nav Links (Single line, text with hover underlines) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              activeTab === 'home'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            المواقيت اليومية
          </button>

          <button
            onClick={() => setActiveTab('suburbs')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              activeTab === 'suburbs'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            الجزائر وضواحيها
          </button>

          <button
            onClick={() => setActiveTab('qibla')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              activeTab === 'qibla'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            اتجاه القبلة
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              activeTab === 'calendar'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            إمساكية الشهر
          </button>

          <button
            onClick={() => setActiveTab('adhkar')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              activeTab === 'adhkar'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white border-transparent'
            }`}
          >
            الأذكار والمسبحة
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mute / Unmute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            title={isMuted ? 'إلغاء كتم صوت الأذان' : 'كتم صوت الأذان'}
            aria-label="التحكم بالصوت"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            title="إعدادات التنبيه والمواقيت"
            aria-label="الإعدادات"
          >
            <Bell className="w-4 h-4 text-amber-400" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            aria-label="تبديل المظهر"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenLocationPicker}
            className="px-3.5 py-1.5 text-xs md:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>اختر منطقتك</span>
          </button>
        </div>
      </div>
    </header>
  );
};
