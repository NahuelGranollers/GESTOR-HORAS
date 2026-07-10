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



export function isInsideSchedule(minOfDay: number, config: WorkConfig): boolean {
  const schedE1 = parseTimeToMinutes(config.horario.entradaDefault);
  const schedS1 = parseTimeToMinutes(config.horario.salidaDefault);
  
  let inside1 = false;
  if (schedE1 !== schedS1) {
    if (schedE1 > schedS1) {
      inside1 = minOfDay >= schedE1 || minOfDay < schedS1;
    } else {
      inside1 = minOfDay >= schedE1 && minOfDay < schedS1;
    }
  }

  let inside2 = false;
  if (config.horario.entrada2Default && config.horario.salida2Default) {
    const schedE2 = parseTimeToMinutes(config.horario.entrada2Default);
    const schedS2 = parseTimeToMinutes(config.horario.salida2Default);
    if (schedE2 !== schedS2) {
      if (schedE2 > schedS2) {
        inside2 = minOfDay >= schedE2 || minOfDay < schedS2;
      } else {
        inside2 = minOfDay >= schedE2 && minOfDay < schedS2;
      }
    }
  }

  return inside1 || inside2;
}

export function formatHours(decimalHours: number): string {
  const isNegative = decimalHours < 0;
  const absHours = Math.abs(decimalHours);
  const h = Math.floor(absHours);
  const m = Math.round((absHours - h) * 60);
  
  if (m === 60) {
    return `${isNegative ? '-' : ''}${String(h + 1).padStart(2, '0')}:00h`;
  }
  return `${isNegative ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}h`;
}

export function shiftSpansInterval(entrada: string, salida: string, nextDay: boolean, startHour: number, endHour: number): boolean {
  if (!entrada || !salida) return false;
  const e = parseTimeToMinutes(entrada);
  let s = parseTimeToMinutes(salida);
  if (nextDay || s < e) {
    s += 1440;
  }
  const intStart = startHour * 60;
  const intEnd = endHour * 60;
  return e <= intStart && s >= intEnd;
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
  
  if (shift.nextDay || s < e) {
    s += 1440;
  }

  let rawNormalMins = 0;
  let rawExtraDayMins = 0;
  let rawExtraNightMins = 0;

  function processSegment(startMins: number, endMins: number) {
    for (let m = startMins; m < endMins; m++) {
      const minOfDay = m % 1440;
      if (isInsideSchedule(minOfDay, config)) {
        rawNormalMins++;
      } else if (isNighttimeMinute(minOfDay, config)) {
        rawExtraNightMins++;
      } else {
        rawExtraDayMins++;
      }
    }
  }

  processSegment(e, s);

  if (shift.entrada2 && shift.salida2) {
    const e2 = parseTimeToMinutes(shift.entrada2);
    let s2 = parseTimeToMinutes(shift.salida2);
    if (s2 < e2 || (shift.nextDay && s2 < e2)) {
      s2 += 1440;
    }
    processSegment(e2, s2);
  }

  let descansoMins = 0;
  if (shift.descanso !== undefined && shift.descanso > 0) {
    descansoMins = Math.round(shift.descanso * 60);
  }

  const isComidaActive = shift.comida !== undefined 
    ? shift.comida 
    : shiftSpansInterval(shift.entrada, shift.salida, shift.nextDay || false, 14, 15);
     
  const isCenaActive = shift.cena !== undefined 
    ? shift.cena 
    : shiftSpansInterval(shift.entrada, shift.salida, shift.nextDay || false, 21, 22);

  if (isComidaActive) {
    descansoMins += 60;
  }
  if (isCenaActive) {
    descansoMins += 60;
  }

  let effNormalMins = rawNormalMins;
  let effExtraDayMins = rawExtraDayMins;
  let effExtraNightMins = rawExtraNightMins;
  let remainingBreak = descansoMins;

  const subNormal = Math.min(effNormalMins, remainingBreak);
  effNormalMins -= subNormal;
  remainingBreak -= subNormal;

  if (remainingBreak > 0) {
    const subExtraDay = Math.min(effExtraDayMins, remainingBreak);
    effExtraDayMins -= subExtraDay;
    remainingBreak -= subExtraDay;
  }

  if (remainingBreak > 0) {
    const subExtraNight = Math.min(effExtraNightMins, remainingBreak);
    effExtraNightMins -= subExtraNight;
    remainingBreak -= subExtraNight;
  }

  const totalEffectiveHours = (effNormalMins + effExtraDayMins + effExtraNightMins) / 60;
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
    let normalHours = effNormalMins / 60;
    let extDiur = effExtraDayMins / 60;
    let extNoct = effExtraNightMins / 60;

    result.deber = round2(Math.max(0, baseObjetivo - normalHours));
    result.extDiur = round2(extDiur);
    result.extNoct = round2(extNoct);

    if (shift.opcion === 'Cobrar') {
      result.dinero = round2((result.extDiur * config.tarifas.diurna) + (result.extNoct * config.tarifas.nocturna));
    } else {
      result.bolsa = round2((result.extDiur * 1) + (result.extNoct * config.bolsa.multiplicador));
    }
    
    result.bolsa = round2(result.bolsa - result.deber);
  }

  return result;


}

export const DEFAULT_CONFIG: WorkConfig = {
  horario: {
    entradaDefault: "09:00",
    salidaDefault: "14:00",
    entrada2Default: "15:00",
    salida2Default: "18:00",
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
