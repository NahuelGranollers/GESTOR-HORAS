const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('const [quickNotas, setQuickNotas] = useState(')) {
  code = code.replace(/const \[quickSalida2, setQuickSalida2\] = useState.*?;\n/, "const [quickSalida2, setQuickSalida2] = useState(config.horario.salida2Default || '');\n  const [quickNotas, setQuickNotas] = useState('');\n");
}

fs.writeFileSync('src/App.tsx', code);
