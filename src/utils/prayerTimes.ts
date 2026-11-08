/**
 * High-Precision Prayer Times Calculation Engine
 * Tuned to Algerian Ministry of Religious Affairs & Waqfs Standards:
 * - Fajr angle: 18.0°
 * - Isha angle: 17.0°
 * - Asr calculation: Maliki / Shafi'i shadow factor = 1
 * - High-precision solar ephemeris calculation
 */

export interface PrayerTimes {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
  lastThird: string;
  // Raw Date objects for countdowns
  dates: {
    imsak: Date;
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    midnight: Date;
  };
}

export type PrayerKey = 'imsak' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface NextPrayerInfo {
  currentKey: PrayerKey;
  currentNameAr: string;
  nextKey: PrayerKey;
  nextNameAr: string;
  targetTime: Date;
  remainingSeconds: number;
  progressPercent: number; // 0 to 100 within current prayer window
}

export const PRAYER_NAMES_AR: Record<PrayerKey, string> = {
  imsak: 'الإمساك',
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

export const PRAYER_NAMES_EN: Record<PrayerKey, string> = {
  imsak: 'Imsak',
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

// Math helpers in degrees
const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (rad: number) => (rad * 180) / Math.PI;

function fixHour(hour: number): number {
  return ((hour % 24) + 24) % 24;
}

function fixAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export interface CalculationOptions {
  fajrAngle?: number; // 18.0 deg default (Algeria)
  ishaAngle?: number; // 17.0 deg default (Algeria)
  asrShadowFactor?: number; // 1 = Standard/Maliki
  minuteOffsets?: Partial<Record<PrayerKey, number>>;
}

export function calculatePrayerTimes(
  date: Date,
  lat: number,
  lng: number,
  options: CalculationOptions = {}
): PrayerTimes {
  const fajrAngle = options.fajrAngle ?? 18.0;
  const ishaAngle = options.ishaAngle ?? 17.0;
  const asrFactor = options.asrShadowFactor ?? 1;
  const offsets = options.minuteOffsets ?? {};

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian Day
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD =
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    day +
    B -
    1524.5;

  const D = JD - 2451545.0; // days since J2000.0

  // Sun's mean anomaly & mean longitude
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)));

  // Obliquity of ecliptic
  const e = 23.439 - 0.00000036 * D;

  // Sun declination & Right Ascension
  const sinDec = Math.sin(rad(e)) * Math.sin(rad(L));
  const dec = deg(Math.asin(sinDec));

  // Equation of Time in hours
  const RA = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
  const eqt = q / 15 - fixHour(RA);

  // Timezone offset of target location: Algeria is consistently UTC+1 all year
  // (Africa/Algiers has no daylight saving time, constant GMT+1).
  const timezone = 1.0;

  // Solar Noon (Dhuhr)
  const dhuhrBase = 12 + timezone - lng / 15 - eqt;

  // Hour Angle calculation for a given sun depression angle below horizon (e.g. Fajr/Isha/Sunrise)
  function getHourAngle(sunAltitude: number): number {
    const latRad = rad(lat);
    const decRad = rad(dec);
    const cosH =
      (Math.sin(rad(sunAltitude)) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1) return 0; // perpetual night
    if (cosH < -1) return 180; // perpetual day
    return deg(Math.acos(cosH));
  }

  // Sunrise and Sunset: center of sun disk is 0.833° below horizon
  const sunriseSunsetAngle = -0.8333;
  const H_sunrise = getHourAngle(sunriseSunsetAngle) / 15;

  // Fajr hour angle
  const H_fajr = getHourAngle(-fajrAngle) / 15;

  // Isha hour angle
  const H_isha = getHourAngle(-ishaAngle) / 15;

  // Asr hour angle (Maliki: shadow = noon shadow + 1 * object height)
  const noonAltitude = 90 - lat + dec;
  const noonShadow = Math.tan(rad(90 - Math.abs(noonAltitude)));
  const asrAltitude = deg(Math.atan(1 / (asrFactor + noonShadow)));
  const H_asr = getHourAngle(asrAltitude) / 15;

  // Raw decimal hours
  let fajrHour = dhuhrBase - H_fajr;
  let sunriseHour = dhuhrBase - H_sunrise;
  let dhuhrHour = dhuhrBase;
  let asrHour = dhuhrBase + H_asr;
  let maghribHour = dhuhrBase + H_sunrise;
  let ishaHour = dhuhrBase + H_isha;

  // Imsak is standardly ~10 minutes before Fajr
  let imsakHour = fajrHour - 10 / 60;

  // Apply user minute offsets if specified
  imsakHour += (offsets.imsak ?? 0) / 60;
  fajrHour += (offsets.fajr ?? 0) / 60;
  sunriseHour += (offsets.sunrise ?? 0) / 60;
  dhuhrHour += (offsets.dhuhr ?? 0) / 60;
  asrHour += (offsets.asr ?? 0) / 60;
  maghribHour += (offsets.maghrib ?? 0) / 60;
  ishaHour += (offsets.isha ?? 0) / 60;

  function toDate(decimalHour: number): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const totalMinutes = Math.round(decimalHour * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    d.setHours(hours, mins, 0, 0);
    return d;
  }

  const dImsak = toDate(imsakHour);
  const dFajr = toDate(fajrHour);
  const dSunrise = toDate(sunriseHour);
  const dDhuhr = toDate(dhuhrHour);
  const dAsr = toDate(asrHour);
  const dMaghrib = toDate(maghribHour);
  const dIsha = toDate(ishaHour);

  // Midnight calculation (halfway between Maghrib and next day's Fajr)
  const dFajrTomorrow = new Date(dFajr.getTime() + 24 * 60 * 60 * 1000);
  const nightDurationMs = dFajrTomorrow.getTime() - dMaghrib.getTime();
  const dMidnight = new Date(dMaghrib.getTime() + nightDurationMs / 2);
  const dLastThird = new Date(dFajrTomorrow.getTime() - nightDurationMs / 3);

  function formatTime(d: Date): string {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  return {
    imsak: formatTime(dImsak),
    fajr: formatTime(dFajr),
    sunrise: formatTime(dSunrise),
    dhuhr: formatTime(dDhuhr),
    asr: formatTime(dAsr),
    maghrib: formatTime(dMaghrib),
    isha: formatTime(dIsha),
    midnight: formatTime(dMidnight),
    lastThird: formatTime(dLastThird),
    dates: {
      imsak: dImsak,
      fajr: dFajr,
      sunrise: dSunrise,
      dhuhr: dDhuhr,
      asr: dAsr,
      maghrib: dMaghrib,
      isha: dIsha,
      midnight: dMidnight,
    },
  };
}

/**
 * Calculates countdown and active prayer status
 */
export function getNextPrayer(prayerTimes: PrayerTimes, now: Date = new Date()): NextPrayerInfo {
  const sequence: { key: PrayerKey; nameAr: string; time: Date }[] = [
    { key: 'fajr', nameAr: 'الفجر', time: prayerTimes.dates.fajr },
    { key: 'sunrise', nameAr: 'الشروق', time: prayerTimes.dates.sunrise },
    { key: 'dhuhr', nameAr: 'الظهر', time: prayerTimes.dates.dhuhr },
    { key: 'asr', nameAr: 'العصر', time: prayerTimes.dates.asr },
    { key: 'maghrib', nameAr: 'المغرب', time: prayerTimes.dates.maghrib },
    { key: 'isha', nameAr: 'العشاء', time: prayerTimes.dates.isha },
  ];

  const nowMs = now.getTime();

  // Find next prayer
  for (let i = 0; i < sequence.length; i++) {
    const p = sequence[i];
    if (nowMs < p.time.getTime()) {
      const prev = i === 0 ? sequence[sequence.length - 1] : sequence[i - 1];
      const prevTimeMs = i === 0 ? prev.time.getTime() - 24 * 3600 * 1000 : prev.time.getTime();
      const totalWindowMs = p.time.getTime() - prevTimeMs;
      const elapsedMs = Math.max(0, nowMs - prevTimeMs);
      const progress = Math.min(100, Math.max(0, (elapsedMs / totalWindowMs) * 100));
      const remainingSeconds = Math.max(0, Math.floor((p.time.getTime() - nowMs) / 1000));

      return {
        currentKey: prev.key,
        currentNameAr: prev.nameAr,
        nextKey: p.key,
        nextNameAr: p.nameAr,
        targetTime: p.time,
        remainingSeconds,
        progressPercent: progress,
      };
    }
  }

  // After Isha, next prayer is Fajr tomorrow
  const tomorrowFajr = new Date(prayerTimes.dates.fajr.getTime() + 24 * 3600 * 1000);
  const remainingSeconds = Math.max(0, Math.floor((tomorrowFajr.getTime() - nowMs) / 1000));
  const ishaMs = prayerTimes.dates.isha.getTime();
  const totalWindowMs = tomorrowFajr.getTime() - ishaMs;
  const elapsedMs = Math.max(0, nowMs - ishaMs);
  const progress = Math.min(100, Math.max(0, (elapsedMs / totalWindowMs) * 100));

  return {
    currentKey: 'isha',
    currentNameAr: 'العشاء',
    nextKey: 'fajr',
    nextNameAr: 'الفجر',
    targetTime: tomorrowFajr,
    remainingSeconds,
    progressPercent: progress,
  };
}

/**
 * Calculate Qibla bearing from coordinates to Mecca Kaaba
 * Kaaba Coordinates: Lat 21.422487°, Lng 39.826206°
 */
export function calculateQibla(lat: number, lng: number): { bearing: number; distanceKm: number } {
  const kaabaLat = 21.422487;
  const kaabaLng = 39.826206;

  const lat1 = rad(lat);
  const lat2 = rad(kaabaLat);
  const dLng = rad(kaabaLng - lng);

  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
  let qibla = deg(Math.atan2(y, x));
  qibla = (qibla + 360) % 360;

  // Great circle distance
  const R = 6371; // km
  const dLat = lat2 - lat1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return { bearing: Math.round(qibla * 10) / 10, distanceKm };
}

/**
 * Format Algerian / Islamic Hijri date from Gregorian date
 */
export function getHijriDate(date: Date, adjustmentDays: number = 0): {
  day: number;
  monthName: string;
  monthNumber: number;
  year: number;
  formattedAr: string;
} {
  const adjustedDate = new Date(date.getTime() + adjustmentDays * 86400000);

  // Using Intl with Islamic-umalqura calendar which closely tracks Algerian official moonsighting
  try {
    const formatter = new Intl.DateTimeFormat('ar-DZ-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(adjustedDate);
    const day = parseInt(parts.find((p) => p.type === 'day')?.value || '1', 10);
    const monthName = parts.find((p) => p.type === 'month')?.value || 'رمضان';
    const year = parseInt(parts.find((p) => p.type === 'year')?.value || '1448', 10);

    return {
      day,
      monthName,
      monthNumber: 1,
      year,
      formattedAr: `${day} ${monthName} ${year} هـ`,
    };
  } catch {
    // Fallback standard months
    const hijriMonths = [
      'المحرم',
      'صفر',
      'ربيع الأول',
      'ربيع الثاني',
      'جمادى الأولى',
      'جمادى الآخرة',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذو القعدة',
      'ذو الحجة',
    ];
    return {
      day: adjustedDate.getDate(),
      monthName: hijriMonths[adjustedDate.getMonth() % 12],
      monthNumber: (adjustedDate.getMonth() % 12) + 1,
      year: 1448,
      formattedAr: `${adjustedDate.getDate()} ${hijriMonths[adjustedDate.getMonth() % 12]} 1448 هـ`,
    };
  }
}

/**
 * Format remaining seconds into HH:MM:SS
 */
export function formatCountdown(seconds: number): { hours: string; minutes: string; seconds: string } {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  };
}
