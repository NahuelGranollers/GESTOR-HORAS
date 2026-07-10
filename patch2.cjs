const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "salida: string;   // \"HH:MM\" or \"\"\\n  nextDay?: boolean;",
  "salida: string;   // \"HH:MM\" or \"\"\\n  entrada2?: string;\\n  salida2?: string;\\n  nextDay?: boolean;"
);

fs.writeFileSync('src/types.ts', code);
