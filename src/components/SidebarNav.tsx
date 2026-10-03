import React from 'react';
import { Language, NavigationTab, UserSession } from '../types';
import { translations } from '../translations';
import {
  Home,
  BarChart2,
  UtensilsCrossed,
  Package,
  AlertTriangle,
  LifeBuoy,
  FlaskConical,
  ChefHat,
  RotateCcw,
  FileText,
  Settings,
  ShieldCheck,
  Building2,
  Sparkles,
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

  const navItems: { id: NavigationTab; label: string; icon: any; badge?: string }[] = [
    { id: 'today', label: t.nav.today, icon: Home },
    { id: 'forecast', label: t.nav.forecast, icon: BarChart2 },
    { id: 'production', label: t.nav.production, icon: UtensilsCrossed },
    { id: 'inventory', label: t.nav.inventory, icon: Package },
    { id: 'wasterisk', label: t.nav.wasteRisk, icon: AlertTriangle, badge: `${foodAtRiskCount} items` },
    { id: 'rescue', label: t.nav.rescuePlan, icon: LifeBuoy, badge: `${pendingRescueCount} at risk` },
    { id: 'feedback', label: t.nav.feedback, icon: RotateCcw },
    { id: 'experiments', label: t.nav.experiments, icon: FlaskConical },
    { id: 'menu', label: t.nav.menu, icon: ChefHat },
    { id: 'replay', label: t.nav.replay, icon: RotateCcw },
    { id: 'reports', label: t.nav.reports, icon: FileText },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-orange-100/90 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      {/* Upper Navigation Links */}
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 mb-2">
          <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            Decision System
          </div>
          <div className="text-xs font-bold text-orange-950 truncate">
            {session.setupInfo?.location || 'Bengaluru, India'}
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                    : 'text-neutral-700 hover:bg-orange-50/70 hover:text-orange-950'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'rescue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
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

      {/* Bottom Offline Status & Trust Card */}
      <div className="p-4 border-t border-neutral-100 space-y-2">
        <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-[11px] text-neutral-600">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Offline Local Engine</span>
          </div>
          <p className="leading-snug text-neutral-500">
            No cloud API needed. All forecasts, safety checks & learning run locally.
          </p>
        </div>
      </div>
    </aside>
  );
};
