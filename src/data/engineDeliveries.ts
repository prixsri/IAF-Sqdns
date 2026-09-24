import { EngineDeliveryLog } from '../types/fleet';

export interface HALProductionLine {
  id: string;
  name: string;
  location: string;
  nominalCapacity: number; // units per year
  maxCapacity: number; // units per year
  status: 'operational' | 'scaling' | 'transitioning';
  role: string;
}

export const HAL_PRODUCTION_LINES: HALProductionLine[] = [
  {
    id: 'bengaluru-line1',
    name: 'HAL LCA Division Line 1',
    location: 'Bengaluru Complex, Karnataka',
    nominalCapacity: 8,
    maxCapacity: 10,
    status: 'operational',
    role: 'Tejas Mk1A Final Assembly & Systems Integration'
  },
  {
    id: 'bengaluru-line2',
    name: 'HAL LCA Division Line 2',
    location: 'Bengaluru Complex, Karnataka',
    nominalCapacity: 8,
    maxCapacity: 10,
    status: 'operational',
    role: 'Tejas Mk1A Structural Assembly & Avionics Testing'
  },
  {
    id: 'nashik-line3',
    name: 'HAL Aircraft Manufacturing Division (AMD)',
    location: 'Nashik, Maharashtra (Ozar Base)',
    nominalCapacity: 8,
    maxCapacity: 10,
    status: 'scaling',
    role: 'Tejas Mk1A 3rd Production Line (Re-tooled Su-30MKI Facility)'
  }
];

export const HISTORICAL_AND_COMMITTED_DELIVERIES: EngineDeliveryLog[] = [
  // Historical receipts / initial deliveries
  { period: '2021-Q3', year: 2021, month: 8, contract: '83-Order (99 Engines)', committed: 2, actualOrProjected: 2, status: 'delivered', notes: 'Initial batch of Category-B engines for Mk1A testing and validation' },
  { period: '2022-Q2', year: 2022, month: 5, contract: '83-Order (99 Engines)', committed: 4, actualOrProjected: 4, status: 'delivered', notes: 'Engines for prototype integration and system flight clearance' },
  { period: '2023-Q4', year: 2023, month: 11, contract: '83-Order (99 Engines)', committed: 6, actualOrProjected: 4, status: 'delayed', notes: 'GE Aerospace sub-tier supplier foundry & single-crystal casting disruptions' },
  { period: '2024-Q1', year: 2024, month: 3, contract: '83-Order (99 Engines)', committed: 6, actualOrProjected: 1, status: 'delayed', notes: 'First Tejas Mk1A LA-5033 flies on spare engine; GE deliveries frozen due to Korean/supplier bottlenecks' },
  { period: '2024-Q3', year: 2024, month: 9, contract: '83-Order (99 Engines)', committed: 8, actualOrProjected: 2, status: 'delayed', notes: 'High-level MoD intervention with US DoD; GE commits delivery restart timeline' },
  { period: '2025-Q1', year: 2025, month: 3, contract: '83-Order (99 Engines)', committed: 10, actualOrProjected: 6, status: 'delivered', notes: 'Restart of serial F-404-IN20 deliveries to HAL Bengaluru' },
  { period: '2025-Q3', year: 2025, month: 9, contract: '83-Order (99 Engines)', committed: 12, actualOrProjected: 10, status: 'delivered', notes: 'Ramping up towards 16 engines per annum cadence' },
  { period: '2026-Q1', year: 2026, month: 2, contract: '83-Order (99 Engines)', committed: 12, actualOrProjected: 12, status: 'scheduled', notes: 'Arrival of standard production rate engines; HAL lines ramp up' },
  { period: '2026-Q4', year: 2026, month: 12, contract: '83-Order (99 Engines)', committed: 16, actualOrProjected: 16, status: 'scheduled', notes: 'Milestone: Deliveries of Tejas Mk1A scale up starting Dec 2026' },
  { period: '2027-H1', year: 2027, month: 6, contract: '83-Order (99 Engines)', committed: 20, actualOrProjected: 20, status: 'scheduled', notes: 'Committed 2 engines/month sustained pace (24 engines/yr)' },
  { period: '2027-H2', year: 2027, month: 12, contract: '83-Order (99 Engines)', committed: 24, actualOrProjected: 24, status: 'scheduled', notes: 'Full rate engine supply; HAL Nashik line operates in parallel' },
  { period: '2028-H1', year: 2028, month: 6, contract: '83-Order (99 Engines)', committed: 24, actualOrProjected: 24, status: 'scheduled', notes: 'Fulfillment of 83-jet order engine requirement; transition to 97-jet order' },
  { period: '2028-H2', year: 2028, month: 12, contract: '97-Order (115+ Engines)', committed: 24, actualOrProjected: 24, status: 'scheduled', notes: 'Initial deliveries for additional 97 Tejas Mk1A batch' },
  { period: '2029-H1', year: 2029, month: 6, contract: '97-Order (115+ Engines)', committed: 24, actualOrProjected: 24, status: 'scheduled', notes: 'Sustained 2 engines per month delivery pace' },
  { period: '2030-H1', year: 2030, month: 6, contract: '97-Order (115+ Engines)', committed: 24, actualOrProjected: 24, status: 'scheduled', notes: 'GE F404 continuous supply; concurrent introduction of GE F414-INS6' }
];

export const GE_F414_PROGRAM_PARAMS = {
  contractSignTarget: 'March 2027',
  supplyRateMonthly: 2, // 2 engines per month
  supplyRateAnnual: 24, // 24 engines per year
  totPercentage: 80, // 80% Technology Transfer to HAL
  targetAirframe: 'Tejas Mk2 (MWF) & AMCA Mk1 (initial batches)',
  thrustRatingKN: 98, // 98 kN afterburning thrust
  status: 'Inter-governmental negotiation & technical specs finalized'
};
