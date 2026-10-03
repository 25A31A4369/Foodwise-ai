import React, { useState } from 'react';
import { ForecastDay, Language } from '../types';
import { translations } from '../translations';
import {
  TrendingUp,
  BarChart2,
  HelpCircle,
  Calendar,
  CloudRain,
  Users,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ForecastSectionProps {
  language: Language;
  days: ForecastDay[];
  weatherInfo: {
    city: string;
    temperature: string;
    condition: string;
    isRainExpected: boolean;
  };
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({
  language,
  days,
  weatherInfo,
}) => {
  const t = translations[language];
  const [showWhyModal, setShowWhyModal] = useState(false);

  const maxVal = 250; // Graph starts strictly from 0 to 250 customers

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                {t.forecastSection.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              {t.forecastSection.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowWhyModal(true)}
            className="self-start sm:self-auto px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>{t.forecastSection.whyDifferentBtn}</span>
          </button>
        </div>

        {/* 2. Visual Bar Chart Starting from 0 */}
        <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-neutral-200/80 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-600 mb-4">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-orange-600" />
              CUSTOMER DEMAND (Starts from 0)
            </span>
            <span className="text-[11px] font-normal text-neutral-400">
              Scale: 0 to 250 customers
            </span>
          </div>

          <div className="relative h-48 w-full">
            {/* Guide lines from 0 to 250 */}
            {[250, 200, 150, 100, 50, 0].map((step) => {
              const yPos = 100 - (step / maxVal) * 100;
              return (
                <div
                  key={step}
                  className="absolute inset-x-0 flex items-center gap-2"
                  style={{ top: `${yPos}%` }}
                >
                  <span className="w-7 text-[10px] font-mono text-neutral-400 tabular-nums text-right shrink-0">
                    {step}
                  </span>
                  <div className="flex-1 h-px bg-neutral-200/80 border-dashed" />
                </div>
              );
            })}

            {/* Daily Bars */}
            <div className="absolute inset-y-0 left-10 right-4 flex items-end justify-around pt-2 pb-6">
              {days.map((d, i) => {
                const heightPct = (d.expectedCustomers / maxVal) * 100;
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5 w-12 sm:w-16 group">
                    <span
                      className={`text-xs font-extrabold tabular-nums ${
                        d.isToday ? 'text-orange-700' : 'text-neutral-700'
                      }`}
                    >
                      {d.expectedCustomers}
                    </span>
                    <div
                      className={`w-7 sm:w-9 rounded-t-lg transition-all ${
                        d.isToday
                          ? 'bg-gradient-to-t from-orange-600 to-orange-400 shadow-xs'
                          : 'bg-neutral-300 group-hover:bg-neutral-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span
                      className={`text-[11px] font-bold ${
                        d.isToday ? 'text-orange-950 underline' : 'text-neutral-600'
                      }`}
                    >
                      {d.dayName}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-medium">
                      {d.dateStr}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Ingredient Demand Projection Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-400 uppercase font-bold text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Expected People</th>
                <th className="py-2.5 px-3">Expected Meals</th>
                <th className="py-2.5 px-3">Rice Demand</th>
                <th className="py-2.5 px-3">Dal Demand</th>
                <th className="py-2.5 px-3">Veggies Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
              {days.map((d, idx) => (
                <tr key={idx} className={d.isToday ? 'bg-orange-50/50 font-bold text-orange-950' : 'hover:bg-neutral-50'}>
                  <td className="py-2.5 px-3 flex items-center gap-1.5">
                    <span>{d.dayName}</span>
                    {d.isToday && (
                      <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.2 rounded font-bold">
                        TODAY
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">{d.expectedCustomers}</td>
                  <td className="py-2.5 px-3 tabular-nums">{d.expectedMeals}</td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {d.keyIngredientDemand.find((k) => k.item === 'Rice')?.amountKg} kg
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {d.keyIngredientDemand.find((k) => k.item === 'Dal')?.amountKg} kg
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">
                    {d.keyIngredientDemand.find((k) => k.item === 'Veggies')?.amountKg} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHY IS TODAY DIFFERENT? MODAL */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-700">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-neutral-900">
                  {t.forecastSection.whyDifferentTitle}
                </h3>
                <p className="text-xs text-neutral-500">
                  Why today is 185 vs 192 on previous Tuesdays
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div className="flex items-start gap-2">
                <CloudRain className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900">Weather Effect:</span>{' '}
                  {weatherInfo.condition} — Reduces walk-in dining by ~6%.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900">Day-of-Week Pattern:</span>{' '}
                  Wednesday lunch is consistently 5% lower than Friday rush.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900">Recent Leftovers Included:</span>{' '}
                  Yesterday had 2.1 kg surplus rice, deducted from morning production boiler.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900">Auditorium Event Buffer:</span>{' '}
                  Cultural fest prep adds 15 extra evening snacks.
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowWhyModal(false)}
                className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
