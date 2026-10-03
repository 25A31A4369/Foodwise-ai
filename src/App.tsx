import React, { useState, useEffect } from 'react';
import {
  AppKPIs,
  DamagedStockRecord,
  DecisionReplayRecord,
  ExperimentItem,
  ForecastDay,
  InventoryItem,
  Language,
  LeftoverFeedbackRecord,
  NavigationTab,
  OrganizationType,
  ProductionPlanItem,
  RescuePlanItem,
  SmartMenuItem,
  TodayActionCard,
  TodayUserInput,
  UserSession,
} from './types';
import { getDefaultDemoData } from './demoData';
import { translations } from './translations';
import { LoginFlow } from './components/LoginFlow';
import { SidebarNav } from './components/SidebarNav';
import { TodaySection } from './components/TodaySection';
import { ForecastSection } from './components/ForecastSection';
import { ProductionSection } from './components/ProductionSection';
import { InventorySection } from './components/InventorySection';
import { WasteRiskSection } from './components/WasteRiskSection';
import { RescuePlanSection } from './components/RescuePlanSection';
import { ExperimentsSection } from './components/ExperimentsSection';
import { SmartMenuSection } from './components/SmartMenuSection';
import { DecisionReplaySection } from './components/DecisionReplaySection';
import { LeftoverFeedbackSection } from './components/LeftoverFeedbackSection';
import { ReportsView } from './components/ReportsView';
import { SettingsSection } from './components/SettingsSection';
import { AddUpdateModal } from './components/AddUpdateModal';
import { SomethingChangedModal } from './components/SomethingChangedModal';
import { DamagedStockModal } from './components/DamagedStockModal';
import { DemoTourModal } from './components/DemoTourModal';
import {
  Plus,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Menu,
  X,
  Globe,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';

const STORAGE_KEY = 'foodwise_ai_app_v2';

export default function App() {
  // Session
  const [session, setSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_session`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isLoggedIn: false,
      mobile: '',
      language: 'en',
      orgType: 'cafeteria',
      orgName: 'Green Valley College Cafeteria',
      step: 'language',
      setupInfo: {
        usualPeopleCount: 185,
        mealsServed: ['Breakfast', 'Lunch', 'Dinner'],
        location: 'Bengaluru, India',
        localContext: 'Rain expected this evening',
      },
    };
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('today');

  // Business Dataset
  const seed = getDefaultDemoData(session.orgType);
  const [kpis, setKpis] = useState<AppKPIs>(seed.kpis);
  const [todayActions, setTodayActions] = useState<TodayActionCard[]>(seed.todayActions);
  const [forecastDays, setForecastDays] = useState<ForecastDay[]>(seed.forecastDays);
  const [productionPlans, setProductionPlans] = useState<ProductionPlanItem[]>(seed.productionPlans);
  const [inventory, setInventory] = useState<InventoryItem[]>(seed.inventory);
  const [rescuePlans, setRescuePlans] = useState<RescuePlanItem[]>(seed.rescuePlans);
  const [smartMenus, setSmartMenus] = useState<SmartMenuItem[]>(seed.smartMenus);
  const [experiments, setExperiments] = useState<ExperimentItem[]>(seed.experiments);
  const [decisionReplays, setDecisionReplays] = useState<DecisionReplayRecord[]>(seed.decisionReplays);
  const [leftoverHistory, setLeftoverHistory] = useState<LeftoverFeedbackRecord[]>(seed.leftoverHistory);
  const [damagedStock, setDamagedStock] = useState<DamagedStockRecord[]>(seed.damagedStock);
  const [weatherInfo, setWeatherInfo] = useState(seed.weatherInfo);

  // User Today's Input State (Input given by user first then AI makes decisions)
  const [hasGivenTodayInput, setHasGivenTodayInput] = useState(false);
  const [todayUserInput, setTodayUserInput] = useState<TodayUserInput>({
    expectedCustomers: 180,
    riceStockKg: 25,
    riceLeftoverKg: 3,
    tomatoesStockKg: 12,
    paneerStockKg: 8,
    localCondition: 'Rain expected this evening 🌧️',
    isRainExpected: true,
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangedModalOpen, setIsChangedModalOpen] = useState(false);
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Persist session
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_session`, JSON.stringify(session));
    } catch {}
  }, [session]);

  const updateSession = (partial: Partial<UserSession>) => {
    setSession((prev) => ({ ...prev, ...partial }));
  };

  // Process User Input First -> then AI Generates Decisions
  const handleSubmitTodayInput = (input: TodayUserInput) => {
    setTodayUserInput(input);
    setHasGivenTodayInput(true);

    const newExpected = Math.max(40, input.expectedCustomers);
    const ratio = newExpected / 180;
    const recommendedRiceKg = Math.max(5, Math.round(newExpected * 0.135 - (input.riceLeftoverKg * 0.6)));
    const riceAvoided = Math.round((input.riceLeftoverKg * 0.5 + 0.8) * 10) / 10;

    setKpis((prev) => ({
      ...prev,
      customersExpected: newExpected,
      potentialWasteAvoidedKg: Math.round((4.2 * ratio) * 10) / 10,
      potentialCostSaving: Math.round(1240 * ratio),
    }));

    // Update today's action cards dynamically based on user input
    setTodayActions([
      {
        id: 'act-1',
        item: 'RICE',
        emoji: '🍚',
        actionHeading: `PREPARE ${recommendedRiceKg - 1}–${recommendedRiceKg} KG RICE`,
        subheading: `Calibrated from your input: ${newExpected} customers & ${input.riceLeftoverKg} kg yesterday’s surplus`,
        reasons: [
          `Your input: ${newExpected} customers expected today`,
          `Your input: ${input.riceLeftoverKg} kg rice leftover from yesterday`,
          `Your input: ${input.riceStockKg} kg rice currently in storage`,
          input.isRainExpected
            ? 'Rain expected this evening reduces walk-in traffic by ~6%'
            : 'Clear operational conditions support full baseline attendance',
        ],
        potentialWasteAvoidedKg: riceAvoided,
        costSaved: Math.round(riceAvoided * 140),
        confidencePct: 92,
        risksIfIgnored: `Surplus rice of ~${Math.round((input.riceLeftoverKg + 1.5) * 10) / 10} kg will spoil by closing time.`,
        alternatives: 'Keep 3 kg dry grain ready for quick 15-minute replenishment if attendance surges.',
        status: 'pending',
      },
      {
        id: 'act-2',
        item: 'TOMATOES',
        emoji: '🍅',
        actionHeading: "DON'T BUY MORE TOMATOES",
        subheading: `${input.tomatoesStockKg} kg stock available from your input; shelf life ends in 48h`,
        reasons: [
          `Your input: ${input.tomatoesStockKg} kg currently stored in walk-in cooler`,
          'Shelf life ends in 48 hours (batch #TM-894)',
          `Average daily consumption is ~${Math.round(newExpected * 0.025 * 10) / 10} kg`,
          'Zero new procurement needed today to prevent spoilage dead loss',
        ],
        potentialWasteAvoidedKg: 5.5,
        costSaved: 380,
        confidencePct: 94,
        risksIfIgnored: 'Vendor delivery of 10 kg will push older stock into spoilage.',
        alternatives: 'Shift near-expiry tomatoes into lunch rasam or approved curry base.',
        status: 'pending',
      },
      {
        id: 'act-3',
        item: 'PANEER',
        emoji: '🥛',
        actionHeading: 'USE PANEER TODAY',
        subheading: `${input.paneerStockKg} kg near 72-hour dairy limit — activate today’s special`,
        reasons: [
          `Your input: ${input.paneerStockKg} kg batch PN-201 expires tomorrow at 11:00 AM`,
          'High cost ingredient (₹320/kg)',
          'Zero risk of waste if incorporated into lunch curry or roll special',
        ],
        potentialWasteAvoidedKg: 6.0,
        costSaved: 1920,
        confidencePct: 91,
        risksIfIgnored: '8 kg spoiled paneer represents ₹2,560 dead loss tomorrow.',
        alternatives: 'Freeze paneer cubes or move 4 kg to adjacent dining hall.',
        status: 'pending',
      },
    ]);

    // Update forecast days
    setForecastDays((prev) =>
      prev.map((d) => (d.isToday ? { ...d, expectedCustomers: newExpected } : d))
    );

    // Update production plans
    setProductionPlans((prev) =>
      prev.map((p) => {
        if (p.item.toLowerCase().includes('rice')) {
          return {
            ...p,
            demandKg: Math.round(newExpected * 0.135),
            usableStockKg: input.riceLeftoverKg,
            recommendedProductionKg: recommendedRiceKg,
            explanation: `Calibrated for your input: ${newExpected} customers minus ${input.riceLeftoverKg} kg yesterday's leftovers.`,
          };
        }
        return {
          ...p,
          demandKg: Math.round(p.demandKg * ratio * 10) / 10,
          recommendedProductionKg: Math.round(p.recommendedProductionKg * ratio * 10) / 10,
          explanation: `Calibrated for your input: ${newExpected} people.`,
        };
      })
    );

    setWeatherInfo((prev) => ({
      ...prev,
      condition: input.localCondition,
      isRainExpected: input.isRainExpected,
    }));

    showToast(`AI Decisions generated from your input (${newExpected} customers, ${input.riceStockKg}kg stock)!`);
  };

  // Finish Login and initialize dataset for selected organization
  const handleFinishLogin = (selectedOrg?: OrganizationType, selectedOrgName?: string) => {
    const org = selectedOrg || session.orgType || 'cafeteria';
    const orgName = selectedOrgName || session.orgName || 'Food Service Facility';
    const fresh = getDefaultDemoData(org);
    setKpis(fresh.kpis);
    setTodayActions(fresh.todayActions);
    setForecastDays(fresh.forecastDays);
    setProductionPlans(fresh.productionPlans);
    setInventory(fresh.inventory);
    setRescuePlans(fresh.rescuePlans);
    setSmartMenus(fresh.smartMenus);
    setExperiments(fresh.experiments);
    setDecisionReplays(fresh.decisionReplays);
    setLeftoverHistory(fresh.leftoverHistory);
    setDamagedStock(fresh.damagedStock);
    setWeatherInfo(fresh.weatherInfo);

    // Reset user input state so input is requested first
    setHasGivenTodayInput(false);
    setTodayUserInput({
      expectedCustomers: fresh.kpis.customersExpected || 180,
      riceStockKg: 25,
      riceLeftoverKg: 3,
      tomatoesStockKg: 12,
      paneerStockKg: 8,
      localCondition: fresh.weatherInfo.condition,
      isRainExpected: fresh.weatherInfo.isRainExpected,
    });

    setSession((prev) => ({
      ...prev,
      orgType: org,
      orgName: orgName,
      isLoggedIn: true,
      step: 'dashboard',
    }));
    showToast(`Welcome to ${orgName}! Please enter today's input.`);
  };

  // Complete Reset Demo: Clears storage, session, inputs, recommendations, history, and returns to Language Selection (Step 1)
  const handleResetDemo = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_session`);
      localStorage.clear();
    } catch {}

    const freshSession: UserSession = {
      isLoggedIn: false,
      mobile: '',
      language: 'en',
      orgType: 'cafeteria',
      orgName: '',
      step: 'language',
      setupInfo: {
        usualPeopleCount: 185,
        mealsServed: ['Breakfast', 'Lunch', 'Dinner'],
        location: 'Bengaluru, India',
        localContext: 'Rain expected this evening',
      },
    };
    setSession(freshSession);

    const fresh = getDefaultDemoData('cafeteria');
    setKpis(fresh.kpis);
    setTodayActions(fresh.todayActions);
    setForecastDays(fresh.forecastDays);
    setProductionPlans(fresh.productionPlans);
    setInventory(fresh.inventory);
    setRescuePlans(fresh.rescuePlans);
    setSmartMenus(fresh.smartMenus);
    setExperiments(fresh.experiments);
    setDecisionReplays(fresh.decisionReplays);
    setLeftoverHistory(fresh.leftoverHistory);
    setDamagedStock(fresh.damagedStock);
    setWeatherInfo(fresh.weatherInfo);

    // Reset user input state
    setHasGivenTodayInput(false);
    setTodayUserInput({
      expectedCustomers: 180,
      riceStockKg: 25,
      riceLeftoverKg: 3,
      tomatoesStockKg: 12,
      paneerStockKg: 8,
      localCondition: 'Rain expected this evening 🌧️',
      isRainExpected: true,
    });
    setTodayActions(fresh.todayActions);
    setForecastDays(fresh.forecastDays);
    setProductionPlans(fresh.productionPlans);
    setInventory(fresh.inventory);
    setRescuePlans(fresh.rescuePlans);
    setSmartMenus(fresh.smartMenus);
    setExperiments(fresh.experiments);
    setDecisionReplays(fresh.decisionReplays);
    setLeftoverHistory(fresh.leftoverHistory);
    setDamagedStock(fresh.damagedStock);
    setWeatherInfo(fresh.weatherInfo);

    setActiveTab('today');
    setIsAddModalOpen(false);
    setIsChangedModalOpen(false);
    setIsDamagedModalOpen(false);
    setIsDemoTourOpen(false);
    setMobileMenuOpen(false);

    showToast('Demo session reset. Returned to Language Selection.');
  };

  // Action card handlers
  const handleAcceptTodayAction = (id: string) => {
    setTodayActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'accepted' } : a))
    );
    showToast('Action accepted! Production plan confirmed.');
  };

  const handleRejectTodayAction = (id: string, reason: string = 'Manager decision') => {
    const act = todayActions.find((a) => a.id === id);
    setTodayActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a))
    );

    if (act) {
      const newRecord: DecisionReplayRecord = {
        id: `rep-${Date.now()}`,
        date: 'Today',
        item: act.item,
        aiPredicted: act.actionHeading,
        humanDecided: 'Rejected by Chef',
        actualOutcome: 'Awaiting end-of-day audit',
        difference: 'Override',
        reason: reason,
        evaluationNote: 'Recorded in adaptive decision memory to refine future baseline.',
      };
      setDecisionReplays((prev) => [newRecord, ...prev]);
    }
    showToast('Action rejected. Stored in decision replay for future learning.');
  };

  const handleChangeTodayAction = (id: string, customVal: string) => {
    const act = todayActions.find((a) => a.id === id);
    setTodayActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'changed', customValue: customVal } : a))
    );

    if (act) {
      const newRecord: DecisionReplayRecord = {
        id: `rep-${Date.now()}`,
        date: 'Today',
        item: act.item,
        aiPredicted: act.actionHeading,
        humanDecided: customVal,
        actualOutcome: 'Pending closing audit',
        difference: 'Customized quantity',
        reason: 'Manager adjusted batch based on local knowledge',
        evaluationNote: 'System will compare this custom batch against tonight’s leftovers.',
      };
      setDecisionReplays((prev) => [newRecord, ...prev]);
    }
    showToast(`Saved custom plan: ${customVal}`);
  };

  const handleAddKnowledge = (item: string, knowledge: string) => {
    showToast(`Added knowledge for ${item}! AI will adapt future recommendations.`);
  };

  // Rescue Plan handler
  const handleExecuteRescueAction = (rescueId: string, tierName: string, actionLabel: string) => {
    setRescuePlans((prev) =>
      prev.map((rp) =>
        rp.id === rescueId ? { ...rp, status: 'rescued', selectedAction: actionLabel } : rp
      )
    );
    setKpis((prev) => ({
      ...prev,
      foodAtRiskKg: Math.max(0, Math.round((prev.foodAtRiskKg - 3.5) * 10) / 10),
      potentialWasteAvoidedKg: Math.round((prev.potentialWasteAvoidedKg + 3.5) * 10) / 10,
    }));
    showToast(`Executed ${tierName}: ${actionLabel}`);
  };

  // Something Changed dynamic recalculation (Story flow)
  const handleSomethingChanged = (type: string, detail: string) => {
    let customerDelta = 0;
    let reasonText = '';

    if (type === 'more_customers' || detail.toLowerCase().includes('event') || detail.toLowerCase().includes('booking')) {
      customerDelta = +30;
      reasonText = detail || 'College event nearby increases footfall';
    } else if (type === 'weather_changed' || detail.toLowerCase().includes('rain')) {
      customerDelta = -20;
      reasonText = 'Rain expected this evening reduces walk-in traffic';
      setWeatherInfo((prev) => ({ ...prev, condition: 'Rain expected 🌧️', isRainExpected: true }));
    } else if (type === 'fewer_customers') {
      customerDelta = -25;
      reasonText = 'Slow customer footfall reported';
    } else {
      customerDelta = -10;
      reasonText = detail || 'Operational condition shift';
    }

    const newExpected = Math.max(80, kpis.customersExpected + customerDelta);
    setKpis((prev) => ({ ...prev, customersExpected: newExpected }));

    // Adjust today's forecast day
    setForecastDays((prev) =>
      prev.map((d) => (d.isToday ? { ...d, expectedCustomers: newExpected } : d))
    );

    // Adjust production items
    const ratio = newExpected / (newExpected - customerDelta);
    setProductionPlans((prev) =>
      prev.map((p) => ({
        ...p,
        demandKg: Math.round(p.demandKg * ratio * 10) / 10,
        recommendedProductionKg: Math.round(p.recommendedProductionKg * ratio * 10) / 10,
        explanation: `Recalculated for updated ${newExpected} people (${reasonText}).`,
      }))
    );

    // Update today's action card
    setTodayActions((prev) =>
      prev.map((act) => {
        if (act.item === 'RICE') {
          return {
            ...act,
            actionHeading: `PREPARE ${Math.round(23 * ratio)} KG RICE`,
            subheading: `Recalculated: ${reasonText}`,
            reasons: [
              reasonText,
              `Customer projection adjusted to ${newExpected} people`,
              'Production boilers automatically calibrated',
            ],
          };
        }
        return act;
      })
    );

    showToast(`Plan recalculated for: ${reasonText}!`);
  };

  // Damaged stock logging
  const handleRecordDamaged = (ingredient: string, qtyKg: number, reason: string) => {
    const newLog: DamagedStockRecord = {
      id: `dam-${Date.now()}`,
      ingredient,
      quantityKg: qtyKg,
      reason: reason as any,
      dateReported: 'Today',
      recalculatedImpact: `Deducted ${qtyKg} kg from usable inventory. Waste risk recalculated.`,
    };
    setDamagedStock((prev) => [newLog, ...prev]);

    // Deduct from inventory stock
    setInventory((prev) =>
      prev.map((it) => {
        if (it.name.toLowerCase().includes(ingredient.toLowerCase())) {
          const updatedStock = Math.max(0, it.currentStock - qtyKg);
          return {
            ...it,
            currentStock: updatedStock,
            suggestedAction: `${qtyKg} kg recorded damaged (${reason}). Net stock: ${updatedStock} kg.`,
          };
        }
        return it;
      })
    );

    showToast(`Recorded ${qtyKg} kg damaged ${ingredient}. Inventory stock updated.`);
  };

  // If not logged in, render the clean Login / Onboarding flow
  if (!session.isLoggedIn || session.step !== 'dashboard') {
    return (
      <LoginFlow
        session={session}
        onUpdateSession={updateSession}
        onFinishLogin={handleFinishLogin}
      />
    );
  }

  const t = translations[session.language];
  const foodAtRiskCount = inventory.filter((i) => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL').length;
  const pendingRescueCount = rescuePlans.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F2937] flex flex-col antialiased">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setActiveTab('today')}
            >
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xs font-bold text-base">
                🍲
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-neutral-900 leading-tight">
                    FOODWISE AI
                  </span>
                  <span className="text-[9px] font-black text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded-full border border-orange-200 uppercase">
                    OFFLINE DEMO
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400 font-semibold hidden sm:inline">
                  “Predict. Prevent. Rescue.”
                </span>
              </div>
            </div>
          </div>

          {/* Action Zone: + SOMETHING CHANGED?, + ADD / UPDATE, 3-Min Tour, Language */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 3-Min Demo Tour button for judges */}
            <button
              type="button"
              onClick={() => setIsDemoTourOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-orange-950 bg-orange-100/90 hover:bg-orange-200 border border-orange-300 rounded-xl transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-700" />
              <span>{t.header.demoTourBtn}</span>
            </button>

            {/* SOMETHING CHANGED? Button */}
            <button
              type="button"
              onClick={() => setIsChangedModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">{t.header.somethingChangedBtn}</span>
              <span className="sm:hidden">Changed?</span>
            </button>

            {/* + ADD / UPDATE Primary Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md shadow-orange-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">{t.header.addUpdateBtn}</span>
            </button>

            {/* Language selector */}
            <div className="flex items-center bg-neutral-100 rounded-xl p-1 text-xs font-bold">
              {(['en', 'hi', 'te'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => updateSession({ language: lng })}
                  className={`px-2 py-1 rounded-lg uppercase ${
                    session.language === lng ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* Reset Demo Button */}
            <button
              type="button"
              onClick={handleResetDemo}
              title="Reset Demo Session"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-neutral-600 hover:text-red-600 bg-neutral-100 hover:bg-red-50 border border-neutral-200 hover:border-red-200 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500 hover:text-red-600" />
              <span className="hidden xl:inline">Reset</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                setIsDemoTourOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 bg-orange-50 border border-orange-200 rounded-xl text-xs font-bold text-orange-950"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                3-Minute Evaluator Guide
              </span>
              <span className="text-orange-700">Start →</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { id: 'today' as NavigationTab, label: t.nav.today },
                { id: 'forecast' as NavigationTab, label: t.nav.forecast },
                { id: 'production' as NavigationTab, label: t.nav.production },
                { id: 'inventory' as NavigationTab, label: t.nav.inventory },
                { id: 'wasterisk' as NavigationTab, label: t.nav.wasteRisk },
                { id: 'rescue' as NavigationTab, label: t.nav.rescuePlan },
                { id: 'feedback' as NavigationTab, label: t.nav.feedback },
                { id: 'experiments' as NavigationTab, label: t.nav.experiments },
                { id: 'menu' as NavigationTab, label: t.nav.menu },
                { id: 'replay' as NavigationTab, label: t.nav.replay },
                { id: 'reports' as NavigationTab, label: t.nav.reports },
                { id: 'settings' as NavigationTab, label: t.nav.settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-xs font-bold text-left ${
                    activeTab === tab.id ? 'bg-orange-600 text-white' : 'bg-neutral-50 text-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                handleResetDemo();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 flex items-center justify-between p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-red-600" />
                Reset Demo Session
              </span>
              <span className="text-red-600 text-xs">Reset →</span>
            </button>
          </div>
        )}
      </header>

      {/* MAIN LAYOUT: LEFT SIDEBAR + RIGHT VIEWPORT */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Left Navigation */}
        <SidebarNav
          session={session}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          foodAtRiskCount={foodAtRiskCount}
          pendingRescueCount={pendingRescueCount}
        />

        {/* Right Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-y-auto">
          {/* Top Greeting Message (Section 8 in prompt) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-2xs">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 mb-0.5">
                {t.header.goodMorning} 👋
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-tight">
                {session.orgName || 'Green Valley College Cafeteria'}
              </h1>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                {t.header.subheading}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600 bg-neutral-50 px-3.5 py-2 rounded-2xl border border-neutral-200 self-start sm:self-auto">
              <span className="flex items-center gap-1.5 text-neutral-800">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                {session.setupInfo?.location || 'Bengaluru, India'}
              </span>
              <span>·</span>
              <span className="text-orange-950 font-bold">{weatherInfo.condition}</span>
            </div>
          </div>

          {/* TAB 1: TODAY */}
          {activeTab === 'today' && (
            <TodaySection
              language={session.language}
              kpis={kpis}
              actions={todayActions}
              onAcceptAction={handleAcceptTodayAction}
              onRejectAction={handleRejectTodayAction}
              onChangeAction={handleChangeTodayAction}
              onAddKnowledge={handleAddKnowledge}
              onJumpToTab={setActiveTab}
              hasGivenTodayInput={hasGivenTodayInput}
              todayUserInput={todayUserInput}
              onSubmitTodayInput={handleSubmitTodayInput}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {/* TAB 2: FORECAST */}
          {activeTab === 'forecast' && (
            <ForecastSection
              language={session.language}
              days={forecastDays}
              weatherInfo={weatherInfo}
            />
          )}

          {/* TAB 3: PRODUCTION */}
          {activeTab === 'production' && (
            <ProductionSection
              language={session.language}
              plans={productionPlans}
              onAcceptPlan={(id) => {
                setProductionPlans((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, status: 'accepted' } : p))
                );
                showToast('Kitchen batch approved!');
              }}
              onChangePlan={(id, newKg) => {
                setProductionPlans((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, humanKg: newKg, status: 'changed' } : p))
                );
                showToast(`Production target customized to ${newKg} kg.`);
              }}
            />
          )}

          {/* TAB 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <InventorySection
              language={session.language}
              inventory={inventory}
              onOpenDamagedModal={() => setIsDamagedModalOpen(true)}
            />
          )}

          {/* TAB 5: WASTE RISK */}
          {activeTab === 'wasterisk' && (
            <WasteRiskSection
              language={session.language}
              inventory={inventory}
              onJumpToRescue={() => setActiveTab('rescue')}
            />
          )}

          {/* TAB 6: RESCUE PLAN (Waste Rescue Mode) */}
          {activeTab === 'rescue' && (
            <RescuePlanSection
              language={session.language}
              rescuePlans={rescuePlans}
              onExecuteRescueAction={handleExecuteRescueAction}
            />
          )}

          {/* TAB: LEFTOVER FEEDBACK (Closing Audit & Learning Loop) */}
          {activeTab === 'feedback' && (
            <LeftoverFeedbackSection
              language={session.language}
              history={leftoverHistory}
              onSaveAndLearn={(newRecord) => {
                setLeftoverHistory((prev) => [newRecord, ...prev]);
                showToast('Leftover feedback saved! Next forecast updated.');
              }}
            />
          )}

          {/* TAB 7: EXPERIMENTS (AI Experiment Lab) */}
          {activeTab === 'experiments' && (
            <ExperimentsSection
              language={session.language}
              experiments={experiments}
              onApproveExperiment={(id) => {
                setExperiments((prev) =>
                  prev.map((e) => (e.id === id ? { ...e, status: 'running' } : e))
                );
                showToast('3-Day Controlled Experiment started!');
              }}
              onDismissExperiment={(id) => {
                showToast('Experiment dismissed.');
              }}
            />
          )}

          {/* TAB 8: SMART MENU */}
          {activeTab === 'menu' && (
            <SmartMenuSection
              language={session.language}
              menus={smartMenus}
              onApproveMenu={(id) => {
                setSmartMenus((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, status: 'approved' } : m))
                );
                showToast('Special dish added to daily menu board!');
              }}
              onRejectMenu={(id) => {
                setSmartMenus((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, status: 'rejected' } : m))
                );
                showToast('Dish dismissed.');
              }}
            />
          )}

          {/* TAB 9: DECISION REPLAY */}
          {activeTab === 'replay' && (
            <DecisionReplaySection
              language={session.language}
              records={decisionReplays}
            />
          )}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && (
            <ReportsView
              language={session.language}
              metrics={{
                foodWasteKg: 14.5,
                wasteAvoidedKg: 42.0,
                moneySaved: 4850,
                forecastAccuracy: 93,
                productionAccuracy: 91,
                mostWasted: 'Cold Chapatis',
                bestImprovement: 'Curd Rice & Rice sizing (+38% accuracy)',
              }}
              rootCauses={[
                {
                  id: 'rc-1',
                  item: 'Cooked Rice',
                  wastedAmount: '2.1 kg',
                  wasteCost: '₹140',
                  mainCause: 'Cooked initial batch without checking late lab attendance',
                  suggestedCorrection: 'Use FoodWise two-stage batch cooking rule',
                },
                {
                  id: 'rc-2',
                  item: 'Tomatoes',
                  wastedAmount: '1.5 kg',
                  wasteCost: '₹55',
                  mainCause: 'Overly ripe crates delivered on Friday afternoon',
                  suggestedCorrection: 'Shift near-expiry tomatoes into lunch rasam',
                },
              ]}
            />
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsSection
              session={session}
              onUpdateSession={updateSession}
              onResetDemo={handleResetDemo}
            />
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-white py-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-800">FOODWISE AI</span>
            <span>—</span>
            <span>Predict. Prevent. Rescue.</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span>Offline Localhost Demo</span>
            <span>·</span>
            <span>Zero Cloud APIs</span>
            <span>·</span>
            <button
              type="button"
              onClick={handleResetDemo}
              className="text-red-600 font-bold hover:underline"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Large "+ ADD / UPDATE" Modal */}
      <AddUpdateModal
        language={session.language}
        orgType={session.orgType}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitEntry={(entry) => {
          showToast(`Information recorded: ${entry.summary}`);
          if (entry.category === 'customers' || entry.category === 'students' || entry.category === 'residents' || entry.category === 'guests') {
            const count = parseInt(entry.values.field1, 10);
            if (count > 0) {
              handleSubmitTodayInput({
                ...todayUserInput,
                expectedCustomers: count,
              });
            }
          } else if (entry.category === 'stock') {
            const kg = parseFloat(entry.values.field2) || 25;
            handleSubmitTodayInput({
              ...todayUserInput,
              riceStockKg: kg,
            });
          } else if (entry.category === 'leftovers') {
            const kg = parseFloat(entry.values.field2) || 3;
            handleSubmitTodayInput({
              ...todayUserInput,
              riceLeftoverKg: kg,
            });
          }
        }}
      />

      {/* 2. "+ SOMETHING CHANGED?" Modal */}
      <SomethingChangedModal
        language={session.language}
        isOpen={isChangedModalOpen}
        onClose={() => setIsChangedModalOpen(false)}
        onApplyChange={handleSomethingChanged}
      />

      {/* 3. Damaged Stock Modal */}
      <DamagedStockModal
        language={session.language}
        isOpen={isDamagedModalOpen}
        onClose={() => setIsDamagedModalOpen(false)}
        onRecordDamaged={handleRecordDamaged}
      />

      {/* 4. 3-Minute Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onJumpToTab={setActiveTab}
        onTriggerQuickEvent={(ev) => handleSomethingChanged('other', ev)}
      />
    </div>
  );
}
