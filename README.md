# Indian Air Force (IAF) Fleet Strength & Squadron Evolution Simulator

An interactive, high-fidelity strategic simulation web application designed to model the Indian Air Force's force structure, combat squadron dynamics, engine supply constraints, and modernization roadmap from **2025 through 2040**.

---

## 🚀 Key Simulation Capabilities

> **Data methodology (updated 29 September 2026):** Current inventory values are an open-source snapshot, not an official IAF serviceability return. Confirmed holdings, best-supported estimates, undisclosed counts, and future procurement allocations are labeled separately in the Baseline ORBAT view. Procurement totals and leased aircraft are not counted as delivered IAF inventory. All 2025–2040 program paths remain modeled scenarios unless explicitly identified as a public commitment.

### 1. Interactive Timeline Scrubber (2025–2040)

- Scrub through annual milestones with real-time calculations of total combat aircraft, operational squadrons (calculated at the standard **18 airframes per squadron**), and force deficit against the sanctioned **42-squadron threshold (756 jets)**.
- Features **Auto-Play / Pause** animation and **1x / 2x speed playback**.
- Dynamic milestone ticker highlighting modeled and reported events (e.g., AMCA first-flight target, Tejas Mk1A delivery forecast, GE F414 planning status, and proposed Rafale MRFA milestones).

### 2. Comprehensive Baseline Inventory (Current IAF ORBAT)

- **Kinetic (Combat Fighters):** Su-30MKI (about 266, open-source estimate), Rafale (36 confirmed inducted), Mirage 2000 (roughly 45–50 estimate), MiG-29 UPG (roughly 55–65 estimate), SEPECAT Jaguar (roughly 100–120 estimate), Tejas Mk1 (32 single-seat fighters confirmed delivered).
  - Includes radar suites (Bars PESA, RBE2 AESA, RDY-2, Zhuk-ME, EL/M-2052), hardpoints, combat radius, key armament (BrahMos, Meteor, SCALP, Astra, ASRAAM), active squadron allocations, base locations, and IAF Operational Commands.
- **Force Multipliers:** Beriev A-50EI Phalcon AWACS, DRDO Netra Mk1 AEW&C, and Ilyushin Il-78MKI tankers.
- **Rotary (Helicopters):** Boeing AH-64E Apache Guardian (22 delivered), HAL Prachanda LCH (10 initial IAF aircraft; later allocations are future), Boeing CH-47F (I) Chinook (15 delivered), Mil Mi-17V-5 (more than 200 family aircraft, exact IAF count undisclosed), and HAL Dhruv ALH (about 75 assigned to the IAF).
- **Unmanned (UAVs / Drones):** IAI Heron Mk II MALE (current IAF count undisclosed), MQ-9B SkyGuardian (0 IAF-owned delivered by the cutoff; 8 of 31 purchased aircraft allocated for later IAF delivery), IAI Harop loitering munitions (historical reported count, current stock undisclosed), and DRDO Ghatak stealth UCAV (program projection).

### 3. GE Engine Supply Constraint & Glider Backlog Tracker

- Models serial production of the **83 + 97 = 180 Tejas Mk1-A** order tied to GE F-404-IN20 engine deliveries.
- **Historical Deliveries & Delays:** Documents past receipts and supply chain bottlenecks (2021–2025).
- **Future Commitments:** Simulates a reported planning cadence of **2 engines/month (24/year)**; realized deliveries have lagged and are treated as a scenario input.
- **HAL Three-Line Infrastructure:**
  - LCA Line 1 (Bengaluru): 8/year
  - LCA Line 2 (Bengaluru): 8/year
  - Line 3 (AMD Nashik): 8–10/year
  - Combined baseline: **24 units/year**, scalable to **30 units/year**.
- **Glider Airframe Backlog:** Dynamically detects when HAL assembly outpaces engine receipts, accumulating un-engined airframes ("gliders") in hangars.
- **Production Line Trade-Off Rule:** When a configurable Tejas Mk2 production case begins, the Tejas Mk1-A line scales down to **16 units/year**.
- **GE F-414 Programme:** Models the 2023 GE-HAL MoU and reported planning cadence; no completed production contract or delivered F414 engines is asserted.

### 4. Dynamic Simulation Rules & Milestones

- **Tejas Mk1-A:** 180 aircraft are ordered, but September 2026 reporting said original-order handovers remained delayed; December 2026 induction is a configurable forecast.
- **Tejas Mk2 (MWF):** Current public target is a **September 2027 prototype first flight**; series production and induction dates remain unconfirmed and are modeled as scenarios.
- **114 Rafale MRFA:** A proposed package remains under negotiation; no final contract or delivery schedule is asserted. Fly-away and Indian-assembly rates are configurable what-if assumptions.
- **AMCA Program (5th Gen Stealth):** Design-and-development approval occurred in **March 2024**; the current public target is a **September 2028 first flight**. Production quantities and induction dates remain unconfirmed.
- **Ghatak Autonomous UCAV:** SWiFT has demonstrated flying-wing technology and a 2026 remotely piloted strike-aircraft AoN exists, but Ghatak quantity, production, and induction dates remain unconfirmed.
- **Su-30MKI Additions:** **12 additional aircraft are contracted**, with first delivery targeted for FY 2027–28 and reported batch completion by 2029; this is not modeled as a guaranteed 2027 delivery.
- **Legacy Fleet Phase-Out Curves:**
  - SEPECAT Jaguar: Phased retirement begins **2028** (~18–20/year).
  - MiG-29 UPG: Still operational; retirement timing and annual withdrawal rate are not publicly announced.
  - Su-30MKI Older Frames: Phased retirement & "Super Sukhoi" upgrade rotation starting **2030**.
  - Mirage 2000: Still operational; earlier retirement planning around 2035 may extend toward 2038–39, but no final date is confirmed.

### 5. Strategic Wargame & Scenario Comparison Matrix

Compare 4 strategic pathways side-by-side:

1. **Reported/Modeled Roadmap (Baseline):** Proposed MRFA excluded by default; reported GE cadence and unconfirmed Mk2/AMCA planning cases.
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

---

## 🌐 Continuous Integration & Deployment (CI/CD)

The repository includes automated CI/CD via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)):

**CI (Pull Requests & Pushes):** Automatically installs dependencies (`npm ci`), runs TypeScript compilation (`tsc -b`), and verifies the production build (`vite build`).
**CD (Deployment to GitHub Pages):** On push to `master` (or manual trigger), builds the production assets and deploys directly to GitHub Pages.

### Enabling GitHub Pages in Repository Settings

1. Navigate to your repository on GitHub: `Settings` > `Pages`.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Pushes to `master` will now automatically build and publish the live site at `https://<username>.github.io/IAF-Sqdns/`.
