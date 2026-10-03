import React, { useState } from 'react';
import { Language, OrganizationType } from '../types';
import { translations } from '../translations';
import {
  X,
  Plus,
  CheckCircle2,
  Calendar,
  Users,
  Package,
  Layers,
  Sparkles,
  AlertTriangle,
  Clock,
  CloudSun,
  Truck,
  FileQuestion,
  Utensils,
} from 'lucide-react';

interface AddUpdateModalProps {
  language: Language;
  orgType: OrganizationType;
  isOpen: boolean;
  onClose: () => void;
  onSubmitEntry: (data: { category: string; summary: string; values: Record<string, any> }) => void;
}

export const AddUpdateModal: React.FC<AddUpdateModalProps> = ({
  language,
  orgType,
  isOpen,
  onClose,
  onSubmitEntry,
}) => {
  const t = translations[language];

  // Organization-tailored category tabs
  const getCategoriesForOrg = (org: OrganizationType) => {
    switch (org) {
      case 'cafeteria':
        return [
          { id: 'students', label: 'Students / Staff', icon: Users },
          { id: 'meal_type', label: 'Meal Type (Breakfast/Lunch)', icon: Utensils },
          { id: 'menu', label: 'Menu Items', icon: Calendar },
          { id: 'production', label: 'Production Batch', icon: Layers },
          { id: 'leftovers', label: 'Leftovers', icon: Package },
          { id: 'damaged', label: 'Damaged Food', icon: AlertTriangle },
        ];
      case 'hostel':
        return [
          { id: 'residents', label: 'Hostel Residents Count', icon: Users },
          { id: 'meal_type', label: 'Breakfast / Lunch / Dinner', icon: Utensils },
          { id: 'menu', label: 'Menu Schedule', icon: Calendar },
          { id: 'stock', label: 'Grocery Ingredients', icon: Package },
          { id: 'leftovers', label: 'Leftover Food', icon: Layers },
        ];
      case 'supermarket':
        return [
          { id: 'stock', label: 'Shelf Stock', icon: Package },
          { id: 'sales', label: 'Today’s Sales', icon: Layers },
          { id: 'expiry', label: 'Update Expiry Dates', icon: Clock },
          { id: 'damaged', label: 'Damaged Products', icon: AlertTriangle },
          { id: 'promotions', label: 'Discount Promotion', icon: Sparkles },
          { id: 'supplier', label: 'Supplier Issue', icon: Truck },
        ];
      case 'hotel':
        return [
          { id: 'guests', label: 'Guest Room Count', icon: Users },
          { id: 'events', label: 'Banquet & Events', icon: Calendar },
          { id: 'buffet', label: 'Buffet Pans Prep', icon: Utensils },
          { id: 'stock', label: 'Kitchen Ingredients', icon: Package },
          { id: 'leftovers', label: 'Buffet Leftovers', icon: Layers },
        ];
      case 'restaurant':
      default:
        return [
          { id: 'customers', label: 'Expected Customers', icon: Users },
          { id: 'stock', label: 'Add Inventory / Ingredient', icon: Package },
          { id: 'sales', label: 'Today’s Sales', icon: Layers },
          { id: 'leftovers', label: 'Add Leftovers', icon: Utensils },
          { id: 'damaged', label: 'Report Damaged Food', icon: AlertTriangle },
          { id: 'expiry', label: 'Update Expiry', icon: Clock },
          { id: 'weather', label: 'Weather / Local Event', icon: CloudSun },
          { id: 'supplier', label: 'Supplier Issue', icon: Truck },
          { id: 'other', label: 'Other Note', icon: FileQuestion },
        ];
    }
  };

  const categories = getCategoriesForOrg(orgType);
  const [activeTab, setActiveTab] = useState(categories[0].id);

  // Form input states
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let summary = '';
    if (activeTab === 'customers' || activeTab === 'students' || activeTab === 'residents' || activeTab === 'guests') {
      summary = `Expected ${field1 || '180'} people today.`;
    } else if (activeTab === 'stock') {
      summary = `Added stock: ${field1 || 'Rice'} (${field2 || '25 kg'}).`;
    } else if (activeTab === 'leftovers') {
      summary = `Leftover recorded: ${field1 || 'Rice'} (${field2 || '3 kg'}).`;
    } else {
      summary = `Updated ${activeTab} data.`;
    }

    onSubmitEntry({
      category: activeTab,
      summary,
      values: { field1, field2, field3 },
    });

    // Reset fields and close
    setField1('');
    setField2('');
    setField3('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wide">
                ＋ ADD OR UPDATE INFORMATION
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-normal">
              No technical terminology. Enter what you have or expect, and FoodWise recalculates.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills / Tab list */}
        <div className="p-4 bg-[#FCFAF6] border-b border-neutral-200/60 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat.id);
                    setField1('');
                    setField2('');
                    setField3('');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white text-neutral-700 hover:bg-orange-50 border border-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Plain Language Form */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 space-y-5">
          {/* Customers / Students / Residents / Guests Tab */}
          {(activeTab === 'customers' || activeTab === 'students' || activeTab === 'residents' || activeTab === 'guests') && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                  How many people do you expect today?
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    value={field1}
                    onChange={(e) => setField1(e.target.value)}
                    placeholder="e.g. 185"
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-lg font-bold tabular-nums focus:outline-hidden focus:border-orange-500"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-semibold text-neutral-400">
                    people
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">
                  FoodWise will automatically adjust portion multipliers and batch sizes.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Any special booking, tour bus, or school schedule?
                </label>
                <input
                  type="text"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  placeholder="e.g. Table reservation of 25 at 1:30 PM"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Stock / Ingredients Tab */}
          {(activeTab === 'stock' || activeTab === 'ingredient') && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Ingredient or Food Item Name:
                </label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="e.g. Rice, Tomatoes, Chicken, Paneer"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    How much do you have on hand?
                  </label>
                  <input
                    type="text"
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    placeholder="e.g. 25 kg"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    How many days until it expires?
                  </label>
                  <input
                    type="number"
                    value={field3}
                    onChange={(e) => setField3(e.target.value)}
                    placeholder="e.g. 2 days"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Leftovers Tab */}
          {activeTab === 'leftovers' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  What dish was left over?
                </label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="e.g. Rice, Dal, Chapati"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  How much was left yesterday?
                </label>
                <input
                  type="text"
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  placeholder="e.g. 3 kg"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Damaged Food Tab */}
          {activeTab === 'damaged' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  What food got damaged or spoiled?
                </label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="e.g. 4 kg tomatoes bruised during unloading"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Weather / Event Tab */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  What weather or local event is happening?
                </label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="e.g. Heavy evening thunderstorm, cricket match nearby"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Supplier Issue Tab */}
          {activeTab === 'supplier' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  What supplier issue happened?
                </label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="e.g. Chicken vendor delayed delivery by 3 hours"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Generic fallback for sales / menu / other */}
          {['sales', 'menu', 'meal_type', 'production', 'expiry', 'promotions', 'events', 'buffet', 'other'].includes(activeTab) && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Details / Value:
                </label>
                <input
                  type="text"
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  placeholder="Enter details in plain words..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Analyze</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
