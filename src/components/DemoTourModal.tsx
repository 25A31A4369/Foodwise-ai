import React, { useState } from 'react';
import { NavigationTab } from '../types';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  LifeBuoy,
  FlaskConical,
  ChefHat,
  RotateCcw,
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab: (tab: NavigationTab) => void;
  onTriggerQuickEvent: (eventStr: string) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToTab,
  onTriggerQuickEvent,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: 'Step 1: Dashboard at 6:00 AM',
      subtitle: 'Instant clarity on today’s kitchen risk',
      content:
        'The dashboard answers immediately: “What should I do today?” Notice the 4 top cards: 185 Customers Expected, 6.8 KG Food at Risk, 4.2 KG Potential Waste Avoided, and ₹1,240 saved.',
      targetTab: 'today' as NavigationTab,
      actionText: 'View Today’s Dashboard',
    },
    {
      title: 'Step 2: Transparent Action Recommendations',
      subtitle: 'Clear culinary instructions, not confusing percentages',
      content:
        'AI translates complex demand data into simple kitchen actions: “PREPARE 23–24 KG RICE”, “DON’T BUY MORE TOMATOES”, and “USE PANEER TODAY”. Every recommendation has Why, Confidence, and Alternatives.',
      targetTab: 'today' as NavigationTab,
      actionText: 'Inspect Recommendations',
    },
    {
      title: 'Step 3: Real-Time Recalculation ("Something Changed?")',
      subtitle: 'Adapt within seconds when rain or events occur',
      content:
        'Click below to simulate “Rain expected this evening”. Watch the customer forecast and production batch automatically scale down by ~6% with updated kitchen explanations.',
      targetTab: 'forecast' as NavigationTab,
      actionText: 'Simulate "Rain Expected"',
      trigger: 'Rain expected this evening',
    },
    {
      title: 'Step 4: Human-in-the-Loop & Decision Replay',
      subtitle: 'AI collaborates; the chef has the final say',
      content:
        'FoodWise never overrides human judgment. When the manager rejects or modifies an AI quantity, the system saves the reason into learning memory and displays it in Decision Replay.',
      targetTab: 'replay' as NavigationTab,
      actionText: 'Open Decision Replay',
    },
    {
      title: 'Step 5: Waste Rescue Mode (Unique Feature 2)',
      subtitle: 'Never classify food as waste prematurely',
      content:
        'Instead of an alert that says “throw this away”, Waste Rescue Mode evaluates 6 tiers in strict order: USE → ALLOCATE → PROMOTE → REDESIGN → REDISTRIBUTE → DISCARD.',
      targetTab: 'rescue' as NavigationTab,
      actionText: 'Open Waste Rescue Plan',
    },
    {
      title: 'Step 6: AI Experiment Lab (Unique Feature 1)',
      subtitle: 'Continuous learning through safe kitchen tests',
      content:
        'When demand is uncertain (e.g. ±8%), FoodWise suggests a 3-day test: “Reduce rice production by 8% for 3 days.” After the test, it records 44% waste reduction without stockouts and updates future baseline recommendations.',
      targetTab: 'experiments' as NavigationTab,
      actionText: 'Open Experiment Lab',
    },
    {
      title: 'Step 7: Smart Menu Redesign',
      subtitle: 'Chef-approved surplus recipes',
      content:
        'Absorb at-risk ingredients with temporary daily specials (e.g., Tomato Rasam & Soup Bowl absorbing 5 kg tomatoes). The chef reviews and approves before anything reaches the daily board.',
      targetTab: 'menu' as NavigationTab,
      actionText: 'Open Smart Menu',
    },
  ];

  const current = demoSteps[currentStep];

  const handleStepAction = () => {
    onJumpToTab(current.targetTab);
    if (current.trigger) {
      onTriggerQuickEvent(current.trigger);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-neutral-200 shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-100 text-orange-700 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-black text-sm text-neutral-900 uppercase tracking-wide">
                3-Minute Evaluator Guide
              </h3>
              <span className="text-[11px] text-neutral-400 font-semibold">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step details */}
        <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 mb-6 flex-1">
          <h4 className="font-extrabold text-base text-neutral-900 mb-0.5">
            {current.title}
          </h4>
          <span className="text-xs font-bold text-orange-700 block mb-3">
            {current.subtitle}
          </span>
          <p className="text-xs text-neutral-700 leading-relaxed font-medium">
            {current.content}
          </p>

          <button
            type="button"
            onClick={handleStepAction}
            className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <span>{current.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <div className="flex gap-1">
            {demoSteps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentStep ? 'bg-orange-600' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {currentStep < demoSteps.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                onJumpToTab(demoSteps[nextStep].targetTab);
              }}
              className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white font-bold flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
            >
              Finish Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
