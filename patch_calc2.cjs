const fs = require('fs');
let code = fs.readFileSync('src/utils/calculator.ts', 'utf8');

const calcBodyRegex = /let rawNormalMins = 0;[\s\S]*?return result;/;

const newCalcBody = `
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
      result.bolsa = round2((result.extDiur * 1) + (result.extNoct * config.bolsa.multiplicador));
    }
    
    result.bolsa = round2(result.bolsa - result.deber);
  }

  return result;
`;

code = code.replace(calcBodyRegex, newCalcBody);
fs.writeFileSync('src/utils/calculator.ts', code);
