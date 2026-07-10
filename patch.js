const fs = require('fs');
let code = fs.readFileSync('src/utils/calculator.ts', 'utf8');

// We need to add the isInsideSchedule function and modify calculateDayShift.
const isInsideScheduleFn = `
export function isInsideSchedule(minOfDay: number, config: WorkConfig): boolean {
  const schedE = parseTimeToMinutes(config.horario.entradaDefault);
  const schedS = parseTimeToMinutes(config.horario.salidaDefault);
  if (schedE === schedS) return false;
  if (schedE > schedS) {
    return minOfDay >= schedE || minOfDay < schedS;
  } else {
    return minOfDay >= schedE && minOfDay < schedS;
  }
}
`;

code = code.replace('export function formatHours', isInsideScheduleFn + '\nexport function formatHours');

const calcBodyRegex = /let rawNightMins = 0;[\s\S]*?return result;/;

const newCalcBody = `
  let rawNormalMins = 0;
  let rawExtraDayMins = 0;
  let rawExtraNightMins = 0;

  for (let m = e; m < s; m++) {
    const minOfDay = m % 1440;
    if (isInsideSchedule(minOfDay, config)) {
      rawNormalMins++;
    } else if (isNighttimeMinute(minOfDay, config)) {
      rawExtraNightMins++;
    } else {
      rawExtraDayMins++;
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

    if (normalHours > baseObjetivo) {
      const overflow = normalHours - baseObjetivo;
      extDiur += overflow;
      normalHours = baseObjetivo;
    }

    result.extDiur = round2(extDiur);
    result.extNoct = round2(extNoct);
    result.deber = round2(baseObjetivo - normalHours);

    if (shift.opcion === 'Cobrar') {
      result.dinero = round2((result.extDiur * config.tarifas.diurna) + (result.extNoct * config.tarifas.nocturna));
    } else {
      // "set normal work hours to x1, and ensure that only nocturnas, festivas, or weekend hours apply the x1.5 multiplier (Bolsa)"
      // So extra diurna is x1, extra nocturna is multiplier.
      result.bolsa = round2((result.extDiur * 1) + (result.extNoct * config.bolsa.multiplicador));
    }
    
    // We already calculated deber, subtract it from bolsa.
    result.bolsa = round2(result.bolsa - result.deber);
  }

  return result;
`;

code = code.replace(calcBodyRegex, newCalcBody);
fs.writeFileSync('src/utils/calculator.ts', code);
