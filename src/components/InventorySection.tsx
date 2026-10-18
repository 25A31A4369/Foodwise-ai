import React, { useState } from 'react';
import { InventoryItem, Language, RiskLevel } from '../types';
import { translations } from '../translations';
import {
  Package,
  Search,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Clock,
  Boxes,
  IndianRupee,
} from 'lucide-react';

interface InventorySectionProps {
  language: Language;
  inventory: InventoryItem[];
  onOpenDamagedModal: () => void;
  onJumpToRescue?: () => void;
}

export const InventorySection: React.FC<InventorySectionProps> = ({
  language,
  inventory,
  onOpenDamagedModal,
  onJumpToRescue,
}) => {
  const t = translations[language];
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Computations for KPI cards
  const totalBatches = inventory.length;
  const totalWeightKg = inventory.reduce((sum, item) => sum + item.currentStock, 0);
  const expiringSoonItems = inventory.filter((item) => item.daysRemaining <= 2 || item.riskLevel === 'CRITICAL' || item.riskLevel === 'HIGH');
  const expiringSoonBatchesCount = expiringSoonItems.length;
  const expiringSoonKg = expiringSoonItems.reduce((sum, item) => sum + item.currentStock, 0);
  const totalInventoryValue = inventory.reduce(
    (sum, item) => sum + item.currentStock * (item.costPerUnit || 40),
    0
  );

  const filtered = inventory.filter((item) => {
    let matchesFilter = true;
    if (filterMode === 'EXPIRING_SOON') {
      matchesFilter = item.daysRemaining <= 2 || item.riskLevel === 'CRITICAL' || item.riskLevel === 'HIGH';
    } else if (filterMode === 'CRITICAL') {
      matchesFilter = item.riskLevel === 'CRITICAL';
    } else if (filterMode === 'HIGH') {
      matchesFilter = item.riskLevel === 'HIGH';
    } else if (filterMode === 'MEDIUM_LOW') {
      matchesFilter = item.riskLevel === 'MEDIUM' || item.riskLevel === 'LOW';
    }

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t.nav.inventory || 'Inventory & FEFO Lifecycle'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            First-Expired, First-Out batch tracking, expiry risk classification, and spoilage prevention.
          </p>
        </div>

        {/* Operational Toolbar Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onJumpToRescue && (
            <button
              type="button"
              onClick={onJumpToRescue}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
            >
              <span>View Rescue Plans</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDamagedModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Damaged Stock</span>
          </button>
        </div>
      </div>

      {/* 3 CLEAN INTERACTIVE FEFO KPI CARDS (Replaces non-interactive pipeline banner) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* KPI 1: Total Batches */}
        <button
          type="button"
          onClick={() => setFilterMode('ALL')}
          className={`p-4 bg-white rounded-lg border text-left transition-all ${
            filterMode === 'ALL'
              ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              Total Batches
            </span>
            <Boxes className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalBatches}
            <span className="text-xs font-normal text-slate-600 ml-1.5">batches</span>
          </div>
          <div className="text-[11px] text-slate-600 mt-1 font-medium">
            {totalWeightKg.toFixed(1)} kg total active inventory
          </div>
        </button>

        {/* KPI 2: Expiring < 48 Hours */}
        <button
          type="button"
          onClick={() => setFilterMode('EXPIRING_SOON')}
          className={`p-4 bg-white rounded-lg border text-left transition-all ${
            filterMode === 'EXPIRING_SOON'
              ? 'border-amber-500 ring-1 ring-amber-500 bg-amber-50/30'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Expiring &lt; 48h
            </span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {expiringSoonBatchesCount}
            <span className="text-xs font-normal text-amber-800 ml-1.5">at risk</span>
          </div>
          <div className="text-[11px] text-amber-900 mt-1 font-medium">
            {expiringSoonKg.toFixed(1)} kg requiring priority FEFO use
          </div>
        </button>

        {/* KPI 3: Total Capital Inventory Value */}
        <div className="p-4 bg-white rounded-lg border border-slate-200 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
              Total Stock Value
            </span>
            <IndianRupee className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ₹{totalInventoryValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-600 mt-1 font-medium">
            Managed commercial raw materials
          </div>
        </div>
      </div>

      {/* Structured FEFO Data Table Section */}
      <section className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        {/* Table Filters & Search Bar */}
        <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredient or batch #..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 placeholder:text-slate-500"
            />
          </div>

          {/* Functional Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-md text-xs self-start sm:self-auto flex-wrap">
            {[
              { id: 'ALL', label: 'All Batches' },
              { id: 'EXPIRING_SOON', label: 'Expiring <48h' },
              { id: 'CRITICAL', label: 'Critical' },
              { id: 'HIGH', label: 'High Risk' },
              { id: 'MEDIUM_LOW', label: 'Stable (Med/Low)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterMode(f.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                  filterMode === f.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table with High WCAG Contrast */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3.5">Ingredient</th>
                <th className="py-2.5 px-3 font-mono">Batch #</th>
                <th className="py-2.5 px-3">Stock on Hand</th>
                <th className="py-2.5 px-3">Expiry Timeline</th>
                <th className="py-2.5 px-3">Daily Burn Rate</th>
                <th className="py-2.5 px-3">Projected Surplus</th>
                <th className="py-2.5 px-3">Risk Status</th>
                <th className="py-2.5 px-3.5">FEFO Suggested Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-600">
                    No batches match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isCritical = item.riskLevel === 'CRITICAL';
                  const isHigh = item.riskLevel === 'HIGH';
                  const isMedium = item.riskLevel === 'MEDIUM';

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isCritical
                          ? 'bg-rose-50/30 hover:bg-rose-50/50'
                          : isHigh
                          ? 'bg-amber-50/20 hover:bg-amber-50/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Ingredient */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.emoji}</span>
                          <div>
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[10px] text-slate-600 font-medium">
                              Stage: {item.lifecycleStage || 'Available'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Batch # */}
                      <td className="py-3 px-3 font-mono font-semibold text-slate-800 text-[11px]">
                        {item.batchNumber}
                      </td>

                      {/* Stock on Hand */}
                      <td className="py-3 px-3 font-mono tabular-nums font-bold text-slate-900">
                        {item.currentStock} {item.unit}
                      </td>

                      {/* Expiry Timeline */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <Clock
                            className={`w-3.5 h-3.5 ${
                              isCritical
                                ? 'text-rose-600'
                                : isHigh
                                ? 'text-amber-600'
                                : 'text-slate-600'
                            }`}
                          />
                          <span
                            className={`font-semibold font-mono tabular-nums ${
                              isCritical
                                ? 'text-rose-700 font-bold'
                                : isHigh
                                ? 'text-amber-800 font-bold'
                                : 'text-slate-700'
                            }`}
                          >
                            {item.daysRemaining} {item.daysRemaining === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-600 block mt-0.5 font-medium">
                          Exp: {item.expiryDate}
                        </span>
                      </td>

                      {/* Daily Burn Rate */}
                      <td className="py-3 px-3 font-mono tabular-nums font-medium text-slate-700">
                        {item.expectedDailyUsage} {item.unit}/day
                      </td>

                      {/* Projected Surplus */}
                      <td className="py-3 px-3 font-mono tabular-nums font-bold">
                        {item.expectedSurplus > 0 ? (
                          <span className="text-amber-700">
                            +{item.expectedSurplus} {item.unit}
                          </span>
                        ) : (
                          <span className="text-emerald-700">Balanced (0 kg)</span>
                        )}
                      </td>

                      {/* Risk Status */}
                      <td className="py-3 px-3">
                        {isCritical ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded uppercase">
                            Critical (&lt;24h)
                          </span>
                        ) : isHigh ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded uppercase">
                            High Risk (&lt;48h)
                          </span>
                        ) : isMedium ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 rounded uppercase">
                            Medium Risk
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded uppercase">
                            Low / Safe
                          </span>
                        )}
                      </td>

                      {/* FEFO Suggested Action */}
                      <td className="py-3 px-3.5 text-slate-700 text-[11px] leading-snug max-w-xs font-medium">
                        {item.suggestedAction}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
