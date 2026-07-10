const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

code = code.replace(/const \[entrada, setEntrada\] = useState\(''\);/, "const [entrada, setEntrada] = useState('');\n  const [salida, setSalida] = useState('');\n  const [entrada2, setEntrada2] = useState('');\n  const [salida2, setSalida2] = useState('');");
code = code.replace(/const \[salida, setSalida\] = useState\(''\);\n/, "");

code = code.replace(/setEntrada\(shift\.entrada \|\| config\.horario\.entradaDefault\);/, "setEntrada(shift.entrada || config.horario.entradaDefault);\n        setSalida(shift.salida || config.horario.salidaDefault);\n        setEntrada2(shift.entrada2 || config.horario.entrada2Default || '');\n        setSalida2(shift.salida2 || config.horario.salida2Default || '');");
code = code.replace(/setSalida\(shift\.salida \|\| config\.horario\.salidaDefault\);\n/, "");

code = code.replace(/setEntrada\(config\.horario\.entradaDefault\);/, "setEntrada(config.horario.entradaDefault);\n        setSalida(config.horario.salidaDefault);\n        setEntrada2(config.horario.entrada2Default || '');\n        setSalida2(config.horario.salida2Default || '');");
code = code.replace(/setSalida\(config\.horario\.salidaDefault\);\n/, "");

code = code.replace(/const previewShift: DayShift = \{\n    entrada,\n    salida,/, "const previewShift: DayShift = {\n    entrada,\n    salida,\n    entrada2,\n    salida2,");

code = code.replace(/onSave\(day, \{\n      entrada,\n      salida,/, "onSave(day, {\n      entrada,\n      salida,\n      entrada2,\n      salida2,");

let htmlInput = `<div className="flex gap-4">
                <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <div className="flex items-center mb-2">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Entrada 2
                    </label>
                  </div>
                  <input
                    type="time"
                    value={entrada2}
                    onChange={(e) => setEntrada2(e.target.value)}
                    className="w-full bg-transparent text-white text-2xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                  />
                </div>
                <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <div className="flex items-center mb-2">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Salida 2
                    </label>
                  </div>
                  <input
                    type="time"
                    value={salida2}
                    onChange={(e) => setSalida2(e.target.value)}
                    className="w-full bg-transparent text-white text-2xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                  />
                </div>
              </div>`;

code = code.replace(/<div className="flex gap-4">\s*<div className="flex-1 bg-\[#0A0A0A\] p-4 rounded-3xl border border-\[#2C2C2E\] flex flex-col relative group">[\s\S]*?<\/label>\s*<\/div>\s*<\/div>\s*<\/div>/, "$&\n              " + htmlInput);

fs.writeFileSync('src/components/EditSheet.tsx', code);
