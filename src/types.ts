export type Language = 'en' | 'hi' | 'te';

export type OrganizationType =
  | 'cafeteria'
  | 'hostel'
  | 'supermarket'
  | 'restaurant'
  | 'hotel'
  | 'other';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type LifecycleStage =
  | 'purchased'
  | 'received'
  | 'stored'
  | 'available'
  | 'allocated'
  | 'prepared'
  | 'served'
  | 'leftover'
  | 'rescued_or_discarded';

export type NavigationTab =
  | 'today'
  | 'forecast'
  | 'production'
  | 'inventory'
  | 'wasterisk'
  | 'rescue'
  | 'feedback'
  | 'experiments'
  | 'menu'
  | 'replay'
  | 'reports'
  | 'settings';

export interface UserSession {
  isLoggedIn: boolean;
  mobile: string;
  language: Language;
  orgType: OrganizationType;
  orgName: string;
  step: 'language' | 'mobile' | 'otp' | 'org' | 'first_setup' | 'dashboard';
  setupInfo: {
    usualPeopleCount: number;
    mealsServed: string[];
    location: string;
    localContext: string;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  currentStock: number;
  unit: string;
  batchNumber: string;
  purchaseDate: string;
  expiryDate: string;
  daysRemaining: number;
  expectedDailyUsage: number;
  expectedSurplus: number;
  riskLevel: RiskLevel;
  lifecycleStage: LifecycleStage;
  suggestedAction: string;
  costPerUnit: number;
}

export interface TodayUserInput {
  expectedCustomers: number;
  riceStockKg: number;
  riceLeftoverKg: number;
  tomatoesStockKg: number;
  paneerStockKg: number;
  localCondition: string;
  isRainExpected: boolean;
}

export interface TodayActionCard {
  id: string;
  item: string;
  emoji: string;
  actionHeading: string; // e.g. "PREPARE 23–24 KG RICE", "DON'T BUY MORE", "USE TODAY"
  subheading: string;
  reasons: string[];
  potentialWasteAvoidedKg: number;
  costSaved: number;
  confidencePct: number;
  risksIfIgnored: string;
  alternatives: string;
  status: 'pending' | 'accepted' | 'changed' | 'rejected';
  userNotes?: string;
  customValue?: string;
}

export interface ForecastDay {
  dayName: string;
  dateStr: string;
  expectedCustomers: number;
  expectedMeals: number;
  keyIngredientDemand: { item: string; amountKg: number }[];
  isToday?: boolean;
}

export interface ProductionPlanItem {
  id: string;
  item: string;
  emoji: string;
  demandKg: number;
  usableStockKg: number;
  recommendedProductionKg: number;
  unit: string;
  explanation: string;
  status: 'pending' | 'accepted' | 'changed';
  humanKg?: number;
}

export interface RescueTierOption {
  tierNumber: number;
  tierName: 'USE' | 'ALLOCATE' | 'PROMOTE' | 'REDESIGN' | 'REDISTRIBUTE' | 'DISCARD';
  title: string;
  description: string;
  isFeasible: boolean;
  impactScore: string;
  safetyStatus: string;
  actionLabel: string;
}

export interface RescuePlanItem {
  id: string;
  ingredient: string;
  emoji: string;
  quantityAtRiskKg: number;
  expiryHours: number;
  currentRisk: RiskLevel;
  primarySuggestedTier: 'USE' | 'ALLOCATE' | 'PROMOTE' | 'REDESIGN' | 'REDISTRIBUTE' | 'DISCARD';
  tiers: RescueTierOption[];
  status: 'pending' | 'rescued' | 'modified';
  selectedAction?: string;
}

export interface SmartMenuItem {
  id: string;
  dishName: string;
  emoji: string;
  atRiskIngredient: string;
  ingredientUsageKg: number;
  expectedPortions: number;
  expectedWasteReductionKg: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
}

export interface ExperimentItem {
  id: string;
  title: string;
  emoji: string;
  uncertaintyContext: string;
  proposal: string;
  hypothesis: string;
  duration: string;
  controlGroup: string;
  testGroup: string;
  metrics: string[];
  status: 'suggested' | 'running' | 'completed';
  learnedTakeaway?: string;
  wasteReductionRecorded?: string;
}

export interface DecisionReplayRecord {
  id: string;
  date: string;
  item: string;
  aiPredicted: string;
  humanDecided: string;
  actualOutcome: string;
  difference: string;
  reason: string;
  evaluationNote: string;
}

export interface LeftoverFeedbackRecord {
  date: string;
  items: {
    name: string;
    emoji: string;
    predictedKg: number;
    actualKg: number;
    reason: string;
  }[];
  learnedRule: string;
  nextForecastImpact: string;
}

export interface DamagedStockRecord {
  id: string;
  ingredient: string;
  quantityKg: number;
  reason: 'Spoiled' | 'Damaged packaging' | 'Temperature issue' | 'Expired' | 'Other';
  dateReported: string;
  recalculatedImpact: string;
}

export interface AppKPIs {
  customersExpected: number;
  foodAtRiskKg: number;
  potentialWasteAvoidedKg: number;
  potentialCostSaving: number;
}
