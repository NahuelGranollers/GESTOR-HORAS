const fs = require('fs');
let code = fs.readFileSync('src/utils/calculator.ts', 'utf8');

const replacement = `
    let totalWorked = totalEffectiveHours;
    let normalHours = effNormalMins / 60;
    let extDiur = effExtraDayMins / 60;
    let extNoct = effExtraNightMins / 60;

    if (totalWorked < baseObjetivo) {
      result.deber = round2(baseObjetivo - totalWorked);
      result.extDiur = 0;
      result.extNoct = 0;
    } else {
      result.deber = 0;
      if (normalHours > baseObjetivo) {
        const overflow = normalHours - baseObjetivo;
        extDiur += overflow;
      } else {
        const gap = baseObjetivo - normalHours;
        if (extDiur >= gap) {
          extDiur -= gap;
        } else {
          let rem = gap - extDiur;
          extDiur = 0;
          extNoct -= rem;
        }
      }
      result.extDiur = round2(extDiur);
      result.extNoct = round2(extNoct);
    }

    if (shift.opcion === 'Cobrar') {
      result.dinero = round2((result.extDiur * config.tarifas.diurna) + (result.extNoct * config.tarifas.nocturna));
    } else {
      result.bolsa = round2((result.extDiur * 1) + (result.extNoct * config.bolsa.multiplicador));
    }
    
    result.bolsa = round2(result.bolsa - result.deber);
`;

const regex = /let normalHours = effNormalMins \/ 60;[\s\S]*?result\.bolsa = round2\(result\.bolsa - result\.deber\);/;

code = code.replace(regex, replacement);

fs.writeFileSync('src/utils/calculator.ts', code);
