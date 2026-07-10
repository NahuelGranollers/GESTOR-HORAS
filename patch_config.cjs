const fs = require('fs');
let code = fs.readFileSync('src/components/ConfigView.tsx', 'utf8');

const handleHardResetCode = `
  const handleHardReset = () => {
    if (confirm('ATENCIÓN: Se borrarán TODOS los datos de la aplicación y se restablecerá la caché. ¿Estás seguro?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (`;

code = code.replace(/return \(/, handleHardResetCode);

const buttonsCode = `
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[10px] text-[#FF453A] hover:bg-[#FF453A]/10 border border-[#FF453A]/20 rounded-xl px-2 py-1.5 transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar
          </button>
          <button
            type="button"
            onClick={handleHardReset}
            className="flex items-center gap-1.5 text-[10px] text-white bg-[#FF453A] hover:bg-[#FF453A]/80 shadow-lg shadow-[#FF453A]/20 rounded-xl px-2 py-1.5 transition-colors font-bold"
          >
            Refrescar Caché
          </button>
        </div>`;

const replaceTarget = /<button[\s\S]*?onClick=\{handleReset\}[\s\S]*?<\/button>/;

code = code.replace(replaceTarget, buttonsCode);

fs.writeFileSync('src/components/ConfigView.tsx', code);
