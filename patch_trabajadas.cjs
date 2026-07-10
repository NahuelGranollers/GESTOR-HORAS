const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="mt-8 pt-6 border-t border-\[#2C2C2E\] grid grid-cols-2 gap-y-4 gap-x-6 text-sm">\s*<div className="flex justify-between items-center bg-\[#1C1C1E\] p-3 rounded-xl border border-\[#2C2C2E\]">\s*<span className="text-\[#8E8E93\] font-semibold text-xs uppercase tracking-wider">Trabajadas<\/span>\s*<span className="text-white font-black text-lg">\{formatHours\(monthCalculations\[selectedDay\]\.total\)\}<\/span>\s*<\/div>\s*<div className="flex justify-between items-center bg-\[#1C1C1E\] p-3 rounded-xl border border-\[#2C2C2E\]">\s*<span className="text-\[#8E8E93\] font-semibold text-xs uppercase tracking-wider">Objetivo<\/span>\s*<span className="text-white font-black text-lg">\{\(currentMonthData\[selectedDay\]\.festivo \|\| selIsWeekend\) \? '00:00h' : formatHours\(config\.jornadaDiariaObjetivo\)\}<\/span>\s*<\/div>/;

code = code.replace(regex, '<div className="mt-8 pt-6 border-t border-[#2C2C2E] grid grid-cols-2 gap-y-4 gap-x-6 text-sm">');
fs.writeFileSync('src/App.tsx', code);
