const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace text-2xl with text-xl in App.tsx
code = code.replaceAll('text-2xl', 'text-xl');

// And remove the "Trabajadas" and "Objetivo" stats blocks that user asked to remove.
// I already ran a patch to remove "Trabajadas" and "Objetivo", but let's double check if it succeeded. 
// Oh, the previous `patch_trabajadas.cjs` failed? Let's fix it by simpler replacements.

const regexStats = /<div className="flex justify-between items-center bg-\[#1C1C1E\] p-3 rounded-xl border border-\[#2C2C2E\]">\s*<span className="text-\[#8E8E93\] font-semibold text-xs uppercase tracking-wider">Trabajadas<\/span>\s*<span className="text-white font-black text-lg">.*?<\/span>\s*<\/div>\s*<div className="flex justify-between items-center bg-\[#1C1C1E\] p-3 rounded-xl border border-\[#2C2C2E\]">\s*<span className="text-\[#8E8E93\] font-semibold text-xs uppercase tracking-wider">Objetivo<\/span>\s*<span className="text-white font-black text-lg">.*?<\/span>\s*<\/div>/g;

code = code.replace(regexStats, '');

fs.writeFileSync('src/App.tsx', code);
