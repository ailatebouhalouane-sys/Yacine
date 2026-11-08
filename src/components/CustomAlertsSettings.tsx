import React, { useState, useEffect, useRef } from 'react';
import { PrayerKey } from '../utils/prayerTimes';
import {
  adhanEngine,
  requestNotificationPermission,
  sendPrayerNotification,
  REAL_ADHAN_TRACKS,
} from '../utils/sound';
import {
  Bell,
  BellOff,
  Volume2,
  Play,
  Square,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  Sliders,
  Upload,
  Radio,
  Music,
} from 'lucide-react';

export type SoundOption =
  | 'makkah'
  | 'madina'
  | 'alaqsa'
  | 'fajr_real'
  | 'mishary'
  | 'takbirat'
  | 'quiet_chime'
  | 'custom_uploaded';

export interface PrayerAlertConfig {
  enabled: boolean;
  sound: SoundOption;
  beforeMinutes: number; // 0, 5, 10, 15, 20
  iqamaReminderMinutes: number; // 0 (disabled), 10, 15, 20
}

export interface CustomAlertsState {
  globalVolume: number; // 0 to 1
  isMuted: boolean;
  selectedDefaultSound: SoundOption;
  customAudioName?: string;
  prayers: Record<PrayerKey, PrayerAlertConfig>;
  qiyamAlertEnabled: boolean;
  qiyamBeforeMinutes: number; // e.g. 30 mins before fajr
}

const DEFAULT_ALERT_CONFIG: CustomAlertsState = {
  globalVolume: 0.85,
  isMuted: false,
  selectedDefaultSound: 'makkah',
  prayers: {
    imsak: { enabled: true, sound: 'quiet_chime', beforeMinutes: 0, iqamaReminderMinutes: 0 },
    fajr: { enabled: true, sound: 'fajr_real', beforeMinutes: 15, iqamaReminderMinutes: 20 },
    sunrise: { enabled: false, sound: 'quiet_chime', beforeMinutes: 0, iqamaReminderMinutes: 0 },
    dhuhr: { enabled: true, sound: 'makkah', beforeMinutes: 10, iqamaReminderMinutes: 15 },
    asr: { enabled: true, sound: 'madina', beforeMinutes: 10, iqamaReminderMinutes: 15 },
    maghrib: { enabled: true, sound: 'alaqsa', beforeMinutes: 5, iqamaReminderMinutes: 10 },
    isha: { enabled: true, sound: 'mishary', beforeMinutes: 10, iqamaReminderMinutes: 15 },
  },
  qiyamAlertEnabled: true,
  qiyamBeforeMinutes: 45,
};

interface CustomAlertsSettingsProps {
  currentLocationName: string;
  onClose?: () => void;
}

export const CustomAlertsSettings: React.FC<CustomAlertsSettingsProps> = ({
  currentLocationName,
}) => {
  const [alertsState, setAlertsState] = useState<CustomAlertsState>(() => {
    try {
      const saved = localStorage.getItem('algeria_prayer_alerts_config');
      return saved ? JSON.parse(saved) : DEFAULT_ALERT_CONFIG;
    } catch {
      return DEFAULT_ALERT_CONFIG;
    }
  });

  const [playingSound, setPlayingSound] = useState<SoundOption | null>(null);
  const [customAudioDataUrl, setCustomAudioDataUrl] = useState<string | null>(() => {
    return localStorage.getItem('custom_user_adhan_audio');
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [notificationGranted, setNotificationGranted] = useState<boolean>(() => {
    return 'Notification' in window && Notification.permission === 'granted';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('algeria_prayer_alerts_config', JSON.stringify(alertsState));
  }, [alertsState]);

  const soundOptionsCatalog: {
    id: SoundOption;
    title: string;
    reciter: string;
    type: 'real_voice' | 'alert_sound' | 'custom';
    path?: string;
  }[] = [
    {
      id: 'makkah',
      title: 'أذان المسجد الحرام (مكة المكرمة)',
      reciter: 'تسجيل حقيقي بصوت الشيخ علي أحمد ملا (شيخ مؤذني الحرم المكي)',
      type: 'real_voice',
      path: '/audio/adhan_makkah.mp3',
    },
    {
      id: 'madina',
      title: 'أذان المسجد النبوي الشريف (المدينة)',
      reciter: 'تسجيل حقيقي بصوت مؤذن الحرم النبوي الشريف',
      type: 'real_voice',
      path: '/audio/adhan_madina.mp3',
    },
    {
      id: 'alaqsa',
      title: 'أذان المسجد الأقصى المبارك (القدس)',
      reciter: 'تسجيل حقيقي خاشع من رحاب المسجد الأقصى',
      type: 'real_voice',
      path: '/audio/adhan_alaqsa.mp3',
    },
    {
      id: 'fajr_real',
      title: 'أذان الفجر الحقيقي (الصلاة خير من النوم)',
      reciter: 'تسجيل أذان الفجر بصوت شجي لإيقاظ القلوب للصلاة',
      type: 'real_voice',
      path: '/audio/adhan_fajr.mp3',
    },
    {
      id: 'mishary',
      title: 'أذان الشيخ مشاري راشد العفاسي',
      reciter: 'تسجيل أذان استوديو نقي بصوت القارئ مشاري العفاسي',
      type: 'real_voice',
      path: '/audio/adhan_mishary.mp3',
    },
    {
      id: 'takbirat',
      title: 'تكبيرات الأذان فقط',
      reciter: 'الله أكبر الله أكبر (مختصر وسريع)',
      type: 'alert_sound',
    },
    {
      id: 'quiet_chime',
      title: 'نغمة تنبيه هادئة',
      reciter: 'رنين روحاني خافت ملائم لأماكن العمل والاجتماعات',
      type: 'alert_sound',
    },
  ];

  const handleTestSound = (sound: SoundOption) => {
    if (playingSound === sound) {
      adhanEngine.stopAll();
      setPlayingSound(null);
      return;
    }

    adhanEngine.stopAll();
    setPlayingSound(sound);
    const vol = alertsState.isMuted ? 0 : alertsState.globalVolume;

    const onEnded = () => setPlayingSound(null);

    if (sound === 'custom_uploaded' && customAudioDataUrl) {
      adhanEngine.playRealAdhan(customAudioDataUrl, vol, onEnded);
      return;
    }

    if (sound === 'quiet_chime') {
      adhanEngine.playChime(vol).then(onEnded);
      return;
    }

    if (sound === 'takbirat') {
      adhanEngine.playTakbirat(vol).then(onEnded);
      return;
    }

    const item = soundOptionsCatalog.find((s) => s.id === sound);
    if (item?.path) {
      adhanEngine.playRealAdhan(item.path, vol, onEnded);
    } else {
      adhanEngine.playRealAdhan('/audio/adhan_makkah.mp3', vol, onEnded);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('يرجى اختيار ملف صوتي حقيقي (MP3, M4A, WAV)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomAudioDataUrl(result);
      try {
        localStorage.setItem('custom_user_adhan_audio', result);
      } catch {
        // if exceeds localStorage quota
      }
      setAlertsState((prev) => ({
        ...prev,
        customAudioName: file.name,
        selectedDefaultSound: 'custom_uploaded',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationGranted(granted);
    if (granted) {
      sendPrayerNotification('الفجر (تجربة الأذان الحقيقي)', currentLocationName);
    }
  };

  const handleUpdatePrayerConfig = (
    key: PrayerKey,
    updates: Partial<PrayerAlertConfig>
  ) => {
    setAlertsState((prev) => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [key]: {
          ...prev.prayers[key],
          ...updates,
        },
      },
    }));
  };

  const prayerDisplayInfo: { key: PrayerKey; nameAr: string }[] = [
    { key: 'fajr', nameAr: 'صلاة الفجر' },
    { key: 'sunrise', nameAr: 'شروق الشمس' },
    { key: 'dhuhr', nameAr: 'صلاة الظهر' },
    { key: 'asr', nameAr: 'صلاة العصر' },
    { key: 'maghrib', nameAr: 'صلاة المغرب' },
    { key: 'isha', nameAr: 'صلاة العشاء' },
    { key: 'imsak', nameAr: 'وقت الإمساك' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 text-slate-100 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Radio className="w-6 h-6 text-emerald-400" />
              <span>أصوات الأذان الحقيقي والتنبيهات المخصصة</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              تسجيلات حقيقية MP3
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            اختر صوت الأذان الحقيقي بصوت كبار المؤذنين (الحرم المكي، الحرم النبوي، الأقصى، مشاري العفاسي) أو ارفع أذاناً مخصصاً من جهازك
          </p>
        </div>

        {/* Global Volume & Mute */}
        <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => {
              adhanEngine.stopAll();
              setPlayingSound(null);
              setAlertsState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              alertsState.isMuted ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400'
            }`}
            title={alertsState.isMuted ? 'إلغاء الكتم' : 'كتم الكل'}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">مستوى الصوت:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={alertsState.globalVolume}
              onChange={(e) =>
                setAlertsState((prev) => ({
                  ...prev,
                  globalVolume: Number(e.target.value),
                  isMuted: false,
                }))
              }
              className="w-24 accent-emerald-500 cursor-pointer"
            />
            <span className="font-mono-numbers text-emerald-400 w-8">
              {alertsState.isMuted ? '0%' : `${Math.round(alertsState.globalVolume * 100)}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Currently Playing Audio Floating Bar if active */}
      {playingSound && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-slate-950 border border-emerald-500/50 flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
              <Music className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-xs text-emerald-300 font-semibold block">جارٍ تشغيل الأذان الحقيقي الآن:</span>
              <span className="text-sm font-bold text-white">
                {soundOptionsCatalog.find((s) => s.id === playingSound)?.title || 'أذان مخصص'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              adhanEngine.stopAll();
              setPlayingSound(null);
            }}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>إيقاف الأذان</span>
          </button>
        </div>
      )}

      {/* Real Adhan Audio Library Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>تسجيلات الأذان الحقيقي بصوت كبار المؤذنين</span>
          </h3>
          <span className="text-xs text-slate-400">انقر على أي تسجيل لسماعه واختياره</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {soundOptionsCatalog
            .filter((s) => s.type === 'real_voice')
            .map((item) => {
              const isPlaying = playingSound === item.id;
              const isDefault = alertsState.selectedDefaultSound === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isDefault
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                          🕌
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        </div>
                      </div>

                      {isDefault && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          الافتراضي
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {item.reciter}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    {/* Play/Stop Button */}
                    <button
                      onClick={() => handleTestSound(item.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        isPlaying
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>إيقاف</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>استماع للأذان الحقيقي</span>
                        </>
                      )}
                    </button>

                    {/* Set as Default Button */}
                    <button
                      onClick={() =>
                        setAlertsState((prev) => ({
                          ...prev,
                          selectedDefaultSound: item.id,
                        }))
                      }
                      className={`p-2 rounded-xl text-xs transition-colors border ${
                        isDefault
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                      }`}
                      title="تعيين كصوت الأذان الافتراضي لكافة الصلوات"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Custom Upload Option: Upload your favorite Adhan from phone or computer */}
      <div className="mb-8 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>هل تملك تسجيلاً لمؤذن جزائري أو ترغب برفع أذانك المفضل؟</span>
          </h4>
          <p className="text-xs text-slate-400">
            يمكنك رفع ملف أذان مخصص بصيغة (MP3 / WAV / M4A) من هاتفك أو حاسوبك وسيقوم التطبيق بحفظه وتشغيله عند دخول وقت الصلاة.
          </p>
          {customAudioDataUrl && (
            <div className="text-xs text-emerald-400 pt-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>تم رفع الملف بنجاح: {alertsState.customAudioName || 'أذان مخصص'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>اختر ملف الأذان من جهازك</span>
          </button>

          {customAudioDataUrl && (
            <button
              onClick={() => handleTestSound('custom_uploaded')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
                playingSound === 'custom_uploaded'
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {playingSound === 'custom_uploaded' ? 'إيقاف' : 'تجربة الأذان المرفوع'}
            </button>
          )}
        </div>
      </div>

      {/* Individual Prayer Customization with Real Adhan Picker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>تخصيص الأذان والتنبيهات لكل صلاة على حدة</span>
          </h3>
          <span className="text-xs text-slate-400">يتم الحفظ التلقائي في جهازك</span>
        </div>

        <div className="space-y-3">
          {prayerDisplayInfo.map((p) => {
            const cfg = alertsState.prayers[p.key];
            return (
              <div
                key={p.key}
                className={`p-4 rounded-xl border transition-all ${
                  cfg.enabled
                    ? 'bg-slate-950/50 border-slate-800'
                    : 'bg-slate-950/20 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Prayer Name & Main Toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdatePrayerConfig(p.key, { enabled: !cfg.enabled })}
                      className={`p-2 rounded-xl transition-colors ${
                        cfg.enabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                      title={cfg.enabled ? 'تعطيل التنبيه' : 'تفعيل التنبيه'}
                    >
                      {cfg.enabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>

                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{p.nameAr}</span>
                        {cfg.enabled ? (
                          <span className="text-[10px] text-emerald-400 font-medium">مفعل</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-medium">معطل</span>
                        )}
                      </h4>
                    </div>
                  </div>

                  {/* Settings options row */}
                  {cfg.enabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs w-full lg:w-auto">
                      {/* Real Adhan Voice Selector */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-slate-400">صوت الأذان الحقيقي:</span>
                        <select
                          value={cfg.sound}
                          onChange={(e) =>
                            handleUpdatePrayerConfig(p.key, { sound: e.target.value as SoundOption })
                          }
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option value="makkah">أذان الحرم المكي الشريف (علي ملا)</option>
                          <option value="madina">أذان المسجد النبوي الشريف</option>
                          <option value="alaqsa">أذان المسجد الأقصى المبارك</option>
                          {p.key === 'fajr' && (
                            <option value="fajr_real">أذان الفجر الحقيقي (الصلاة خير من النوم)</option>
                          )}
                          <option value="mishary">أذان الشيخ مشاري العفاسي</option>
                          <option value="takbirat">تكبيرات فقط</option>
                          <option value="quiet_chime">نغمة هادئة</option>
                          {customAudioDataUrl && <option value="custom_uploaded">الأذان المخصص المرفوع</option>}
                        </select>
                      </div>

                      {/* Before Prayer Minutes */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-slate-400">تنبيه مسبق (قبل الأذان):</span>
                        <select
                          value={cfg.beforeMinutes}
                          onChange={(e) =>
                            handleUpdatePrayerConfig(p.key, { beforeMinutes: Number(e.target.value) })
                          }
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option value={0}>عند وقت الأذان تماماً</option>
                          <option value={5}>قبل الأذان بـ 5 دقائق</option>
                          <option value={10}>قبل الأذان بـ 10 دقائق (وضوء)</option>
                          <option value={15}>قبل الأذان بـ 15 دقيقة</option>
                          <option value={20}>قبل الأذان بـ 20 دقيقة (للمسجد)</option>
                        </select>
                      </div>

                      {/* Iqama Reminder (After Prayer) */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] text-slate-400">تذكير الإقامة (بعد الأذان):</span>
                        <select
                          value={cfg.iqamaReminderMinutes}
                          onChange={(e) =>
                            handleUpdatePrayerConfig(p.key, {
                              iqamaReminderMinutes: Number(e.target.value),
                            })
                          }
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option value={0}>معطل</option>
                          <option value={10}>بعد 10 دقائق (إقامة المغرب)</option>
                          <option value={15}>بعد 15 دقيقة (إقامة الظهر/العصر/العشاء)</option>
                          <option value={20}>بعد 20 دقيقة (إقامة الفجر)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
