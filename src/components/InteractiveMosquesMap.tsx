import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { ALGERIA_MOSQUES, MosqueDetail, calculateDistanceKm, formatDistanceAr } from '../data/algeriaMosques';
import { calculatePrayerTimes, PrayerTimes } from '../utils/prayerTimes';
import { LocationDetail } from '../data/algeriaData';
import { MapPin, Search, Navigation, Compass, ExternalLink, Clock, Users, Sparkles, Check } from 'lucide-react';

interface InteractiveMosquesMapProps {
  currentLocation: LocationDetail;
  userCoords?: { lat: number; lng: number } | null;
  onSelectMosque?: (mosque: MosqueDetail) => void;
}

export const InteractiveMosquesMap: React.FC<InteractiveMosquesMapProps> = ({
  currentLocation,
  userCoords,
  onSelectMosque,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'suburbs' | 'historic' | 'grand'>('all');
  const [selectedMosque, setSelectedMosque] = useState<MosqueDetail>(ALGERIA_MOSQUES[0]);
  const [favoriteMosqueId, setFavoriteMosqueId] = useState<string>(() => {
    return localStorage.getItem('favorite_algeria_mosque') || 'djamaa-el-djazair';
  });

  // Effective user coordinates (GPS or selected Wilaya/Suburb)
  const activeLat = userCoords?.lat ?? currentLocation.lat;
  const activeLng = userCoords?.lng ?? currentLocation.lng;

  // Calculate distances and sort
  const mosquesWithDistance = useMemo(() => {
    return ALGERIA_MOSQUES.map((m) => {
      const dist = calculateDistanceKm(activeLat, activeLng, m.lat, m.lng);
      return { ...m, distanceKm: dist };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [activeLat, activeLng]);

  // Filtered mosques
  const filteredMosques = useMemo(() => {
    return mosquesWithDistance.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.nameAr.toLowerCase().includes(q) ||
        m.nameFr.toLowerCase().includes(q) ||
        m.districtAr.toLowerCase().includes(q) ||
        m.wilayaNameAr.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (filterType === 'suburbs') return m.isSuburbAlgiers;
      if (filterType === 'historic') return m.isHistoric;
      if (filterType === 'grand') return (m.capacity ?? 0) >= 10000;
      return true;
    });
  }, [mosquesWithDistance, searchQuery, filterType]);

  const closestMosque = mosquesWithDistance[0];

  // Calculate live prayer times for the selected mosque
  const selectedMosquePrayerTimes: PrayerTimes = useMemo(() => {
    return calculatePrayerTimes(new Date(), selectedMosque.lat, selectedMosque.lng);
  }, [selectedMosque]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedMosque.lat, selectedMosque.lng],
        zoom: 13,
        zoomControl: true,
      });

      // High-performance OpenStreetMap Carto tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers on filter / search / selection change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // User location marker
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    L.marker([activeLat, activeLng], { icon: userIcon })
      .bindTooltip(`موقعك الحالي (${currentLocation.nameAr})`, { direction: 'top', offset: [0, -8] })
      .addTo(markersGroup);

    // Mosque markers
    filteredMosques.forEach((mosque) => {
      const isSelected = mosque.id === selectedMosque.id;
      const isFav = mosque.id === favoriteMosqueId;

      const mosqueIcon = L.divIcon({
        className: 'custom-mosque-marker',
        html: `
          <div style="
            background: ${isSelected ? '#10b981' : isFav ? '#f59e0b' : '#065f46'};
            color: white;
            padding: 6px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transform: scale(${isSelected ? 1.25 : 1});
            transition: transform 0.2s;
            cursor: pointer;
            font-size: 14px;
          ">
            🕌
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([mosque.lat, mosque.lng], { icon: mosqueIcon })
        .bindTooltip(
          `<strong>${mosque.nameAr}</strong><br/><span style="font-size:11px; color:#10b981;">يبعد ${formatDistanceAr(mosque.distanceKm)}</span>`,
          { direction: 'top', offset: [0, -16] }
        )
        .addTo(markersGroup);

      marker.on('click', () => {
        setSelectedMosque(mosque);
        onSelectMosque?.(mosque);
        map.setView([mosque.lat, mosque.lng], 14, { animate: true });
      });
    });
  }, [filteredMosques, selectedMosque, favoriteMosqueId, activeLat, activeLng, currentLocation]);

  const handleFlyToMosque = (mosque: MosqueDetail) => {
    setSelectedMosque(mosque);
    onSelectMosque?.(mosque);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([mosque.lat, mosque.lng], 15, { animate: true });
    }
  };

  const handleFindClosest = () => {
    if (closestMosque) {
      handleFlyToMosque(closestMosque);
    }
  };

  const handleSaveFavorite = (id: string) => {
    setFavoriteMosqueId(id);
    localStorage.setItem('favorite_algeria_mosque', id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 text-slate-100 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <span>خريطة مساجد الجزائر وضواحيها التفاعلية</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            استكشف المساجد الرئيسية بالعاصمة وضواحيها، وابحث عن أقرب مسجد إليك واطلع على مواقيت الصلاة والإقامة فيه
          </p>
        </div>

        {/* Action Button: Find Closest */}
        <button
          onClick={handleFindClosest}
          className="self-start md:self-auto px-4 py-2.5 text-xs md:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 shrink-0"
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>أقرب مسجد لي ({closestMosque ? closestMosque.nameAr : ''})</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الحي (كتشاوة، الرويبة، الشراقة، المحمدية...)"
            className="w-full pl-4 pr-10 py-2 text-xs md:text-sm bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
          {[
            { id: 'all', label: 'جميع المساجد' },
            { id: 'suburbs', label: 'ضواحي العاصمة' },
            { id: 'historic', label: 'مساجد تاريخية' },
            { id: 'grand', label: 'مساجد كبرى' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filterType === f.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map + Selected Mosque Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Viewport Container */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div
            ref={mapContainerRef}
            className="w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner z-0"
            style={{ minHeight: '400px' }}
          />

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>المسجد المحدد</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span>موقعك التقريبي</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>المسجد المفضل</span>
              </span>
            </div>

            <span>انقر على أي مئذنة لمعاينة التفاصيل</span>
          </div>
        </div>

        {/* Selected Mosque Details & Prayer Schedule */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            {/* Mosque Title & Favorite Button */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {selectedMosque.nameAr}
                  </h3>
                  {selectedMosque.isHistoric && (
                    <span className="text-[10px] text-amber-400 font-medium">
                      معلم أثري
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedMosque.districtAr} · {selectedMosque.wilayaNameAr}
                </p>
              </div>

              <button
                onClick={() => handleSaveFavorite(selectedMosque.id)}
                className={`p-2 rounded-xl text-xs transition-colors border ${
                  favoriteMosqueId === selectedMosque.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                }`}
                title="تعيين كمسجد مفضل"
              >
                {favoriteMosqueId === selectedMosque.id ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>المفضل</span>
                  </span>
                ) : (
                  <span>⭐ المفضلة</span>
                )}
              </button>
            </div>

            {/* Distance & Capacity Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono-numbers">
                <Compass className="w-4 h-4 shrink-0" />
                <span>
                  يبعد عنك: {formatDistanceAr(selectedMosque.distanceKm ?? calculateDistanceKm(activeLat, activeLng, selectedMosque.lat, selectedMosque.lng))}
                </span>
              </div>

              {selectedMosque.capacity && (
                <div className="flex items-center gap-1.5 text-slate-300 font-mono-numbers">
                  <Users className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>يتسع لـ {selectedMosque.capacity.toLocaleString()} مصلٍ</span>
                </div>
              )}
            </div>

            {/* Features Tags */}
            <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
              {selectedMosque.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800"
                >
                  {feat}
                </span>
              ))}
            </div>

            {/* Prayer Times in this specific Mosque */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مواقيت الأذان والإقامة في {selectedMosque.nameAr}:</span>
                </span>
                <span className="text-[11px] text-slate-400">توقيت الجزائر</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-mono-numbers">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-sans">الفجر</span>
                  <span className="font-bold text-white block text-sm">{selectedMosquePrayerTimes.fajr}</span>
                  <span className="block text-[9px] text-emerald-400 font-sans mt-0.5">+{selectedMosque.iqamaMinutes.fajr}د إقامة</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-sans">الظهر</span>
                  <span className="font-bold text-white block text-sm">{selectedMosquePrayerTimes.dhuhr}</span>
                  <span className="block text-[9px] text-emerald-400 font-sans mt-0.5">+{selectedMosque.iqamaMinutes.dhuhr}د</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-sans">العصر</span>
                  <span className="font-bold text-white block text-sm">{selectedMosquePrayerTimes.asr}</span>
                  <span className="block text-[9px] text-emerald-400 font-sans mt-0.5">+{selectedMosque.iqamaMinutes.asr}د</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-sans">المغرب</span>
                  <span className="font-bold text-white block text-sm">{selectedMosquePrayerTimes.maghrib}</span>
                  <span className="block text-[9px] text-emerald-400 font-sans mt-0.5">+{selectedMosque.iqamaMinutes.maghrib}د</span>
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-sans">العشاء</span>
                  <span className="font-bold text-white block text-sm">{selectedMosquePrayerTimes.isha}</span>
                  <span className="block text-[9px] text-emerald-400 font-sans mt-0.5">+{selectedMosque.iqamaMinutes.isha}د</span>
                </div>
              </div>
            </div>

            {/* Jumuah Khutbah Time */}
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <span className="font-medium">صلاة وخطبة الجمعة المباركة:</span>
              <span className="font-bold font-mono-numbers text-sm text-white">{selectedMosque.jumuahTime} زوالاً</span>
            </div>

            {/* GPS Direction Button */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.lat},${selectedMosque.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl text-xs md:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-2 transition-colors border border-slate-700"
            >
              <span>الاتجاه المباشر إلى المسجد (GPS)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Quick List of Nearby Mosques */}
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
            <span className="text-[11px] text-slate-400 font-medium block">المساجد القريبة منك:</span>
            {filteredMosques.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => handleFlyToMosque(m)}
                className={`w-full p-2 rounded-lg text-right text-xs transition-colors flex items-center justify-between border ${
                  m.id === selectedMosque.id
                    ? 'bg-emerald-950/60 border-emerald-500/80 text-white'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="truncate">{m.nameAr}</span>
                <span className="text-emerald-400 font-mono-numbers text-[11px] shrink-0">
                  {formatDistanceAr(m.distanceKm)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
