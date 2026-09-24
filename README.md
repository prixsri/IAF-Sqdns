# Indian Air Force (IAF) Fleet Strength & Squadron Evolution Simulator

An interactive, high-fidelity strategic simulation web application designed to model the Indian Air Force's force structure, combat squadron dynamics, engine supply constraints, and modernization roadmap from **2025 through 2040**.

---

## 🚀 Key Simulation Capabilities

### 1. Interactive Timeline Scrubber (2025–2040)

- Scrub through annual milestones with real-time calculations of total combat aircraft, operational squadrons (calculated at the standard **18 airframes per squadron**), and force deficit against the sanctioned **42-squadron threshold (756 jets)**.
- Features **Auto-Play / Pause** animation and **1x / 2x speed playback**.
- Dynamic milestone ticker highlighting pivotal events (e.g., AMCA DCPP clearance, Tejas Mk1A induction start, GE F414 signing, Rafale fly-away arrival).

### 2. Comprehensive Baseline Inventory (Current IAF ORBAT)

- **Kinetic (Combat Fighters):** Su-30MKI (260), Rafale (36), Mirage 2000 (48), MiG-29 UPG (58), SEPECAT Jaguar (116), Tejas Mk1 (32).
  - Includes radar suites (Bars PESA, RBE2 AESA, RDY-2, Zhuk-ME, EL/M-2052), hardpoints, combat radius, key armament (BrahMos, Meteor, SCALP, Astra, ASRAAM), active squadron allocations, base locations, and IAF Operational Commands.
- **Force Multipliers:** Beriev A-50EI Phalcon AWACS, DRDO Netra Mk1 AEW&C, and Ilyushin Il-78MKI tankers.
- **Rotary (Helicopters):** Boeing AH-64E Apache Guardian, HAL Prachanda LCH, Boeing CH-47F (I) Chinook, Mil Mi-17V-5, and HAL Dhruv ALH.
- **Unmanned (UAVs / Drones):** IAI Heron Mk II MALE, MQ-9B SkyGuardian, IAI Harop loitering munitions, and DRDO Ghatak stealth UCAV.

### 3. GE Engine Supply Constraint & Glider Backlog Tracker

- Models serial production of the **83 + 97 = 180 Tejas Mk1-A** order tied to GE F-404-IN20 engine deliveries.
- **Historical Deliveries & Delays:** Documents past receipts and supply chain bottlenecks (2021–2025).
- **Future Commitments:** Simulates GE's committed supply cadence of **2 engines/month (24/year)**.
- **HAL Three-Line Infrastructure:**
  - LCA Line 1 (Bengaluru): 8/year
  - LCA Line 2 (Bengaluru): 8/year
  - Line 3 (AMD Nashik): 8–10/year
  - Combined baseline: **24 units/year**, scalable to **30 units/year**.
- **Glider Airframe Backlog:** Dynamically detects when HAL assembly outpaces engine receipts, accumulating un-engined airframes ("gliders") in hangars.
- **Production Line Trade-Off Rule:** When the Tejas Mk2 Medium Weight Fighter enters production in September 2030, the Tejas Mk1-A line scales down to **16 units/year**.
- **GE F-414 Deal:** Models the March 2027 milestone for 2 engines/month supply with **80% Technology Transfer (ToT)** to HAL.

### 4. Dynamic Simulation Rules & Milestones

- **Tejas Mk1-A:** Inductions scale up starting **December 2026**.
- **Tejas Mk2 (MWF):** Rollout projected for **March 2027**; first series induction starts **September 2030** (120 units).
- **114 Rafale MRFA:** Signed before March 2027; first **18 fly-away jets** arrive in **2030**; Indian-assembled jets follow starting **2031** at **12 units/year**.
- **AMCA Program (5th Gen Stealth):** DCPP finalized **October 2026** (84-month development clock for 5 prototypes); 40 AMCA Mk1 Lead-in Series Production (LSP) starts **2032** at **16 units/year**; 120 AMCA Mk2 units begin **2035**.
- **Ghatak Autonomous UCAV:** 60 stealth flying-wing units inducted starting **2030** at **16 units/year**.
- **Su-30MKI Additions:** Delivery of **12 additional Su-30MKI** units assembled at HAL Nashik in **2027**.
- **Legacy Fleet Phase-Out Curves:**
  - SEPECAT Jaguar: Phased retirement begins **2028** (~18–20/year).
  - MiG-29 UPG: Phased retirement starts **2029** (~18/year).
  - Su-30MKI Older Frames: Phased retirement & "Super Sukhoi" upgrade rotation starting **2030**.
  - Mirage 2000: Phased drawdown **2032–2036**.

### 5. Strategic Wargame & Scenario Comparison Matrix

Compare 4 strategic pathways side-by-side:

1. **Official Planned Roadmap (Baseline):** Rafale MRFA active, on-time GE deliveries, on-time Mk2 & AMCA.
2. **Worst Case (Engine Crisis & MRFA Stalled):** 18-month GE delay, HAL throttled to 16/yr, MRFA cancelled, AMCA slips to 2035. Demonstrates the critical trough below 28 squadrons.
3. **Atmanirbhar Bharat Surge (Pure Indigenous):** HAL scaled to 30 jets/yr, No MRFA import, domestic high-rate production.
4. **Dual-Track Force Modernization (Fast Recovery):** Rafale MRFA + HAL 30/yr + structural service life extensions (SLEP).

### 6. Data Explorer & Report Export

- Full tabular year-by-year dataset with filtering and sorting.
- **Export to CSV:** Instant download of all parameters and projections.
- **Printable Executive Briefing:** Air Staff-level confidential summary with key findings, critical trough dates, and force vulnerability assessments.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (Tactical Military HUD Theme)
- **Charts:** Recharts (Interactive Area, Composed, Line, and Bar charts)
- **Icons:** Lucide React

---

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Clone the repository and navigate into it
cd IAF-Sqdns

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Preview

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview -- --port 5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
