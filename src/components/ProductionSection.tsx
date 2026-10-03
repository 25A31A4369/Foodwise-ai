import React, { useState } from 'react';
import { Language, ProductionPlanItem } from '../types';
import { translations } from '../translations';
import {
  UtensilsCrossed,
  CheckCircle2,
  Edit2,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  Check,
} from 'lucide-react';

interface ProductionSectionProps {
  language: Language;
  plans: ProductionPlanItem[];
  onAcceptPlan: (id: string) => void;
  onChangePlan: (id: string, newKg: number) => void;
}

export const ProductionSection: React.FC<ProductionSectionProps> = ({
  language,
  plans,
  onAcceptPlan,
  onChangePlan,
}) => {
  const t = translations[language];
  const [editingPlan, setEditingPlan] = useState<ProductionPlanItem | null>(null);
  const [customKg, setCustomKg] = useState('');

  const handleOpenEdit = (p: ProductionPlanItem) => {
    setEditingPlan(p);
    setCustomKg((p.humanKg !== undefined ? p.humanKg : p.recommendedProductionKg).toString());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customKg);
    if (editingPlan && !isNaN(val) && val >= 0) {
      onChangePlan(editingPlan.id, val);
      setEditingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
            <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
              {t.productionSection.title}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal">
            {t.productionSection.subtitle}
          </p>
        </div>

        {/* Production Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((p) => {
            const isAccepted = p.status === 'accepted';
            const isCustom = p.humanKg !== undefined;
            const displayKg = isCustom ? p.humanKg : p.recommendedProductionKg;

            return (
              <div
                key={p.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isAccepted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isCustom
                    ? 'border-blue-300 bg-blue-50/20'
                    : 'border-neutral-200 bg-white hover:border-orange-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-neutral-50 rounded-2xl border border-neutral-200">
                      {p.emoji}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-neutral-900">
                        {p.item}
                      </h3>
                      <span className="text-xs text-neutral-400 font-medium">
                        Recipe Target
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black text-neutral-900 tabular-nums">
                      {displayKg}{' '}
                      <span className="text-xs font-bold text-neutral-500">{p.unit}</span>
                    </div>
                    {isCustom && (
                      <span className="text-[10px] text-blue-700 font-bold block">
                        (AI suggested: {p.recommendedProductionKg} {p.unit})
                      </span>
                    )}
                  </div>
                </div>

                {/* Math Formula breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Demand
                    </span>
                    <span className="font-extrabold text-neutral-800 tabular-nums">
                      {p.demandKg} {p.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Usable Stock
                    </span>
                    <span className="font-extrabold text-emerald-700 tabular-nums">
                      - {p.usableStockKg} {p.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-950 block">
                      To Prepare
                    </span>
                    <span className="font-black text-orange-600 tabular-nums">
                      = {p.recommendedProductionKg} {p.unit}
                    </span>
                  </div>
                </div>

                {/* Plain-Language Explanation */}
                <p className="text-xs text-neutral-600 mb-4 bg-orange-50/50 p-3 rounded-xl border border-orange-100 leading-relaxed font-medium">
                  {p.explanation}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => onAcceptPlan(p.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isAccepted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAccepted ? 'Accepted' : 'Accept Plan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="py-2 px-3.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Change</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Edit modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl"
          >
            <h3 className="font-bold text-base text-neutral-900 mb-1">
              Change Quantity for {editingPlan.item}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              AI recommended {editingPlan.recommendedProductionKg} {editingPlan.unit}.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {t.productionSection.changePrompt}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={customKg}
                onChange={(e) => setCustomKg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-base font-bold tabular-nums focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
              >
                Save My Target
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
