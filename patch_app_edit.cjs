const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<EditSheet[\s\S]*?onClose=\{.*?\}\n\s*\/>/;

const replacement = `<EditSheet
            isOpen={isEditOpen}
            day={editingDay}
            month={month}
            year={year}
            shift={currentMonthData[editingDay]}
            config={config}
            onSave={(day, newShift) => {
              handleSaveDayShift(day, newShift);
            }}
            onClear={(day) => {
              handleClearDayShift(day);
            }}
            onClose={() => setIsEditOpen(false)}
            onPrevDay={() => {
              if (editingDay > 1) {
                setEditingDay(editingDay - 1);
              }
            }}
            onNextDay={() => {
              if (editingDay < daysInMonth) {
                setEditingDay(editingDay + 1);
              }
            }}
          />`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
