const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

// 1. Replace the header
const headerRegex = /<div className="px-6 pb-6 pt-2 flex items-center justify-between">[\s\S]*?<X className="w-5 h-5" \/>\s*<\/button>\s*<\/div>/;

const headerReplacement = `<div className="px-6 pb-6 pt-2 flex items-center justify-between">
              <div>
                <span className="text-[#0A84FF] text-xs font-bold uppercase tracking-widest block mb-1">Editor de Turno</span>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {dayNames[dayOfWeek]}, {day} {monthNames[month]}
                  </h3>
                  <div className="flex bg-[#2C2C2E] rounded-xl overflow-hidden ml-2 border border-[#3A3A3C]">
                    <button onClick={handleSaveAndPrev} className="px-2 py-1.5 hover:bg-[#3A3A3C] transition-colors border-r border-[#3A3A3C]">
                      <ChevronRight className="w-4 h-4 text-[#8E8E93] rotate-180" />
                    </button>
                    <button onClick={handleSaveAndNext} className="px-2 py-1.5 hover:bg-[#3A3A3C] transition-colors">
                      <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#2C2C2E] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors border border-[#3A3A3C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>`;

code = code.replace(headerRegex, headerReplacement);

// 2. Add entrada2 and salida2 back to the form grid
const formGridRegex = /<div className="flex gap-4">\s*<div className="flex-1 bg-\[#0A0A0A\] p-4 rounded-3xl border border-\[#2C2C2E\] flex flex-col relative group">[\s\S]*?<\/button>\s*<\/div>\s*<input\s*type="time"[\s\S]*?className="w-full bg-transparent text-white text-xl font-black outline-none border-none p-0 focus:ring-0 \[\&::-webkit-calendar-picker-indicator\]:opacity-0 \[\&::-webkit-calendar-picker-indicator\]:absolute \[\&::-webkit-calendar-picker-indicator\]:w-full"\s*\/>\s*<\/div>\s*<\/div>/;

const formGridReplacement = `<div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Entrada 1
                    </label>
                    <input
                      type="time" 
                      value={entrada}
                      onChange={(e) => setEntrada(e.target.value)}
                      className="w-full bg-transparent text-white text-xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                    />
                  </div>
                  <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Salida 1
                    </label>
                    <input
                      type="time" 
                      value={salida}
                      onChange={(e) => setSalida(e.target.value)}
                      className="w-full bg-transparent text-white text-xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Entrada 2
                    </label>
                    <input
                      type="time" 
                      value={entrada2}
                      onChange={(e) => setEntrada2(e.target.value)}
                      className="w-full bg-transparent text-white text-xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                    />
                  </div>
                  <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Salida 2
                      </label>
                      <button 
                        onClick={() => setNextDay(!nextDay)}
                        className={\`text-[9px] font-bold px-2 py-1 rounded-lg transition-colors \${nextDay ? 'bg-[#BF5AF2] text-white' : 'bg-[#2C2C2E] text-[#8E8E93]'}\`}
                      >
                        +1 Día
                      </button>
                    </div>
                    <input 
                      type="time"
                      value={salida2}
                      onChange={(e) => setSalida2(e.target.value)}
                      className="w-full bg-transparent text-white text-xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                    />
                  </div>
                </div>
              </div>`;

code = code.replace(formGridRegex, formGridReplacement);

// Just in case formGridRegex failed, let's write the code out to a new file so we can check it
fs.writeFileSync('src/components/EditSheet.tsx', code);
