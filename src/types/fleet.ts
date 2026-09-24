export type FleetCategory = "kinetic" | "multiplier" | "rotary" | "unmanned";

export interface SquadronInfo {
  number: string;
  name: string;
  base: string;
  command:
    | "Western"
    | "Eastern"
    | "South Western"
    | "Central"
    | "Southern"
    | "Training"
    | "Maintenance";
  crest?: string;
  status: "active" | "converting" | "number-plated" | "projected";
}

export interface AircraftSpec {
  id: string;
  name: string;
  category: FleetCategory;
  role: string;
  generation:
    | "Gen 4"
    | "Gen 4.5"
    | "Gen 4.5+"
    | "Gen 5 Stealth"
    | "AEW&C"
    | "Tanker"
    | "Attack Heli"
    | "Utility Heli"
    | "MALE UAV"
    | "Stealth UCAV"
    | "Loitering Munition";
  manufacturer: string;
  origin: string;
  firstInducted: number;
  currentAirframes: number;
  currentSquadrons: number;
  airframesPerSquadron: number;
  engineType: string;
  radar: string;
  combatRangeKm: number;
  maxSpeedMach: number;
  hardpoints: number;
  keyWeapons: string[];
  squadrons: SquadronInfo[];
  description: string;
  silhouette: string;
}

export interface EngineDeliveryLog {
  period: string; // e.g. "2024-Q1", "2025-11"
  year: number;
  month: number;
  contract: "83-Order (99 Engines)" | "97-Order (115+ Engines)" | "F414-Mk2";
  committed: number;
  actualOrProjected: number;
  status: "delivered" | "delayed" | "scheduled";
  notes: string;
}

export interface SimulationConfig {
  mrfaRafaleEnabled: boolean;
  mrfaSignedYear: number;
  mrfaFlyawayDeliveryYear: number;
  mrfaMakeInIndiaRate: number; // 12 units/yr
  geEngineDelayMonths: number; // 0, 6, 12, 18, 24
  geEngineAnnualSupply: number; // 24/yr baseline (2/mo)
  halMk1aCapacity: number; // 24/yr baseline, scalable to 30
  tejasMk2Enabled: boolean;
  tejasMk2StartYear: number; // 2030 (Sept)
  tejasMk2ProductionRate: number; // 16 to 24 units/yr
  amcaEnabled: boolean;
  amcaMk1StartYear: number; // 2032 (16 units/yr, 40 total)
  amcaMk2StartYear: number; // 2035 (120 total)
  ghatakEnabled: boolean;
  ghatakStartYear: number; // 2030 (16 units/yr, 60 total)
  su30NashikAdditions: boolean; // 12 units in 2027
  retirementPace: "normal" | "accelerated" | "slep_extended";
  targetSquadrons: number; // 42 sanctioned
}

export interface YearFleetBreakdown {
  [aircraftId: string]: number; // airframes count
}

export interface YearSquadronBreakdown {
  [aircraftId: string]: number; // squadron count (airframes / 18)
}

export interface SimulationYearData {
  year: number;
  totalAirframes: number;
  totalSquadrons: number; // fighters / 18
  targetSquadrons: number;
  deficit: number;
  airframes: YearFleetBreakdown;
  squadrons: YearSquadronBreakdown;
  netDelta: number;
  inductions: {
    aircraftId: string;
    name: string;
    count: number;
  }[];
  retirements: {
    aircraftId: string;
    name: string;
    count: number;
  }[];
  engineStatus: {
    f404DeliveredCum: number;
    f404AirframesBuiltCum: number;
    f404GlidersAwaitingEngine: number;
    f414DeliveredCum: number;
    f414AirframesBuiltCum: number;
  };
  generationShare: {
    gen4: number;
    gen45: number;
    gen5: number;
  };
  keyMilestones: string[];
}

export interface ScenarioPreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  config: SimulationConfig;
}
