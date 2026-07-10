const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/opcion: 'Bolsa' \| 'Cobrar';/, "opcion: 'Bolsa' | 'Cobrar';\n  notas?: string;");

fs.writeFileSync('src/types.ts', code);
