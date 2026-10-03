import React from 'react';
import { DecisionReplayRecord, Language } from '../types';
import { translations } from '../translations';
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Scale,
} from 'lucide-react';

interface DecisionReplaySectionProps {
  language: Language;
  records: DecisionReplayRecord[];
}

export const DecisionReplaySection: React.FC<DecisionReplaySectionProps> = ({
  language,
  records,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                {t.replaySection.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              {t.replaySection.subtitle}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Accountability & Mutual Trust</span>
          </div>
        </div>

        {/* Replay Records Deck */}
        <div className="space-y-4">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-3xl border border-neutral-200 bg-[#FCFAF6] hover:bg-white transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500 mb-3 pb-2 border-b border-neutral-200/80">
                <span className="font-extrabold text-neutral-900">
                  {rec.date} — {rec.item}
                </span>
                <span className="text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                  Difference: {rec.difference}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-3.5">
                {/* AI Prediction */}
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    {t.replaySection.aiPredictedCol}
                  </span>
                  <span className="text-lg font-black text-neutral-800 tabular-nums">
                    {rec.aiPredicted}
                  </span>
                </div>

                {/* Manager Decision */}
                <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200">
                  <span className="text-[10px] uppercase font-bold text-orange-950 block mb-1">
                    {t.replaySection.humanDecidedCol}
                  </span>
                  <span className="text-lg font-black text-orange-900 tabular-nums">
                    {rec.humanDecided}
                  </span>
                </div>

                {/* Actual Outcome */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                    {t.replaySection.actualOutcomeCol}
                  </span>
                  <span className="text-lg font-black text-emerald-900 tabular-nums">
                    {rec.actualOutcome}
                  </span>
                </div>
              </div>

              {/* Context and Learning Note */}
              <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 text-xs space-y-1">
                <div>
                  <strong className="text-neutral-900">Context Provided by Manager:</strong>{' '}
                  <span className="text-neutral-700">{rec.reason}</span>
                </div>
                <div className="text-emerald-900 font-medium">
                  <strong>System Learning:</strong> {rec.evaluationNote}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
