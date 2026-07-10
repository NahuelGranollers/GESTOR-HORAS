const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const quickEntrada = config\.horario\.entradaDefault;\n    const quickSalida = config\.horario\.salidaDefault;/, "const quickEntrada = config.horario.entradaDefault;\n    const quickSalida = config.horario.salidaDefault;\n    const quickEntrada2 = config.horario.entrada2Default;\n    const quickSalida2 = config.horario.salida2Default;");

fs.writeFileSync('src/App.tsx', code);
