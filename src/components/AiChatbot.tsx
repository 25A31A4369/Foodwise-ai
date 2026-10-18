import React, { useState, useRef, useEffect } from 'react';
import { AppKPIs, InventoryItem, Language, ProductionPlanItem, TodayUserInput } from '../types';
import { translations } from '../translations';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChefHat,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  Trash2,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

interface AiChatbotProps {
  language: Language;
  isOpen: boolean;
  onToggle: () => void;
  todayUserInput: TodayUserInput;
  kpis: AppKPIs;
  inventory: InventoryItem[];
  productionPlans: ProductionPlanItem[];
  weatherCondition: string;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  language,
  isOpen,
  onToggle,
  todayUserInput,
  kpis,
  inventory,
  productionPlans,
  weatherCondition,
}) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello Chef! I am your AI Kitchen Copilot. I'm actively monitoring your operational inputs: ${todayUserInput.expectedCustomers} expected customers, weather conditions (${weatherCondition}), and ${inventory.filter((i) => i.riskLevel === 'CRITICAL' || i.riskLevel === 'HIGH').length} batches near shelf-life expiration. How can I assist service today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const quickPrompts = [
    'Why did rice prep drop today?',
    'How do I rescue 5kg paneer?',
    "Summarize today's waste risk",
    'Suggest culinary substitution for tomatoes',
    'How do I log closing leftovers?',
  ];

  const generateAiResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('rice') || q.includes('why did rice')) {
      const ricePlan = productionPlans.find((p) => p.item.toLowerCase().includes('rice'));
      const recKg = ricePlan ? ricePlan.recommendedProductionKg : 22;
      return `🍚 **Rice Batch Calibration Analysis:**\n\n- **Target today:** ${recKg} kg cooked rice (vs. normal baseline 28 kg).\n- **Key Drivers:**\n  1. **Surplus Credit:** You logged ${todayUserInput.riceLeftoverKg} kg leftover rice from yesterday's closing dinner, which was safely held in walk-in cold storage.\n  2. **Weather Drag:** ${weatherCondition} is expected, projecting a ~6% reduction in casual walk-in customers (${todayUserInput.expectedCustomers} pax vs normal 198 pax).\n  3. **Prevention:** This calibrated batch prevents ~3.8 kg over-production spoilage by closing time, saving ₹420.`;
    }

    if (q.includes('paneer') || q.includes('rescue')) {
      const paneerItem = inventory.find((i) => i.name.toLowerCase().includes('paneer'));
      const stock = paneerItem ? paneerItem.currentStock : todayUserInput.paneerStockKg || 8;
      return `🥛 **Paneer Rescue & Culinary Repurposing:**\n\n- **Batch Status:** ${stock} kg stored (Batch #PN-301) expiring within 28 hours (72-hour fresh dairy limit).\n- **Recommended Tier 1 Action:** Activate **Paneer Bhurji / Kathi Roll Special** for lunch rush.\n- **Batch Recipe:** Uses 6.0 kg paneer, produces 35 quick-grab portions at ₹75/roll.\n- **Economic Outcome:** Recovers ₹1,920 in ingredient value and avoids complete spoilage dead loss.\n- **Backup Option:** If lunch demand slows by 1:30 PM, portion into 500g vacuum pouches and freeze at -18°C.`;
    }

    if (q.includes('waste') || q.includes('risk') || q.includes('summarize')) {
      const criticalCount = inventory.filter((i) => i.riskLevel === 'CRITICAL').length;
      const highCount = inventory.filter((i) => i.riskLevel === 'HIGH').length;
      return `📊 **Today's Kitchen Waste Risk Summary:**\n\n- **Customers Expected:** ${todayUserInput.expectedCustomers} pax\n- **Critical Batches:** ${criticalCount} items expiring in <24h (Ripe Tomatoes, Fresh Curd)\n- **High Risk Batches:** ${highCount} items expiring in <48h (Fresh Paneer Dairy)\n- **Potential Waste Preventable Today:** ${kpis.potentialWasteAvoidedKg} kg (~₹${kpis.potentialCostSaving.toLocaleString()})\n- **Kitchen Directive:** Stick strictly to two-stage batch cooking (prepare 70% before noon, prepare remaining 30% after 1:15 PM if demand confirms).`;
    }

    if (q.includes('tomato') || q.includes('substitut')) {
      return `🍅 **Tomato Culinary Substitution & Rescue Options:**\n\n- **Current State:** 12 kg ripe tomatoes stored in cooler (Batch #TM-894, shelf-life 48h).\n- **Do NOT procure new tomatoes today.**\n- **Repurposing Options:**\n  1. **Lunch Rasam / Shorba:** Cook down 8 kg ripe tomatoes with tamarind, pepper, and cumin. Riper tomatoes provide superior umami.\n  2. **Curry Gravy Base:** Puree 4 kg with ginger-garlic, simmer with oil into master gravy paste (stable in walk-in for 4 days).\n  3. **Emergency Substitutions:** If fresh tomatoes run short in salads, use cucumber-carrot slaw with lemon vinaigrette or roasted bell pepper relish.`;
    }

    if (q.includes('leftover') || q.includes('log') || q.includes('closing')) {
      return `📋 **Standard Operating Procedure for Leftovers:**\n\n1. **Record:** Weigh surplus food immediately at kitchen closing (9:30 PM) using the digital platform scale.\n2. **Cooling Protocol:** Rapidly chill cooked food from 60°C to below 5°C within 90 minutes using shallow metal gastros.\n3. **Labeling:** Affix FEFO sticker with Item Name, Weight (kg), Date & Shift, and Max Holding Temp.\n4. **System Input:** Enter actual kg into the **Operations / Step 1 Morning Log** tomorrow morning. The AI model automatically deducts it from the next morning's dry grain prep target.`;
    }

    // Default intelligent kitchen query response
    return `👨‍🍳 **Chef Copilot Advisory:**\n\nBased on your active shift (${todayUserInput.expectedCustomers} customers, ${todayUserInput.riceStockKg} kg rice stock, and local context: "${weatherCondition}"):\n\n- Ensure morning batch production follows the calibrated targets on the **Operations** tab.\n- High-risk items (Paneer & Tomatoes) should be directed into today's specials via the **Rescue & Specials** tab.\n- Would you like specific cooking proportions, portion sizing formulas, or HACCP holding temperature limits for any ingredient?`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateAiResponse(query);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: 'Chat history cleared. I am ready for your next culinary or operational question, Chef.',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button - Compact */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-md border border-slate-700 transition-all hover:scale-105 group text-xs font-semibold"
          title="Open Kitchen Copilot"
        >
          <div className="relative flex items-center justify-center">
            <ChefHat className="w-3.5 h-3.5 text-orange-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-1 ring-slate-900" />
          </div>
          <span>Kitchen Copilot</span>
        </button>
      )}

      {/* Chatbot Overlay Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white border border-slate-200 shadow-2xl rounded-xl flex flex-col transition-all overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 md:inset-x-24 md:inset-y-12'
              : 'bottom-5 right-5 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white shrink-0">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-tight">
                    {t.chatbot?.title || "Chef's Copilot"}
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1 py-0.2 rounded border border-emerald-800">
                    Live Shift Context
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
                  {todayUserInput.expectedCustomers} pax · {weatherCondition}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                type="button"
                onClick={onToggle}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Carousel Strip */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0">
            <div className="flex items-center gap-1.5 min-w-max">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                Suggested:
              </span>
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isAi ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAi && (
                    <div className="w-6 h-6 rounded bg-slate-900 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      isAi
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                        : 'bg-slate-900 text-white font-medium'
                    }`}
                  >
                    {/* Formatted body */}
                    <div className="whitespace-pre-line space-y-1">
                      {msg.text.split('\n').map((line, idx) => {
                        if (line.startsWith('**') || line.includes('**')) {
                          // Simple bold parser
                          const parts = line.split('**');
                          return (
                            <p key={idx}>
                              {parts.map((p, pIdx) =>
                                pIdx % 2 === 1 ? (
                                  <strong key={pIdx} className="font-bold text-slate-900">
                                    {p}
                                  </strong>
                                ) : (
                                  p
                                )
                              )}
                            </p>
                          );
                        }
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>

                    <div
                      className={`text-[9px] mt-1.5 font-mono ${
                        isAi ? 'text-slate-400 text-right' : 'text-slate-400 text-right'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                <span className="text-[11px] font-mono text-slate-400 ml-1">Analyzing kitchen data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chatbot?.placeholder || 'Ask about prep sizing, leftover rescue, substitutions...'}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-800 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-md transition-colors shrink-0 shadow-xs"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
