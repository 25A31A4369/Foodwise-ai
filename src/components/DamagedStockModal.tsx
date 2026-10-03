import React, { useState } from 'react';
import { Language } from '../types';
import { X, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DamagedStockModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onRecordDamaged: (ingredient: string, qtyKg: number, reason: string) => void;
}

export const DamagedStockModal: React.FC<DamagedStockModalProps> = ({
  language,
  isOpen,
  onClose,
  onRecordDamaged,
}) => {
  const [ingredient, setIngredient] = useState('Tomatoes');
  const [quantity, setQuantity] = useState('5.0');
  const [reason, setReason] = useState<'Spoiled' | 'Damaged packaging' | 'Temperature issue' | 'Expired' | 'Other'>('Spoiled');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseFloat(quantity) || 1;
    onRecordDamaged(ingredient, q, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-neutral-200 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900">
                Report Damaged Stock
              </h3>
              <p className="text-xs text-neutral-500">
                Immediately updates available inventory & purchase advice
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Damaged Ingredient:
            </label>
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="e.g. Tomatoes, Milk, Paneer"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Quantity Damaged (KG):
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold tabular-nums focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Damage Reason:
            </label>
            <select
              value={reason}
              onChange={(e: any) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-orange-500"
            >
              <option value="Spoiled">Spoiled</option>
              <option value="Damaged packaging">Damaged packaging</option>
              <option value="Temperature issue">Temperature issue / Chiller failure</option>
              <option value="Expired">Expired</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs"
            >
              Record Damage & Recalculate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
