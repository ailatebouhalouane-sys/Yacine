import React, { useState } from 'react';
import { NextPrayerInfo, formatCountdown } from '../utils/prayerTimes';
import { LocationDetail } from '../data/algeriaData';
import { ADHAN_DUAA } from '../data/islamicContent';
import { adhanEngine } from '../utils/sound';
import { MapPin, Navigation, Play, Square, BookOpen, Volume2 } from 'lucide-react';

interface HeroPrayerCountdownProps {
  nextPrayer: NextPrayerInfo;
  currentLocation: LocationDetail;
  hijriDateStr: string;
  gregorianDateStr: string;
  onAutoLocate: () => void;
  isLocating: boolean;
  onOpenLocationPicker: () => void;
  isMuted: boolean;
  soundType: 'full' | 'takbirat' | 'chime';
}

export const HeroPrayerCountdown: React.FC<HeroPrayerCountdownProps> = ({
  nextPrayer,
  currentLocation,
  hijriDateStr,
  gregorianDateStr,
  onAutoLocate,
  isLocating,
  onOpenLocationPicker,
  isMuted,
  soundType,
}) => {
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [showDuaaModal, setShowDuaaModal] = useState(false);
  const [selectedRealTrack, setSelectedRealTrack] = useState<string>('makkah');

  const countdown = formatCountdown(nextPrayer.remainingSeconds);

  const realTracks = [
    { id: 'makkah', label: 'الحرم المكي (علي ملا)', path: '/audio/adhan_makkah.mp3' },
    { id: 'madina', label: 'المسجد النبوي', path: '/audio/adhan_madina.mp3' },
    { id: 'alaqsa', label: 'المسجد الأقصى', path: '/audio/adhan_alaqsa.mp3' },
    { id: 'fajr', label: 'أذان الفجر الحقيقي', path: '/audio/adhan_fajr.mp3' },
    { id: 'mishary', label: 'مشاري العفاسي', path: '/audio/adhan_mishary.mp3' },
  ];

  const handleToggleAdhanSound = () => {
    if (isPlayingAdhan) {
      adhanEngine.stopAll();
      setIsPlayingAdhan(false);
    } else {
      setIsPlayingAdhan(true);
      const track = realTracks.find((t) => t.id === selectedRealTrack) || realTracks[0];
      adhanEngine.playRealAdhan(track.path, isMuted ? 0 : 0.85, () => setIsPlayingAdhan(false));
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-slate-800 bg-slate-900 text-slate-100 shadow-xl mb-8">
      {/* Background Photography with Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/grand_mosque_algiers_1793699554075.jpg"
          alt="جامع الجزائر الأعظم بالواجهة البحرية عند الغروب"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.45] scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-6 mb-8 text-sm">
          {/* Location details */}
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{currentLocation.nameAr}</span>
            </span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <button
              onClick={onOpenLocationPicker}
              className="text-xs text-slate-300 hover:text-emerald-300 underline underline-offset-4 transition-colors"
            >
              {currentLocation.isSuburb ? 'ضواحي العاصمة' : 'تغيير المنطقة'}
            </button>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <button
              onClick={onAutoLocate}
              disabled={isLocating}
              className="text-xs text-slate-300 hover:text-emerald-300 flex items-center gap-1 transition-colors disabled:opacity-50"
              title="تحديد الموقع عبر GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'جار التحديد...' : 'موقعي الحالي'}</span>
            </button>
          </div>

          {/* Dates Metadata without pill boxes */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300 font-medium">
            <span className="text-amber-300 font-serif font-bold">{hijriDateStr}</span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span>{gregorianDateStr}</span>
          </div>
        </div>

        {/* Central Next Prayer Countdown Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Countdown Display */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-slate-300 text-sm md:text-base font-medium">
              <span>الصلاة القادمة:</span>
              <span className="text-xl md:text-2xl font-bold text-emerald-400">
                صلاة {nextPrayer.nextNameAr}
              </span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="text-slate-300">
                الحالية: <span className="text-slate-100 font-semibold">{nextPrayer.currentNameAr}</span>
              </span>
            </div>

            {/* Large Tabular Numbers Countdown */}
            <div className="flex items-baseline gap-2 md:gap-4 font-mono-numbers py-2 text-slate-100">
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {countdown.hours}
                </span>
                <span className="text-xs md:text-sm text-slate-400 font-sans mt-1">ساعة</span>
              </div>
              <span className="text-3xl sm:text-5xl md:text-6xl text-emerald-400 font-light -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {countdown.minutes}
                </span>
                <span className="text-xs md:text-sm text-slate-400 font-sans mt-1">دقيقة</span>
              </div>
              <span className="text-3xl sm:text-5xl md:text-6xl text-emerald-400 font-light -mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-emerald-400 drop-shadow-md">
                  {countdown.seconds}
                </span>
                <span className="text-xs md:text-sm text-slate-400 font-sans mt-1">ثانية</span>
              </div>
            </div>

            {/* Time Window Progress Bar */}
            <div className="pt-2 max-w-xl">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                <span>انقضى من الوقت</span>
                <span className="font-mono-numbers">{Math.round(nextPrayer.progressPercent)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
                  style={{ width: `${nextPrayer.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Side Action Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-center lg:border-r lg:border-slate-800 lg:pr-8">
            {/* Quick Real Voice Selector */}
            <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">صوت الأذان الحقيقي:</span>
              <select
                value={selectedRealTrack}
                onChange={(e) => {
                  setSelectedRealTrack(e.target.value);
                  if (isPlayingAdhan) {
                    adhanEngine.stopAll();
                    setIsPlayingAdhan(false);
                  }
                }}
                className="bg-slate-900 border border-slate-700 text-emerald-400 font-semibold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
              >
                {realTracks.map((t) => (
                  <option key={t.id} value={t.id} className="text-white">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleToggleAdhanSound}
              className={`w-full py-3.5 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all active:scale-[0.98] ${
                isPlayingAdhan
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-emerald-950/40'
              }`}
            >
              {isPlayingAdhan ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>إيقاف الأذان الحقيقي</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>استماع للأذان الحقيقي الآن</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowDuaaModal(true)}
              className="w-full py-3 px-4 rounded-xl font-medium text-xs md:text-sm bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>دعاء ما بعد الأذان المستجاب</span>
            </button>

            <div className="text-center pt-1 text-xs text-slate-400">
              <span className="text-emerald-400">تنبيه تلقائي: </span>
              {isMuted ? 'الصوت مكتوم حالياً' : 'مفعل عند دخول وقت الصلاة'}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adhan Duaa */}
      {showDuaaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-right shadow-2xl relative">
            <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{ADHAN_DUAA.title}</span>
            </h3>

            <p className="font-amiri text-xl leading-relaxed text-slate-100 bg-slate-950/70 p-4 rounded-xl border border-slate-800 mb-4">
              « {ADHAN_DUAA.text} »
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 mb-6 border-t border-slate-800 pt-3">
              <p>
                <strong className="text-slate-300">المصدر:</strong> {ADHAN_DUAA.source}
              </p>
              <p>
                <strong className="text-emerald-400">الفضل:</strong> {ADHAN_DUAA.benefit}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDuaaModal(false)}
                className="px-5 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
