import React, { useState } from 'react';
import { LocationDetail, ALGIERS_SUBURBS, ALGERIA_WILAYAS, findClosestAlgerianLocation } from '../data/algeriaData';
import { Search, MapPin, Check, Navigation, Building2 } from 'lucide-react';

interface AlgeriaLocationPickerProps {
  currentLocation: LocationDetail;
  onSelectLocation: (loc: LocationDetail) => void;
  onClose?: () => void;
  onAutoLocate: () => void;
  isLocating: boolean;
}

export const AlgeriaLocationPicker: React.FC<AlgeriaLocationPickerProps> = ({
  currentLocation,
  onSelectLocation,
  onClose,
  onAutoLocate,
  isLocating,
}) => {
  const [activeTab, setActiveTab] = useState<'suburbs' | 'wilayas'>('suburbs');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'center' | 'east' | 'west' | 'south'>('all');

  const filteredSuburbs = ALGIERS_SUBURBS.filter((suburb) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      suburb.nameAr.toLowerCase().includes(q) ||
      suburb.nameFr.toLowerCase().includes(q)
    );
  });

  const filteredWilayas = ALGERIA_WILAYAS.filter((wilaya) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      wilaya.nameAr.toLowerCase().includes(q) ||
      wilaya.nameFr.toLowerCase().includes(q) ||
      String(wilaya.wilayaCode).includes(q);

    const matchesRegion = regionFilter === 'all' || wilaya.region === regionFilter;
    return matchesQuery && matchesRegion;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 text-slate-100 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <span>اختر ولايتك أو ضاحيتك بالجزائر</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            تغطية دقيقة لولاية الجزائر بجميع بلدياتها وضواحيها المتروبوليتانية، وكافة ولايات الوطن الـ 58
          </p>
        </div>

        {/* GPS Locate Button */}
        <button
          onClick={onAutoLocate}
          disabled={isLocating}
          className="self-start md:self-auto px-4 py-2 text-xs md:text-sm font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'جار تحديد موقعك عبر GPS...' : 'تحديد الموقع تلقائياً'}</span>
        </button>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Suburbs vs All Wilayas Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 shrink-0">
          <button
            onClick={() => setActiveTab('suburbs')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'suburbs'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الجزائر العاصمة وضواحيها ({ALGIERS_SUBURBS.length})
          </button>
          <button
            onClick={() => setActiveTab('wilayas')}
            className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'wilayas'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ولايات الجزائر الـ 58 ({ALGERIA_WILAYAS.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'suburbs'
                ? 'ابحث عن الضاحية (رويبة، زرالدة، الشراقة، براقي...)'
                : 'ابحث عن الولاية بالاسم أو الرقم...'
            }
            className="w-full pl-4 pr-10 py-2 text-sm bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Suburbs Tab Content */}
      {activeTab === 'suburbs' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>الضواحي والدوائر الكبرى للعاصمة وضواحي الحزام المتروبوليتاني:</span>
            <span>المرجع: جامع الجزائر المحمدية (UTC+1)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSuburbs.map((suburb) => {
              const isSelected = currentLocation.id === suburb.id;
              return (
                <button
                  key={suburb.id}
                  onClick={() => {
                    onSelectLocation(suburb);
                    onClose?.();
                  }}
                  className={`p-3.5 rounded-xl text-right transition-all border flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{suburb.nameAr}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {suburb.nameFr} {suburb.parentWilaya ? `· ${suburb.parentWilaya}` : ''}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-emerald-500 text-slate-950 shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 58 Wilayas Tab Content */}
      {activeTab === 'wilayas' && (
        <div className="space-y-4">
          {/* Regional Filter buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 ml-1">تصفية حسب الإقليم:</span>
            {[
              { id: 'all', label: 'كافة الولايات' },
              { id: 'center', label: 'الوسط' },
              { id: 'east', label: 'الشرق' },
              { id: 'west', label: 'الغرب' },
              { id: 'south', label: 'الجنوب الكبير' },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setRegionFilter(reg.id as any)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  regionFilter === reg.id
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredWilayas.map((wilaya) => {
              const isSelected = currentLocation.id === wilaya.id || (currentLocation.wilayaCode === wilaya.wilayaCode && !currentLocation.isSuburb);
              return (
                <button
                  key={wilaya.id}
                  onClick={() => {
                    onSelectLocation(wilaya);
                    onClose?.();
                  }}
                  className={`p-2.5 rounded-lg text-right transition-all border flex items-center justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500 text-white'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-[10px] text-emerald-400 font-mono-numbers block">
                      {String(wilaya.wilayaCode).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-slate-100 truncate block">
                      {wilaya.nameAr}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
