import React, { useState } from 'react';
import { InventoryItem, Language } from '../types';
import { translations } from '../translations';
import {
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';

interface InventorySectionProps {
  language: Language;
  inventory: InventoryItem[];
  onOpenDamagedModal: () => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  language,
  inventory,
  onOpenDamagedModal,
}) => {
  const t = translations[language];
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const lifecycleStages = [
    'PURCHASED',
    'RECEIVED',
    'STORED',
    'AVAILABLE',
    'ALLOCATED',
    'PREPARED',
    'SERVED',
    'LEFTOVER',
    'RESCUED / DISCARDED',
  ];

  const filtered = inventory.filter((item) => {
    if (filterRisk === 'ALL') return true;
    return item.riskLevel === filterRisk;
  });

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
                {t.inventorySection.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              {t.inventorySection.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDamagedModal}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors"
            >
              Report Damaged Stock
            </button>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              {t.inventorySection.fefoBadge}
            </span>
          </div>
        </div>

        {/* 9-Stage Pipeline visual */}
        <div className="p-4 rounded-2xl bg-orange-50/30 border border-orange-100 mb-6 overflow-x-auto">
          <div className="text-[10px] uppercase font-bold text-neutral-400 mb-2">
            Ingredient Lifecycle Pipeline:
          </div>
          <div className="flex items-center gap-1.5 min-w-[760px]">
            {lifecycleStages.map((stg, i) => (
              <React.Fragment key={stg}>
                <div className="flex-1 bg-white border border-neutral-200 rounded-xl p-2 text-center shadow-2xs">
                  <span className="text-[9px] font-bold text-orange-600 block">Step {i + 1}</span>
                  <span className="text-[10px] font-black text-neutral-800">{stg}</span>
                </div>
                {i < lifecycleStages.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-orange-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* FEFO Batch Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-400 uppercase font-bold text-[10px] border-b border-neutral-200">
              <tr>
                <th className="py-2.5 px-3">Ingredient</th>
                <th className="py-2.5 px-3">{t.inventorySection.batchLabel}</th>
                <th className="py-2.5 px-3">Stock on Hand</th>
                <th className="py-2.5 px-3">{t.inventorySection.daysRemainingLabel}</th>
                <th className="py-2.5 px-3">{t.inventorySection.dailyUsageLabel}</th>
                <th className="py-2.5 px-3">{t.inventorySection.surplusLabel}</th>
                <th className="py-2.5 px-3">{t.inventorySection.riskLabel}</th>
                <th className="py-2.5 px-3">Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
              {filtered.map((item) => {
                const isCritical = item.riskLevel === 'CRITICAL';
                const isHigh = item.riskLevel === 'HIGH';
                const isMed = item.riskLevel === 'MEDIUM';

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isCritical
                        ? 'bg-red-50/50 hover:bg-red-50'
                        : isHigh
                        ? 'bg-amber-50/40 hover:bg-amber-50'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2 font-bold text-neutral-900">
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-500">{item.batchNumber}</td>
                    <td className="py-3 px-3 font-bold tabular-nums">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-extrabold ${
                          item.daysRemaining <= 1
                            ? 'text-red-600'
                            : item.daysRemaining <= 2
                            ? 'text-amber-600'
                            : 'text-neutral-700'
                        }`}
                      >
                        {item.daysRemaining} days
                      </span>
                    </td>
                    <td className="py-3 px-3 tabular-nums">
                      {item.expectedDailyUsage} {item.unit}/day
                    </td>
                    <td className="py-3 px-3 tabular-nums font-bold">
                      {item.expectedSurplus > 0 ? (
                        <span className="text-red-700">+{item.expectedSurplus} {item.unit}</span>
                      ) : (
                        <span className="text-emerald-700">0 {item.unit}</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isCritical
                            ? 'bg-red-600 text-white'
                            : isHigh
                            ? 'bg-red-100 text-red-800'
                            : isMed
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-600 text-[11px] leading-snug">
                      {item.suggestedAction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
