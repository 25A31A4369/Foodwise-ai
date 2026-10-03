import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import {
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Users,
  CloudRain,
  Truck,
  Flame,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  UserX,
} from 'lucide-react';

interface SomethingChangedModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onApplyChange: (type: string, detail: string) => void;
}

export const SomethingChangedModal: React.FC<SomethingChangedModalProps> = ({
  language,
  isOpen,
  onClose,
  onApplyChange,
}) => {
  const changeOptions = [
    {
      id: 'weather_changed',
      label: language === 'hi' ? 'अचानक बारिश या आंधी' : language === 'te' ? 'ఆకస్మిక వర్షం లేదా తుఫాను' : 'Rain expected / sudden weather shift',
      icon: CloudRain,
      detailPreset: 'Rain expected this evening in Bengaluru',
    },
    {
      id: 'local_event',
      label: language === 'hi' ? 'आस-पास कॉलेज फेस्ट या कार्यक्रम' : language === 'te' ? 'సమీపంలో కళాశాల ఉత్సవం' : 'College festival / local event nearby',
      icon: Calendar,
      detailPreset: 'College festival in main auditorium with 35 extra guests',
    },
    {
      id: 'more_customers',
      label: language === 'hi' ? 'अपेक्षा से अधिक ग्राहक / बड़ी बुकिंग' : language === 'te' ? 'కస్టమర్ల రద్దీ / పెద్ద బుకింగ్' : 'Customer rush / large group booking',
      icon: Users,
      detailPreset: 'Tour bus or student group booking of 30 people',
    },
    {
      id: 'fewer_customers',
      label: language === 'hi' ? 'ग्राहक कम आए / सुस्त दिन' : language === 'te' ? 'కస్టమర్లు తగ్గారు' : 'Fewer customers (slow walk-in day)',
      icon: Users,
      detailPreset: 'Afternoon footfall slowed down by 25 people',
    },
    {
      id: 'supplier_problem',
      label: language === 'hi' ? 'सप्लायर देर से आया या सामान कम मिला' : language === 'te' ? 'సరుకులు ఆలస్యంగా వచ్చాయి' : 'Supplier delay / missing stock',
      icon: Truck,
      detailPreset: 'Vendor delayed delivery by 3 hours',
    },
    {
      id: 'staff_shortage',
      label: language === 'hi' ? 'रसोई कर्मचारियों की कमी' : language === 'te' ? 'సిబ్బంది కొరత' : 'Staff shortage in kitchen',
      icon: UserX,
      detailPreset: 'Cook on sick leave, switch to fast-batch menu',
    },
    {
      id: 'food_damaged',
      label: language === 'hi' ? 'सामान खराब हुआ' : language === 'te' ? 'ఆహారం పాడైంది' : 'Damaged / spoiled ingredients during prep',
      icon: Flame,
      detailPreset: '5 kg tomatoes bruised or spoiled',
    },
    {
      id: 'other',
      label: language === 'hi' ? 'अन्य कोई अप्रत्याशित बदलाव' : language === 'te' ? 'ఇతర మార్పు' : 'Other unexpected kitchen situation',
      icon: HelpCircle,
      detailPreset: 'Operational adjustment',
    },
  ];

  const [selectedOption, setSelectedOption] = useState(changeOptions[0].id);
  const [detailInput, setDetailInput] = useState(changeOptions[0].detailPreset);

  if (!isOpen) return null;

  const handleSelect = (id: string, preset: string) => {
    setSelectedOption(id);
    setDetailInput(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyChange(selectedOption, detailInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-neutral-200 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                ＋ SOMETHING CHANGED?
              </h2>
              <p className="text-xs text-neutral-500">
                FoodWise will immediately re-run AI recommendations & batch sizes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {changeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id, opt.detailPreset)}
                  className={`w-full p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-xs'
                      : 'border-neutral-200 hover:border-amber-300 bg-white text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <span className="text-amber-700 font-bold">✓</span>}
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Brief details (or adjust preset):
            </label>
            <input
              type="text"
              value={detailInput}
              onChange={(e) => setDetailInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recalculate Recommendations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
