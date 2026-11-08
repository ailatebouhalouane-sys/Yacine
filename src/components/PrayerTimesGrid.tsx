import React from 'react';
import { PrayerTimes, PrayerKey, NextPrayerInfo } from '../utils/prayerTimes';
import { Volume2, Bell, BellOff, Sun, Sunset, Sunrise, Moon, CloudSun, Sparkles } from 'lucide-react';
import { adhanEngine } from '../utils/sound';

interface PrayerTimesGridProps {
  prayerTimes: PrayerTimes;
  nextPrayer: NextPrayerInfo;
  enabledAlerts: Record<PrayerKey, boolean>;
  onToggleAlert: (key: PrayerKey) => void;
  isMuted: boolean;
}

interface PrayerCardConfig {
  key: PrayerKey;
  nameAr: string;
  nameEn: string;
  icon: React.ReactNode;
  description: string;
  isMainObligation: boolean;
}

export const PrayerTimesGrid: React.FC<PrayerTimesGridProps> = ({
  prayerTimes,
  nextPrayer,
  enabledAlerts,
  onToggleAlert,
  isMuted,
}) => {
  const cards: PrayerCardConfig[] = [
    {
      key: 'imsak',
      nameAr: 'الإمساك',
      nameEn: 'Imsak',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      description: 'وقت الإمساك للصائمين',
      isMainObligation: false,
    },
    {
      key: 'fajr',
      nameAr: 'الفجر',
      nameEn: 'Fajr',
      icon: <Sunrise className="w-5 h-5 text-amber-400" />,
      description: 'ركعتا سنة الفجر ثم الفريضة',
      isMainObligation: true,
    },
    {
      key: 'sunrise',
      nameAr: 'الشروق',
      nameEn: 'Sunrise',
      icon: <Sun className="w-5 h-5 text-orange-400" />,
      description: 'شروق الشمس ونهاية وقت الفجر',
      isMainObligation: false,
    },
    {
      key: 'dhuhr',
      nameAr: 'الظهر',
      nameEn: 'Dhuhr',
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      description: 'أربع ركعات سرية',
      isMainObligation: true,
    },
    {
      key: 'asr',
      nameAr: 'العصر',
      nameEn: 'Asr',
      icon: <CloudSun className="w-5 h-5 text-amber-500" />,
      description: 'الصلاة الوسطى (مذهب مالك)',
      isMainObligation: true,
    },
    {
      key: 'maghrib',
      nameAr: 'المغرب',
      nameEn: 'Maghrib',
      icon: <Sunset className="w-5 h-5 text-rose-400" />,
      description: 'ثلاث ركعات ووقت الإفطار',
      isMainObligation: true,
    },
    {
      key: 'isha',
      nameAr: 'العشاء',
      nameEn: 'Isha',
      icon: <Moon className="w-5 h-5 text-sky-400" />,
      description: 'أربع ركعات ثم الشفع والوتر',
      isMainObligation: true,
    },
  ];

  const [playingKey, setPlayingKey] = React.useState<string | null>(null);

  const handleTestSound = (key: PrayerKey) => {
    if (playingKey === key) {
      adhanEngine.stopAll();
      setPlayingKey(null);
      return;
    }

    adhanEngine.stopAll();
    setPlayingKey(key);

    const onEnded = () => setPlayingKey(null);

    if (key === 'fajr') {
      adhanEngine.playRealAdhan('/audio/adhan_fajr.mp3', isMuted ? 0 : 0.85, onEnded);
    } else if (key === 'imsak' || key === 'sunrise') {
      adhanEngine.playChime(isMuted ? 0 : 0.6).then(onEnded);
    } else {
      adhanEngine.playRealAdhan('/audio/adhan_makkah.mp3', isMuted ? 0 : 0.85, onEnded);
    }
  };

  return (
    <div className="space-y-4 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <span>جدول مواقيت الصلاة اليومية</span>
        </h2>
        <div className="text-xs text-slate-400 flex items-center gap-3">
          <span>طريقة الحساب: وزارة الشؤون الدينية والأوقاف الجزائرية</span>
          <span aria-hidden="true">·</span>
          <span>الفجر 18° / العشاء 17°</span>
        </div>
      </div>

      {/* Grid of prayer cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-4">
        {cards.map((item) => {
          const isCurrent = nextPrayer.currentKey === item.key;
          const isNext = nextPrayer.nextKey === item.key;
          const timeStr = prayerTimes[item.key];
          const isAlertEnabled = enabledAlerts[item.key] ?? true;

          return (
            <div
              key={item.key}
              className={`relative rounded-xl p-4 transition-all duration-200 border flex flex-col justify-between ${
                isNext
                  ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                  : isCurrent
                  ? 'bg-slate-900/90 border-slate-700'
                  : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-800/80 text-slate-200">
                    {item.icon}
                  </div>

                  {/* Badges without candy pills: quiet text */}
                  {isNext && (
                    <span className="text-[11px] font-bold text-emerald-400">
                      الصلاة القادمة
                    </span>
                  )}
                  {isCurrent && !isNext && (
                    <span className="text-[11px] font-medium text-slate-400">
                      الوقت الحالي
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-100">
                    {item.nameAr}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Central Time in Tabular Numerals */}
              <div className="my-3 text-right">
                <span className="font-mono-numbers text-2xl md:text-3xl font-extrabold tracking-tight text-white block">
                  {timeStr}
                </span>
              </div>

              {/* Card Footer: Action toggles */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                {/* Audio quick preview */}
                <button
                  onClick={() => handleTestSound(item.key)}
                  className={`p-1 rounded transition-colors flex items-center gap-1 ${
                    playingKey === item.key
                      ? 'text-rose-400 bg-rose-500/20'
                      : 'hover:text-emerald-400 hover:bg-slate-800 text-slate-400'
                  }`}
                  title={playingKey === item.key ? 'إيقاف الأذان' : 'سماع الأذان الحقيقي'}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${playingKey === item.key ? 'animate-bounce' : ''}`} />
                </button>

                {/* Reminder Alert toggle */}
                <button
                  onClick={() => onToggleAlert(item.key)}
                  className={`flex items-center gap-1 p-1 rounded transition-colors ${
                    isAlertEnabled
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                  title={isAlertEnabled ? 'التنبيه مفعل' : 'التنبيه معطل'}
                >
                  {isAlertEnabled ? (
                    <Bell className="w-3.5 h-3.5" />
                  ) : (
                    <BellOff className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px]">
                    {isAlertEnabled ? 'مفعل' : 'صامت'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Night Times Bar (قيام الليل ومنتصف الليل) */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">أوقات قيام الليل المستحبة:</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono-numbers">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-sans">منتصف الليل الشرعي:</span>
            <span className="text-white font-bold">{prayerTimes.midnight}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-sans">بداية الثلث الأخير (النزول الإلهي):</span>
            <span className="text-emerald-400 font-bold">{prayerTimes.lastThird}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
