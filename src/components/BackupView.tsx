/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { MonthData, MonthCalculations, WorkConfig } from '../types';
import { Download, Upload, FileSpreadsheet, Printer, Copy, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface BackupViewProps {
  year: number;
  month: number;
  appData: MonthData;
  calculations: MonthCalculations;
  config: WorkConfig;
  onImportData: (importedData: MonthData, importedConfig?: WorkConfig) => void;
}

export default function BackupView({
  year,
  month,
  appData,
  calculations,
  config,
  onImportData,
}: BackupViewProps) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Format month index to string (e.g. 7 -> "08")
  const padStr = (num: number) => String(num).padStart(2, '0');

  // CSV Exporter
  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Spanish accents in Excel
    csvContent += 'Fecha;Día;Tipo;Entrada;Salida;Descanso (h);Ausencia (h);Efectivas;Extra Diurna (h);Extra Nocturna (h);A Deber (h);Extra (€);Bolsa (h)\n';

    for (let i = 1; i <= daysInMonth; i++) {
      const shift = appData[i];
      const calc = calculations[i];
      const dateStr = `${year}-${padStr(month + 1)}-${padStr(i)}`;
      const dateObj = new Date(year, month, i);
      const dayName = dayNamesShort[dateObj.getDay()];

      const isFest = shift?.festivo || (dateObj.getDay() === 0 || dateObj.getDay() === 6);
      const tipo = isFest ? 'Festivo' : 'Laborable';

      if (shift && shift.entrada && shift.salida) {
        const total = calc?.total ?? 0;
        const extDiu = calc?.extDiur ?? 0;
        const extNoc = calc?.extNoct ?? 0;
        const deb = calc?.deber ?? 0;
        const din = calc?.dinero ?? 0;
        const bol = calc?.bolsa ?? 0;

        csvContent += `${dateStr};${dayName};${tipo};${shift.entrada};${shift.salida};${shift.descanso};${shift.ausencia};${total.toFixed(2)};${extDiu.toFixed(2)};${extNoc.toFixed(2)};${deb.toFixed(2)};${din.toFixed(2)};${bol.toFixed(2)}\n`;
      } else {
        const deb = calc?.deber ?? 0;
        csvContent += `${dateStr};${dayName};${tipo};;;;;;0.00;0.00;${deb.toFixed(2)};0.00;0.00\n`;
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HorasPro_Reporte_${year}_${padStr(month + 1)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Exporter
  const handleExportJSONFile = () => {
    const backupObj = {
      version: 'HorasProV6',
      year,
      month,
      config,
      appData,
    };

    const str = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HorasPro_Backup_${year}_${padStr(month + 1)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy JSON to Clipboard
  const handleCopyJSON = () => {
    const backupObj = {
      version: 'HorasProV6',
      year,
      month,
      config,
      appData,
    };
    navigator.clipboard.writeText(JSON.stringify(backupObj, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Manual Text Import
  const handleImportText = () => {
    setImportError(null);
    setImportSuccess(false);

    try {
      const parsed = JSON.parse(importText);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('El formato JSON no es válido.');
      }
      if (parsed.version !== 'HorasProV6' && !parsed.gestorHorasDataV5 && !parsed.entrada) {
        // Simple validation, let's accept V5 structure as well for compatibility!
        throw new Error('Copia de seguridad incompatible o corrupta.');
      }

      // Check format and import
      let finalData: MonthData = {};
      if (parsed.appData) {
        finalData = parsed.appData;
      } else {
        // Assume direct day-index object if V5 structure
        finalData = parsed;
      }

      onImportData(finalData, parsed.config);
      setImportSuccess(true);
      setImportText('');
    } catch (err: any) {
      setImportError(err.message || 'Error al procesar el JSON. Verifica los caracteres.');
    }
  };

  // File Import handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object') {
          let finalData: MonthData = {};
          if (parsed.appData) {
            finalData = parsed.appData;
          } else {
            // Check compatibility with V5 backup
            finalData = parsed;
          }
          onImportData(finalData, parsed.config);
          setImportSuccess(true);
        } else {
          throw new Error('Archivo de copia inválido.');
        }
      } catch (err: any) {
        setImportError('Error al leer el archivo JSON: ' + (err.message || 'formato inválido'));
      }
    };
    reader.readAsText(file);
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Download className="w-5 h-5 text-[#30D158]" />
        <h3 className="text-lg font-bold text-white">Exportar y Copias de Seguridad</h3>
      </div>

      {/* Grid Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Export Options */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 space-y-4 shadow-sm">
          <h4 className="text-[#8E8E93] text-xs font-bold uppercase tracking-widest border-b border-[#2C2C2E] pb-3 mb-3">
            Descargas e Informes
          </h4>
          <p className="text-xs text-[#8E8E93] leading-relaxed">
            Genera e imprime informes del mes actual ({monthNames[month]} {year}). Puedes exportar a Excel / Hojas de cálculo de Google o guardar en PDF.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-between w-full bg-[#30D158]/10 hover:bg-[#30D158]/20 border border-[#30D158]/30 rounded-xl p-3.5 text-sm text-[#30D158] font-bold transition-all"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Exportar a Excel (CSV)
              </span>
              <span className="text-[10px] uppercase font-bold bg-[#30D158]/20 px-2 py-0.5 rounded">.CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-between w-full bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 border border-[#0A84FF]/30 rounded-xl p-3.5 text-sm text-[#0A84FF] font-bold transition-all"
            >
              <span className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Imprimir / Guardar PDF
              </span>
              <span className="text-[10px] uppercase font-bold bg-[#0A84FF]/20 px-2 py-0.5 rounded">PDF</span>
            </button>
          </div>
        </div>

        {/* Backups Export */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-[#8E8E93] text-xs font-bold uppercase tracking-widest border-b border-[#2C2C2E] pb-3 mb-3">
              Exportar Copia de Seguridad
            </h4>
            <p className="text-xs text-[#8E8E93] leading-relaxed mb-4">
              Conserva una copia de tus registros mensuales y configuraciones del convenio fuera de este navegador en formato JSON.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExportJSONFile}
              className="flex items-center justify-center gap-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] border-none rounded-xl p-3 text-xs text-white font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              Descargar .json
            </button>

            <button
              onClick={handleCopyJSON}
              className="flex items-center justify-center gap-2 bg-[#2C2C2E] hover:bg-[#3A3A3C] border-none rounded-xl p-3 text-xs text-white font-bold transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#30D158]" />
                  <span className="text-[#30D158]">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Código
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backup Import Section */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 shadow-sm space-y-4">
        <h4 className="text-[#8E8E93] text-xs font-bold uppercase tracking-widest border-b border-[#2C2C2E] pb-3 mb-3">
          Restaurar Copia de Seguridad
        </h4>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          Sube tu archivo de copia `.json` descargado anteriormente o pega el bloque de texto de copia para restaurar todo al instante.
        </p>

        {importError && (
          <div className="bg-[#FF453A]/10 border border-[#FF453A]/20 text-[#FF453A] rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {importSuccess && (
          <div className="bg-[#30D158]/10 border border-[#30D158]/20 text-[#30D158] rounded-xl p-3 flex items-center gap-2 text-xs font-semibold">
            <Check className="w-4 h-4 shrink-0" />
            <span>¡Copia de seguridad cargada y restaurada con éxito!</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            {/* File Upload Trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-[#2C2C2E] hover:bg-[#3A3A3C] border border-[#38383A] rounded-xl px-4 py-2 text-xs text-white font-semibold transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Seleccionar archivo .json
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <span className="text-xs text-[#8E8E93] italic">O pega el código abajo:</span>
          </div>

          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='Pega aquí tu JSON de copia de seguridad (ej: {"version": "HorasProV6", ...})'
            className="w-full h-32 bg-[#2C2C2E] text-white font-mono text-xs border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#30D158] transition-all resize-none shadow-inner"
          />

          <div className="flex justify-end">
            <button
              onClick={handleImportText}
              disabled={!importText.trim()}
              className="px-6 py-3 bg-[#30D158] hover:bg-[#24a841] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-[#30D158]/20"
            >
              Procesar y Restaurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
