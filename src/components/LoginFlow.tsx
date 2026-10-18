import React, { useState } from 'react';
import { Language, OrganizationType, UserSession } from '../types';
import { translations } from '../translations';
import { ArrowRight, Check, ShieldCheck, Building2, Store, Hotel, School, Utensils, Home } from 'lucide-react';

interface LoginFlowProps {
  session: UserSession;
  onUpdateSession: (partial: Partial<UserSession>) => void;
  onFinishLogin: (selectedOrg?: OrganizationType, selectedOrgName?: string) => void;
}

export const LoginFlow: React.FC<LoginFlowProps> = ({
  session,
  onUpdateSession,
  onFinishLogin,
}) => {
  const t = translations[session.language];
  const [mobileInput, setMobileInput] = useState(session.mobile || '');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // Setup form states
  const [peopleCount, setPeopleCount] = useState(
    session.setupInfo?.usualPeopleCount?.toString() || '185'
  );
  const [selectedMeals, setSelectedMeals] = useState<string[]>(
    session.setupInfo?.mealsServed || ['Breakfast', 'Lunch', 'Dinner']
  );
  const [locationInput, setLocationInput] = useState(
    session.setupInfo?.location || 'Bengaluru, India'
  );
  const [localInfoInput, setLocalInfoInput] = useState(
    session.setupInfo?.localContext || 'Rain expected this evening'
  );

  const orgList: { type: OrganizationType; title: string; desc: string; icon: string }[] = [
    { type: 'cafeteria', title: '🍽 Cafeteria', desc: 'College, university, hospital & office dining', icon: '🍽' },
    { type: 'hostel', title: '🏠 Hostel', desc: 'Student or worker hostel boarding mess', icon: '🏠' },
    { type: 'supermarket', title: '🛒 Supermarket', desc: 'Fresh produce, deli, bakery & shelf expiry', icon: '🛒' },
    { type: 'restaurant', title: '🍛 Restaurant', desc: 'Dine-in, takeaway, daily specials & chefs', icon: '🍛' },
    { type: 'hotel', title: '🏨 Hotel', desc: 'Buffets, room service, events & banquets', icon: '🏨' },
    { type: 'other', title: '🏢 Other Food Service', desc: 'Catering, cloud kitchen or community meals', icon: '🏢' },
  ];

  const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const quickLocalTags = [
    'College event',
    'Holiday',
    'Rain',
    'Festival',
    'Exam day',
    'Staff shortage',
    'Supplier delay',
    'Large booking',
  ];

  const handleSelectLanguage = (lang: Language) => {
    onUpdateSession({ language: lang, step: 'mobile' });
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = mobileInput.trim() || '9876543210';
    onUpdateSession({ mobile: clean, step: 'otp' });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '123456') {
      setOtpError('');
      onUpdateSession({ step: 'org' });
    } else {
      setOtpError('Please enter verification OTP: 123456');
    }
  };

  const handleSelectOrg = (orgType: OrganizationType) => {
    const orgNames: Record<OrganizationType, string> = {
      restaurant: 'The Spice Route Restaurant',
      cafeteria: 'Green Valley College Cafeteria',
      hostel: 'Sunrise Student Hostel Mess',
      supermarket: 'DailyFresh Supermarket & Deli',
      hotel: 'Grand Heritage Hotel & Banquets',
      other: 'City Central Food Service',
    };
    const orgName = orgNames[orgType] || 'Food Service Facility';
    onUpdateSession({
      orgType,
      orgName,
      isLoggedIn: true,
      step: 'dashboard',
    });
    onFinishLogin(orgType, orgName);
  };

  const handleFinishSetup = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSession({
      isLoggedIn: true,
      step: 'dashboard',
      setupInfo: {
        usualPeopleCount: parseInt(peopleCount, 10) || 185,
        mealsServed: selectedMeals,
        location: locationInput.trim() || 'Bengaluru, India',
        localContext: localInfoInput.trim(),
      },
    });
    onFinishLogin();
  };

  const toggleMeal = (meal: string) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header - Cleaned per enterprise spec */}
      <header className="relative z-10 max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-orange-600 flex items-center justify-center text-white shadow-xs font-bold text-xs">
            FW
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-900 leading-tight">
                FOODWISE AI
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              “Predict. Prevent. Rescue.”
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-lg w-full mx-auto px-6 py-4 flex-1 flex flex-col justify-center">
        {/* SCREEN 1: Language */}
        {session.step === 'language' && (
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <div className="mb-5">
              <h1 className="text-xl font-bold text-slate-900 mb-1">
                Choose your language
              </h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your preferred interface language for commercial kitchen operations:
              </p>
            </div>

            <div className="space-y-2.5 mb-6">
              {[
                { id: 'en' as Language, title: 'English', sub: 'Standard English for commercial kitchens' },
                { id: 'hi' as Language, title: 'हिन्दी', sub: 'सरल हिन्दी - रसोई और कैंटीन के लिए' },
                { id: 'te' as Language, title: 'తెలుగు', sub: 'సులభమైన తెలుగు - ఆహార సంస్థల కోసం' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLanguage(item.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-colors flex items-center justify-between group ${
                    session.language === item.id
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500">{item.sub}</div>
                  </div>
                  <div className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-orange-500 group-hover:text-orange-600 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onUpdateSession({ step: 'mobile' })}
              className="w-full py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* SCREEN 2: Enter Mobile */}
        {session.step === 'mobile' && (
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 mb-1">
              Enter Mobile Number
            </h1>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Login to access daily demand forecasting and production recommendations.
            </p>

            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full pl-11 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-bold placeholder-slate-300 focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 text-base"
                  />
                </div>
              </div>

              {/* Demo quick auto-fill helper */}
              <button
                type="button"
                onClick={() => setMobileInput('9876543210')}
                className="w-full text-left p-2.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between"
              >
                <span>Demo shortcut: +91 98765 43210</span>
                <span className="font-semibold text-orange-600">Auto-fill</span>
              </button>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateSession({ step: 'language' })}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Send OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SCREEN 3: OTP */}
        {session.step === 'otp' && (
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 mb-1">
              Enter Verification Code
            </h1>
            <p className="text-xs text-slate-500 mb-4">
              Enter the 6-digit code sent to +91 {mobileInput || '9876543210'}.
            </p>

            <div className="mb-4 p-3 rounded-md bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block uppercase">
                  Prototype Verification Code
                </span>
                <span className="text-sm font-mono font-bold tracking-widest text-slate-900">
                  123456
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpInput('123456');
                  setOtpError('');
                }}
                className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100"
              >
                Auto-fill
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => {
                    setOtpInput(e.target.value);
                    if (otpError) setOtpError('');
                  }}
                  placeholder="123456"
                  className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-mono font-bold text-xl tracking-[0.4em] focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500"
                />
                {otpError && (
                  <p className="mt-1.5 text-xs font-medium text-red-600 text-center">
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateSession({ step: 'mobile' })}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Verify</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SCREEN 4: What type of organization do you manage? */}
        {session.step === 'org' && (
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 mb-1">
              Select Facility Type
            </h1>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Select your facility type to configure batch sizing and food waste rescue pathways:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {orgList.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleSelectOrg(item.type)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    session.orgType === item.type
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl block mb-1">{item.icon}</span>
                  <h3 className="font-bold text-slate-900 text-xs mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onUpdateSession({ step: 'otp' })}
                className="font-medium text-slate-500 hover:text-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => handleSelectOrg(session.orgType || 'cafeteria')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-semibold text-xs shadow-xs flex items-center gap-1.5"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: FIRST-TIME SETUP */}
        {session.step === 'first_setup' && (
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 mb-1">
              {t.firstSetup.title}
            </h1>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              {t.firstSetup.subtitle}
            </p>

            <form onSubmit={handleFinishSetup} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  1. {t.firstSetup.qPeople}
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(e.target.value)}
                    placeholder="e.g. 185"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-bold tabular-nums focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <span className="absolute right-3 top-2 text-[11px] text-slate-400 font-medium">
                    people/day
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  2. {t.firstSetup.qMeals}
                </label>
                <div className="flex flex-wrap gap-2">
                  {mealOptions.map((meal) => {
                    const active = selectedMeals.includes(meal);
                    return (
                      <button
                        key={meal}
                        type="button"
                        onClick={() => toggleMeal(meal)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {active && '✓ '}
                        {meal}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  3. {t.firstSetup.qLocation}
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  4. {t.firstSetup.qLocalInfo}
                </label>
                <input
                  type="text"
                  value={localInfoInput}
                  onChange={(e) => setLocalInfoInput(e.target.value)}
                  placeholder="e.g. Rain expected this evening, semester exams ongoing"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {quickLocalTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setLocalInfoInput(tag)}
                      className="px-2 py-0.5 rounded text-[11px] bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>{t.firstSetup.btnFinish}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl w-full mx-auto px-6 py-4 flex items-center justify-between text-xs text-slate-400">
        <div>FOODWISE AI — Commercial Food Waste Reduction</div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local Engine Active</span>
        </div>
      </footer>
    </div>
  );
};
