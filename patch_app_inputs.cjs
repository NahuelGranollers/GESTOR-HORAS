const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const quickAddInputs = `              <div className="flex gap-4">
                <div className="flex-1 bg-[#1C1C1E] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <div className="flex items-center mb-2">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Entrada 2
                    </label>
                  </div>
                  <input
                    type="time" 
                    value={quickEntrada2}
                    onChange={(e) => setQuickEntrada2(e.target.value)}
                    className="w-full bg-transparent text-white text-2xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                  />
                </div>
                
                <div className="flex-1 bg-[#1C1C1E] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Salida 2
                    </label>
                  </div>
                  <input
                    type="time" 
                    value={quickSalida2}
                    onChange={(e) => setQuickSalida2(e.target.value)}
                    className="w-full bg-transparent text-white text-2xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                  />
                </div>
              </div>`;

code = code.replace(/<div className="flex gap-4">\s*<div className="flex-1 bg-\[#1C1C1E\] p-4 rounded-3xl border border-\[#2C2C2E\] flex flex-col relative group">[\s\S]*?<\/button>\s*<\/div>\s*<input\s*type="time"\s*value=\{quickSalida\}[\s\S]*?\/>\s*<\/div>\s*<\/div>/, "$&\n" + quickAddInputs);

fs.writeFileSync('src/App.tsx', code);
