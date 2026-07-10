const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

const regexEditStats = /<div className="flex justify-between items-center">\s*<span className="text-\[#8E8E93\] text-sm font-bold uppercase tracking-widest">Base<\/span>\s*<span className="font-mono text-white text-lg font-black">.*?<\/span>\s*<\/div>\s*<div className="flex justify-between items-center">\s*<span className="text-\[#8E8E93\] text-sm font-bold uppercase tracking-widest">Trabajadas<\/span>\s*<span className="font-mono text-white text-lg font-black">.*?<\/span>\s*<\/div>/g;

code = code.replace(regexEditStats, '');

fs.writeFileSync('src/components/EditSheet.tsx', code);
