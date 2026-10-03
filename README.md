# FOODWISE AI
> **“Predict. Prevent. Rescue.”**  
> *Turn yesterday's leftovers into tomorrow's smarter decisions.*

---

## 1. Executive Summary & Core Philosophy

**FoodWise AI** is an offline-first, human-controlled decision intelligence prototype designed to eliminate avoidable food waste in:
- **Cafeterias & Dining Halls** (Universities, Colleges, Campuses)
- **Hostels & Boarding Messes**
- **Restaurants & Commercial Kitchens**
- **Supermarkets & Fresh Food Retailers**
- **Hotels & Banquet Centers**
- **Institutional Food-Service Providers**

### The Core Differentiator: Adaptive Food Decision Loop
FoodWise AI is **not** another passive reporting dashboard. It is an **adaptive culinary decision system**:

```
DATA & CONTEXT
      ↓
FORECAST DEMAND (0-based scale)
      ↓
CHECK INVENTORY & SHELF LIFE (FEFO)
      ↓
CHECK WEATHER & LOCAL EVENTS
      ↓
CHECK LEFTOVER HISTORY
      ↓
CALCULATE SURPLUS WASTE RISK (Low / Medium / High / Critical)
      ↓
GENERATE 6-TIER RESCUE PLAN
      ↓
SAFETY CHECK & EXPLAINABILITY (Why? Confidence? Alternatives?)
      ↓
HUMAN APPROVAL (Accept / Change / Reject / Add Knowledge)
      ↓
KITCHEN ACTION & SERVICE
      ↓
END-OF-DAY CLOSING FEEDBACK (What was left & Why?)
      ↓
CONTINUOUS LEARNING & SAFE EXPERIMENT LAB
      ↓
NEXT DAY'S REFINED FORECAST
```

---

## 2. Key Unique Features

### A. Feature 1: AI Controlled Experimentation & Learning
When demand is uncertain (e.g. `±8%`), FoodWise does **not** pretend false precision. It says:
> *“Rice demand is uncertain by ±8%. Suggested experiment: Reduce rice production by 8% for 3 similar days. Measure: Sales, Leftovers, Stockouts, Customer satisfaction.”*

Once executed, FoodWise records the measured result (*e.g., “Leftover rice dropped by 44% with zero stockouts”*) and updates future baseline recommendations.

### B. Feature 2: Waste Rescue Mode (6-Tier Hierarchy)
When an ingredient approaches expiry, FoodWise **never** jumps immediately to discarding. It evaluates options in strict order:
1. **USE**: Can the ingredient be safely absorbed in today's scheduled menu?
2. **ALLOCATE**: Can it be transferred to a nearby kitchen/outlet with shortage? *(e.g. Outlet A surplus of 8 kg to Outlet B shortage of 5 kg, verified temperature safety)*
3. **PROMOTE**: Can demand be boosted through an attractive promotion or daily special? *(e.g. 20% discount on fresh soup bowls)*
4. **REDESIGN**: Can the chef safely launch a temporary special dish? *(Smart Menu Redesign)*
5. **REDISTRIBUTE**: Can it be safely routed to community partners or NGOs before expiry?
6. **DISCARD**: Only when biological spoilage has occurred and all 5 prior rescue paths fail.

### C. Feature 3: Human-in-the-Loop & Decision Replay
- The AI never has absolute authority.
- The AI **cannot** automatically discard food, purchase food, publish promotions, or override food safety standards.
- Every recommendation displays:
  - **AI Recommendation**
  - **Why (Data factors)**
  - **Confidence level**
  - **Expected Impact**
  - **Risks if Ignored**
  - **Alternatives**
- Actions: `[ ACCEPT ]` · `[ CHANGE ]` · `[ REJECT ]` · `[ ADD MY KNOWLEDGE ]`.
- Rejections and changes are stored in **Decision Replay** (*What did AI predict vs What manager decided vs What actually happened*).

---

## 3. 3-Minute Demo Walkthrough for Evaluators & Judges

1. **Login & Organization Select**:
   - Select Language (`English`, `हिन्दी`, `తెలుగు`).
   - Enter mobile (`+91 98765 43210` with one-tap auto-fill).
   - Enter demo OTP `123456` with one-click fill.
   - Choose **🍽 Cafeteria** (Green Valley College Cafeteria, Bengaluru).
   - First-time setup: 185 people, Breakfast/Lunch/Dinner, Bengaluru, India.

2. **Main Dashboard**:
   - Displays 4 core metrics:
     - **Customers Expected**: `185`
     - **Food at Risk**: `6.8 KG`
     - **Potential Waste Avoided**: `4.2 KG`
     - **Potential Cost Saving**: `₹1,240`

3. **Central Decision: “WHAT SHOULD I DO TODAY?”**:
   - `PREPARE 23–24 KG RICE` (Deducted 2.1 kg from yesterday’s surplus + rain factor).
   - `DON’T BUY MORE TOMATOES` (12 kg on hand; 6 kg risk of expiring).
   - `USE PANEER TODAY` (8 kg near 24h expiry; chef roll special).

4. **Dynamic Recalculation (“SOMETHING CHANGED?”)**:
   - Click `＋ SOMETHING CHANGED?` → Select `Rain expected this evening` or `College event nearby`.
   - Watch customer forecast and production batch adjust immediately with updated explanations.

5. **Decision Replay**:
   - Click **Decision Replay** tab: Compare AI prediction (`20 kg`) vs Manager decision (`23 kg`) vs Actual outcome (`22.2 kg`). Notice how the system praises the manager's context.

6. **Waste Rescue Mode**:
   - Click **Rescue Plan**: View the 6-tier rescue breakdown for 6.8 kg tomatoes and 5 kg paneer. Click `Execute Tier 1 (USE)` to rescue stock.

7. **AI Experiment Lab**:
   - Click **Experiments**: View the `8% Lean Rice Production Test` with hypothesis, control vs test, and measured outcome.

8. **Smart Menu Redesign**:
   - Click **Smart Menu**: View the `Tomato Rasam & Artisanal Soup Bowl` designed to consume 5 kg at-risk tomatoes. Click `Approve for Today's Menu`.

9. **Closing Audit (Leftover Feedback)**:
   - Click **Leftover Feedback**: Enter actual closing leftovers (Rice 1.2 kg, Chicken 2.3 kg) and reason. Click `SAVE & LEARN` to feed forward into tomorrow's forecast.

10. **Reports & 0-Based Graphs**:
    - Click **Reports**: View the 7-day trend where waste avoided (green) grows as actual leftovers (gray) shrink to 1.6 kg.

---

## 4. Technical Architecture

- **Runtime**: React 19 SPA + Vite + Tailwind CSS 4.
- **Offline-First Storage**: Local browser persistence via `localStorage` (Zero external APIs, no paid tokens, no internet connection required).
- **Color Discipline**:
  - Primary Accent: Culinary Orange (`#EA580C`, `#F97316`)
  - Clean Background: Warm Cream Travertine (`#FAF7F2`)
  - Structured Cards: Clean White (`#FFFFFF`) with subtle 1px border lines
  - Contrast Text: Charcoal (`#1F2937`)
  - Semantic Status: Emerald (Safe), Amber (Watch), Crimson (Critical)
- **Zero Digital Jargon**: Avoids confusing terms; explains all formulas in plain kitchen prose.
