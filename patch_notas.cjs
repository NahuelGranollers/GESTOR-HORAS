const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<h3 className="text-white font-bold text-xl tracking-tight">\s*\{dayNamesFull\[selDayOfWeek\]\}, \{selectedDay\}\s*<\/h3>/;

const replacement = `<h3 className="text-white font-bold text-xl tracking-tight">
                    {dayNamesFull[selDayOfWeek]}, {selectedDay}
                  </h3>
                  {currentMonthData[selectedDay]?.notas && (
                    <span className="text-[#FF9F0A] text-sm font-medium mt-1 block flex items-center gap-1">
                      📍 {currentMonthData[selectedDay].notas}
                    </span>
                  )}`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
