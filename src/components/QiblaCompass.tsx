import React, { useState, useEffect } from 'react';
import { calculateQibla } from '../utils/prayerTimes';
import { LocationDetail } from '../data/algeriaData';
import { Compass, RotateCw, Navigation2, Info } from 'lucide-react';

interface QiblaCompassProps {
  currentLocation: LocationDetail;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ currentLocation }) => {
  const qiblaData = calculateQibla(currentLocation.lat, currentLocation.lng);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [hasOrientationPermission, setHasOrientationPermission] = useState<boolean>(false);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS Safari, alpha for standard Android
      let heading: number | null = null;
      if ('webkitCompassHeading' in e && typeof (e as any).webkitCompassHeading === 'number') {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null) {
        setDeviceHeading(Math.round(heading));
        setHasOrientationPermission(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const effectiveHeading = deviceHeading !== null ? deviceHeading : manualHeading;
  // Calculate relative angle to Kaaba
  const relativeQiblaAngle = (qiblaData.bearing - effectiveHeading + 360) % 360;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 text-slate-100 shadow-xl mb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span>بوصلة اتجاه القبلة الشريفة</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            تحديد دقيق لزاوية الكعبة المشرفة بمكة المكرمة انطلاقاً من إحداثيات {currentLocation.nameAr}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm font-mono-numbers">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-right">
            <span className="text-slate-400 font-sans block text-[11px]">زاوية القبلة:</span>
            <span className="text-emerald-400 font-bold text-base">{qiblaData.bearing}°</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-right">
            <span className="text-slate-400 font-sans block text-[11px]">المسافة إلى مكة:</span>
            <span className="text-amber-300 font-bold text-base">{qiblaData.distanceKm.toLocaleString()} كم</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Compass Visual Dial */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner">
            {/* Cardinal Markers */}
            <span className="absolute top-3 font-bold text-rose-400 text-sm">شمال (N)</span>
            <span className="absolute bottom-3 font-bold text-slate-400 text-sm">جنوب (S)</span>
            <span className="absolute right-3 font-bold text-slate-400 text-sm">شرق (E)</span>
            <span className="absolute left-3 font-bold text-slate-400 text-sm">غرب (W)</span>

            {/* Dial Tick marks */}
            <div className="absolute inset-4 rounded-full border border-dashed border-slate-800 pointer-events-none" />

            {/* Needle pointing to Qibla relative to heading */}
            <div
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${relativeQiblaAngle}deg)` }}
            >
              {/* Top pointer targeting Kaaba */}
              <div className="absolute top-7 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-500/50">
                  🕋
                </div>
                <div className="w-1.5 h-16 bg-gradient-to-t from-transparent via-emerald-400 to-emerald-500 rounded-full" />
              </div>

              {/* Bottom counter pointer */}
              <div className="absolute bottom-10 w-1 h-10 bg-slate-700/60 rounded-full" />
            </div>

            {/* Center Pivot */}
            <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center z-10 shadow-lg">
              <Navigation2
                className="w-5 h-5 text-emerald-400 transition-transform duration-300"
                style={{ transform: `rotate(${relativeQiblaAngle}deg)` }}
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs text-slate-400">
              {deviceHeading !== null
                ? 'مستشعر البوصلة الجيروسكوبي يعمل مباشرة من هاتفك'
                : 'يمكنك تدوير القرص يدوياً بمحاذاة اتجاه الشمال الفعلي'}
            </span>
          </div>
        </div>

        {/* Direction details & manual calibration */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Info className="w-4 h-4 shrink-0" />
              <span>إرشاد تحديد القبلة في الجزائر</span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              تقع الكعبة المشرفة بالنسبة لمدينة {currentLocation.nameAr} في اتجاه الشرق والجنوب الشرقي بزاوية مقدارها{' '}
              <strong className="text-emerald-400 font-mono-numbers">{qiblaData.bearing}°</strong> بالنسبة لاتجاه الشمال الجغرافي.
            </p>
            <p className="text-xs text-slate-400">
              يكفي أن تجعل وجهك نحو الشرق مع ميلان خفيف نحو اليمين (الجنوب) لتكون متوجهاً بدقة نحو القبلة المشرفة.
            </p>
          </div>

          {/* Manual rotation slider for desktop users */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                <span>محاذاة بوصلة الهاتف / الجهاز يدوياً:</span>
              </span>
              <span className="font-mono-numbers text-emerald-400 font-bold">{effectiveHeading}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={effectiveHeading}
              onChange={(e) => {
                setDeviceHeading(null);
                setManualHeading(Number(e.target.value));
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0° شمال</span>
              <span>90° شرق</span>
              <span>180° جنوب</span>
              <span>270° غرب</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
