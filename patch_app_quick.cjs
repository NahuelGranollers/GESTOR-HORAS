const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add quickNotas state
code = code.replace(/const \[quickSalida2, setQuickSalida2\] = useState\(''\);/, "const [quickSalida2, setQuickSalida2] = useState('');\n  const [quickNotas, setQuickNotas] = useState('');");

// Update useEffect to populate quickNotas
const useEffectRegex = /setQuickSalida\(shift\.salida\);\s*\} else \{/;
const useEffectReplacement = `setQuickSalida(shift.salida);
      setQuickNotas(shift.notas || '');
    } else {
      setQuickNotas('');`;
code = code.replace(useEffectRegex, useEffectReplacement);

// Update save to include quickNotas
const saveRegex = /salida2: quickSalida2,\s*\}\);/;
const saveReplacement = `salida2: quickSalida2,
      notas: quickNotas,
    });`;
code = code.replace(saveRegex, saveReplacement);

// 2. Add Notas input in UI
const uiRegex = /<button \s*onClick=\{handleSaveQuickEntry\}\s*className="w-full bg-white text-black font-black py-3 rounded-2xl text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white\/10 active:scale-\[0\.98\]"\s*>/;

const uiReplacement = `<div className="bg-[#1C1C1E] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group mb-6">
                <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2">
                  Notas / Lugar
                </label>
                <input
                  type="text" 
                  value={quickNotas}
                  onChange={(e) => setQuickNotas(e.target.value)}
                  placeholder="Ej: Oficina central, remoto..."
                  className="w-full bg-transparent text-white text-base outline-none border-none p-0 focus:ring-0 placeholder-[#8E8E93]/50" 
                />
              </div>

              <button 
                onClick={handleSaveQuickEntry}
                className="w-full bg-white text-black font-black py-3 rounded-2xl text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 active:scale-[0.98]"
              >`;
code = code.replace(uiRegex, uiReplacement);

// 3. Add Totales to the variations output
const totalsRegex = /\{monthCalculations\[selectedDay\]\.total > 0 && \(\s*<div className="flex justify-between items-center bg-\[#1C1C1E\] p-3 rounded-xl border border-\[#30D158\]\/30">/;

const totalsReplacement = `{monthCalculations[selectedDay].total > 0 && (
                    <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-white/20 col-span-2">
                      <span className="text-[#8E8E93] font-semibold text-xs uppercase tracking-wider">Totales</span>
                      <span className="text-white font-black text-lg">
                        {formatHours(monthCalculations[selectedDay].total)}
                      </span>
                    </div>
                  )}
                  {monthCalculations[selectedDay].total > 0 && (
                    <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-[#30D158]/30">`;
code = code.replace(totalsRegex, totalsReplacement);

// 4. Add Next / Prev buttons to the quick editor header
const quickHeaderRegex = /<h3 className="text-white font-bold text-xl tracking-tight">\s*\{dayNamesFull\[selDayOfWeek\]\}, \{selectedDay\}\s*<\/h3>/;

const quickHeaderReplacement = `<h3 className="text-white font-bold text-xl tracking-tight flex items-center gap-3">
                    {dayNamesFull[selDayOfWeek]}, {selectedDay}
                    <div className="flex bg-[#1C1C1E] rounded-xl overflow-hidden border border-[#2C2C2E] ml-2">
                      <button 
                        onClick={() => {
                          const prevDate = new Date(year, month, selectedDay - 1);
                          if (prevDate.getMonth() === month) setSelectedDay(selectedDay - 1);
                        }} 
                        className="px-2 py-1 hover:bg-[#2C2C2E] transition-colors border-r border-[#2C2C2E]"
                      >
                        <ChevronRight className="w-4 h-4 text-[#8E8E93] rotate-180" />
                      </button>
                      <button 
                        onClick={() => {
                          const nextDate = new Date(year, month, selectedDay + 1);
                          if (nextDate.getMonth() === month) setSelectedDay(selectedDay + 1);
                        }} 
                        className="px-2 py-1 hover:bg-[#2C2C2E] transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                      </button>
                    </div>
                  </h3>`;
code = code.replace(quickHeaderRegex, quickHeaderReplacement);

fs.writeFileSync('src/App.tsx', code);
