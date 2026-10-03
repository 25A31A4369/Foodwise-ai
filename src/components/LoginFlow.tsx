import React, { useState } from 'react';
import { Language, OrganizationType, UserSession } from '../types';
import { translations } from '../translations';
import { ArrowRight, Check, ShieldCheck, Sparkles, Building2, Store, Hotel, School, Utensils, Home } from 'lucide-react';

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
      setOtpError('Please enter demo OTP: 123456');
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F2937] flex flex-col justify-between relative overflow-hidden">
      {/* Top Header */}
      <header className="relative z-10 max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/20 font-bold">
            🍲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-neutral-900 leading-tight">
                FOODWISE AI
              </span>
              <span className="text-[10px] font-bold text-orange-800 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                OFFLINE DEMO
              </span>
            </div>
            <span className="text-xs text-orange-950 font-medium">
              “Predict. Prevent. Rescue.”
            </span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-white border border-orange-200 rounded-xl p-1 shadow-2xs">
          {(['en', 'hi', 'te'] as Language[]).map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => onUpdateSession({ language: lng })}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                session.language === lng
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {lng === 'en' ? 'English' : lng === 'hi' ? 'हिन्दी' : 'తెలుగు'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-xl w-full mx-auto px-6 py-4 flex-1 flex flex-col justify-center">
        {/* Progress indicator */}
        <div className="mb-4 flex items-center justify-between text-xs text-neutral-500 font-semibold">
          <span className="flex items-center gap-1.5 text-orange-700">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            {session.step === 'language' && 'Step 1: Choose your language'}
            {session.step === 'mobile' && 'Step 2: Enter mobile number'}
            {session.step === 'otp' && 'Step 3: Demo OTP verification'}
            {session.step === 'org' && 'Step 4: What type of organization do you manage?'}
          </span>
          <span className="text-neutral-400">
            {session.step === 'language' && '1 / 4'}
            {session.step === 'mobile' && '2 / 4'}
            {session.step === 'otp' && '3 / 4'}
            {session.step === 'org' && '4 / 4'}
          </span>
        </div>

        {/* SCREEN 1: Language */}
        {session.step === 'language' && (
          <div className="bg-white rounded-3xl p-7 border border-orange-100 shadow-xl">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-neutral-900 mb-1">
                FOODWISE AI
              </h1>
              <p className="text-sm font-semibold text-orange-700 mb-3">
                “Predict. Prevent. Rescue.”
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Turn yesterday’s leftovers into tomorrow’s smarter decisions. Select your language to continue:
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { id: 'en' as Language, title: 'English', sub: 'Simple English for commercial kitchens' },
                { id: 'hi' as Language, title: 'हिन्दी', sub: 'सरल हिन्दी - रसोई और कैंटीन के लिए' },
                { id: 'te' as Language, title: 'తెలుగు', sub: 'సులభమైన తెలుగు - ఆహార సంస్థల కోసం' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLanguage(item.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    session.language === item.id
                      ? 'border-orange-500 bg-orange-50/60 shadow-xs'
                      : 'border-neutral-200 hover:border-orange-300 hover:bg-orange-50/20'
                  }`}
                >
                  <div>
                    <div className="text-base font-bold text-neutral-900 group-hover:text-orange-950">
                      {item.title}
                    </div>
                    <div className="text-xs text-neutral-500">{item.sub}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 group-hover:border-orange-500 group-hover:text-orange-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onUpdateSession({ step: 'mobile' })}
              className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCREEN 2: Enter Mobile */}
        {session.step === 'mobile' && (
          <div className="bg-white rounded-3xl p-7 border border-orange-100 shadow-xl">
            <h1 className="text-2xl font-black text-neutral-900 mb-1">
              Enter Mobile Number
            </h1>
            <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
              Login to access offline forecasting and production recommendations.
            </p>

            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full pl-13 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-900 font-bold placeholder-neutral-300 focus:outline-hidden focus:border-orange-500 focus:bg-white text-lg"
                  />
                </div>
              </div>

              {/* Demo quick auto-fill helper */}
              <button
                type="button"
                onClick={() => setMobileInput('9876543210')}
                className="w-full text-left p-3 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-950 text-xs flex items-center justify-between"
              >
                <span>💡 Demo shortcut: +91 98765 43210</span>
                <span className="font-bold underline text-orange-700">Auto-fill</span>
              </button>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateSession({ step: 'language' })}
                  className="px-4 py-3 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2"
                >
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SCREEN 3: OTP */}
        {session.step === 'otp' && (
          <div className="bg-white rounded-3xl p-7 border border-orange-100 shadow-xl">
            <h1 className="text-2xl font-black text-neutral-900 mb-1">
              Enter OTP
            </h1>
            <p className="text-xs text-neutral-600 mb-4">
              Enter the 6-digit verification code.
            </p>

            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-amber-800 block">
                  Prototype Demo OTP
                </span>
                <span className="text-base font-mono font-black tracking-widest text-amber-900">
                  123456
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpInput('123456');
                  setOtpError('');
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100 shadow-2xs"
              >
                Auto-fill 123456
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
                  className="w-full text-center py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-900 font-mono font-black text-2xl tracking-[0.5em] focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
                {otpError && (
                  <p className="mt-2 text-xs font-semibold text-red-600 text-center">
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onUpdateSession({ step: 'mobile' })}
                  className="px-4 py-3 text-xs font-bold text-neutral-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2"
                >
                  <span>Verify</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SCREEN 4: What type of organization do you manage? */}
        {session.step === 'org' && (
          <div className="bg-white rounded-3xl p-7 border border-orange-100 shadow-xl">
            <h1 className="text-2xl font-black text-neutral-900 mb-1">
              What type of organization do you manage?
            </h1>
            <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
              Select your facility to tailor portions, recipe calculators, and waste rescue routes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {orgList.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleSelectOrg(item.type)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    session.orgType === item.type
                      ? 'border-orange-500 bg-orange-50/70 shadow-xs'
                      : 'border-neutral-200 hover:border-orange-300 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{item.icon}</span>
                  <h3 className="font-bold text-neutral-900 text-sm mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 leading-snug">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-neutral-500">
              <button
                type="button"
                onClick={() => onUpdateSession({ step: 'otp' })}
                className="font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => handleSelectOrg(session.orgType || 'cafeteria')}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: FIRST-TIME SETUP (Section 7 in prompt) */}
        {session.step === 'first_setup' && (
          <div className="bg-white rounded-3xl p-7 border border-orange-100 shadow-xl">
            <h1 className="text-2xl font-black text-neutral-900 mb-1">
              {t.firstSetup.title}
            </h1>
            <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
              {t.firstSetup.subtitle}
            </p>

            <form onSubmit={handleFinishSetup} className="space-y-4">
              {/* Question 1: How many people do you usually serve? */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  1. {t.firstSetup.qPeople}
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(e.target.value)}
                    placeholder="e.g. 185"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-base font-bold tabular-nums focus:outline-hidden focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-semibold">
                    people/day
                  </span>
                </div>
              </div>

              {/* Question 2: Which meals do you serve? */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          active
                            ? 'bg-orange-600 text-white shadow-xs'
                            : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                        }`}
                      >
                        {active && '✓ '}
                        {meal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Location */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  3. {t.firstSetup.qLocation}
                </label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Default: Bengaluru, India (offline demo mode)
                </span>
              </div>

              {/* Question 4: Local information today */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  4. {t.firstSetup.qLocalInfo}
                </label>
                <input
                  type="text"
                  value={localInfoInput}
                  onChange={(e) => setLocalInfoInput(e.target.value)}
                  placeholder="e.g. Rain expected this evening, College event nearby"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-orange-500 mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {quickLocalTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setLocalInfoInput((prev) => (prev ? `${prev}, ${tag}` : tag))}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-neutral-300 text-neutral-600 hover:bg-orange-50 hover:text-orange-900"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => onUpdateSession({ step: 'org' })}
                  className="text-xs font-bold text-neutral-500 hover:text-neutral-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 flex items-center gap-2"
                >
                  <span>{t.firstSetup.btnFinish}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer message */}
      <footer className="relative z-10 max-w-4xl w-full mx-auto px-6 py-4 text-center text-xs text-neutral-400">
        FoodWise AI · “Turn yesterday’s leftovers into tomorrow’s smarter decisions.” · Offline Prototype
      </footer>
    </div>
  );
};
