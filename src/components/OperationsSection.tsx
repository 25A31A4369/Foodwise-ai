import React, { useState, useEffect } from 'react';
import {
  AppKPIs,
  Language,
  ProductionPlanItem,
  TodayActionCard,
  TodayUserInput,
} from '../types';
import { translations } from '../translations';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  UtensilsCrossed,
  ShieldCheck,
  Sparkles,
  CloudRain,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Info,
} from 'lucide-react';

export type VerificationGateStatus = 'awaiting' | 'accepted' | 'modified';

interface OperationsSectionProps {
  language: Language;
  kpis: AppKPIs;
  actions: TodayActionCard[];
  onAcceptAction: (id: string) => void;
  onRejectAction: (id: string, reason?: string) => void;
  onChangeAction: (id: string, customVal: string) => void;
  hasGivenTodayInput: boolean;
  todayUserInput: TodayUserInput;
  onSubmitTodayInput: (input: TodayUserInput) => void;
  productionPlans: ProductionPlanItem[];
  onAcceptProductionPlan: (id: string) => void;
  onChangeProductionPlan: (id: string, newKg: number) => void;
  onApproveAllProductionPlans: () => void;
  onOpenSomethingChanged: () => void;
  weatherCondition: string;
  verificationStatus: VerificationGateStatus;
  onVerifyAiPredictions: () => void;
}

export const OperationsSection: React.FC<OperationsSectionProps> = ({
  language,
  kpis,
  actions,
  onAcceptAction,
  onRejectAction,
  onChangeAction,
  hasGivenTodayInput,
  todayUserInput,
  onSubmitTodayInput,
  productionPlans,
  onAcceptProductionPlan,
  onChangeProductionPlan,
  onApproveAllProductionPlans,
  onOpenSomethingChanged,
  weatherCondition,
  verificationStatus,
  onVerifyAiPredictions,
}) => {
  const t = translations[language];

  // User input states
  const [inputCustomers, setInputCustomers] = useState(todayUserInput.expectedCustomers.toString());
  const [inputRiceStock, setInputRiceStock] = useState(todayUserInput.riceStockKg.toString());
  const [inputRiceLeftover, setInputRiceLeftover] = useState(todayUserInput.riceLeftoverKg.toString());
  const [inputTomatoesStock, setInputTomatoesStock] = useState(todayUserInput.tomatoesStockKg.toString());
  const [inputPaneerStock, setInputPaneerStock] = useState((todayUserInput.paneerStockKg || 8).toString());
  const [inputCondition, setInputCondition] = useState(todayUserInput.localCondition);
  const [isEditingInput, setIsEditingInput] = useState(verificationStatus === 'modified');
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Custom modal/inline edit states
  const [editingPlan, setEditingPlan] = useState<ProductionPlanItem | null>(null);
  const [customPlanKg, setCustomPlanKg] = useState('');

  useEffect(() => {
    setInputCustomers(todayUserInput.expectedCustomers.toString());
    setInputRiceStock(todayUserInput.riceStockKg.toString());
    setInputRiceLeftover(todayUserInput.riceLeftoverKg.toString());
    setInputTomatoesStock(todayUserInput.tomatoesStockKg.toString());
    setInputPaneerStock((todayUserInput.paneerStockKg || 8).toString());
    setInputCondition(todayUserInput.localCondition);
  }, [todayUserInput]);

  const handleCalibrate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setIsEditingInput(false);
      onSubmitTodayInput({
        expectedCustomers: parseInt(inputCustomers, 10) || 180,
        riceStockKg: parseFloat(inputRiceStock) || 25,
        riceLeftoverKg: parseFloat(inputRiceLeftover) || 3,
        tomatoesStockKg: parseFloat(inputTomatoesStock) || 12,
        paneerStockKg: parseFloat(inputPaneerStock) || 8,
        localCondition: inputCondition.trim() || 'Normal daily service',
        isRainExpected: inputCondition.toLowerCase().includes('rain'),
      });
    }, 250);
  };

  const applyPreset = (customers: number, riceStock: number, leftover: number, paneer: number, cond: string) => {
    setInputCustomers(customers.toString());
    setInputRiceStock(riceStock.toString());
    setInputRiceLeftover(leftover.toString());
    setInputPaneerStock(paneer.toString());
    setInputCondition(cond);
  };

  const handleSavePlanEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customPlanKg);
    if (editingPlan && !isNaN(val) && val >= 0) {
      onChangeProductionPlan(editingPlan.id, val);
      setEditingPlan(null);
    }
  };

  const allPlansApproved = productionPlans.every((p) => p.status === 'accepted');

  // Match production plan with any high-priority directives or calculate smart alert metadata
  const getPlanAlertInfo = (plan: ProductionPlanItem) => {
    const itemName = plan.item.toLowerCase();
    const matchedAction = actions.find(
      (a) =>
        a.item.toLowerCase().includes(itemName) ||
        itemName.includes(a.item.toLowerCase()) ||
        (itemName.includes('rice') && a.item.toLowerCase().includes('rice')) ||
        (itemName.includes('veg') && a.item.toLowerCase().includes('tomato')) ||
        (itemName.includes('paneer') && a.item.toLowerCase().includes('paneer'))
    );

    if (itemName.includes('rice')) {
      return {
        hasAlert: true,
        alertType: 'warning' as const,
        badgeText: 'RAIN & SURPLUS CALIBRATED',
        badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
        alertHeadline: `${todayUserInput.riceLeftoverKg} kg yesterday surplus deducted · Rain drag accounted (-6%)`,
        wasteAvoidedKg: matchedAction?.potentialWasteAvoidedKg || 1.5,
        costSaved: matchedAction?.costSaved || 220,
        confidencePct: matchedAction?.confidencePct || 88,
        actionId: matchedAction?.id,
      };
    }

    if (itemName.includes('chicken')) {
      return {
        hasAlert: true,
        alertType: 'info' as const,
        badgeText: 'BUFFER INTEGRATED',
        badgeColor: 'text-blue-800 bg-blue-50 border-blue-200',
        alertHeadline: '2 kg pre-cooked cold storage buffer credited; 14 kg net batch',
        wasteAvoidedKg: 0.8,
        costSaved: 340,
        confidencePct: 92,
        actionId: matchedAction?.id,
      };
    }

    if (itemName.includes('veg') || itemName.includes('sabzi')) {
      return {
        hasAlert: true,
        alertType: 'urgent' as const,
        badgeText: 'NEAR-EXPIRY RESCUE',
        badgeColor: 'text-rose-800 bg-rose-50 border-rose-200',
        alertHeadline: '7 kg morning prep ready. Uses 4 kg near-expiry cooler tomatoes',
        wasteAvoidedKg: 4.0,
        costSaved: 280,
        confidencePct: 94,
        actionId: matchedAction?.id,
      };
    }

    if (itemName.includes('dal')) {
      return {
        hasAlert: true,
        alertType: 'success' as const,
        badgeText: 'STANDARD TARGET',
        badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        alertHeadline: '3 kg hot hold available. 9 kg fresh steam batch meets 185 pax ratio',
        wasteAvoidedKg: 0.5,
        costSaved: 95,
        confidencePct: 96,
        actionId: matchedAction?.id,
      };
    }

    return {
      hasAlert: !!matchedAction,
      alertType: 'info' as const,
      badgeText: matchedAction ? 'HIGH PRIORITY DIRECTIVE' : 'CALIBRATED BATCH',
      badgeColor: 'text-slate-800 bg-slate-100 border-slate-300',
      alertHeadline: matchedAction?.subheading || plan.explanation,
      wasteAvoidedKg: matchedAction?.potentialWasteAvoidedKg || 0,
      costSaved: matchedAction?.costSaved || 0,
      confidencePct: matchedAction?.confidencePct || 90,
      actionId: matchedAction?.id,
    };
  };

  const handleApprovePlanWithAlert = (plan: ProductionPlanItem) => {
    onAcceptProductionPlan(plan.id);
    const alertInfo = getPlanAlertInfo(plan);
    if (alertInfo.actionId) {
      onAcceptAction(alertInfo.actionId);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t.nav.operations || 'Operations & Production Batching'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            2-Step Predictive Pipeline: Weather & Demand Auto-Detection with Human-in-the-Loop Verification.
          </p>
        </div>

        {/* Operational Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onOpenSomethingChanged}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Shift / Weather Alert</span>
          </button>
        </div>
      </div>

      {/* 2-STEP PREDICTIVE WEATHER & USER VERIFICATION WORKFLOW GATE */}
      <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        {/* Step 1: AI Auto-Detection Telemetry */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-orange-400 flex items-center justify-center shrink-0">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">
                    Phase 1: AI Auto-Detection Engine
                  </span>
                  <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                    Radar Grounded
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                  Local Condition: {weatherCondition} · Precipitation Probability 68%
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Historical pattern analysis indicates rain suppresses walk-in attendance by ~6%. Baseline demand projected at <strong className="font-semibold text-slate-900">185 customers</strong> (vs. dry baseline of 198). Rice prep reduced to account for <strong className="font-semibold text-slate-900">{todayUserInput.riceLeftoverKg} kg</strong> recorded surplus.
                </p>
              </div>
            </div>

            {/* Verification Status Badge */}
            <div className="shrink-0 self-start md:self-auto">
              {verificationStatus === 'awaiting' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{t.verificationGate?.statusAwaiting || 'Awaiting Chef Verification'}</span>
                </span>
              ) : verificationStatus === 'accepted' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.verificationGate?.statusAccepted || 'Verified by Chef (AI Baseline Active)'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded-md">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.verificationGate?.statusModified || 'Customized by Chef (Manual Override)'}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Human-in-the-Loop Verification Gate Actions */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              {t.verificationGate?.title || 'Phase 2: Human-in-the-Loop Verification Gate'}
            </h3>
            <p className="text-xs text-slate-600 max-w-xl">
              {t.verificationGate?.description ||
                'AI has predicted high evening rain and 185 expected customers. Do you want to accept AI predictions or modify inputs?'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onVerifyAiPredictions}
              className={`px-4 py-2 text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 ${
                verificationStatus === 'accepted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {verificationStatus === 'accepted'
                  ? 'AI Predictions Accepted'
                  : t.verificationGate?.btnAccept || 'Accept AI Predictions'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditingInput(!isEditingInput)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span>
                {isEditingInput
                  ? 'Hide Input Editor'
                  : t.verificationGate?.btnModify || 'Modify Inputs & Sizing'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            {t.cards.expectedCustomers}
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {kpis.customersExpected}
            <span className="text-xs font-normal text-slate-600 ml-1">pax</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            {verificationStatus === 'accepted'
              ? 'AI weather-calibrated baseline'
              : 'Active operational headcount'}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            Potential Waste Avoided
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {kpis.potentialWasteAvoidedKg}
            <span className="text-xs font-normal text-emerald-600 ml-1">kg</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">Via calibrated batch sizes</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            Projected Cost Savings
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{kpis.potentialCostSaving.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-600 mt-1">Prevented over-purchasing</div>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
            Food At Risk (FEFO)
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {kpis.foodAtRiskKg}
            <span className="text-xs font-normal text-amber-600 ml-1">kg</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1">3 batches expiring &lt;48h</div>
        </div>
      </div>

      {/* INPUT EDITOR (Visible when user clicks 'Modify Inputs') */}
      {isEditingInput && (
        <section className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Custom Shift Calibration Editor
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                Override Headcount, Inventory Stock & Shift Notice
              </h2>
            </div>

            {/* Shift Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-600 font-medium mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset(180, 25, 3, 8, 'Normal lunch routine')}
                className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Standard (180 pax)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(145, 25, 6, 8, 'Rain expected this evening')}
                className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Rain Shift (145 pax)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(230, 35, 1, 10, 'Campus event rush')}
                className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                Event Peak (230 pax)
              </button>
            </div>
          </div>

          <form onSubmit={handleCalibrate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Expected Footfall (Pax)
                </label>
                <input
                  type="number"
                  min="20"
                  max="1200"
                  value={inputCustomers}
                  onChange={(e) => setInputCustomers(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Rice in Storage (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={inputRiceStock}
                  onChange={(e) => setInputRiceStock(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Yesterday Surplus Rice (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={inputRiceLeftover}
                  onChange={(e) => setInputRiceLeftover(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tomatoes in Cooler (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={inputTomatoesStock}
                  onChange={(e) => setInputTomatoesStock(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Paneer Stock (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={inputPaneerStock}
                  onChange={(e) => setInputPaneerStock(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end pt-1">
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Shift Notice / Weather / Local Circumstance
                </label>
                <input
                  type="text"
                  value={inputCondition}
                  onChange={(e) => setInputCondition(e.target.value)}
                  placeholder="e.g. Rain expected this evening, student bus delay"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isCalibrating}
                  className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isCalibrating ? 'Recalculating...' : 'Apply Custom Inputs'}</span>
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {/* UNIFIED DAILY PRODUCTION BATCH TARGETS WITH DIRECT MERGED ALERTS */}
      <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Daily Production Batch Targets & Calibrated Directives
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Target cooking batches calibrated for {kpis.customersExpected} customers. High-priority weather & surplus directives merged directly into batch rows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onApproveAllProductionPlans}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1.5 ${
                allPlansApproved
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{allPlansApproved ? 'All Batches Approved' : 'Approve All Batches'}</span>
            </button>
          </div>
        </div>

        {/* Structured Unified Batch Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Recipe Item & High-Priority Alert</th>
                <th className="py-2.5 px-3">Forecast Demand</th>
                <th className="py-2.5 px-3">Usable Stock</th>
                <th className="py-2.5 px-3">Batch Target</th>
                <th className="py-2.5 px-4">Operational Rationale & Impact</th>
                <th className="py-2.5 px-3 text-right">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {productionPlans.map((p) => {
                const isAccepted = p.status === 'accepted';
                const isCustom = p.humanKg !== undefined;
                const displayKg = isCustom ? p.humanKg : p.recommendedProductionKg;
                const alertInfo = getPlanAlertInfo(p);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isAccepted
                        ? 'bg-emerald-50/20 hover:bg-emerald-50/40'
                        : isCustom
                        ? 'bg-blue-50/20 hover:bg-blue-50/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl shrink-0 mt-0.5">{p.emoji}</span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{p.item}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider font-mono ${alertInfo.badgeColor}`}
                            >
                              {alertInfo.badgeText}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-700 leading-tight">
                            {alertInfo.alertHeadline}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono tabular-nums font-semibold text-slate-700">
                      {p.demandKg} {p.unit}
                    </td>

                    <td className="py-3.5 px-3 font-mono tabular-nums font-semibold text-slate-700">
                      <div>
                        {p.usableStockKg} {p.unit}
                      </div>
                      <span className="text-[10px] text-slate-600 block">Pre-staged</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-bold font-mono tabular-nums text-slate-900">
                        <span className="text-base">{displayKg}</span>
                        <span className="text-xs text-slate-600 font-normal">{p.unit}</span>
                        {isCustom && (
                          <span className="text-[9px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1 py-0.2 rounded font-sans">
                            Edited
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm text-[11px] leading-relaxed">
                      <p className="text-slate-700 font-medium">{p.explanation}</p>
                      <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-600">
                        <span>
                          Avoided: <strong className="text-emerald-700 font-mono">+{alertInfo.wasteAvoidedKg} kg</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Savings: <strong className="text-slate-900 font-mono">₹{alertInfo.costSaved}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          AI Conf: <strong className="text-slate-800 font-mono">{alertInfo.confidencePct}%</strong>
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApprovePlanWithAlert(p)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1 ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{isAccepted ? 'Approved' : 'Approve'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingPlan(p);
                            setCustomPlanKg(
                              (p.humanKg !== undefined ? p.humanKg : p.recommendedProductionKg).toString()
                            );
                          }}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
                          title="Override batch kg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL: CUSTOMIZE BATCH KG */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Adjust Target: {editingPlan.item}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-slate-500 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlanEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batch Target ({editingPlan.unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={customPlanKg}
                  onChange={(e) => setCustomPlanKg(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
                <span className="text-[11px] text-slate-600 block mt-1">
                  System recommendation: {editingPlan.recommendedProductionKg} {editingPlan.unit}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md shadow-xs"
                >
                  Save Custom Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
