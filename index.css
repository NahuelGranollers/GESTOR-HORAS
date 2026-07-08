/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkConfig, DayShift, DayCalculation } from '../types';

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return h * 60 + m;
}

export function formatMinutesToTime(mins: number): string {
  const normMins = (mins % 1440 + 1440) % 1440;
  const h = Math.floor(normMins / 60);
  const m = normMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isNighttimeMinute(minOfDay: number, config: WorkConfig): boolean {
  const inicio = parseTimeToMinutes(config.nocturna.inicio);
  const fin = parseTimeToMinutes(config.nocturna.fin);

  if (inicio === fin) return false;

  if (inicio > fin) {
    return minOfDay >= inicio || minOfDay < fin;
  } else {
    return minOfDay >= inicio && minOfDay < fin;
  }
}

const round2 = (num: number) => Math.round(num * 100) / 100;

export function calculateDayShift(
  dayIndex: number,
  shift: DayShift,
  config: WorkConfig,
  isWeekend: boolean = false
): DayCalculation {
  const result: DayCalculation = {
    total: 0,
    deber: 0,
    extDiur: 0,
    extNoct: 0,
    festivas: 0,
    dinero: 0,
    bolsa: 0,
  };

  const festivo = shift.festivo || isWeekend;

  if (!shift.entrada || !shift.salida) {
    if (!festivo) {
      result.deber = round2(config.jornadaDiariaObjetivo);
    }
    return result;
  }

  const e = parseTimeToMinutes(shift.entrada);
  let s = parseTimeToMinutes(shift.salida);
  
  if (s < e) {
    s += 1440;
  }

  let rawNightMins = 0;
  let rawDayMins = 0;

  for (let m = e; m < s; m++) {
    const minOfDay = m % 1440;
    if (isNighttimeMinute(minOfDay, config)) {
      rawNightMins++;
    } else {
      rawDayMins++;
    }
  }

  let descansoMins = 0;
  if (shift.descanso !== undefined && shift.descanso > 0) {
    descansoMins = Math.round(shift.descanso * 60);
  } else {
    let coversBreak = false;
    for (let m = e; m < s; m++) {
      const minOfDay = m % 1440;
      if (minOfDay === 870) { 
        coversBreak = true;
        break;
      }
    }
    
    if (coversBreak) {
      descansoMins = Math.round(config.horario.descansoDefault * 60);
    }
  }

  let effDayMins = rawDayMins;
  let effNightMins = rawNightMins;
  let remainingBreak = descansoMins;

  const subDay = Math.min(effDayMins, remainingBreak);
  effDayMins -= subDay;
  remainingBreak -= subDay;
  if (remainingBreak > 0) {
    effNightMins = Math.max(0, effNightMins - remainingBreak);
  }

  const totalEffectiveHours = (effDayMins + effNightMins) / 60;
  result.total = round2(totalEffectiveHours);

  const baseObjetivo = festivo ? 0 : config.jornadaDiariaObjetivo;
  
  if (festivo) {
    result.festivas = round2(totalEffectiveHours);
    if (shift.opcion === 'Cobrar') {
      result.dinero = round2(totalEffectiveHours * config.tarifas.festiva);
    } else {
      result.bolsa = round2(totalEffectiveHours * config.bolsa.multiplicador);
    }
  } else {
    let extraDayMins = 0;
    let extraNightMins = 0;
    
    if (totalEffectiveHours > baseObjetivo) {
      const extraMins = Math.round((totalEffectiveHours - baseObjetivo) * 60);
      let collected = 0;
      // Recorrer hacia atrás desde la salida para ver si las extras caen en noche o día
      for (let m = s - 1; m >= e && collected < extraMins; m--) {
        const minOfDay = (m % 1440 + 1440) % 1440;
        if (isNighttimeMinute(minOfDay, config)) {
          extraNightMins++;
        } else {
          extraDayMins++;
        }
        collected++;
      }
    }
    
    result.extNoct = round2(extraNightMins / 60);
    result.extDiur = round2(extraDayMins / 60);
    
    if (shift.opcion === 'Cobrar') {
      result.dinero = round2((result.extDiur * config.tarifas.diurna) + (result.extNoct * config.tarifas.nocturna));
    } else {
      result.bolsa = round2((result.extDiur * 1) + (result.extNoct * config.bolsa.multiplicador));
    }
  }
  
  if (totalEffectiveHours < baseObjetivo) {
    result.deber = round2(baseObjetivo - totalEffectiveHours);
  } else {
    result.deber = 0;
  }

  return result;
}

export const DEFAULT_CONFIG: WorkConfig = {
  horario: {
    entradaDefault: "09:00",
    salidaDefault: "18:00",
    descansoDefault: 1.0,
  },
  semanaHorasObjetivo: 40,
  jornadaDiariaObjetivo: 8,
  nocturna: {
    inicio: "22:00",
    fin: "08:00",
  },
  tarifas: {
    diurna: 12,
    nocturna: 14,
    festiva: 14,
  },
  bolsa: {
    multiplicador: 1.5,
  },
};
