import React from 'react';
import { InventoryItem, Language } from '../types';
import { translations } from '../translations';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  LifeBuoy,
} from 'lucide-react';

interface WasteRiskSectionProps {
  language: Language;
  inventory: InventoryItem[];
  onJumpToRescue: () => void;
}

export const WasteRiskSection: React.FC<WasteRiskSectionProps> = ({
  language,
  inventory,
  onJumpToRescue,
}) => {
  const t = translations[language];

  const atRiskItems = inventory.filter(
    (item) => item.riskLevel === 'CRITICAL' || item.riskLevel === 'HIGH' || item.riskLevel === 'MEDIUM'
  );

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                WASTE RISK ENGINE
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              Surplus is calculated by subtracting projected daily consumption from remaining shelf life.
            </p>
          </div>

          <button
            type="button"
            onClick={onJumpToRescue}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Open Rescue Plan →</span>
          </button>
        </div>

        {/* Risk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {atRiskItems.map((item) => {
            const isCritical = item.riskLevel === 'CRITICAL';
            const isHigh = item.riskLevel === 'HIGH';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isCritical
                    ? 'border-red-300 bg-red-50/20'
                    : isHigh
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-white rounded-2xl border border-neutral-200">
                      {item.emoji}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-neutral-900">
                        {item.name}
                      </h3>
                      <span className="text-xs text-neutral-500 font-medium">
                        Batch: {item.batchNumber}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                      isCritical
                        ? 'bg-red-600 text-white'
                        : isHigh
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.riskLevel} RISK
                  </span>
                </div>

                {/* Math breakdown */}
                <div className="p-3.5 bg-white/90 rounded-2xl border border-neutral-200/80 mb-3 text-xs space-y-1.5">
                  <div className="font-bold text-neutral-800">
                    Why {item.riskLevel}?
                  </div>
                  <ul className="space-y-1 text-neutral-600 text-[11px]">
                    <li>• Current Stock: <strong>{item.currentStock} {item.unit}</strong></li>
                    <li>• Shelf Life Remaining: <strong>{item.daysRemaining} days</strong></li>
                    <li>• Expected Consumption Rate: <strong>{item.expectedDailyUsage} {item.unit}/day</strong></li>
                    <li className="text-red-700 font-bold">
                      • Projected Surplus: <strong>+{item.expectedSurplus} {item.unit}</strong> will expire unless rescued
                    </li>
                  </ul>
                </div>

                {/* Action Recommendation */}
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-xs text-orange-950 font-semibold mb-3">
                  <span className="font-black text-orange-900 block text-[10px] uppercase tracking-wide">
                    Suggested Action:
                  </span>
                  “{item.suggestedAction}”
                </div>

                <button
                  type="button"
                  onClick={onJumpToRescue}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Activate Rescue Action
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
