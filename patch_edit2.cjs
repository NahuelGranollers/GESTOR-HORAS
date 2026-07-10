const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

code = code.replace(/const \[confirmClear, setConfirmClear\] = useState\(false\);/, "const [confirmClear, setConfirmClear] = useState(false);\n  const [notas, setNotas] = useState('');");

code = code.replace(/if \(shift\) \{\n\s*setEntrada\(shift\.entrada \|\| config\.horario\.entradaDefault\);\n\s*setEntrada2\(shift\.entrada2 \|\| config\.horario\.entrada2Default \|\| ''\);\n\s*setSalida2\(shift\.salida2 \|\| config\.horario\.salida2Default \|\| ''\);\n\s*setSalida\(shift\.salida \|\| config\.horario\.salidaDefault\);\n\s*setNextDay\(shift\.nextDay \|\| false\);\n\s*setFestivo\(shift\.festivo\);\n\s*setOpcion\(shift\.opcion \|\| 'Bolsa'\);\n\s*\}/, `if (shift) {
        setEntrada(shift.entrada ?? '');
        setEntrada2(shift.entrada2 ?? '');
        setSalida2(shift.salida2 ?? '');
        setSalida(shift.salida ?? '');
        setNextDay(shift.nextDay || false);
        setFestivo(shift.festivo);
        setOpcion(shift.opcion || 'Bolsa');
        setNotas(shift.notas || '');
      }`);

code = code.replace(/\} else \{\n\s*setEntrada\(config\.horario\.entradaDefault\);\n\s*setEntrada2\(config\.horario\.entrada2Default \|\| ''\);\n\s*setSalida2\(config\.horario\.salida2Default \|\| ''\);\n\s*setSalida\(config\.horario\.salidaDefault\);\n\s*setNextDay\(false\);\n\s*setFestivo\(isWeekend\);\n\s*setOpcion\('Bolsa'\);\n\s*\}/, `} else {
        setEntrada(config.horario.entradaDefault);
        setEntrada2(config.horario.entrada2Default || '');
        setSalida2(config.horario.salida2Default || '');
        setSalida(config.horario.salidaDefault);
        setNextDay(false);
        setFestivo(isWeekend);
        setOpcion('Bolsa');
        setNotas('');
      }`);

code = code.replace(/opcion,\n\s*\};\n\s*const previewCalc/, "opcion,\n    notas,\n  };\n  const previewCalc");

code = code.replace(/opcion,\n\s*\}\);\n\s*onClose\(\);/, "opcion,\n      notas,\n    });\n    onClose();");

// Reduce text size for times
code = code.replaceAll('text-2xl', 'text-xl');

// Add notas input field before actions
const notasHtml = `
              <div className="bg-[#1C1C1E] p-4 rounded-3xl border border-[#2C2C2E]">
                <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  Notas / Lugar
                </label>
                <input
                  type="text"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Oficina central, remoto..."
                  className="w-full bg-transparent text-white text-sm outline-none border-none p-0 focus:ring-0 placeholder-[#8E8E93]/50"
                />
              </div>
`;

code = code.replace(/<div className="flex justify-between items-center bg-\[#1C1C1E\] p-2 rounded-2xl border border-\[#2C2C2E\]">/, notasHtml + "\n              $&");

fs.writeFileSync('src/components/EditSheet.tsx', code);
