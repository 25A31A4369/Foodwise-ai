import React, { useState } from 'react';
import { ExperimentItem, Language } from '../types';
import { translations } from '../translations';
import {
  FlaskConical,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Play,
  RotateCcw,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ExperimentsSectionProps {
  language: Language;
  experiments: ExperimentItem[];
  onApproveExperiment: (id: string) => void;
  onDismissExperiment: (id: string) => void;
}

export const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  language,
  experiments,
  onApproveExperiment,
  onDismissExperiment,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
            <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
              {t.experimentsSection.title}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal">
            {t.experimentsSection.subtitle}
          </p>
        </div>

        {/* Uncertainty Banner */}
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/90 text-xs text-orange-950 mb-6 flex items-start gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <span className="font-extrabold block text-sm mb-0.5">
              The Adaptive Food Decision Loop
            </span>
            <p className="text-orange-900/90 leading-relaxed font-medium">
              When the AI recognizes uncertainty, it does NOT pretend certainty. Instead, it suggests a small, risk-free experiment, measures actual kitchen results, and uses human feedback to refine tomorrow’s recommendations.
            </p>
          </div>
        </div>

        {/* Experiment Cards */}
        <div className="space-y-5">
          {experiments.map((exp) => {
            const isRunning = exp.status === 'running';
            const isCompleted = exp.status === 'completed';

            return (
              <div
                key={exp.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isRunning
                    ? 'border-orange-500 bg-orange-50/20 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-neutral-200 bg-white hover:border-orange-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                      {exp.emoji}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-neutral-900">
                        {exp.title}
                      </h3>
                      <span className="text-xs text-neutral-500 font-medium">
                        Duration: {exp.duration}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                      isRunning
                        ? 'bg-orange-600 text-white animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {isRunning ? 'Active Test In Progress' : isCompleted ? 'Completed & Learned' : 'Proposed Experiment'}
                  </span>
                </div>

                {/* Uncertainty Context */}
                <p className="text-xs text-neutral-700 font-medium mb-4 bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 leading-relaxed">
                  <strong className="text-neutral-900">Uncertainty Identified:</strong> “{exp.uncertaintyContext}”
                </p>

                {/* Proposal & Hypothesis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
                  <div className="p-3.5 bg-white rounded-2xl border border-neutral-200">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                      Action to Test
                    </span>
                    <p className="font-semibold text-neutral-800">{exp.proposal}</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                      Expected Outcome (Hypothesis)
                    </span>
                    <p className="font-semibold text-emerald-950">{exp.hypothesis}</p>
                  </div>
                </div>

                {/* Control vs Test */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Control Group
                    </span>
                    <span className="font-medium text-neutral-700">{exp.controlGroup}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-950 block">
                      Test Group
                    </span>
                    <span className="font-bold text-orange-900">{exp.testGroup}</span>
                  </div>
                </div>

                {/* Metrics measured */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">
                    {t.experimentsSection.metricsTitle}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.metrics.map((m) => (
                      <span
                        key={m}
                        className="text-[11px] font-semibold bg-white border border-neutral-200 px-2.5 py-0.5 rounded-lg text-neutral-700"
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learned result box if completed or running */}
                {exp.learnedTakeaway && (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-950 mb-4">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-blue-900 mb-1">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>{t.experimentsSection.learningTitle}</span>
                    </div>
                    <p className="font-medium leading-relaxed">{exp.learnedTakeaway}</p>
                    {exp.wasteReductionRecorded && (
                      <div className="mt-2 text-xs font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg inline-block">
                        Measured Result: {exp.wasteReductionRecorded}
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => onApproveExperiment(exp.id)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isRunning ? 'Test is Active' : t.experimentsSection.btnApprove}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDismissExperiment(exp.id)}
                      className="px-4 py-2 text-neutral-500 hover:text-neutral-800 text-xs font-semibold"
                    >
                      {t.experimentsSection.btnDismiss}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
