const fs = require('fs');
let code = fs.readFileSync('src/utils/calculator.ts', 'utf8');

const isInsideScheduleFn = `
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
`;

code = code.replace(/export function isInsideSchedule[\s\S]*?\}\n/, isInsideScheduleFn);

let defaultConfig = `export const DEFAULT_CONFIG: WorkConfig = {
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
};`;

code = code.replace(/export const DEFAULT_CONFIG: WorkConfig = \{[\s\S]*?\};/, defaultConfig);

fs.writeFileSync('src/utils/calculator.ts', code);
