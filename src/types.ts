/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WorkConfig {
  horario: {
    entradaDefault: string;   // e.g., "09:00"
    salidaDefault: string;    // e.g., "18:00"
    descansoDefault: number;  // e.g., 1.0 (hour)
  };
  semanaHorasObjetivo: number;  // e.g., 40
  jornadaDiariaObjetivo: number; // e.g., 8
  nocturna: {
    inicio: string; // e.g., "22:00"
    fin: string;    // e.g., "08:00"
  };
  tarifas: {
    diurna: number;   // e.g., 12 €/h
    nocturna: number; // e.g., 14 €/h
    festiva: number;  // e.g., 14 €/h
  };
  bolsa: {
    multiplicador: number; // e.g., 1.5
  };
}

export interface DayShift {
  entrada: string;  // "HH:MM" or ""
  salida: string;   // "HH:MM" or ""
  descanso: number; // in hours
  ausencia: number; // in hours (hours of justified absence like doctor, etc.)
  festivo: boolean;
  opcion: 'Bolsa' | 'Cobrar';
}

export interface DayCalculation {
  total: number;       // Effective hours worked (salida - entrada - descanso)
  deber: number;       // Hours owed if total < target and not holiday
  extDiur: number;     // Daytime overtime hours
  extNoct: number;     // Nighttime overtime hours
  festivas: number;    // Holiday/weekend hours worked
  dinero: number;      // Earned compensation in Euros
  bolsa: number;       // Accumulated hours in time bank (Bolsa)
}

export interface MonthData {
  [day: number]: DayShift;
}

export interface MonthCalculations {
  [day: number]: DayCalculation;
}
