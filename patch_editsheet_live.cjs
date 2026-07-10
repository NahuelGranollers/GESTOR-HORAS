const fs = require('fs');
let code = fs.readFileSync('src/components/EditSheet.tsx', 'utf8');

const regex = /\{\/\* Live Preview Card \*\/\}/;

const notasInput = `
              <div className="bg-[#0A0A0A] p-5 rounded-3xl border border-[#2C2C2E] flex flex-col">
                <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2">
                  Notas / Lugar
                </label>
                <input
                  type="text"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Oficina central, remoto..."
                  className="w-full bg-transparent text-white text-base outline-none border-none p-0 focus:ring-0 placeholder-[#8E8E93]/50"
                />
              </div>

              {/* Live Preview Card */}`;

code = code.replace(regex, notasInput);

const livePreviewRegex = /\{previewCalc\.total > 0 && \([\s\S]*?<\/div>\s*\)\}/;

const livePreviewReplacement = `{previewCalc.total > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8E8E93] text-sm font-bold uppercase tracking-widest">Totales</span>
                        <span className="font-mono text-white text-lg font-black">
                          {formatHours(previewCalc.total)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#30D158] text-sm font-bold uppercase tracking-widest">Laborables</span>
                        <span className="font-mono text-[#30D158] text-lg font-black">
                          {formatHours(previewCalc.total - previewCalc.extDiur - previewCalc.extNoct - previewCalc.festivas)}
                        </span>
                      </div>
                    </>
                  )}`;

code = code.replace(livePreviewRegex, livePreviewReplacement);

fs.writeFileSync('src/components/EditSheet.tsx', code);
