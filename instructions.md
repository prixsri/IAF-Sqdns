
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

* **Mk1-A Inductions:** Deliveries scale up starting **December 2026**.
* **Tejas Mk2 Rollout & GE-F414 Deal:**
* Rollout projected for **March 2027**, alongside the signing of a GE F-414-IN engine deal featuring a supply rate of **2 engines per month**.
* First Mk2 induction out of the 120 planned units begins in **September 2030**.
* **Line Capacity Trade-off:** When Tejas Mk2 enters production, the Tejas Mk1 production line scales down to **16 units/year**.

### B. Rafale Procurement (114 MRFA)

* **Deal Milestone:** Assumed signed before **March 2027**.
* **Delivery Schedule:** First lot of **18 jets** arrives in fly-away condition in **2030**. Indian-assembled jets follow starting **2031** at a sustained rate of **12 units/year**.

### C. AMCA Program (DCPP & Production)

* **Milestone Start:** AMCA DCPP decision finalized in **October 2026**.
* **Development Phase:** Add an 84-month timeline for 5 prototype tests to complete.
* **Production Schedule:**
* **40 AMCA Mk1 LSP** production starts in **2032** at **16 units/year**.
* Remaining **120 units** production initiates in **2035**.

### D. Ghatak UCAV & Other Additions

* **Ghatak UCAV:** Induction of **60 units** begins in **2030** at a rate of **16 units/year**.
* **Su-30MKI Additions:** Delivery of an additional **12 Su-30MKI** units in **2027**.

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
