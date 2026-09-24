import { SimulationConfig, SimulationYearData, ScenarioPreset } from '../types/fleet';

export const DEFAULT_CONFIG: SimulationConfig = {
  mrfaRafaleEnabled: true,
  mrfaSignedYear: 2027,
  mrfaFlyawayDeliveryYear: 2030,
  mrfaMakeInIndiaRate: 12, // units per year
  geEngineDelayMonths: 0,
  geEngineAnnualSupply: 24, // 2 engines/month
  halMk1aCapacity: 24, // baseline 24, scalable to 30
  tejasMk2Enabled: true,
  tejasMk2StartYear: 2030, // Sept 2030
  tejasMk2ProductionRate: 16,
  amcaEnabled: true,
  amcaMk1StartYear: 2032, // 16/yr, 40 total
  amcaMk2StartYear: 2035, // 120 total
  ghatakEnabled: true,
  ghatakStartYear: 2030, // 16/yr, 60 total
  su30NashikAdditions: true, // 12 units in 2027
  retirementPace: 'normal',
  targetSquadrons: 42,
};

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'baseline',
    name: 'Official Planned Trajectory (Baseline)',
    tagline: 'MoD & IAF Master Roadmap',
    badge: 'Standard Case',
    description: 'Rafale 114 MRFA signed in 2027, GE deliveries on committed 24/yr rate, Tejas Mk2 inducting Sept 2030, and AMCA Mk1 LSP starting 2032.',
    config: {
      ...DEFAULT_CONFIG,
    }
  },
  {
    id: 'engine-crisis-no-mrfa',
    name: 'Engine Bottleneck & MRFA Stalled',
    tagline: 'Critical Trough / Two-Front Vulnerability',
    badge: 'Worst Case',
    description: 'GE F404 suffers an 18-month delay, MRFA 114 deal is cancelled or indefinitely frozen, and AMCA slips to 2035. Force drops to dangerous low.',
    config: {
      ...DEFAULT_CONFIG,
      mrfaRafaleEnabled: false,
      geEngineDelayMonths: 18,
      halMk1aCapacity: 16,
      tejasMk2StartYear: 2032,
      amcaMk1StartYear: 2035,
      amcaMk2StartYear: 2037,
      retirementPace: 'normal'
    }
  },
  {
    id: 'indigenous-surge',
    name: 'Atmanirbhar Bharat Surge (Pure Indigenous)',
    tagline: 'HAL 30/yr Surge, No Foreign MRFA',
    badge: 'Indigenous Surge',
    description: 'HAL scales Tejas Mk1A line to 30 jets/yr, on-time F414 deal, accelerated Tejas Mk2 and AMCA, bypassing imported MRFA in favor of domestic fighters.',
    config: {
      ...DEFAULT_CONFIG,
      mrfaRafaleEnabled: false,
      halMk1aCapacity: 30,
      geEngineAnnualSupply: 30,
      geEngineDelayMonths: 0,
      tejasMk2StartYear: 2030,
      tejasMk2ProductionRate: 20,
      amcaMk1StartYear: 2032,
      amcaMk2StartYear: 2035,
    }
  },
  {
    id: 'dual-track-high-readiness',
    name: 'Dual-Track Force Modernization',
    tagline: '114 MRFA + HAL 30/yr + Service Extension',
    badge: 'Fastest Recovery',
    description: 'Aggressive procurement: Rafale MRFA on track, HAL runs at 30 jets/yr, and legacy fleet receives life-extensions (SLEP) to prevent premature squadron depletion.',
    config: {
      ...DEFAULT_CONFIG,
      mrfaRafaleEnabled: true,
      halMk1aCapacity: 30,
      geEngineAnnualSupply: 30,
      retirementPace: 'slep_extended',
    }
  }
];

export function runFleetSimulation(config: SimulationConfig): SimulationYearData[] {
  const years: number[] = [];
  for (let y = 2025; y <= 2040; y++) {
    years.push(y);
  }

  // Initial baseline counts at end of 2025:
  let su30 = 260;
  let rafaleCurrent = 36;
  let mirage2000 = 48;
  let mig29 = 58;
  let jaguar = 116;
  let tejasMk1 = 32;

  // Inducting types
  let tejasMk1a = 0;
  let tejasMk2 = 0;
  let rafaleMRFA = 0;
  let amcaMk1 = 0;
  let amcaMk2 = 0;
  let ghatakUCAV = 0;

  // Cumulative tracking
  let cumMk1aProduced = 0;
  const maxMk1aOrder = 180; // 83 + 97
  let cumF404EnginesReceived = 8; // already delivered before 2026
  let cumMk2Delivered = 0;
  const maxMk2Order = 120;
  let cumRafaleMRFADelivered = 0;
  const maxRafaleMRFA = 114;
  let cumAmcaMk1Delivered = 0;
  const maxAmcaMk1 = 40;
  let cumAmcaMk2Delivered = 0;
  const maxAmcaMk2 = 120;
  let cumGhatakDelivered = 0;
  const maxGhatak = 60;

  const result: SimulationYearData[] = [];

  for (const year of years) {
    const inductionsThisYear: { aircraftId: string; name: string; count: number }[] = [];
    const retirementsThisYear: { aircraftId: string; name: string; count: number }[] = [];
    const milestonesThisYear: string[] = [];

    // --- ENGINE DELIVERIES CALCULATION (GE F-404) ---
    // Delay effect in years:
    const delayYears = config.geEngineDelayMonths / 12;

    let enginesReceivedThisYear = 0;
    if (year >= 2026) {
      if (year === 2026) {
        // Late 2026 delivery ramp
        enginesReceivedThisYear = delayYears > 0.5 ? Math.max(2, Math.round(12 - delayYears * 8)) : 14;
      } else if (year < 2026 + delayYears) {
        // Delayed period
        enginesReceivedThisYear = Math.max(4, Math.round(config.geEngineAnnualSupply * 0.4));
      } else {
        enginesReceivedThisYear = config.geEngineAnnualSupply;
      }
    }
    cumF404EnginesReceived += enginesReceivedThisYear;

    // --- TEJAS MK1A PRODUCTION ---
    // Capacity rules: baseline config.halMk1aCapacity (24 or 30).
    // When Tejas Mk2 enters production (year >= config.tejasMk2StartYear), Mk1 line scales down to 16/yr!
    let effectiveMk1aLineCapacity = config.halMk1aCapacity;
    if (config.tejasMk2Enabled && year >= config.tejasMk2StartYear) {
      effectiveMk1aLineCapacity = 16;
    }

    let mk1aInductedThisYear = 0;
    if (year >= 2026 && cumMk1aProduced < maxMk1aOrder) {
      if (year === 2026) {
        // Scaling up starts December 2026 (first batch of 4-6 planes)
        const initialBatch = delayYears > 0.5 ? 2 : 4;
        mk1aInductedThisYear = Math.min(initialBatch, maxMk1aOrder - cumMk1aProduced);
        milestonesThisYear.push('Tejas Mk1-A serial induction scale-up initiated (Dec 2026)');
      } else {
        // Limited by line capacity and remaining order
        const targetBuild = Math.min(effectiveMk1aLineCapacity, maxMk1aOrder - cumMk1aProduced);
        
        // Limited by available engines:
        // Engines needed = total airframes + 15% spares buffer
        const availableEnginesForAirframes = Math.max(0, cumF404EnginesReceived - cumMk1aProduced);
        mk1aInductedThisYear = Math.min(targetBuild, availableEnginesForAirframes);
      }

      cumMk1aProduced += mk1aInductedThisYear;
      tejasMk1a += mk1aInductedThisYear;
      if (mk1aInductedThisYear > 0) {
        inductionsThisYear.push({
          aircraftId: 'tejas_mk1a',
          name: 'HAL Tejas Mk1-A',
          count: mk1aInductedThisYear
        });
      }
    }

    // Uninstalled airframes waiting for engines (gliders)
    const potentialAirframesWithoutEngineConstraint = Math.min(maxMk1aOrder, (year - 2025) * effectiveMk1aLineCapacity);
    const glidersCount = Math.max(0, Math.min(potentialAirframesWithoutEngineConstraint - cumMk1aProduced, 16));

    // --- SU-30MKI ADDITIONS (Nashik line 12 units in 2027) ---
    if (year === 2027 && config.su30NashikAdditions) {
      su30 += 12;
      inductionsThisYear.push({
        aircraftId: 'su30mki',
        name: 'Sukhoi Su-30MKI (Nashik Assembly)',
        count: 12
      });
      milestonesThisYear.push('Induction of 12 additional Su-30MKI assembled by HAL Nashik');
    }

    // --- TEJAS MK2 (MWF) ---
    if (year === 2027) {
      milestonesThisYear.push('Tejas Mk2 prototype rollout & GE F-414-IN engine deal finalization (2 engines/month)');
    }
    if (config.tejasMk2Enabled && year >= config.tejasMk2StartYear && cumMk2Delivered < maxMk2Order) {
      let mk2InductedThisYear = 0;
      if (year === config.tejasMk2StartYear) {
        // Starts September 2030 (4-6 units in first partial year)
        mk2InductedThisYear = 4;
        milestonesThisYear.push('First Tejas Mk2 Medium Weight Fighter (MWF) serial induction');
      } else {
        mk2InductedThisYear = Math.min(config.tejasMk2ProductionRate, maxMk2Order - cumMk2Delivered);
      }
      cumMk2Delivered += mk2InductedThisYear;
      tejasMk2 += mk2InductedThisYear;
      if (mk2InductedThisYear > 0) {
        inductionsThisYear.push({
          aircraftId: 'tejas_mk2',
          name: 'HAL Tejas Mk2 (MWF)',
          count: mk2InductedThisYear
        });
      }
    }

    // --- RAFALE 114 MRFA ---
    if (config.mrfaRafaleEnabled) {
      if (year === config.mrfaSignedYear) {
        milestonesThisYear.push('114 Multi-Role Fighter Aircraft (MRFA) Rafale deal contract signed');
      }
      if (year === config.mrfaFlyawayDeliveryYear) {
        // First lot of 18 jets in fly-away condition in 2030
        const flyaway = 18;
        cumRafaleMRFADelivered += flyaway;
        rafaleMRFA += flyaway;
        inductionsThisYear.push({
          aircraftId: 'rafale_mrfa',
          name: 'Dassault Rafale (MRFA Fly-away Batch 1)',
          count: flyaway
        });
        milestonesThisYear.push('Delivery of first 18 Rafale MRFA jets in fly-away condition from France');
      } else if (year > config.mrfaFlyawayDeliveryYear && cumRafaleMRFADelivered < maxRafaleMRFA) {
        // Indian assembled jets follow starting 2031 at 12 units/yr
        const assembled = Math.min(config.mrfaMakeInIndiaRate, maxRafaleMRFA - cumRafaleMRFADelivered);
        cumRafaleMRFADelivered += assembled;
        rafaleMRFA += assembled;
        inductionsThisYear.push({
          aircraftId: 'rafale_mrfa',
          name: 'Dassault Rafale (Make-in-India Assembled)',
          count: assembled
        });
      }
    }

    // --- AMCA PROGRAM ---
    if (year === 2026) {
      milestonesThisYear.push('AMCA DCPP decision finalized (October 2026, 84-month development clock)');
    }
    if (config.amcaEnabled) {
      // 40 AMCA Mk1 LSP starts in 2032 at 16 units/year
      if (year >= config.amcaMk1StartYear && cumAmcaMk1Delivered < maxAmcaMk1) {
        const amcaMk1Batch = Math.min(16, maxAmcaMk1 - cumAmcaMk1Delivered);
        cumAmcaMk1Delivered += amcaMk1Batch;
        amcaMk1 += amcaMk1Batch;
        inductionsThisYear.push({
          aircraftId: 'amca_mk1',
          name: 'DRDO/HAL AMCA Mk1 (5th Gen Stealth LSP)',
          count: amcaMk1Batch
        });
        if (year === config.amcaMk1StartYear) {
          milestonesThisYear.push('AMCA Mk1 5th-Gen Stealth Fighter series induction begins');
        }
      }

      // Remaining 120 units production initiates in 2035
      if (year >= config.amcaMk2StartYear && cumAmcaMk2Delivered < maxAmcaMk2) {
        const amcaMk2Batch = Math.min(16, maxAmcaMk2 - cumAmcaMk2Delivered);
        cumAmcaMk2Delivered += amcaMk2Batch;
        amcaMk2 += amcaMk2Batch;
        inductionsThisYear.push({
          aircraftId: 'amca_mk2',
          name: 'AMCA Mk2 (Indigenous High-Thrust Engine)',
          count: amcaMk2Batch
        });
        if (year === config.amcaMk2StartYear) {
          milestonesThisYear.push('AMCA Mk2 full production begins with indigenous high-thrust engine');
        }
      }
    }

    // --- GHATAK UCAV ---
    if (config.ghatakEnabled && year >= config.ghatakStartYear && cumGhatakDelivered < maxGhatak) {
      const ghatakBatch = Math.min(16, maxGhatak - cumGhatakDelivered);
      cumGhatakDelivered += ghatakBatch;
      ghatakUCAV += ghatakBatch;
      inductionsThisYear.push({
        aircraftId: 'ghatak_ucav',
        name: 'DRDO Ghatak Stealth UCAV',
        count: ghatakBatch
      });
      if (year === config.ghatakStartYear) {
        milestonesThisYear.push('DRDO Ghatak Autonomous Stealth Flying-Wing UCAV induction begins');
      }
    }

    // --- LEGACY FLEET RETIREMENTS ---
    // Modifiers based on retirement pace:
    // normal: baseline as specified in instructions
    // accelerated: retirements happen 1-2 years sooner / heavier
    // slep_extended: life extensions keep frames active 2-3 years longer

    // 1. Jaguars: Phased drawdown starts from 2028 (currently 116 units)
    if (jaguar > 0 && year >= 2028) {
      let jagRetire = 0;
      if (config.retirementPace === 'accelerated') {
        jagRetire = year === 2028 ? 24 : year === 2029 ? 24 : year === 2030 ? 24 : year === 2031 ? 24 : 20;
      } else if (config.retirementPace === 'slep_extended') {
        jagRetire = year === 2028 ? 10 : year === 2029 ? 12 : year === 2030 ? 14 : year === 2031 ? 16 : 18;
      } else {
        // normal
        jagRetire = year === 2028 ? 18 : year === 2029 ? 18 : year === 2030 ? 20 : year === 2031 ? 20 : year === 2032 ? 20 : 20;
      }
      jagRetire = Math.min(jaguar, jagRetire);
      jaguar -= jagRetire;
      if (jagRetire > 0) {
        retirementsThisYear.push({
          aircraftId: 'jaguar',
          name: 'SEPECAT Jaguar DARIN II/III',
          count: jagRetire
        });
        if (year === 2028) {
          milestonesThisYear.push('SEPECAT Jaguar phased drawdown commenced');
        }
      }
    }

    // 2. MiG-29: Retirement phase-out starts from 2029 (currently 58 units)
    if (mig29 > 0 && year >= 2029) {
      let migRetire = 0;
      if (config.retirementPace === 'accelerated') {
        migRetire = year === 2029 ? 24 : year === 2030 ? 20 : 14;
      } else if (config.retirementPace === 'slep_extended') {
        migRetire = year === 2029 ? 8 : year === 2030 ? 12 : year === 2031 ? 14 : 12;
      } else {
        // normal
        migRetire = year === 2029 ? 18 : year === 2030 ? 18 : year === 2031 ? 14 : 8;
      }
      migRetire = Math.min(mig29, migRetire);
      mig29 -= migRetire;
      if (migRetire > 0) {
        retirementsThisYear.push({
          aircraftId: 'mig29',
          name: 'Mikoyan MiG-29 UPG',
          count: migRetire
        });
        if (year === 2029) {
          milestonesThisYear.push('MiG-29 UPG phase-out commenced');
        }
      }
    }

    // 3. Su-30MKI (Older Frames): Phased phase-out / upgrades schedule beginning 2030 onwards
    // First tranches (1998-2004) retire while newer ones get Super Sukhoi upgrades
    if (su30 > 220 && year >= 2030) {
      let suRetire = 0;
      if (config.retirementPace === 'accelerated') {
        suRetire = 10;
      } else if (config.retirementPace === 'slep_extended') {
        suRetire = 4;
      } else {
        suRetire = 8;
      }
      suRetire = Math.min(su30 - 220, suRetire);
      su30 -= suRetire;
      if (suRetire > 0) {
        retirementsThisYear.push({
          aircraftId: 'su30mki',
          name: 'Su-30MKI (Batch 1 Older Airframes / Depot Retirement)',
          count: suRetire
        });
        if (year === 2030) {
          milestonesThisYear.push('Initial batch Su-30MKI retirement & "Super Sukhoi" upgrade rotation initiated');
        }
      }
    }

    // 4. Mirage 2000: Natural phase-out around 2032-2035
    if (mirage2000 > 0 && year >= 2032) {
      let mirageRetire = 0;
      if (config.retirementPace === 'accelerated') {
        mirageRetire = 20;
      } else if (config.retirementPace === 'slep_extended') {
        mirageRetire = 10;
      } else {
        mirageRetire = 16;
      }
      mirageRetire = Math.min(mirage2000, mirageRetire);
      mirage2000 -= mirageRetire;
      if (mirageRetire > 0) {
        retirementsThisYear.push({
          aircraftId: 'mirage2000',
          name: 'Mirage 2000 I/TI',
          count: mirageRetire
        });
        if (year === 2032) {
          milestonesThisYear.push('Mirage 2000 I/TI phased retirement started');
        }
      }
    }

    // Total Combat Fighters (Standard IAF Squadron calculation: 18 airframes per squadron)
    const totalFighters = su30 + rafaleCurrent + rafaleMRFA + mirage2000 + mig29 + jaguar + tejasMk1 + tejasMk1a + tejasMk2 + amcaMk1 + amcaMk2;
    const totalSquadrons = parseFloat((totalFighters / 18).toFixed(1));
    const deficit = parseFloat((config.targetSquadrons - totalSquadrons).toFixed(1));

    // Generation breakdown
    const gen4 = mirage2000 + mig29 + jaguar;
    const gen45 = su30 + rafaleCurrent + rafaleMRFA + tejasMk1 + tejasMk1a + tejasMk2;
    const gen5 = amcaMk1 + amcaMk2;

    result.push({
      year,
      totalAirframes: totalFighters,
      totalSquadrons,
      targetSquadrons: config.targetSquadrons,
      deficit,
      airframes: {
        su30mki: su30,
        rafale: rafaleCurrent,
        rafale_mrfa: rafaleMRFA,
        mirage2000,
        mig29,
        jaguar,
        tejas_mk1: tejasMk1,
        tejas_mk1a: tejasMk1a,
        tejas_mk2: tejasMk2,
        amca_mk1: amcaMk1,
        amca_mk2: amcaMk2,
        ghatak_ucav: ghatakUCAV
      },
      squadrons: {
        su30mki: parseFloat((su30 / 18).toFixed(1)),
        rafale: parseFloat((rafaleCurrent / 18).toFixed(1)),
        rafale_mrfa: parseFloat((rafaleMRFA / 18).toFixed(1)),
        mirage2000: parseFloat((mirage2000 / 18).toFixed(1)),
        mig29: parseFloat((mig29 / 18).toFixed(1)),
        jaguar: parseFloat((jaguar / 18).toFixed(1)),
        tejas_mk1: parseFloat((tejasMk1 / 18).toFixed(1)),
        tejas_mk1a: parseFloat((tejasMk1a / 18).toFixed(1)),
        tejas_mk2: parseFloat((tejasMk2 / 18).toFixed(1)),
        amca_mk1: parseFloat((amcaMk1 / 18).toFixed(1)),
        amca_mk2: parseFloat((amcaMk2 / 18).toFixed(1)),
        ghatak_ucav: parseFloat((ghatakUCAV / 18).toFixed(1))
      },
      inductions: inductionsThisYear,
      retirements: retirementsThisYear,
      engineStatus: {
        f404DeliveredCum: cumF404EnginesReceived,
        f404AirframesBuiltCum: cumMk1aProduced,
        f404GlidersAwaitingEngine: glidersCount,
        f414DeliveredCum: Math.min(140, Math.max(0, (year - 2027) * 24)),
        f414AirframesBuiltCum: cumMk2Delivered + cumAmcaMk1Delivered,
      },
      generationShare: {
        gen4,
        gen45,
        gen5,
      },
      keyMilestones: milestonesThisYear,
    });
  }

  return result;
}
