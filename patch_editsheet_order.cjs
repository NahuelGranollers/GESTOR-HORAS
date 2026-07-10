const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

const spaceyRegex = /<div className="space-y-4">\s*\{\(previewCalc\.extDiur > 0 \|\| previewCalc\.extNoct > 0 \|\| previewCalc\.festivas > 0 \|\| previewCalc\.deber > 0\) && \(\s*<div className="h-px bg-\[#2C2C2E\] w-full my-4"><\/div>\s*\)\}/;

const spaceyReplacement = `<div className="space-y-4">`;
code = code.replace(spaceyRegex, spaceyReplacement);

// Add divider after Totales & Laborables if there are extras or deber
const previewTotalRegex = /<\/div>\s*<\/>\s*\)\}/;

const previewTotalReplacement = `</div>
                    </>
                  )}
                  {(previewCalc.extDiur > 0 || previewCalc.extNoct > 0 || previewCalc.festivas > 0 || previewCalc.deber > 0) && (
                    <div className="h-px bg-[#2C2C2E] w-full my-4"></div>
                  )}`;

code = code.replace(previewTotalRegex, previewTotalReplacement);

fs.writeFileSync('src/components/EditSheet.tsx', code);
