const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const quickEntrada = config\.horario\.entradaDefault;\n    const quickSalida = config\.horario\.salidaDefault;/, "const quickEntrada = config.horario.entradaDefault;\n    const quickSalida = config.horario.salidaDefault;\n    const quickEntrada2 = config.horario.entrada2Default;\n    const quickSalida2 = config.horario.salida2Default;");

code = code.replace(/entrada: quickEntrada,\n      salida: quickSalida,/, "entrada: quickEntrada,\n      salida: quickSalida,\n      entrada2: quickEntrada2,\n      salida2: quickSalida2,");

code = code.replace(/descanso: config\.horario\.descansoDefault,/, "descanso: 0,");

fs.writeFileSync('src/App.tsx', code);
