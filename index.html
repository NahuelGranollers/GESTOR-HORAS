/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkConfig } from '../types';
import { Settings, Save, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfigViewProps {
  config: WorkConfig;
  onSaveConfig: (newConfig: WorkConfig) => void;
  onResetConfig: () => void;
}

export default function ConfigView({
  config,
  onSaveConfig,
  onResetConfig,
}: ConfigViewProps) {
  // Local states
  const [entradaDefault, setEntradaDefault] = useState('09:00');
  const [salidaDefault, setSalidaDefault] = useState('18:00');
  const [descansoDefault, setDescansoDefault] = useState(1.0);
  const [jornadaDiaria, setJornadaDiaria] = useState(8.0);
  const [semanaHoras, setSemanaHoras] = useState(40.0);
  const [nocturnaInicio, setNocturnaInicio] = useState('22:00');
  const [nocturnaFin, setNocturnaFin] = useState('08:00');
  const [tarifaDiurna, setTarifaDiurna] = useState(12.0);
  const [tarifaNocturna, setTarifaNocturna] = useState(14.0);
  const [tarifaFestiva, setTarifaFestiva] = useState(14.0);
  const [bolsaMultiplicador, setBolsaMultiplicador] = useState(1.5);

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load configuration into local state on load or change
  useEffect(() => {
    setEntradaDefault(config.horario.entradaDefault);
    setSalidaDefault(config.horario.salidaDefault);
    setDescansoDefault(config.horario.descansoDefault);
    setJornadaDiaria(config.jornadaDiariaObjetivo);
    setSemanaHoras(config.semanaHorasObjetivo);
    setNocturnaInicio(config.nocturna.inicio);
    setNocturnaFin(config.nocturna.fin);
    setTarifaDiurna(config.tarifas.diurna);
    setTarifaNocturna(config.tarifas.nocturna);
    setTarifaFestiva(config.tarifas.festiva);
    setBolsaMultiplicador(config.bolsa.multiplicador);
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: WorkConfig = {
      horario: {
        entradaDefault,
        salidaDefault,
        descansoDefault,
      },
      jornadaDiariaObjetivo: jornadaDiaria,
      semanaHorasObjetivo: semanaHoras,
      nocturna: {
        inicio: nocturnaInicio,
        fin: nocturnaFin,
      },
      tarifas: {
        diurna: tarifaDiurna,
        nocturna: tarifaNocturna,
        festiva: tarifaFestiva,
      },
      bolsa: {
        multiplicador: bolsaMultiplicador,
      },
    };
    onSaveConfig(newConfig);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('¿Quieres restaurar los parámetros originales del convenio?')) {
      onResetConfig();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#FF9F0A]" />
          <h3 className="text-lg font-bold text-white">Configuración del Convenio</h3>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-[#FF453A] hover:bg-[#FF453A]/10 border border-[#FF453A]/20 rounded-xl px-3 py-1.5 transition-colors font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restaurar
        </button>
      </div>

      {saveSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20 rounded-2xl p-4 flex items-center gap-2 text-xs font-semibold"
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>¡Configuración guardada correctamente! Los totales se han recalculado.</span>
        </motion.div>
      )}

      {/* Grid sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section: Default Shift */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 space-y-4 shadow-sm">
          <h4 className="text-[#8E8E93] text-xs font-bold uppercase tracking-widest border-b border-[#2C2C2E] pb-3 mb-3">
            Horario Habitual (Predeterminados)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Entrada</label>
              <input
                type="time"
                value={entradaDefault}
                onChange={(e) => setEntradaDefault(e.target.value)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Salida</label>
              <input
                type="time"
                value={salidaDefault}
                onChange={(e) => setSalidaDefault(e.target.value)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Descanso (h)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={descansoDefault}
                onChange={(e) => setDescansoDefault(parseFloat(e.target.value) || 0)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Objetivo Día (h)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={jornadaDiaria}
                onChange={(e) => setJornadaDiaria(parseFloat(e.target.value) || 0)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section: Rates */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 space-y-4 shadow-sm">
          <h4 className="text-[#8E8E93] text-xs font-bold uppercase tracking-widest border-b border-[#2C2C2E] pb-3 mb-3">
            Tarifas de Compensación (€)
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Extra Diurna</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={tarifaDiurna}
                onChange={(e) => setTarifaDiurna(parseFloat(e.target.value) || 0)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Nocturna</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={tarifaNocturna}
                onChange={(e) => setTarifaNocturna(parseFloat(e.target.value) || 0)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Festiva</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={tarifaFestiva}
                onChange={(e) => setTarifaFestiva(parseFloat(e.target.value) || 0)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#8E8E93] uppercase">Multiplicador Bolsa</label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={bolsaMultiplicador}
              onChange={(e) => setBolsaMultiplicador(parseFloat(e.target.value) || 0)}
              className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
            />
          </div>
        </div>

        {/* Section: Night Window */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 space-y-4 shadow-sm md:col-span-2">
          <h4 className="text-[#8E8E93] text-xs font-bold uppercase tracking-widest border-b border-[#2C2C2E] pb-3 mb-3">
            Límites del Horario Nocturno
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Inicio Nocturna</label>
              <input
                type="time"
                value={nocturnaInicio}
                onChange={(e) => setNocturnaInicio(e.target.value)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Fin Nocturna</label>
              <input
                type="time"
                value={nocturnaFin}
                onChange={(e) => setNocturnaFin(e.target.value)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
          </div>
          <p className="text-[11px] text-[#8E8E93] leading-relaxed italic mt-2">
            Cualquier minuto trabajado que se ubique dentro de este rango será automáticamente calificado como hora nocturna, aplicando la tarifa correspondiente o sumándose al saldo de la Bolsa de Horas multiplicada.
          </p>
        </div>

        {/* Section: Targets */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between md:col-span-2">
          <div>
            <h4 className="text-[#8E8E93] text-xs font-bold uppercase tracking-widest border-b border-[#2C2C2E] pb-3 mb-3">
              Horas Semanales de Convenio
            </h4>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#8E8E93] uppercase">Horas Objetivo (h)</label>
              <input
                type="number"
                step="1"
                min="10"
                value={semanaHoras}
                onChange={(e) => setSemanaHoras(parseFloat(e.target.value) || 0)}
                className="bg-[#2C2C2E] border-none rounded-xl p-4 text-base font-bold text-white outline-none focus:ring-2 focus:ring-[#FF9F0A] transition-all"
              />
            </div>
          </div>
          <p className="text-[11px] text-[#8E8E93] leading-relaxed italic mt-2">
            Usado como base de cálculo y referencia en los desgloses semanales de tiempo.
          </p>
        </div>
      </div>

      {/* Submit Sticky Footer Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0A84FF] text-white font-bold rounded-2xl px-8 py-4 transition-colors shadow-lg shadow-[#0A84FF]/20 text-lg"
        >
          <Save className="w-6 h-6" />
          Guardar Cambios
        </button>
      </div>
    </form>
  );
}
