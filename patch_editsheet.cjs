const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

const propsRegex = /interface EditSheetProps \{[\s\S]*?config: WorkConfig;\n\}/;
const propsReplacement = `interface EditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  month: number;
  year: number;
  shift: DayShift | undefined;
  onSave: (day: number, shift: DayShift) => void;
  onClear: (day: number) => void;
  config: WorkConfig;
  onPrevDay?: () => void;
  onNextDay?: () => void;
}`;
code = code.replace(propsRegex, propsReplacement);

const paramsRegex = /export default function EditSheet\(\{[\s\S]*?config,\n\}: EditSheetProps\) \{/;
const paramsReplacement = `export default function EditSheet({
  isOpen,
  onClose,
  day,
  month,
  year,
  shift,
  onSave,
  onClear,
  config,
  onPrevDay,
  onNextDay,
}: EditSheetProps) {`;
code = code.replace(paramsRegex, paramsReplacement);

const handleSaveRegex = /const handleSave = \(\) => \{[\s\S]*?onClose\(\);\n\s*\};/;
const handleSaveReplacement = `const handleSave = () => {
    onSave(day, {
      entrada,
      salida,
      entrada2,
      salida2,
      nextDay,
      descanso: shift?.descanso || 0,
      ausencia: 0,
      festivo,
      opcion,
      notas,
    });
  };

  const handleSaveAndClose = () => {
    handleSave();
    onClose();
  };

  const handleSaveAndPrev = () => {
    handleSave();
    if (onPrevDay) onPrevDay();
  };

  const handleSaveAndNext = () => {
    handleSave();
    if (onNextDay) onNextDay();
  };`;
code = code.replace(handleSaveRegex, handleSaveReplacement);

const buttonsRegex = /<button\s*onClick=\{handleSave\}\s*className="flex-1 bg-white text-black font-black py-4 rounded-2xl text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white\/10 active:scale-\[0\.98\]"\s*>\s*Guardar\s*<\/button>/;
const buttonsReplacement = `<button 
                    onClick={handleSaveAndClose}
                    className="flex-1 bg-white text-black font-black py-4 rounded-2xl text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 active:scale-[0.98]"
                  >
                    Guardar
                  </button>`;
code = code.replace(buttonsRegex, buttonsReplacement);

const headerRegex = /<h2 className="text-white text-2xl font-black uppercase tracking-widest flex items-center gap-2">[\s\S]*?<\/h2>/;
const headerReplacement = `<div className="flex items-center gap-4">
                  <h2 className="text-white text-xl font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="text-[#8E8E93] text-sm">Día</span> {day}
                  </h2>
                  <div className="flex bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl overflow-hidden">
                    <button onClick={handleSaveAndPrev} className="px-3 py-1.5 hover:bg-[#2C2C2E] transition-colors border-r border-[#2C2C2E]">
                      <ChevronRight className="w-4 h-4 text-[#8E8E93] rotate-180" />
                    </button>
                    <button onClick={handleSaveAndNext} className="px-3 py-1.5 hover:bg-[#2C2C2E] transition-colors">
                      <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
                    </button>
                  </div>
                </div>`;
code = code.replace(headerRegex, headerReplacement);

const chevronImportRegex = /import \{[\s\S]*?\} from 'lucide-react';/;
code = code.replace(chevronImportRegex, (match) => {
  if (!match.includes('ChevronRight')) {
    return match.replace('}', ', ChevronRight }');
  }
  return match;
});

// Also make the font smaller as requested: replace text-2xl with text-xl
code = code.replaceAll('text-2xl', 'text-xl');

fs.writeFileSync('src/components/EditSheet.tsx', code);
