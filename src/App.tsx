import React, { useState, useEffect } from 'react';
import {
  AppKPIs,
  DamagedStockRecord,
  DecisionReplayRecord,
  ForecastDay,
  InventoryItem,
  Language,
  NavigationTab,
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
import { OperationsSection, VerificationGateStatus } from './components/OperationsSection';
import { InventorySection } from './components/InventorySection';
import { RescuePlanSection } from './components/RescuePlanSection';
import { ReportsView } from './components/ReportsView';
import { AiChatbot } from './components/AiChatbot';
import { SomethingChangedModal } from './components/SomethingChangedModal';
import { DamagedStockModal } from './components/DamagedStockModal';
import {
  CheckCircle2,
  Building2,
  MapPin,
  User,
  Menu,
  X,
  RotateCcw,
  Bot,
  ChefHat,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = 'foodwise_ai_app_v4';

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

  // Active Tab (4 Consolidated Core Tabs: operations | inventory | rescue | reports)
  const [activeTab, setActiveTab] = useState<NavigationTab>('operations');

  // Business Dataset
  const seed = getDefaultDemoData(session.orgType);
  const [kpis, setKpis] = useState<AppKPIs>(seed.kpis);
  const [todayActions, setTodayActions] = useState<TodayActionCard[]>(seed.todayActions);
  const [forecastDays, setForecastDays] = useState<ForecastDay[]>(seed.forecastDays);
  const [productionPlans, setProductionPlans] = useState<ProductionPlanItem[]>(seed.productionPlans);
  const [inventory, setInventory] = useState<InventoryItem[]>(seed.inventory);
  const [rescuePlans, setRescuePlans] = useState<RescuePlanItem[]>(seed.rescuePlans);
  const [smartMenus, setSmartMenus] = useState<SmartMenuItem[]>(seed.smartMenus);
  const [decisionReplays, setDecisionReplays] = useState<DecisionReplayRecord[]>(seed.decisionReplays);
  const [damagedStock, setDamagedStock] = useState<DamagedStockRecord[]>(seed.damagedStock);
  const [weatherInfo, setWeatherInfo] = useState(seed.weatherInfo);

  // Verification Gate Status (2-step AI pipeline)
  const [verificationStatus, setVerificationStatus] = useState<VerificationGateStatus>('awaiting');

  // AI Chatbot Overlay State
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // User Today's Input State
  const [hasGivenTodayInput, setHasGivenTodayInput] = useState(false);
  const [todayUserInput, setTodayUserInput] = useState<TodayUserInput>({
    expectedCustomers: 185,
    riceStockKg: 25,
    riceLeftoverKg: 3,
    tomatoesStockKg: 12,
    paneerStockKg: 8,
    localCondition: 'Rain expected this evening in Bengaluru',
    isRainExpected: true,
  });

  // Modals
  const [isChangedModalOpen, setIsChangedModalOpen] = useState(false);
  const [isDamagedModalOpen, setIsDamagedModalOpen] = useState(false);
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

  // Accept AI Auto-Predictions (1-click Human Verification Gate)
  const handleVerifyAiPredictions = () => {
    setVerificationStatus('accepted');
    setHasGivenTodayInput(true);
    // Lock in verified baseline plans
    setProductionPlans((prev) => prev.map((p) => ({ ...p, status: 'accepted' })));
    setTodayActions((prev) => prev.map((a) => ({ ...a, status: 'accepted' })));
    showToast('AI Predictions & production targets verified and confirmed by Chef!');
  };

  // Process User Input First -> then AI Generates Decisions (Manual Override)
  const handleSubmitTodayInput = (input: TodayUserInput) => {
    setTodayUserInput(input);
    setHasGivenTodayInput(true);
    setVerificationStatus('modified');

    const newExpected = Math.max(40, input.expectedCustomers);
    const ratio = newExpected / 180;
    const recommendedRiceKg = Math.max(5, Math.round(newExpected * 0.135 - input.riceLeftoverKg * 0.6));
    const riceAvoided = Math.round((input.riceLeftoverKg * 0.5 + 0.8) * 10) / 10;

    setKpis((prev) => ({
      ...prev,
      customersExpected: newExpected,
      potentialWasteAvoidedKg: Math.round(4.2 * ratio * 10) / 10,
      potentialCostSaving: Math.round(1240 * ratio),
    }));

    // Update today's action cards dynamically based on user input
    setTodayActions([
      {
        id: 'act-1',
        item: 'RICE',
        emoji: '🍚',
        actionHeading: `PREPARE ${recommendedRiceKg - 1}–${recommendedRiceKg} KG RICE`,
        subheading: `Calibrated from your custom input: ${newExpected} customers & ${input.riceLeftoverKg} kg yesterday’s surplus`,
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
          `Your input: ${input.paneerStockKg} kg dairy stock on hand`,
          'Batch #PN-301 shelf life expires in 28 hours',
          'High cost ingredient (₹320/kg) with highest monetary risk',
          'Chef special recipe repurposing eliminates 100% of dump loss',
        ],
        potentialWasteAvoidedKg: 6.0,
        costSaved: 1920,
        confidencePct: 95,
        risksIfIgnored: 'Full 6.0 kg batch spoiled by tomorrow morning.',
        alternatives: 'Portion and freeze at -18°C before 2:00 PM cutoff.',
        status: 'pending',
      },
    ]);

    // Update production plans
    setProductionPlans((prev) =>
      prev.map((p) => {
        if (p.item.toLowerCase().includes('rice')) {
          return {
            ...p,
            recommendedProductionKg: recommendedRiceKg,
            demandKg: Math.round(newExpected * 0.135 * 10) / 10,
            usableStockKg: input.riceLeftoverKg,
            explanation: `Calibrated for ${newExpected} people factoring in ${input.riceLeftoverKg} kg yesterday surplus.`,
          };
        }
        const adjDemand = Math.round(p.demandKg * ratio * 10) / 10;
        return {
          ...p,
          demandKg: adjDemand,
          recommendedProductionKg: Math.max(1, Math.round(adjDemand - p.usableStockKg)),
          explanation: `Calibrated for ${newExpected} people based on morning inputs.`,
        };
      })
    );

    showToast(`Recalibrated custom kitchen plan for ${newExpected} customers.`);
  };

  const handleFinishLogin = () => {
    updateSession({ isLoggedIn: true, step: 'dashboard' });
    showToast('Signed in to FoodWise AI Management Suite.');
  };

  // FULL RESET HANDLER (Requirements: clear state, localStorage.clear, sessionStorage.clear, return to Step 1 language selection)
  const handleResetDemo = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}

    setSession({
      isLoggedIn: false,
      mobile: '',
      language: 'en',
      orgType: 'cafeteria',
      orgName: 'Green Valley College Cafeteria',
      step: 'language', // Returns to initial "Step 1: Choose your language" onboarding screen
      setupInfo: {
        usualPeopleCount: 185,
        mealsServed: ['Breakfast', 'Lunch', 'Dinner'],
        location: 'Bengaluru, India',
        localContext: 'Rain expected this evening',
      },
    });

    const resetSeed = getDefaultDemoData('cafeteria');
    setKpis(resetSeed.kpis);
    setTodayActions(resetSeed.todayActions);
    setForecastDays(resetSeed.forecastDays);
    setProductionPlans(resetSeed.productionPlans);
    setInventory(resetSeed.inventory);
    setRescuePlans(resetSeed.rescuePlans);
    setSmartMenus(resetSeed.smartMenus);
    setDecisionReplays(resetSeed.decisionReplays);
    setDamagedStock(resetSeed.damagedStock);
    setWeatherInfo(resetSeed.weatherInfo);

    setHasGivenTodayInput(false);
    setVerificationStatus('awaiting');
    setActiveTab('operations');
    setIsChangedModalOpen(false);
    setIsDamagedModalOpen(false);
    setIsChatbotOpen(false);
    setMobileMenuOpen(false);

    showToast('Session reset. Returned to Step 1: Language Selection.');
  };

  // Action card handlers
  const handleAcceptTodayAction = (id: string) => {
    setTodayActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'accepted' } : a))
    );
    showToast('Directive confirmed & recorded.');
  };

  const handleRejectTodayAction = (id: string, reason: string = 'Chef decision') => {
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
        humanDecided: 'Dismissed by Chef',
        actualOutcome: 'Awaiting shift audit',
        difference: 'Override',
        reason,
        evaluationNote: 'Logged in accuracy evaluation model.',
      };
      setDecisionReplays((prev) => [newRecord, ...prev]);
    }
    showToast('Directive dismissed. Added to Decision Replay model.');
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
        difference: 'Custom Target',
        reason: 'Manager adjusted batch based on local knowledge',
        evaluationNote: 'System will compare this custom batch against tonight’s leftovers.',
      };
      setDecisionReplays((prev) => [newRecord, ...prev]);
    }
    showToast(`Saved custom target: ${customVal}`);
  };

  // Production batch handlers
  const handleAcceptProductionPlan = (id: string) => {
    setProductionPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'accepted' } : p))
    );
    showToast('Production batch approved.');
  };

  const handleChangeProductionPlan = (id: string, newKg: number) => {
    setProductionPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, humanKg: newKg, status: 'changed' } : p))
    );
    showToast(`Batch target updated to ${newKg} kg.`);
  };

  const handleApproveAllProductionPlans = () => {
    setProductionPlans((prev) => prev.map((p) => ({ ...p, status: 'accepted' })));
    showToast('All production batches approved for prep.');
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

  // Chef Specials Handlers
  const handleApproveMenu = (id: string) => {
    setSmartMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'approved' } : m))
    );
    showToast('Approved as today’s featured special on menu board!');
  };

  const handleRejectMenu = (id: string) => {
    setSmartMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'rejected' } : m))
    );
    showToast('Special recipe dismissed.');
  };

  // Something Changed dynamic recalculation
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

    showToast(`Operational plan recalculated for: ${reasonText}!`);
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

    showToast(`Recorded ${qtyKg} kg damaged ${ingredient}. Stock updated.`);
  };

  // If not logged in or in onboarding step, render Login Flow
  if (!session.isLoggedIn || session.step !== 'dashboard') {
    return (
      <LoginFlow
        session={session}
        onUpdateSession={updateSession}
        onFinishLogin={handleFinishLogin}
      />
    );
  }

  const foodAtRiskCount = inventory.filter((i) => i.riskLevel === 'HIGH' || i.riskLevel === 'CRITICAL').length;
  const pendingRescueCount = rescuePlans.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* MINIMAL TOP BAR (Following Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark & Location */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('operations')}
              className="flex items-center gap-2 text-left"
            >
              <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                FW
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-slate-900">
                  FOODWISE AI
                </span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className="hidden sm:inline text-xs text-slate-500 font-medium truncate max-w-xs">
                  {session.orgName || 'Green Valley Cafeteria'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Weather & Verification Telemetry */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{session.setupInfo?.location || 'Bengaluru, India'}</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">{weatherInfo.condition}</span>
          </div>

          {/* Zone 3: Reset, Language Toggle & User Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Segmented Toggle */}
            <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-xs font-semibold border border-slate-200/80">
              {(['en', 'hi', 'te'] as Language[]).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => updateSession({ language: lng })}
                  className={`px-2 py-0.5 rounded text-[11px] uppercase transition-colors ${
                    session.language === lng
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left leading-tight">
                <div className="font-semibold text-slate-800 text-[11px]">Head Chef</div>
                <div className="text-[10px] text-slate-600 font-medium">Ops Lead</div>
              </div>
            </div>

            {/* Full Reset / Reload Button */}
            <button
              type="button"
              onClick={handleResetDemo}
              title="Reset Application (Returns to Step 1)"
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'operations' as NavigationTab, label: 'Operations' },
                { id: 'inventory' as NavigationTab, label: 'Inventory & FEFO' },
                { id: 'rescue' as NavigationTab, label: 'Rescue & Specials' },
                { id: 'reports' as NavigationTab, label: 'Reports & Analytics' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded text-xs font-semibold text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MAIN LAYOUT: LEFT SIDEBAR + WORKSPACE */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Streamlined 4-Tab Desktop Sidebar */}
        <SidebarNav
          session={session}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          foodAtRiskCount={foodAtRiskCount}
          pendingRescueCount={pendingRescueCount}
        />

        {/* Workspace Viewport with pb-24 layout protection for floating copilot */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 pb-24 sm:pb-28 space-y-6 overflow-y-auto">
          {/* TAB 1: OPERATIONS (Predictive Weather + Verification Gate + Batching) */}
          {(activeTab === 'operations' || activeTab === 'today' || activeTab === 'production') && (
            <OperationsSection
              language={session.language}
              kpis={kpis}
              actions={todayActions}
              onAcceptAction={handleAcceptTodayAction}
              onRejectAction={handleRejectTodayAction}
              onChangeAction={handleChangeTodayAction}
              hasGivenTodayInput={hasGivenTodayInput}
              todayUserInput={todayUserInput}
              onSubmitTodayInput={handleSubmitTodayInput}
              productionPlans={productionPlans}
              onAcceptProductionPlan={handleAcceptProductionPlan}
              onChangeProductionPlan={handleChangeProductionPlan}
              onApproveAllProductionPlans={handleApproveAllProductionPlans}
              onOpenSomethingChanged={() => setIsChangedModalOpen(true)}
              weatherCondition={weatherInfo.condition}
              verificationStatus={verificationStatus}
              onVerifyAiPredictions={handleVerifyAiPredictions}
            />
          )}

          {/* TAB 2: INVENTORY & FEFO */}
          {activeTab === 'inventory' && (
            <InventorySection
              language={session.language}
              inventory={inventory}
              onOpenDamagedModal={() => setIsDamagedModalOpen(true)}
              onJumpToRescue={() => setActiveTab('rescue')}
            />
          )}

          {/* TAB 3: RESCUE & SPECIALS (Surplus Action Tree + Integrated Chef Specials) */}
          {activeTab === 'rescue' && (
            <RescuePlanSection
              language={session.language}
              rescuePlans={rescuePlans}
              smartMenus={smartMenus}
              onExecuteRescueAction={handleExecuteRescueAction}
              onApproveMenu={handleApproveMenu}
              onRejectMenu={handleRejectMenu}
            />
          )}

          {/* TAB 4: REPORTS & ANALYTICS (Includes Integrated Decision Replay Accuracy) */}
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
                bestImprovement: 'Curd Rice & Sizing (+38% precision)',
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
                {
                  id: 'rc-3',
                  item: 'Paneer Dairy',
                  wastedAmount: '0.8 kg',
                  wasteCost: '₹256',
                  mainCause: 'Stored near bottom shelf without secondary temperature sensor',
                  suggestedCorrection: 'Follow FEFO shelf placement guidelines in walk-in cooler',
                },
              ]}
              decisionReplays={decisionReplays}
            />
          )}
        </main>
      </div>

      {/* AI KITCHEN ASSISTANT CHATBOT OVERLAY */}
      <AiChatbot
        language={session.language}
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        todayUserInput={todayUserInput}
        kpis={kpis}
        inventory={inventory}
        productionPlans={productionPlans}
        weatherCondition={weatherInfo.condition}
      />

      {/* Contextual Modals */}
      <SomethingChangedModal
        language={session.language}
        isOpen={isChangedModalOpen}
        onClose={() => setIsChangedModalOpen(false)}
        onApplyChange={handleSomethingChanged}
      />

      <DamagedStockModal
        language={session.language}
        isOpen={isDamagedModalOpen}
        onClose={() => setIsDamagedModalOpen(false)}
        onRecordDamaged={handleRecordDamaged}
      />
    </div>
  );
}
