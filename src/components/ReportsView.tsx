import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import {
  TrendingUp,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface ReportsViewProps {
  language: Language;
  metrics: {
    foodWasteKg: number;
    wasteAvoidedKg: number;
    moneySaved: number;
    forecastAccuracy: number;
    productionAccuracy: number;
    mostWasted: string;
    bestImprovement: string;
  };
  rootCauses: {
    id: string;
    item: string;
    wastedAmount: string;
    wasteCost: string;
    mainCause: string;
    suggestedCorrection: string;
  }[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  language,
  metrics,
  rootCauses,
}) => {
  const t = translations[language];
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');

  // 7-day trend data (starts from 0)
  const daysTrend = [
    { day: 'Wed', wasted: 4.8, avoided: 2.1 },
    { day: 'Thu', wasted: 3.9, avoided: 3.4 },
    { day: 'Fri', wasted: 3.1, avoided: 4.8 },
    { day: 'Sat', wasted: 2.8, avoided: 5.2 },
    { day: 'Sun', wasted: 2.4, avoided: 6.1 },
    { day: 'Mon', wasted: 2.1, avoided: 6.9 },
    { day: 'Today', wasted: 1.6, avoided: 7.8 },
  ];

  const maxVal = 10; // Graph starts strictly from 0 to 10 kg

  return (
    <div className="space-y-6">
      {/* 1. TOP METRIC SUMMARY STRIP */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                {t.reportsSection.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              {t.reportsSection.subtitle}
            </p>
          </div>

          {/* Timeframe segmented control */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
            {(['today', 'week', 'month'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  timeframe === tf
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tf === 'today' ? 'Today' : tf === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Operational Plain-Language Numbers (Section 27 in prompt) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 block mb-1">
              {t.reportsSection.foodPurchased}
            </span>
            <span className="text-2xl font-black text-neutral-900 tabular-nums">
              142 kg
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">FEFO tracked</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 block mb-1">
              {t.reportsSection.foodPrepared}
            </span>
            <span className="text-2xl font-black text-neutral-900 tabular-nums">
              118 kg
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Kitchen batches</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 block mb-1">
              {t.reportsSection.foodSold}
            </span>
            <span className="text-2xl font-black text-neutral-900 tabular-nums">
              112 kg
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Customer consumption</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 block mb-1">
              {t.reportsSection.foodLeftover}
            </span>
            <span className="text-2xl font-black text-amber-700 tabular-nums">
              4.5 kg
            </span>
            <span className="text-[10px] text-amber-800 block mt-0.5">Recorded at closing</span>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200">
            <span className="text-[11px] font-bold text-red-900 block mb-1">
              {t.reportsSection.foodWasted}
            </span>
            <span className="text-2xl font-black text-red-600 tabular-nums">
              {metrics.foodWasteKg} kg
            </span>
            <span className="text-[10px] text-red-700 block mt-0.5">Down 68% vs baseline</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-900 block mb-1">
              {t.reportsSection.wasteAvoided}
            </span>
            <span className="text-2xl font-black text-emerald-700 tabular-nums">
              {metrics.wasteAvoidedKg} kg
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Prevented before cooking</span>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200">
            <span className="text-[11px] font-bold text-orange-950 block mb-1">
              {t.reportsSection.moneySaved}
            </span>
            <span className="text-2xl font-black text-orange-950 tabular-nums">
              ₹{metrics.moneySaved.toLocaleString()}
            </span>
            <span className="text-[10px] text-orange-800 block mt-0.5">Cost retained</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 block mb-1">
              {t.reportsSection.accuracy}
            </span>
            <span className="text-2xl font-black text-neutral-900 tabular-nums">
              {metrics.forecastAccuracy}%
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">4 human overrides stored</span>
          </div>
        </div>
      </section>

      {/* 2. 7-DAY VISUAL GRAPH: STARTS FROM 0 */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              {t.reportsSection.chartTitle}
            </h3>
            <p className="text-xs text-neutral-500">
              Starts strictly from zero (0 → 2.5 → 5 → 7.5 → 10 kg). Notice waste avoided (green) surging as actual discards (gray) shrink.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm" />
              Waste Avoided
            </span>
            <span className="flex items-center gap-1.5 text-neutral-500">
              <span className="w-3 h-3 bg-neutral-300 rounded-sm" />
              Actual Leftovers
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-neutral-200/80">
          <div className="relative h-48 w-full">
            {[10, 7.5, 5, 2.5, 0].map((step) => {
              const yPos = 100 - (step / maxVal) * 100;
              return (
                <div
                  key={step}
                  className="absolute inset-x-0 flex items-center gap-2"
                  style={{ top: `${yPos}%` }}
                >
                  <span className="w-8 text-[11px] font-mono text-neutral-400 tabular-nums text-right shrink-0">
                    {step}k
                  </span>
                  <div className="flex-1 h-px bg-neutral-200/80 border-dashed" />
                </div>
              );
            })}

            <div className="absolute inset-y-0 left-12 right-4 flex items-end justify-around pt-2 pb-6">
              {daysTrend.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 w-14">
                  <div className="flex items-end gap-1.5 h-36">
                    <div
                      className="w-4 sm:w-5 bg-emerald-500 rounded-t-sm transition-all shadow-xs"
                      style={{ height: `${(d.avoided / maxVal) * 100}%` }}
                    />
                    <div
                      className="w-4 sm:w-5 bg-neutral-300 rounded-t-sm transition-all"
                      style={{ height: `${(d.wasted / maxVal) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-700">
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROOT-CAUSE ANALYSIS */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
            <h2 className="text-sm font-bold tracking-wider text-neutral-900 uppercase">
              WHY DID WE WASTE IT? (ROOT-CAUSE ANALYSIS)
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal">
            Identifying root operational causes so tomorrow’s production is prepared with precision.
          </p>
        </div>

        <div className="space-y-3">
          {rootCauses.map((rc) => (
            <div
              key={rc.id}
              className="p-4 rounded-2xl border border-neutral-200 bg-white hover:border-orange-200 text-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-neutral-900">
                  {rc.item}
                </span>
                <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                  {rc.wastedAmount} wasted ({rc.wasteCost})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-2 border-t border-neutral-100">
                <div>
                  <span className="text-neutral-500 block mb-0.5">Primary Cause:</span>
                  <span className="font-semibold text-neutral-800">{rc.mainCause}</span>
                </div>
                <div>
                  <span className="text-emerald-700 font-semibold block mb-0.5 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    How to Prevent Tomorrow:
                  </span>
                  <span className="text-neutral-700 font-medium">
                    {rc.suggestedCorrection}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
