import React, { useState } from 'react';
import { Language, OrganizationType, UserSession } from '../types';
import { translations } from '../translations';
import {
  Settings,
  RotateCcw,
  Globe,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SettingsSectionProps {
  session: UserSession;
  onUpdateSession: (partial: Partial<UserSession>) => void;
  onResetDemo: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  session,
  onUpdateSession,
  onResetDemo,
}) => {
  const t = translations[session.language];
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [location, setLocation] = useState(session.setupInfo?.location || 'Bengaluru, India');
  const [people, setPeople] = useState(session.setupInfo?.usualPeopleCount?.toString() || '185');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSession({
      setupInfo: {
        ...session.setupInfo,
        location: location.trim(),
        usualPeopleCount: parseInt(people, 10) || 185,
      },
    });
    alert('Kitchen profile settings saved.');
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
            <h2 className="text-lg font-black tracking-tight text-neutral-900 uppercase">
              {t.settingsSection.title}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-normal">
            {t.settingsSection.subtitle}
          </p>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSaveSettings} className="space-y-5 max-w-xl mb-8">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
              {t.settingsSection.locationLabel}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-orange-600 absolute left-3.5 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs font-bold focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
              {t.settingsSection.peopleServedLabel}
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-orange-600 absolute left-3.5 top-3" />
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-2xl text-xs font-bold tabular-nums focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Save Kitchen Settings
          </button>
        </form>

        {/* Reset Demo Section (Section 29 in prompt) */}
        <div className="p-5 rounded-3xl bg-red-50/50 border border-red-200">
          <div className="flex items-center gap-2.5 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-sm text-red-950">
              {t.settingsSection.resetTitle}
            </h3>
          </div>
          <p className="text-xs text-neutral-600 mb-4 leading-relaxed max-w-xl">
            {t.settingsSection.resetDesc}
          </p>

          {!showConfirmReset ? (
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                {t.settingsSection.resetConfirm}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold hover:bg-neutral-300"
              >
                {t.settingsSection.cancel}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
