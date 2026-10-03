import React, { useState } from 'react';
import { Language, SmartMenuItem } from '../types';
import { translations } from '../translations';
import {
  ChefHat,
  CheckCircle2,
  XCircle,
  Edit2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

interface SmartMenuSectionProps {
  language: Language;
  menus: SmartMenuItem[];
  onApproveMenu: (id: string) => void;
  onRejectMenu: (id: string) => void;
}

export const SmartMenuSection: React.FC<SmartMenuSectionProps> = ({
  language,
  menus,
  onApproveMenu,
  onRejectMenu,
}) => {
  const t = translations[language];
  const [reviewingMenu, setReviewingMenu] = useState<SmartMenuItem | null>(null);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                {t.menuSection.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              {t.menuSection.subtitle}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Requires chef approval</span>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menus.map((m) => {
            const isApproved = m.status === 'approved';
            const isRejected = m.status === 'rejected';

            return (
              <div
                key={m.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isApproved
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isRejected
                    ? 'border-neutral-200 bg-neutral-50/50 opacity-60'
                    : 'border-orange-200 bg-[#FCFAF6] hover:border-orange-400 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                      {m.emoji}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-neutral-900">
                        {m.dishName}
                      </h3>
                      <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md inline-block mt-0.5">
                        {m.atRiskIngredient}
                      </span>
                    </div>
                  </div>

                  {isApproved && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
                      Approved on Menu
                    </span>
                  )}
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-white border border-neutral-200/80 mb-3.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Usage
                    </span>
                    <span className="font-extrabold text-neutral-800 tabular-nums">
                      {m.ingredientUsageKg} kg
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Portions
                    </span>
                    <span className="font-extrabold text-neutral-800 tabular-nums">
                      {m.expectedPortions}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      Waste Cut
                    </span>
                    <span className="font-black text-emerald-700 tabular-nums">
                      -{m.expectedWasteReductionKg} kg
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 mb-4 bg-white/70 p-3 rounded-xl border border-neutral-200/60 leading-relaxed font-medium">
                  {m.reason}
                </p>

                {/* Actions: Review, Accept, Reject */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => onApproveMenu(m.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isApproved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isApproved ? 'Approved' : t.menuSection.btnApprove}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReviewingMenu(m)}
                    className="py-2 px-3 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                  >
                    Review
                  </button>

                  <button
                    type="button"
                    onClick={() => onRejectMenu(m.id)}
                    className="py-2 px-3 rounded-xl text-xs font-semibold text-neutral-400 hover:text-neutral-700"
                  >
                    {t.menuSection.btnReject}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Review Modal */}
      {reviewingMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl">
            <h3 className="font-bold text-base text-neutral-900 mb-1">
              Recipe Review: {reviewingMenu.dishName}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Verifying ingredient ratio & dining kitchen safety
            </p>

            <div className="space-y-3 text-xs mb-5 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div className="flex justify-between">
                <span>At-risk stock targeted:</span>
                <strong>{reviewingMenu.atRiskIngredient}</strong>
              </div>
              <div className="flex justify-between">
                <span>Quantity used in recipe:</span>
                <strong>{reviewingMenu.ingredientUsageKg} kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Total servings yielded:</span>
                <strong>{reviewingMenu.expectedPortions} portions</strong>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Landfill waste prevented:</span>
                <strong>{reviewingMenu.expectedWasteReductionKg} kg</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewingMenu(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onApproveMenu(reviewingMenu.id);
                  setReviewingMenu(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 rounded-xl"
              >
                Approve for Lunch Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
