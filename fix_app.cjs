const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Ensure ChevronRight is imported
const importRegex = /import \{\s*Settings,\s*Calendar\s*,\s*Clock,\s*ChevronDown,\s*ChevronLeft,\s*ChevronRight\s*,\s*Download,\s*Upload\s*\} from 'lucide-react';/;
if (!code.match(importRegex)) {
  code = code.replace(/import \{ Settings, Calendar, Clock, ChevronDown, ChevronLeft, ChevronRight, Download, Upload \} from 'lucide-react';/, "import { Settings, Calendar, Clock, ChevronDown, ChevronLeft, ChevronRight, Download, Upload } from 'lucide-react';");
}

// Ah! Let's just fix the import properly
code = code.replace(/import \{([\s\S]*?)\} from 'lucide-react';/, (match, p1) => {
  if (!p1.includes('ChevronRight')) {
    return `import {${p1}, ChevronRight} from 'lucide-react';`;
  }
  return match;
});

fs.writeFileSync('src/App.tsx', code);
