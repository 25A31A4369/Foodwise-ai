import React from 'react';
import { NavigationTab, UserSession } from '../types';
import { translations } from '../translations';
import {
  LayoutDashboard,
  Package,
  LifeBuoy,
  BarChart3,
  Building2,
  ShieldCheck,
} from 'lucide-react';

interface SidebarNavProps {
  session: UserSession;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  foodAtRiskCount: number;
  pendingRescueCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  session,
  activeTab,
  onSelectTab,
  foodAtRiskCount,
  pendingRescueCount,
}) => {
  const t = translations[session.language];

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeVariant?: 'warning' | 'alert';
  }[] = [
    {
      id: 'operations',
      label: t.nav.operations || 'Operations',
      icon: LayoutDashboard,
    },
    {
      id: 'inventory',
      label: t.nav.inventory,
      icon: Package,
      badge: foodAtRiskCount > 0 ? foodAtRiskCount : undefined,
      badgeVariant: 'warning',
    },
    {
      id: 'rescue',
      label: t.nav.rescueSpecials || t.nav.rescuePlan,
      icon: LifeBuoy,
      badge: pendingRescueCount > 0 ? pendingRescueCount : undefined,
      badgeVariant: 'alert',
    },
    {
      id: 'reports',
      label: t.nav.reports,
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-3.5rem)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-4">
        {/* Unit Identity */}
        <div className="px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
          <div className="flex items-center gap-2 mb-0.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Facility Unit
            </span>
          </div>
          <div className="text-xs font-bold text-slate-900 truncate">
            {session.orgName || 'Central Kitchen'}
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">
            {session.setupInfo?.location || 'Bengaluru, India'}
          </div>
        </div>

        {/* Primary Navigation */}
        <div>
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Map 'today' or 'production' alias to 'operations'
              const isSelected =
                activeTab === item.id ||
                (item.id === 'operations' && (activeTab === 'today' || activeTab === 'production'));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900 font-semibold border-l-2 border-orange-600 pl-2.5'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-orange-600' : 'text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono tabular-nums shrink-0 ${
                        item.badgeVariant === 'alert'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Enterprise System Indicator */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold text-slate-800 text-[11px] truncate">
              Local Decision Engine
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              FEFO & Batch Logic Active
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
