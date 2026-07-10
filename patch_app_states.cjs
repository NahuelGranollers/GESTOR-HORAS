const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const \[quickEntrada, setQuickEntrada\] = useState\(config\.horario\.entradaDefault\);/, "const [quickEntrada, setQuickEntrada] = useState(config.horario.entradaDefault);\n  const [quickEntrada2, setQuickEntrada2] = useState(config.horario.entrada2Default || '');\n  const [quickSalida2, setQuickSalida2] = useState(config.horario.salida2Default || '');");

code = code.replace(/setQuickEntrada\(config\.horario\.entradaDefault\);/, "setQuickEntrada(config.horario.entradaDefault);\n    setQuickEntrada2(config.horario.entrada2Default || '');\n    setQuickSalida2(config.horario.salida2Default || '');");

fs.writeFileSync('src/App.tsx', code);
