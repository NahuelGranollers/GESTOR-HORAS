const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

code = code.replace(/import \{ DayShift, WorkConfig , ChevronRight \} from '\.\.\/types';/, "import { DayShift, WorkConfig } from '../types';");

code = code.replace(/import \{ X, Trash2, Clock \} from 'lucide-react';/, "import { X, Trash2, Clock, ChevronRight } from 'lucide-react';");

fs.writeFileSync('src/components/EditSheet.tsx', code);
