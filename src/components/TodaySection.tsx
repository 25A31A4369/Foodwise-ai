import React, { useState, useEffect } from 'react';
import { AppKPIs, Language, TodayActionCard, TodayUserInput } from '../types';
import { translations } from '../translations';
import {
  Users,
  AlertTriangle,
  Recycle,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Edit3,
  HelpCircle,
  MessageSquarePlus,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Info,
  Clock,
  Plus,
} from 'lucide-react';

interface TodaySectionProps {
  language: Language;
  kpis: AppKPIs;
  actions: TodayActionCard[];
  onAcceptAction: (id: string) => void;
  onRejectAction: (id: string, reason?: string) => void;
  onChangeAction: (id: string, customVal: string) => void;
  onAddKnowledge: (item: string, knowledge: string) => void;
  onJumpToTab: (tab: any) => void;
  hasGivenTodayInput: boolean;
  todayUserInput: TodayUserInput;
  onSubmitTodayInput: (input: TodayUserInput) => void;
  onOpenAddModal: () => void;
}

export const TodaySection: React.FC<TodaySectionProps> = ({
  language,
  kpis,
  actions,
  onAcceptAction,
  onRejectAction,
  onChangeAction,
  onAddKnowledge,
  onJumpToTab,
  hasGivenTodayInput,
  todayUserInput,
  onSubmitTodayInput,
  onOpenAddModal,
}) => {
  const t = translations[language];

  // User input states (Input given by user first)
  const [inputCustomers, setInputCustomers] = useState(todayUserInput.expectedCustomers.toString());
  const [inputRiceStock, setInputRiceStock] = useState(todayUserInput.riceStockKg.toString());
  const [inputRiceLeftover, setInputRiceLeftover] = useState(todayUserInput.riceLeftoverKg.toString());
  const [inputTomatoesStock, setInputTomatoesStock] = useState(todayUserInput.tomatoesStockKg.toString());
  const [inputCondition, setInputCondition] = useState(todayUserInput.localCondition);
  const [isEditingInput, setIsEditingInput] = useState(!hasGivenTodayInput);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setInputCustomers(todayUserInput.expectedCustomers.toString());
    setInputRiceStock(todayUserInput.riceStockKg.toString());
    setInputRiceLeftover(todayUserInput.riceLeftoverKg.toString());
    setInputTomatoesStock(todayUserInput.tomatoesStockKg.toString());
    setInputCondition(todayUserInput.localCondition);
    if (!hasGivenTodayInput) {
      setIsEditingInput(true);
    }
  }, [todayUserInput, hasGivenTodayInput]);

  const handleTriggerAnalysis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsEditingInput(false);
      onSubmitTodayInput({
        expectedCustomers: parseInt(inputCustomers, 10) || 180,
        riceStockKg: parseFloat(inputRiceStock) || 25,
        riceLeftoverKg: parseFloat(inputRiceLeftover) || 3,
        tomatoesStockKg: parseFloat(inputTomatoesStock) || 12,
        paneerStockKg: todayUserInput.paneerStockKg || 8,
        localCondition: inputCondition.trim() || 'Normal daily routine',
        isRainExpected: inputCondition.toLowerCase().includes('rain'),
      });
    }, 380);
  };

  const applyPreset = (customers: number, riceStock: number, leftover: number, cond: string) => {
    setInputCustomers(customers.toString());
    setInputRiceStock(riceStock.toString());
    setInputRiceLeftover(leftover.toString());
    setInputCondition(cond);
  };

  // Modals for deep interaction
  const [activeWhyAction, setActiveWhyAction] = useState<TodayActionCard | null>(null);
  const [editingAction, setEditingAction] = useState<TodayActionCard | null>(null);
  const [customValueInput, setCustomValueInput] = useState('');
  const [knowledgeAction, setKnowledgeAction] = useState<TodayActionCard | null>(null);
  const [knowledgeInput, setKnowledgeInput] = useState('');
  const [rejectingAction, setRejectingAction] = useState<TodayActionCard | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('Local operational preference');

  const handleOpenEdit = (act: TodayActionCard) => {
    setEditingAction(act);
    setCustomValueInput(act.customValue || act.actionHeading);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAction && customValueInput.trim()) {
      onChangeAction(editingAction.id, customValueInput.trim());
      setEditingAction(null);
    }
  };

  const handleSaveKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (knowledgeAction && knowledgeInput.trim()) {
      onAddKnowledge(knowledgeAction.item, knowledgeInput.trim());
      setKnowledgeAction(null);
      setKnowledgeInput('');
    }
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingAction) {
      onRejectAction(rejectingAction.id, rejectReasonInput.trim());
      setRejectingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. STEP 1: INPUT GIVEN BY USER FIRST */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-orange-300 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
              1
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-900">
                  GIVE TODAY’S INPUT FIRST
                </h2>
                {hasGivenTodayInput && !isEditingInput && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    AI Analyzed
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                Enter your operational numbers first. FoodWise AI calculates demand, batch prep, and waste risk after your input.
              </p>
            </div>
          </div>

          {hasGivenTodayInput && !isEditingInput && (
            <button
              type="button"
              onClick={() => setIsEditingInput(true)}
              className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-orange-600" />
              <span>Change Input / Recalculate AI</span>
            </button>
          )}
        </div>

        {/* If submitted and collapsed, show crisp confirmed summary bar */}
        {hasGivenTodayInput && !isEditingInput ? (
          <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-orange-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-neutral-800">
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
                👥 <span className="text-neutral-500 font-medium">Customers:</span> {inputCustomers}
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
                🍚 <span className="text-neutral-500 font-medium">Rice in Stock:</span> {inputRiceStock} kg
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
                ♻️ <span className="text-neutral-500 font-medium">Yesterday Leftover:</span> {inputRiceLeftover} kg
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
                🍅 <span className="text-neutral-500 font-medium">Tomatoes:</span> {inputTomatoesStock} kg
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 text-orange-950 shadow-2xs">
                🌦️ {inputCondition}
              </span>
            </div>

            <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI recommendations below are generated from your input</span>
            </div>
          </div>
        ) : (
          /* Form for Entering Today's Numbers */
          <form onSubmit={handleTriggerAnalysis} className="space-y-4">
            {/* Quick Demo Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Quick Fill:
              </span>
              <button
                type="button"
                onClick={() => applyPreset(180, 25, 3, 'Rain expected this evening 🌧️')}
                className="text-[11px] font-semibold px-2.5 py-1 bg-neutral-100 hover:bg-orange-100 hover:text-orange-950 text-neutral-700 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
              >
                Standard Shift (180 people, 3kg leftover, Rain)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(240, 35, 1, 'College event & lunch rush ☀️')}
                className="text-[11px] font-semibold px-2.5 py-1 bg-neutral-100 hover:bg-orange-100 hover:text-orange-950 text-neutral-700 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
              >
                Busy Rush (240 people, 1kg leftover)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(120, 20, 5, 'Heavy rain slow footfall 🌧️')}
                className="text-[11px] font-semibold px-2.5 py-1 bg-neutral-100 hover:bg-orange-100 hover:text-orange-950 text-neutral-700 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
              >
                Slow Day (120 people, 5kg leftover)
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Field 1: Customers */}
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-neutral-200">
                <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                  👥 How many customers expected?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputCustomers}
                    onChange={(e) => setInputCustomers(e.target.value)}
                    placeholder="180"
                    className="w-full pl-3 pr-12 py-2 bg-white border border-neutral-300 rounded-xl text-base font-black text-neutral-900 tabular-nums focus:outline-hidden focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-neutral-400">
                    people
                  </span>
                </div>
              </div>

              {/* Field 2: Rice in stock */}
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-neutral-200">
                <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                  🍚 How much rice in stock?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputRiceStock}
                    onChange={(e) => setInputRiceStock(e.target.value)}
                    placeholder="25"
                    className="w-full pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-xl text-base font-black text-neutral-900 tabular-nums focus:outline-hidden focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-neutral-400">
                    kg
                  </span>
                </div>
              </div>

              {/* Field 3: Rice leftover yesterday */}
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-neutral-200">
                <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                  ♻️ How much rice left yesterday?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={inputRiceLeftover}
                    onChange={(e) => setInputRiceLeftover(e.target.value)}
                    placeholder="3"
                    className="w-full pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-xl text-base font-black text-neutral-900 tabular-nums focus:outline-hidden focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-neutral-400">
                    kg
                  </span>
                </div>
              </div>

              {/* Field 4: Tomatoes in stock */}
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-neutral-200">
                <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                  🍅 How many tomatoes in stock?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputTomatoesStock}
                    onChange={(e) => setInputTomatoesStock(e.target.value)}
                    placeholder="12"
                    className="w-full pl-3 pr-10 py-2 bg-white border border-neutral-300 rounded-xl text-base font-black text-neutral-900 tabular-nums focus:outline-hidden focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-neutral-400">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Field 5: Today's condition & Action buttons */}
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                  🌦️ Weather / Special Situation today
                </label>
                <input
                  type="text"
                  value={inputCondition}
                  onChange={(e) => setInputCondition(e.target.value)}
                  placeholder="e.g. Rain expected this evening, College cultural fest"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={onOpenAddModal}
                  className="px-3.5 py-2.5 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-orange-600" />
                  <span>More Inputs</span>
                </button>

                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-xl text-xs font-black shadow-md shadow-orange-600/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>AI Analyzing Input...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ANALYZE & MAKE AI DECISIONS →</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      {/* 2. TOP 4 SIMPLE CARDS (Section 8 in prompt) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: CUSTOMERS EXPECTED */}
        <div
          onClick={() => onJumpToTab('forecast')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200 hover:border-orange-300 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 mb-2.5 group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-0.5">
            {t.cards.expectedCustomers}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-neutral-900 tabular-nums">
            {kpis.customersExpected}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Based on your input & history</div>
        </div>

        {/* Card 2: FOOD AT RISK */}
        <div
          onClick={() => onJumpToTab('rescue')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-red-200 hover:border-red-400 bg-red-50/20 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mb-2.5 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-bold text-red-900 uppercase tracking-wide mb-0.5">
            {t.cards.foodAtRisk}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-600 tabular-nums">
            {kpis.foodAtRiskKg}{' '}
            <span className="text-sm font-bold text-red-500">KG</span>
          </div>
          <div className="text-[11px] text-red-700/80 mt-1 font-semibold">Open Rescue Plan →</div>
        </div>

        {/* Card 3: POTENTIAL WASTE AVOIDED */}
        <div
          onClick={() => onJumpToTab('reports')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 hover:border-emerald-400 bg-emerald-50/20 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2.5 group-hover:scale-105 transition-transform">
            <Recycle className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide mb-0.5">
            {t.cards.potentialWasteAvoided}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums">
            {kpis.potentialWasteAvoidedKg}{' '}
            <span className="text-sm font-bold text-emerald-600">KG</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold">Today’s prevention target</div>
        </div>

        {/* Card 4: POTENTIAL COST SAVING */}
        <div
          onClick={() => onJumpToTab('reports')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-200 hover:border-orange-400 bg-orange-50/20 transition-all cursor-pointer shadow-xs group"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 mb-2.5 group-hover:scale-105 transition-transform">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-bold text-orange-950 uppercase tracking-wide mb-0.5">
            {t.cards.potentialCostSaving}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-950 tabular-nums">
            ₹{kpis.potentialCostSaving.toLocaleString()}
          </div>
          <div className="text-[11px] text-orange-800 mt-1 font-semibold">Ingredient value protected</div>
        </div>
      </div>

      {/* 3. STEP 2: CENTRAL SECTION: “WHAT SHOULD I DO TODAY?” */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-orange-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-800 font-extrabold text-xs flex items-center justify-center border border-orange-200">
              2
            </span>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
                <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                  {t.todaySection.title}
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-normal">
                {hasGivenTodayInput
                  ? 'Decisions generated by FoodWise AI based on your input above.'
                  : 'Awaiting your morning operational inputs in Step 1 above.'}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Human in control · No automated discards</span>
          </div>
        </div>

        {/* If no input given yet, show waiting banner */}
        {!hasGivenTodayInput ? (
          <div className="p-8 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/30 text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3 text-2xl">
              ⏳
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              Awaiting User Input First
            </h3>
            <p className="text-xs text-neutral-600 max-w-md mx-auto mb-4 leading-relaxed">
              FoodWise AI makes no assumptions. Enter today’s operational numbers in Step 1 above, then click <strong>“ANALYZE & MAKE AI DECISIONS”</strong> to see the tailored preparation and purchase recommendations.
            </p>
            <button
              type="button"
              onClick={() => handleTriggerAnalysis()}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze & Make AI Decisions Now</span>
            </button>
          </div>
        ) : (
          /* Action Cards */
          <div className="space-y-4">
          {actions.map((act) => {
            const isAccepted = act.status === 'accepted';
            const isRejected = act.status === 'rejected';
            const isChanged = act.status === 'changed';

            return (
              <div
                key={act.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isAccepted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isRejected
                    ? 'border-neutral-200 bg-neutral-50/60 opacity-60'
                    : isChanged
                    ? 'border-blue-300 bg-blue-50/20'
                    : 'border-orange-200/90 bg-[#FCFAF6] shadow-xs hover:border-orange-400'
                }`}
              >
                {/* Header of Action */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-1 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                      {act.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold tracking-wider uppercase text-neutral-400">
                          {act.item}
                        </span>
                        {isAccepted && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Accepted by you
                          </span>
                        )}
                        {isChanged && (
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                            Customized by you
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-[10px] font-bold text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded-md">
                            Rejected (Learning stored)
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-neutral-900 leading-snug">
                        {act.customValue || act.actionHeading}
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">
                        {act.subheading}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                      +{act.potentialWasteAvoidedKg} kg avoided
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveWhyAction(act)}
                      className="text-xs font-bold text-orange-700 bg-white hover:bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 shadow-2xs flex items-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
                      <span>{t.todaySection.btnWhy}</span>
                    </button>
                  </div>
                </div>

                {/* Reason bullets */}
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 mb-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Why does FoodWise suggest this?
                  </div>
                  <ul className="space-y-1 text-xs text-neutral-700">
                    {act.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold shrink-0">·</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact & Confidence Tag strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 mb-4 pb-3 border-b border-neutral-200/70">
                  <div className="flex items-center gap-3">
                    <span>
                      <strong className="text-neutral-800">{t.todaySection.confidence}:</strong>{' '}
                      {act.confidencePct}%
                    </span>
                    <span>·</span>
                    <span>
                      <strong className="text-neutral-800">Value Saved:</strong> ₹{act.costSaved}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setKnowledgeAction(act);
                      setKnowledgeInput('');
                    }}
                    className="text-xs font-bold text-orange-700 hover:text-orange-950 flex items-center gap-1"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>{t.todaySection.btnAddKnowledge}</span>
                  </button>
                </div>

                {/* Action Buttons: ACCEPT / CHANGE / REJECT */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAcceptAction(act.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isAccepted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.todaySection.btnAccept}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(act)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{t.todaySection.btnChange}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRejectingAction(act);
                      setRejectReasonInput('Manager operational preference');
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{t.todaySection.btnReject}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* WHY MODAL / EXPLAINABLE AI */}
      {activeWhyAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl p-1 bg-orange-50 rounded-xl border border-orange-100">
                {activeWhyAction.emoji}
              </span>
              <div>
                <h3 className="font-bold text-base text-neutral-900">
                  {activeWhyAction.actionHeading}
                </h3>
                <span className="text-xs text-neutral-500">
                  Explainable AI Transparency Breakdown
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-neutral-700 mb-6 bg-orange-50/30 p-4 rounded-2xl border border-orange-100">
              <div>
                <span className="font-bold text-orange-950 block uppercase text-[10px] tracking-wide mb-1">
                  1. Real-time Factors Analyzed:
                </span>
                <ul className="space-y-1 pl-2">
                  {activeWhyAction.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-orange-600 font-bold">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-orange-950 block uppercase text-[10px] tracking-wide mb-0.5">
                  2. Confidence Level:
                </span>
                <span className="font-semibold text-neutral-800">
                  {activeWhyAction.confidencePct}% (Grounded in 30 days historical data + local weather)
                </span>
              </div>

              <div>
                <span className="font-bold text-red-900 block uppercase text-[10px] tracking-wide mb-0.5">
                  3. If Ignored (Risks):
                </span>
                <span className="text-neutral-800">{activeWhyAction.risksIfIgnored}</span>
              </div>

              <div>
                <span className="font-bold text-emerald-900 block uppercase text-[10px] tracking-wide mb-0.5">
                  4. Recommended Alternatives:
                </span>
                <span className="text-neutral-800">{activeWhyAction.alternatives}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveWhyAction(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onAcceptAction(activeWhyAction.id);
                  setActiveWhyAction(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl"
              >
                Accept Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE QUANTITY MODAL */}
      {editingAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl"
          >
            <h3 className="font-bold text-base text-neutral-900 mb-1">
              Change Decision for {editingAction.item}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              AI suggested: “{editingAction.actionHeading}”. What do you want to do instead?
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Your preferred kitchen instruction:
              </label>
              <input
                type="text"
                value={customValueInput}
                onChange={(e) => setCustomValueInput(e.target.value)}
                placeholder="e.g. Prepare 26 kg because of basketball team booking"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingAction(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
              >
                Save My Modification
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD MY KNOWLEDGE MODAL (Section 24 in prompt) */}
      {knowledgeAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveKnowledge}
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💬</span>
              <h3 className="font-bold text-base text-neutral-900">
                Add My Knowledge for {knowledgeAction.item}
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              FoodWise collaborates with you. Enter special kitchen context (e.g., “Local wedding nearby”, “Students on exam study leave”).
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Your kitchen knowledge:
              </label>
              <textarea
                rows={3}
                value={knowledgeInput}
                onChange={(e) => setKnowledgeInput(e.target.value)}
                placeholder="e.g. We always cook 2 kg less rice when it rains because students buy hot snacks instead."
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-hidden focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setKnowledgeAction(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
              >
                Include in Learning Loop
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REJECT MODAL WITH REASON CAPTURE (Decision Learning) */}
      {rejectingAction && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmReject}
            className="bg-white rounded-3xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl"
          >
            <h3 className="font-bold text-base text-neutral-900 mb-1">
              Reject Recommendation for {rejectingAction.item}?
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              FoodWise stores your reason so it avoids repeating rejected suggestions.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Reason for rejecting:
              </label>
              <input
                type="text"
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder="e.g. Expecting walk-in crowd, or chef is testing new recipe"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingAction(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Confirm Rejection & Store Learning
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
