import React, { useState } from 'react';
import { Language, RescuePlanItem, RescueTierOption } from '../types';
import { translations } from '../translations';
import {
  LifeBuoy,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Truck,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RescuePlanSectionProps {
  language: Language;
  rescuePlans: RescuePlanItem[];
  onExecuteRescueAction: (rescueId: string, tierName: string, actionLabel: string) => void;
}

export const RescuePlanSection: React.FC<RescuePlanSectionProps> = ({
  language,
  rescuePlans,
  onExecuteRescueAction,
}) => {
  const t = translations[language];
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(rescuePlans[0]?.id || null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleExecute = (plan: RescuePlanItem, tier: RescueTierOption) => {
    onExecuteRescueAction(plan.id, tier.tierName, tier.actionLabel);
    setSuccessToast(`Rescue Plan Executed: ${tier.actionLabel} (${tier.tierName})`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const tierColors: Record<string, { bg: string; text: string; badge: string }> = {
    USE: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-950', badge: 'bg-emerald-600 text-white' },
    ALLOCATE: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-950', badge: 'bg-blue-600 text-white' },
    PROMOTE: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-950', badge: 'bg-amber-600 text-white' },
    REDESIGN: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-950', badge: 'bg-purple-600 text-white' },
    REDISTRIBUTE: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-950', badge: 'bg-teal-600 text-white' },
    DISCARD: { bg: 'bg-neutral-100 border-neutral-300 opacity-60', text: 'text-neutral-700', badge: 'bg-neutral-600 text-white' },
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg shadow-orange-600/15">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-white/20 rounded-xl">
            <LifeBuoy className="w-5 h-5 text-white" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
            {t.rescueSection.title}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black mb-2">
          Don’t Classify Surplus as Waste. Rescue It First.
        </h2>
        <p className="text-xs sm:text-sm text-orange-100 leading-relaxed max-w-3xl">
          {t.rescueSection.subtitle}
        </p>

        {/* 6 Tier Visual Pipeline */}
        <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="bg-white text-orange-900 px-2.5 py-1 rounded-lg">1. USE</span>
          <span>→</span>
          <span className="bg-white text-orange-900 px-2.5 py-1 rounded-lg">2. ALLOCATE</span>
          <span>→</span>
          <span className="bg-white text-orange-900 px-2.5 py-1 rounded-lg">3. PROMOTE</span>
          <span>→</span>
          <span className="bg-white text-orange-900 px-2.5 py-1 rounded-lg">4. REDESIGN</span>
          <span>→</span>
          <span className="bg-white text-orange-900 px-2.5 py-1 rounded-lg">5. REDISTRIBUTE</span>
          <span>→</span>
          <span className="bg-black/30 text-white/80 px-2.5 py-1 rounded-lg">6. DISCARD (Last Resort)</span>
        </div>
      </section>

      {/* Rescue Plan Items Deck */}
      <div className="space-y-4">
        {rescuePlans.map((plan) => {
          const isExpanded = expandedPlanId === plan.id;
          const isRescued = plan.status === 'rescued';

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border transition-all ${
                isRescued
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-neutral-200 hover:border-orange-300 shadow-xs'
              }`}
            >
              {/* Card Title Strip */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl p-1 bg-neutral-50 rounded-2xl border border-neutral-200">
                    {plan.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-black text-neutral-900">
                        {plan.ingredient}
                      </h3>
                      <span className="text-[10px] font-extrabold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                        {plan.currentRisk} RISK ({plan.quantityAtRiskKg} KG)
                      </span>
                      {isRescued && (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Rescued via {plan.selectedAction}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 font-medium flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Expires in {plan.expiryHours} hours</span>
                      <span>·</span>
                      <span className="text-orange-700 font-bold">
                        Primary recommendation: Tier 1 ({plan.primarySuggestedTier})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const primaryTier = plan.tiers.find((t) => t.tierName === plan.primarySuggestedTier);
                      if (primaryTier) handleExecute(plan, primaryTier);
                    }}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5"
                  >
                    <span>Execute Tier 1 ({plan.primarySuggestedTier})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                    className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl"
                    title="View all 6 Rescue Tiers"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 6 TIER EVALUATION DRAWER */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-neutral-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Evaluation of all 6 Rescue Options (in strict hierarchy):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plan.tiers.map((tier) => {
                      const style = tierColors[tier.tierName] || tierColors.USE;
                      const isPrimary = tier.tierName === plan.primarySuggestedTier;

                      return (
                        <div
                          key={tier.tierNumber}
                          className={`p-4 rounded-2xl border flex flex-col justify-between ${style.bg} ${
                            isPrimary ? 'ring-2 ring-orange-500 shadow-xs' : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${style.badge}`}>
                                Tier {tier.tierNumber}: {tier.tierName}
                              </span>
                              {isPrimary && (
                                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                                  Top Choice
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs font-bold text-neutral-900 mb-1 leading-snug">
                              {tier.title}
                            </h4>
                            <p className="text-[11px] text-neutral-600 mb-3 leading-relaxed">
                              {tier.description}
                            </p>

                            <div className="space-y-1 text-[10px] mb-4 bg-white/70 p-2.5 rounded-xl border border-neutral-200/60">
                              <div className="text-emerald-800 font-bold">
                                Impact: {tier.impactScore}
                              </div>
                              <div className="text-neutral-500 font-medium">
                                Safety: {tier.safetyStatus}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleExecute(plan, tier)}
                            className="w-full py-2 px-3 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 shadow-2xs hover:border-orange-500 transition-colors"
                          >
                            {tier.actionLabel}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
