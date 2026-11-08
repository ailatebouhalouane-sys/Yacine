import React, { useState, useMemo } from 'react';
import { LocationDetail } from '../data/algeriaData';
import { calculatePrayerTimes, getHijriDate } from '../utils/prayerTimes';
import { Calendar as CalendarIcon, Printer, ChevronRight, ChevronLeft } from 'lucide-react';

interface MonthlyPrayerCalendarProps {
  currentLocation: LocationDetail;
}

export const MonthlyPrayerCalendar: React.FC<MonthlyPrayerCalendarProps> = ({
  currentLocation,
}) => {
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);

  const displayDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + selectedMonthOffset);
    return d;
  }, [selectedMonthOffset]);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthRows = useMemo(() => {
    const rows = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const times = calculatePrayerTimes(date, currentLocation.lat, currentLocation.lng);
      const hijri = getHijriDate(date);
      const dayName = new Intl.DateTimeFormat('ar-DZ', { weekday: 'long' }).format(date);
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      rows.push({
        day,
        dayName,
        hijriFormatted: `${hijri.day} ${hijri.monthName}`,
        times,
        isToday,
      });
    }
    return rows;
  }, [year, month, daysInMonth, currentLocation]);

  const monthNameAr = new Intl.DateTimeFormat('ar-DZ', { month: 'long', year: 'numeric' }).format(displayDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 text-slate-100 shadow-xl mb-10 print:bg-white print:text-black print:border-none print:shadow-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6 print:border-gray-300">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white print:text-black flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-emerald-400 print:text-emerald-700" />
            <span>إمساكية ومواقيت الشهر - {currentLocation.nameAr}</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-400 print:text-gray-600 mt-1">
            جدول أوقات الصلوات والإمساك طيلة شهر {monthNameAr} وفق معايير وزارة الشؤون الدينية والأوقاف
          </p>
        </div>

        {/* Month Navigation & Print */}
        <div className="flex items-center gap-3 self-start md:self-auto print:hidden">
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setSelectedMonthOffset((prev) => prev - 1)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
              title="الشهر السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-3 text-slate-200">{monthNameAr}</span>
            <button
              onClick={() => setSelectedMonthOffset((prev) => prev + 1)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
              title="الشهر القادم"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors text-slate-200 hover:text-white"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة الإمساكية</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs md:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 print:text-gray-700 print:border-gray-300">
              <th className="py-3 px-2 font-semibold">اليوم</th>
              <th className="py-3 px-2 font-semibold">الميلادي</th>
              <th className="py-3 px-2 font-semibold">الهجري</th>
              <th className="py-3 px-2 font-semibold text-indigo-400 print:text-indigo-800">الإمساك</th>
              <th className="py-3 px-2 font-semibold text-emerald-400 print:text-emerald-800">الفجر</th>
              <th className="py-3 px-2 font-semibold text-orange-400 print:text-orange-800">الشروق</th>
              <th className="py-3 px-2 font-semibold">الظهر</th>
              <th className="py-3 px-2 font-semibold">العصر</th>
              <th className="py-3 px-2 font-semibold text-rose-400 print:text-rose-800">المغرب</th>
              <th className="py-3 px-2 font-semibold text-sky-400 print:text-sky-800">العشاء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
            {monthRows.map((row) => (
              <tr
                key={row.day}
                className={`transition-colors font-mono-numbers ${
                  row.isToday
                    ? 'bg-emerald-950/40 text-emerald-300 font-bold print:bg-emerald-50 print:text-emerald-900'
                    : 'hover:bg-slate-800/30 text-slate-200 print:text-black'
                }`}
              >
                <td className="py-2.5 px-2 font-sans font-medium whitespace-nowrap">
                  {row.dayName}
                  {row.isToday && (
                    <span className="mr-2 text-[10px] text-emerald-400 font-bold print:text-emerald-700">
                      (اليوم)
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-2">{row.day}</td>
                <td className="py-2.5 px-2 font-sans text-amber-300 print:text-amber-800 text-xs">
                  {row.hijriFormatted}
                </td>
                <td className="py-2.5 px-2 text-indigo-300 print:text-indigo-900">{row.times.imsak}</td>
                <td className="py-2.5 px-2 text-emerald-400 font-bold print:text-emerald-900">{row.times.fajr}</td>
                <td className="py-2.5 px-2 text-slate-400 print:text-gray-600">{row.times.sunrise}</td>
                <td className="py-2.5 px-2">{row.times.dhuhr}</td>
                <td className="py-2.5 px-2">{row.times.asr}</td>
                <td className="py-2.5 px-2 text-rose-400 font-bold print:text-rose-900">{row.times.maghrib}</td>
                <td className="py-2.5 px-2">{row.times.isha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
