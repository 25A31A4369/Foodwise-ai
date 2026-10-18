import React, { useState } from 'react';
import { DecisionReplayRecord, Language } from '../types';
import { translations } from '../translations';
import {
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Scale,
  Calendar,
  ChevronDown,
  ChevronUp,
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
  decisionReplays?: DecisionReplayRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  language,
  metrics,
  rootCauses,
  decisionReplays = [],
}) => {
  const t = translations[language];
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');
  const [isDecisionReplayOpen, setIsDecisionReplayOpen] = useState(false);

  // 7-day trend data (starts strictly from 0 to 10 kg)
  const daysTrend = [
    { day: 'Wed', wasted: 4.8, avoided: 2.1 },
    { day: 'Thu', wasted: 3.9, avoided: 3.4 },
    { day: 'Fri', wasted: 3.1, avoided: 4.8 },
    { day: 'Sat', wasted: 2.8, avoided: 5.2 },
    { day: 'Sun', wasted: 2.4, avoided: 6.1 },
    { day: 'Mon', wasted: 2.1, avoided: 6.9 },
    { day: 'Today', wasted: 1.6, avoided: 7.8 },
  ];

  const maxVal = 10;

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t.nav.reports || 'Reports & Waste Analytics'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Cost savings, waste prevention trends, root causes, and machine learning decision accuracy.
          </p>
        </div>

        {/* Timeframe Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs self-start sm:self-auto border border-slate-200">
          {(['today', 'week', 'month'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 font-semibold rounded transition-colors ${
                timeframe === tf
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf === 'today' ? 'Today' : tf === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            {t.reportsSection.wasteAvoided}
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {metrics.wasteAvoidedKg}
            <span className="text-xs font-normal text-emerald-600 ml-1">kg</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1 font-medium">7-day cumulative total</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            {t.reportsSection.moneySaved}
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{metrics.moneySaved.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 font-medium">Direct food cost saved</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            Forecast Accuracy
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.forecastAccuracy}%
          </div>
          <div className="text-[11px] text-slate-600 mt-1 font-medium">Decision Replay calibration</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            Production Alignment
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.productionAccuracy}%
          </div>
          <div className="text-[11px] text-slate-600 mt-1 font-medium">Batch vs actual plate demand</div>
        </div>
      </div>

      {/* Operational Quantities Ledger */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-semibold text-slate-600 block">
            {t.reportsSection.foodPurchased}
          </span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            142 kg
          </span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-semibold text-slate-600 block">
            {t.reportsSection.foodPrepared}
          </span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            118 kg
          </span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-semibold text-slate-600 block">
            {t.reportsSection.foodSold}
          </span>
          <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
            112 kg
          </span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-semibold text-slate-600 block">
            {t.reportsSection.foodLeftover}
          </span>
          <span className="text-lg font-bold text-amber-700 font-mono tabular-nums">
            4.5 kg
          </span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-semibold text-slate-600 block">
            {t.reportsSection.foodWasted}
          </span>
          <span className="text-lg font-bold text-red-600 font-mono tabular-nums">
            {metrics.foodWasteKg} kg
          </span>
        </div>
      </div>

      {/* CLEAN 2-COLUMN GRID: WASTE TREND CHART (LEFT) + ROOT CAUSE ANALYSIS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: 7-DAY WASTE REDUCTION TREND */}
        <section className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  {t.reportsSection.chartTitle || '7-Day Waste Reduction Trend'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Comparison of actual recorded waste vs potential waste prevented.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                  <span>Avoided</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded bg-slate-300" />
                  <span>Waste</span>
                </span>
              </div>
            </div>

            {/* Scaled Bar Visual */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 h-52 items-end pt-4 pb-2 border-b border-slate-200">
              {daysTrend.map((d) => {
                const avoidedPct = (d.avoided / maxVal) * 100;
                const wastedPct = (d.wasted / maxVal) * 100;

                return (
                  <div key={d.day} className="flex flex-col items-center h-full justify-end gap-1.5">
                    <div className="flex items-end gap-1 sm:gap-1.5 h-full w-full justify-center">
                      {/* Avoided Bar */}
                      <div
                        style={{ height: `${avoidedPct}%` }}
                        className="w-1/2 max-w-[24px] bg-emerald-600 rounded-t transition-all relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          +{d.avoided} kg
                        </div>
                      </div>

                      {/* Wasted Bar */}
                      <div
                        style={{ height: `${wastedPct}%` }}
                        className="w-1/2 max-w-[24px] bg-slate-300 rounded-t transition-all relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                          {d.wasted} kg
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-700 truncate mt-1">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 font-mono font-medium">
              <span>0.0 kg baseline</span>
              <span>10.0 kg scale</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
            <span className="font-medium">Continuous Trend:</span>
            <span className="font-bold text-emerald-700 font-mono">
              -66.7% waste reduction since Day 1
            </span>
          </div>
        </section>

        {/* RIGHT COLUMN: ROOT CAUSE ANALYSIS TABLE */}
        <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between h-full">
          <div>
            <div className="p-4 bg-slate-50/70 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Root Cause & Operational Learning Analysis
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Core drivers behind unavoidable spoilage and systematic corrective actions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-2.5">Volume</th>
                    <th className="py-2.5 px-2.5">Loss</th>
                    <th className="py-2.5 px-3">Root Cause</th>
                    <th className="py-2.5 px-3">Correction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rootCauses.map((rc) => (
                    <tr key={rc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {rc.item}
                      </td>
                      <td className="py-2.5 px-2.5 font-mono tabular-nums font-semibold text-rose-700">
                        {rc.wastedAmount}
                      </td>
                      <td className="py-2.5 px-2.5 font-mono tabular-nums text-slate-800 font-semibold">
                        {rc.wasteCost}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 text-[11px] leading-snug">
                        {rc.mainCause}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-800 font-semibold text-[11px] leading-snug">
                        {rc.suggestedCorrection}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-medium">Top learning:</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs">
              {metrics.bestImprovement}
            </span>
          </div>
        </section>
      </div>

      {/* COLLAPSIBLE SUB-TAB: DETAILED DECISION REPLAY & ML ACCURACY TABLE */}
      {decisionReplays.length > 0 && (
        <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setIsDecisionReplayOpen(!isDecisionReplayOpen)}
            className="w-full p-4 bg-slate-50/80 hover:bg-slate-100/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-slate-700" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span>Decision Replay & ML Accuracy Logs</span>
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.2 rounded font-mono">
                    {decisionReplays.length} Records
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Historical delta analysis: AI prediction vs kitchen decisions and calibrated accuracy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-2.5 py-1 rounded shadow-2xs">
                Calibration Rate: <span className="font-mono text-emerald-700 font-bold">93.4%</span>
              </div>
              <div className="p-1 text-slate-500 hover:text-slate-800">
                {isDecisionReplayOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>

          {isDecisionReplayOpen && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Date & Item</th>
                    <th className="py-2.5 px-3">AI Prediction</th>
                    <th className="py-2.5 px-3">Chef/Mgr Decided</th>
                    <th className="py-2.5 px-3">Actual Outcome</th>
                    <th className="py-2.5 px-3">Variance</th>
                    <th className="py-2.5 px-4">Operational Rationale & Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {decisionReplays.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{rec.item}</span>
                        <span className="text-[10px] text-slate-600 font-mono font-medium">
                          {rec.date}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-700">
                        {rec.aiPredicted}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold text-slate-900">
                        {rec.humanDecided}
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-700 font-medium">
                        {rec.actualOutcome}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded font-mono">
                          {rec.difference}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] leading-snug">
                        <span className="text-slate-800 font-semibold block">{rec.reason}</span>
                        <span className="text-slate-600 block mt-0.5 font-medium">{rec.evaluationNote}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
