import React, { useState } from 'react';
import { Language, LeftoverFeedbackRecord } from '../types';
import { translations } from '../translations';
import { RotateCcw, CheckCircle2, Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface LeftoverFeedbackSectionProps {
  language: Language;
  history: LeftoverFeedbackRecord[];
  onSaveAndLearn: (entry: LeftoverFeedbackRecord) => void;
}

export const LeftoverFeedbackSection: React.FC<LeftoverFeedbackSectionProps> = ({
  language,
  history,
  onSaveAndLearn,
}) => {
  const [actualRice, setActualRice] = useState('1.2');
  const [actualChicken, setActualChicken] = useState('2.3');
  const [actualVeg, setActualVeg] = useState('0.8');
  const [selectedReason, setSelectedReason] = useState('Prepared too much');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const reasons = [
    'Lower demand',
    'Prepared too much',
    'Customer preference',
    'Unexpected event',
    'Menu issue',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = parseFloat(actualRice) || 1.2;
    const c = parseFloat(actualChicken) || 2.3;
    const v = parseFloat(actualVeg) || 0.8;

    const newRecord: LeftoverFeedbackRecord = {
      date: 'Today (Closing Audit)',
      items: [
        { name: 'Rice', emoji: '🍚', predictedKg: 2.0, actualKg: r, reason: selectedReason },
        { name: 'Chicken Curry', emoji: '🍗', predictedKg: 1.0, actualKg: c, reason: selectedReason },
        { name: 'Vegetables', emoji: '🥬', predictedKg: 3.0, actualKg: v, reason: selectedReason },
      ],
      learnedRule: `Recorded actual leftovers. Primary driver was: ${selectedReason}.`,
      nextForecastImpact: `Tomorrow's baseline will deduct surplus and apply 8% conservative batch sizing.`,
    };

    onSaveAndLearn(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Leftovers saved! “Yesterday's leftover data has been included into tomorrow’s forecast.”</span>
        </div>
      )}

      {/* Form */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
            <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
              LEFTOVER FEEDBACK LOOP
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal">
            Take 60 seconds at closing time. FoodWise learns from what was actually consumed vs what remained.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-xs font-bold uppercase text-neutral-400">
            How much food was actually left today?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Rice */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 block mb-1">
                🍚 Rice
              </span>
              <span className="text-[10px] text-neutral-400 block mb-2">
                Predicted: 2.0 KG leftover
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={actualRice}
                  onChange={(e) => setActualRice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm font-bold tabular-nums focus:outline-hidden focus:border-orange-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-semibold">
                  KG
                </span>
              </div>
            </div>

            {/* Chicken */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 block mb-1">
                🍗 Chicken Curry
              </span>
              <span className="text-[10px] text-neutral-400 block mb-2">
                Predicted: 1.0 KG leftover
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={actualChicken}
                  onChange={(e) => setActualChicken(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm font-bold tabular-nums focus:outline-hidden focus:border-orange-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-semibold">
                  KG
                </span>
              </div>
            </div>

            {/* Vegetables */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 block mb-1">
                🥬 Vegetables
              </span>
              <span className="text-[10px] text-neutral-400 block mb-2">
                Predicted: 3.0 KG leftover
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={actualVeg}
                  onChange={(e) => setActualVeg(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-sm font-bold tabular-nums focus:outline-hidden focus:border-orange-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-semibold">
                  KG
                </span>
              </div>
            </div>
          </div>

          {/* Reason options */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
              Why was there leftover?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReason(r)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                    selectedReason === r
                      ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>SAVE & LEARN</span>
          </button>
        </form>
      </section>

      {/* History */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <h3 className="text-sm font-black text-neutral-900 uppercase mb-4">
          How FoodWise Adapts From Past Leftovers
        </h3>

        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
              <div className="flex items-center justify-between font-bold text-neutral-800 mb-2 border-b border-neutral-200/70 pb-1.5">
                <span>{h.date}</span>
                <span className="text-emerald-700 font-bold">Feedback Recorded</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                {h.items.map((it, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-xl border border-neutral-200">
                    <span className="font-bold text-neutral-800 block">
                      {it.emoji} {it.name}
                    </span>
                    <span className="text-neutral-500">
                      Actual: <strong>{it.actualKg} kg</strong> (Pred: {it.predictedKg} kg)
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-orange-950 bg-orange-50/70 p-2.5 rounded-xl border border-orange-100 font-medium">
                <strong>Next Forecast Adjustment:</strong> “{h.nextForecastImpact}”
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
