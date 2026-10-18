import React, { useState } from 'react';
import { Language, RescuePlanItem, RescueTierOption, SmartMenuItem } from '../types';
import { translations } from '../translations';
import {
  LifeBuoy,
  ChefHat,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';

interface RescuePlanSectionProps {
  language: Language;
  rescuePlans: RescuePlanItem[];
  smartMenus?: SmartMenuItem[];
  onExecuteRescueAction: (rescueId: string, tierName: string, actionLabel: string) => void;
  onApproveMenu?: (id: string) => void;
  onRejectMenu?: (id: string) => void;
}

export const RescuePlanSection: React.FC<RescuePlanSectionProps> = ({
  language,
  rescuePlans,
  smartMenus = [],
  onExecuteRescueAction,
  onApproveMenu,
  onRejectMenu,
}) => {
  const t = translations[language];
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(rescuePlans[0]?.id || null);
  const [activeTabByPlan, setActiveTabByPlan] = useState<Record<string, 'recipes' | 'tiers'>>({});

  const handleExecute = (plan: RescuePlanItem, tier: RescueTierOption) => {
    onExecuteRescueAction(plan.id, tier.tierName, tier.actionLabel);
  };

  const getActiveTab = (planId: string) => activeTabByPlan[planId] || 'recipes';

  const setActiveTab = (planId: string, tab: 'recipes' | 'tiers') => {
    setActiveTabByPlan((prev) => ({ ...prev, [planId]: tab }));
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t.nav.rescueSpecials || 'Rescue & Specials'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Surplus Action Hierarchy (Use → Allocate → Promote → Redesign → Redistribute → Discard) with integrated Chef Specials.
          </p>
        </div>

        {/* Quiet Pipeline Tag */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Culinary repurposing first · Discard as last resort</span>
        </div>
      </div>

      {/* 6-Tier Hierarchy Explainer Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Surplus Decision Hierarchy:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold text-slate-800 min-w-[620px]">
          <span className="bg-white border border-slate-300 px-2 py-0.5 rounded text-emerald-800">
            1. USE
          </span>
          <span className="text-slate-400">→</span>
          <span className="bg-white border border-slate-300 px-2 py-0.5 rounded text-blue-800">
            2. ALLOCATE
          </span>
          <span className="text-slate-400">→</span>
          <span className="bg-white border border-slate-300 px-2 py-0.5 rounded text-amber-800">
            3. PROMOTE
          </span>
          <span className="text-slate-400">→</span>
          <span className="bg-white border border-slate-300 px-2 py-0.5 rounded text-purple-800">
            4. REDESIGN
          </span>
          <span className="text-slate-400">→</span>
          <span className="bg-white border border-slate-300 px-2 py-0.5 rounded text-teal-800">
            5. REDISTRIBUTE
          </span>
          <span className="text-slate-400">→</span>
          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
            6. DISCARD (Unavoidable)
          </span>
        </div>
      </div>

      {/* Rescue Plans Deck */}
      <div className="space-y-4">
        {rescuePlans.map((plan) => {
          const isExpanded = expandedPlanId === plan.id;
          const isRescued = plan.status === 'rescued';
          const activeSubTab = getActiveTab(plan.id);

          // Find recipe suggestions matching this ingredient
          const matchingRecipes = smartMenus.filter(
            (m) =>
              m.atRiskIngredient.toLowerCase().includes(plan.ingredient.toLowerCase()) ||
              plan.ingredient.toLowerCase().includes(m.atRiskIngredient.toLowerCase())
          );

          // Tier 1 and Tier 3 fast references for instant 1-click rescue
          const tier1 = plan.tiers.find((t) => t.tierNumber === 1) || plan.tiers[0];
          const tier3 = plan.tiers.find((t) => t.tierNumber === 3) || plan.tiers[1] || plan.tiers[0];

          // Auto-generated fallback rescue recipe if no specific custom recipes exist
          const hasRecipes = matchingRecipes.length > 0;
          const fallbackRecipe = !hasRecipes
            ? {
                id: `fallback-rec-${plan.id}`,
                dishName: `Chef Repurposed ${plan.ingredient} Flash Special`,
                emoji: plan.emoji,
                ingredientUsageKg: plan.quantityAtRiskKg,
                expectedPortions: Math.round(plan.quantityAtRiskKg * 5),
                expectedWasteReductionKg: plan.quantityAtRiskKg,
                reason: `Direct operational batch integration: Utilize all ${plan.quantityAtRiskKg} kg near-expiry ${plan.ingredient} in today's lunch side-special or gravy base before shelf-life expires.`,
                status: 'pending',
              }
            : null;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-lg border transition-colors ${
                isRescued
                  ? 'border-emerald-300 bg-emerald-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Strip */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-1 bg-slate-50 border border-slate-200 rounded-md">
                    {plan.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{plan.ingredient}</h3>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-mono tabular-nums">
                        {plan.currentRisk} · {plan.quantityAtRiskKg} KG AT RISK
                      </span>
                      {isRescued && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          Rescued via {plan.selectedAction}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Expires in {plan.expiryHours} hours</span>
                      <span>·</span>
                      <span className="text-slate-800 font-semibold">
                        Recommended: Tier 1 ({plan.primarySuggestedTier})
                      </span>
                      <span>·</span>
                      <span className="text-orange-700 font-semibold">
                        {hasRecipes ? matchingRecipes.length : 1} Culinary Rescue Option Available
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Instant 1-Click Fast Rescue Action in Header */}
                  {tier1 && !isRescued && (
                    <button
                      type="button"
                      onClick={() => handleExecute(plan, tier1)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
                      title="Instant 1-Click Tier 1: Repurpose into today's prep"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>1-Click Tier 1 Use</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Options' : 'Review Rescue & Recipes'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Plan Details */}
              {isExpanded && (
                <div className="border-t border-slate-200 p-4 sm:p-5 bg-slate-50/40 space-y-4">
                  {/* Immediate 1-Click Rescue Action Gate (Always available, never a dead end) */}
                  <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Immediate 1-Click Rescue Protocols (Tiers 1 & 3)
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600">
                        Zero Cognitive Friction
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Tier 1 Fast Action */}
                      {tier1 && (
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex flex-col justify-between gap-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-mono">
                                TIER 1: IMMEDIATE USE
                              </span>
                              <span className="text-[10px] text-slate-600 font-medium">
                                High Recovery
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mt-1">{tier1.title}</h4>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                              {tier1.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleExecute(plan, tier1)}
                            className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>1-Click: {tier1.actionLabel}</span>
                          </button>
                        </div>
                      )}

                      {/* Tier 3 Fast Action */}
                      {tier3 && (
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex flex-col justify-between gap-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                                TIER 3: COUNTER SPECIAL
                              </span>
                              <span className="text-[10px] text-slate-600 font-medium">
                                Fast Turnaround
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mt-1">{tier3.title}</h4>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                              {tier3.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleExecute(plan, tier3)}
                            className="w-full py-1.5 px-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                            <span>1-Click: {tier3.actionLabel}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Segmented Sub-tabs: Chef Recipe Suggestions vs 6 Tiers Hierarchy */}
                  <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-md text-xs w-fit">
                    <button
                      type="button"
                      onClick={() => setActiveTab(plan.id, 'recipes')}
                      className={`px-3 py-1 font-semibold rounded transition-colors flex items-center gap-1.5 ${
                        activeSubTab === 'recipes'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <ChefHat className="w-3.5 h-3.5 text-orange-600" />
                      <span>
                        Chef Specials & Recipes ({hasRecipes ? matchingRecipes.length : 1})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab(plan.id, 'tiers')}
                      className={`px-3 py-1 font-semibold rounded transition-colors flex items-center gap-1.5 ${
                        activeSubTab === 'tiers'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <LifeBuoy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Surplus Action Hierarchy (6 Tiers)</span>
                    </button>
                  </div>

                  {/* SUB-VIEW 1: CHEF SPECIAL RECIPES (Never shows empty dead-end state) */}
                  {activeSubTab === 'recipes' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Custom matching recipes */}
                        {matchingRecipes.map((recipe) => {
                          const isApproved = recipe.status === 'approved';

                          return (
                            <div
                              key={recipe.id}
                              className={`p-4 bg-white rounded-lg border transition-colors ${
                                isApproved
                                  ? 'border-emerald-300 bg-emerald-50/20'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{recipe.emoji}</span>
                                  <div>
                                    <h4 className="text-xs font-bold text-slate-900">
                                      {recipe.dishName}
                                    </h4>
                                    <span className="text-[10px] text-slate-600 font-medium">
                                      Uses {recipe.ingredientUsageKg} kg surplus {plan.ingredient}
                                    </span>
                                  </div>
                                </div>

                                {isApproved && (
                                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                    Active on Menu Board
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded border border-slate-200/80 my-2 text-center text-xs">
                                <div>
                                  <span className="text-[9px] text-slate-600 block font-semibold uppercase">
                                    Usage
                                  </span>
                                  <span className="font-bold text-slate-900 font-mono tabular-nums">
                                    {recipe.ingredientUsageKg} kg
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-600 block font-semibold uppercase">
                                    Portions
                                  </span>
                                  <span className="font-bold text-slate-900 font-mono tabular-nums">
                                    {recipe.expectedPortions}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-emerald-800 block font-semibold uppercase">
                                    Waste Cut
                                  </span>
                                  <span className="font-bold text-emerald-700 font-mono tabular-nums">
                                    -{recipe.expectedWasteReductionKg} kg
                                  </span>
                                </div>
                              </div>

                              <p className="text-[11px] text-slate-700 leading-relaxed mb-3 font-medium">
                                {recipe.reason}
                              </p>

                              <div className="flex items-center gap-2">
                                {onApproveMenu && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onApproveMenu(recipe.id);
                                      onExecuteRescueAction(
                                        plan.id,
                                        'USE',
                                        `Special Recipe: ${recipe.dishName}`
                                      );
                                    }}
                                    className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 ${
                                      isApproved
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>
                                      {isApproved ? 'Approved Special' : 'Approve as Today’s Special'}
                                    </span>
                                  </button>
                                )}

                                {onRejectMenu && !isApproved && (
                                  <button
                                    type="button"
                                    onClick={() => onRejectMenu(recipe.id)}
                                    className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
                                  >
                                    Dismiss
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Always Render Instant Fallback Rescue Recipe If No Custom Recipes Exist */}
                        {!hasRecipes && fallbackRecipe && (
                          <div className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{fallbackRecipe.emoji}</span>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">
                                    {fallbackRecipe.dishName}
                                  </h4>
                                  <span className="text-[10px] text-slate-600 font-medium">
                                    Auto-Generated Immediate Kitchen Rescue
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                Immediate 1-Click
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded border border-slate-200/80 my-2 text-center text-xs">
                              <div>
                                <span className="text-[9px] text-slate-600 block font-semibold uppercase">
                                  Usage
                                </span>
                                <span className="font-bold text-slate-900 font-mono tabular-nums">
                                  {fallbackRecipe.ingredientUsageKg} kg
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-600 block font-semibold uppercase">
                                  Portions
                                </span>
                                <span className="font-bold text-slate-900 font-mono tabular-nums">
                                  {fallbackRecipe.expectedPortions}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-emerald-800 block font-semibold uppercase">
                                  Waste Cut
                                </span>
                                <span className="font-bold text-emerald-700 font-mono tabular-nums">
                                  -{fallbackRecipe.expectedWasteReductionKg} kg
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-700 leading-relaxed mb-3 font-medium">
                              {fallbackRecipe.reason}
                            </p>

                            <button
                              type="button"
                              onClick={() => {
                                onExecuteRescueAction(
                                  plan.id,
                                  'USE',
                                  `Immediate Repurposed Special: ${plan.ingredient}`
                                );
                              }}
                              className="w-full py-1.5 px-3 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>1-Click: Approve as Immediate Today's Special</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB-VIEW 2: 6-TIER HIERARCHY */}
                  {activeSubTab === 'tiers' && (
                    <div className="space-y-2">
                      <div className="text-[11px] text-slate-600 mb-2 font-medium">
                        Execute actions sequentially to maximize culinary value and economic recovery:
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {plan.tiers.map((tier) => (
                          <div
                            key={tier.tierNumber}
                            className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                                  Tier {tier.tierNumber}: {tier.tierName}
                                </span>
                                <span className="text-[10px] text-slate-600 font-semibold font-mono">
                                  {tier.impactScore}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 mt-1">
                                {tier.title}
                              </h5>
                              <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
                                {tier.description}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              <span className="text-[10px] text-emerald-800 font-bold">
                                {tier.safetyStatus}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleExecute(plan, tier)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-900 hover:text-white bg-slate-100 hover:bg-slate-900 border border-slate-300 rounded transition-colors shadow-2xs"
                              >
                                {tier.actionLabel}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
