
# Instructions: IAF Squadron Strength & Fleet Simulation Web Application

## 1. Project Overview

Create a React-based interactive web application to simulate and visualize the Indian Air Force (IAF) fleet strength and squadron evolution over time. The app should map current force levels across kinetic, force multiplier, rotary, and unmanned categories, and project structural changes based on upcoming inductions, production rates, engine supply constraints, and frame retirements.

---

## 2. Baseline Inventory Module (Current IAF Fleet)

Query and ingest data to display the active breakdown of IAF assets categorized into:

* **Kinetic (Combat Fighters):** List active squadrons, aircraft types, and unit numbers (e.g., Su-30MKI, Rafale, Tejas Mk1, MiG-29, Mirage 2000, Jaguars).
* **Force Multipliers:** AWACS, AEW&C, and Air-to-Air Refuelers (e.g., Il-78, Netra, Phalcon).
* **Rotary (Helicopters):** Attack and utility helicopters (e.g., AH-64E, CH-47F, Mi-17 series, Dhruv ALH/Rudra, Prachanda LCH).
* **Unmanned (UAVs):** Remotely Piloted Aircraft and drones (e.g., Heron Mk II, MQ-9B, etc.).

---

## 3. Engine Supply Constraint Tracking (Tejas Mk1-A Order)

Track the serial production of the **83 + 97 Tejas Mk1-A** order linked to GE F-404-IN20 engine deliveries:

* **Historical Deliveries:** Document past GE F-404-IN20 engine receipts by HAL categorized by year-month.
* **Future Commitments:** Map GE's committed delivery rates and estimated future timelines by year-month based on public manufacturer commitments.
* **Production Capacities:** Factor in HAL's baseline manufacturing capacity of **24 units/year**, scalable up to **30 units/year** conditional on engine availability.

---

## 4. Simulation Rules and Milestones

The simulation engine must dynamically calculate active squadron numbers and total airframes based on the following conditional parameters:

### A. Tejas Mk1-A & Mk2 Transition

* **Mk1-A Inductions:** December 2026 is a configurable forecast; September 2026 reporting said original-order handovers remained delayed.
* **Tejas Mk2 Rollout & GE-F414 Deal:**
* Current public target is a **September 2027 prototype first flight**. The GE-HAL production arrangement is based on a 2023 MoU, not a confirmed 2027 contract.
* Series production and induction dates for the 120-unit planning case remain unconfirmed and configurable.
* **Line Capacity Trade-off:** When Tejas Mk2 enters production, the Tejas Mk1 production line scales down to **16 units/year**.

### B. Rafale Procurement (114 MRFA)

* **Deal Milestone:** The 114-aircraft package remains proposed/under negotiation; no final contract or delivery schedule is publicly confirmed.
* **Delivery Schedule:** Fly-away and Indian-assembly quantities are configurable what-if assumptions.

### C. AMCA Program (Development & Production)

* **Milestone Start:** AMCA design-and-development approval was granted in **March 2024**; the current public first-flight target is **September 2028**.
* **Development Phase:** Five flying prototypes plus one structural-test aircraft are planned; the development schedule remains subject to programme execution.
* **Production Schedule:**
* Production quantities and operational induction dates remain unconfirmed; any Mk1/Mk2 rates are scenario assumptions.

### D. Ghatak UCAV & Other Additions

* **Ghatak UCAV:** SWiFT is a technology demonstrator; a 2026 remotely piloted strike-aircraft AoN does not confirm Ghatak quantity or induction date.
* **Su-30MKI Additions:** 12 aircraft are contracted; first delivery is targeted for FY 2027–28 and completion is reportedly targeted by 2029.

### E. Legacy Fleet Retirements

Incorporate phase-out curves for aging airframes:

* **Jaguars:** Retirement begins phased drawdown from **2028**.
* **MiG-29:** Retirement phase-out starts from **2029**.
* **Su-30 (Older Frames):** Phased phase-out/upgrades schedule beginning **2030 onwards**.

---

## 5. UI/UX & Visualization Requirements

* **Interactive Timeline Slider:** Users should be able to scrub through years (e.g., 2026 to 2040) to view real-time changes in total active fighter squadrons vs. the sanctioned 42-squadron requirement.
* **Dashboard Metrics:** Visual charts tracking active combat mass, cumulative engine deliveries vs. airframes built, and deficit/surplus projections.
* **Export/Toggle Controls:** Ability to toggle specific procurement assumptions (e.g., "With/Without Rafale 114 deal", "Engine delay scenarios") to run dynamic game theory variants.

---
