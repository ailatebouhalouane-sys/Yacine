import React, { useState } from 'react';
import { ALL_ADHKAR, DhikrItem, TASBEEH_PRESETS } from '../data/islamicContent';
import { Sparkles, Sun, Moon, Heart, BookOpen, Check, RotateCcw, Volume2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { adhanEngine } from '../utils/sound';

export const AdhkarAndTasbeeh: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'morning' | 'evening' | 'after_prayer' | 'daily_duas' | 'tasbeeh'>('morning');
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Track counts per dhikr
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({});

  // Digital Tasbeeh state
  const [tasbeehPresetIndex, setTasbeehPresetIndex] = useState(0);
  const [currentTasbeehCount, setCurrentTasbeehCount] = useState(0);
  const [totalLifetimeTasbeeh, setTotalLifetimeTasbeeh] = useState(() => {
    return parseInt(localStorage.getItem('tasbeeh_lifetime_count') || '0', 10);
  });

  const activePreset = TASBEEH_PRESETS[tasbeehPresetIndex];

  const handleIncrementTasbeeh = () => {
    const next = currentTasbeehCount + 1;
    setCurrentTasbeehCount(next);

    const newLifetime = totalLifetimeTasbeeh + 1;
    setTotalLifetimeTasbeeh(newLifetime);
    localStorage.setItem('tasbeeh_lifetime_count', String(newLifetime));

    // Play subtle soft click
    adhanEngine.playChime(0.15);

    // Haptic vibration if supported on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleResetTasbeeh = () => {
    setCurrentTasbeehCount(0);
  };

  const handleIncrementDhikr = (id: string, targetCount: number) => {
    const current = completedCounts[id] || 0;
    if (current < targetCount) {
      const next = current + 1;
      setCompletedCounts((prev) => ({ ...prev, [id]: next }));
      adhanEngine.playChime(0.1);
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
    }
  };

  const handleResetCategoryCounts = () => {
    const nextCounts = { ...completedCounts };
    ALL_ADHKAR.filter((d) => d.category === activeCategory).forEach((d) => {
      delete nextCounts[d.id];
    });
    setCompletedCounts(nextCounts);
  };

  const categoryAdhkar = ALL_ADHKAR.filter((d) => d.category === activeCategory);
  const totalInCategory = categoryAdhkar.length;
  const completedInCategory = categoryAdhkar.filter(
    (d) => (completedCounts[d.id] || 0) >= d.targetCount
  ).length;

  const fontClass =
    fontSizeLevel === 'normal'
      ? 'text-lg leading-relaxed'
      : fontSizeLevel === 'large'
      ? 'text-xl md:text-2xl leading-loose'
      : 'text-2xl md:text-3xl leading-[2.2]';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 text-slate-100 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>حصن المسلم: الأذكار والأدعية اليومية</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            أذكار الصباح والمساء، أذكار ما بعد الصلاة المكتوبة، وأدعية مأثورة مع مسبحة إلكترونية تفاعلية
          </p>
        </div>

        {/* Text Size Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0 self-start md:self-auto">
          <span className="text-[11px] text-slate-400 px-2">حجم الخط:</span>
          <button
            onClick={() => setFontSizeLevel('normal')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              fontSizeLevel === 'normal' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            عادي
          </button>
          <button
            onClick={() => setFontSizeLevel('large')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              fontSizeLevel === 'large' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            كبير
          </button>
          <button
            onClick={() => setFontSizeLevel('xlarge')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
              fontSizeLevel === 'xlarge' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            كبير جداً
          </button>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { id: 'morning', label: 'أذكار الصباح', icon: <Sun className="w-4 h-4 text-amber-400" /> },
          { id: 'evening', label: 'أذكار المساء', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
          { id: 'after_prayer', label: 'أذكار بعد الصلاة', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
          { id: 'daily_duas', label: 'أدعية جامعة مأثورة', icon: <Heart className="w-4 h-4 text-rose-400" /> },
          { id: 'tasbeeh', label: 'المسبحة الإلكترونية', icon: <RotateCcw className="w-4 h-4 text-teal-400" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all ${
              activeCategory === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Progress & Reset Bar (When reading Adhkar) */}
      {activeCategory !== 'tasbeeh' && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              الإنجاز اليومي:{' '}
              <strong className="text-emerald-400 font-mono-numbers text-sm">
                {completedInCategory} من {totalInCategory}
              </strong>{' '}
              أذكار
            </span>
          </div>

          <button
            onClick={handleResetCategoryCounts}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط العدادات</span>
          </button>
        </div>
      )}

      {/* Digital Tasbeeh View */}
      {activeCategory === 'tasbeeh' && (
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {/* Preset Chips */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
            {TASBEEH_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTasbeehPresetIndex(idx);
                  setCurrentTasbeehCount(0);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all border ${
                  tasbeehPresetIndex === idx
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {preset.label} ({preset.count})
              </button>
            ))}
          </div>

          {/* Big Interactive Tasbeeh Bead Dial */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleIncrementTasbeeh}
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 border-4 border-emerald-400/80 text-white shadow-2xl flex flex-col items-center justify-center p-6 text-center transform active:scale-95 transition-all select-none cursor-pointer focus:outline-none ring-4 ring-emerald-500/20"
            >
              <span className="font-amiri text-lg sm:text-xl font-bold mb-1 opacity-90 px-2 line-clamp-2">
                {activePreset.label}
              </span>
              <span className="font-mono-numbers text-5xl sm:text-6xl font-extrabold tracking-tight my-2">
                {currentTasbeehCount}
              </span>
              <span className="text-[11px] text-emerald-200/80 tracking-wide font-sans">
                الهدف: {activePreset.count} · انقر للتسبيح
              </span>
            </button>
          </div>

          {/* Reset and Lifetime Counter */}
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button
              onClick={handleResetTasbeeh}
              className="px-4 py-2 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تصفير العداد الحالي</span>
            </button>

            <span className="font-mono-numbers">
              إجمالي التسبيحات المحفوظة: <strong className="text-emerald-400 text-sm">{totalLifetimeTasbeeh}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Adhkar Cards List */}
      {activeCategory !== 'tasbeeh' && (
        <div className="space-y-4">
          {categoryAdhkar.map((item) => {
            const currentCount = completedCounts[item.id] || 0;
            const isCompleted = currentCount >= item.targetCount;
            const remaining = Math.max(0, item.targetCount - currentCount);

            return (
              <div
                key={item.id}
                className={`p-5 md:p-6 rounded-2xl border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-950/25 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Dhikr text in beautiful Amiri font */}
                <p className={`font-amiri text-slate-100 ${fontClass} text-right select-text mb-4`}>
                  {item.textAr}
                </p>

                {/* Source & Reward */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-slate-500">المصدر:</span>
                      <span className="text-slate-300 font-medium">{item.source}</span>
                    </div>
                    {item.reward && (
                      <div className="text-amber-400/90 text-[11px]">
                        ✦ {item.reward}
                      </div>
                    )}
                  </div>

                  {/* Interactive Counter Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleIncrementDhikr(item.id, item.targetCount)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>تم الذكر ({item.targetCount})</span>
                        </>
                      ) : (
                        <>
                          <span className="font-mono-numbers text-sm font-bold text-emerald-400">
                            {currentCount} / {item.targetCount}
                          </span>
                          <span>(اضغط {remaining} متبقٍ)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
