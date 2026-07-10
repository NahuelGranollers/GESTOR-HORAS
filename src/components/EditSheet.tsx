/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DayShift, WorkConfig } from '../types';
import { calculateDayShift, formatHours } from '../utils/calculator';
import { X, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  month: number;
  year: number;
  shift: DayShift | undefined;
  onSave: (day: number, shift: DayShift) => void;
  onClear: (day: number) => void;
  config: WorkConfig;
}

export default function EditSheet({
  isOpen,
  onClose,
  day,
  month,
  year,
  shift,
  onSave,
  onClear,
  config,
}: EditSheetProps) {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dateObj = new Date(year, month, day);
  const dayOfWeek = dateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const [entrada, setEntrada] = useState('');
    const [entrada2, setEntrada2] = useState('');
  const [salida2, setSalida2] = useState('');
  const [salida, setSalida] = useState('');
  const [nextDay, setNextDay] = useState(false);
  const [festivo, setFestivo] = useState(false);
  const [opcion, setOpcion] = useState<'Bolsa' | 'Cobrar'>('Bolsa');
  const [confirmClear, setConfirmClear] = useState(false);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmClear(false);
      if (shift) {
        setEntrada(shift.entrada ?? '');
        setEntrada2(shift.entrada2 ?? '');
        setSalida2(shift.salida2 ?? '');
        setSalida(shift.salida ?? '');
        setNextDay(shift.nextDay || false);
        setFestivo(shift.festivo);
        setOpcion(shift.opcion || 'Bolsa');
        setNotas(shift.notas || '');
      } else {
        setEntrada(config.horario.entradaDefault);
        setEntrada2(config.horario.entrada2Default || '');
        setSalida2(config.horario.salida2Default || '');
        setSalida(config.horario.salidaDefault);
        setNextDay(false);
        setFestivo(isWeekend);
        setOpcion('Bolsa');
        setNotas('');
      }
    }
  }, [isOpen, day, month, year, shift, isWeekend, config]);

  const previewShift: DayShift = {
    entrada,
    salida,
    entrada2,
    salida2,
    nextDay,
    descanso: shift?.descanso || 0,
    ausencia: 0,
    festivo,
    opcion,
    notas,
  };
  const previewCalc = calculateDayShift(day, previewShift, config, isWeekend);

  const hasExtra = previewCalc.extDiur > 0 || previewCalc.extNoct > 0 || previewCalc.festivas > 0;

  const handleSave = () => {
    onSave(day, {
      entrada,
      salida,
      entrada2,
      salida2,
      nextDay,
      descanso: shift?.descanso || 0,
      ausencia: 0,
      festivo,
      opcion,
      notas,
    });
    onClose();
  };

  const handleClear = () => {
    onClear(day);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#1C1C1E] border border-[#2C2C2E] rounded-t-[32px] z-50 overflow-hidden shadow-2xl flex flex-col max-h-[92vh] pb-safe"
          >
            <div className="w-12 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3" />

            <div className="px-6 pb-6 pt-2 flex items-center justify-between">
              <div>
                <span className="text-[#0A84FF] text-xs font-bold uppercase tracking-widest block mb-1">Editor de Turno</span>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {dayNames[dayOfWeek]}, {day} {monthNames[month]}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-[#2C2C2E] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors border border-[#3A3A3C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">
              {/* Form Grid */}
              <div className="flex gap-4">
                <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Entrada
                  </label>
                  <input
                    type="time" 
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)}
                    className="w-full bg-transparent text-white text-xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                  />
                </div>

                <div className="flex-1 bg-[#0A0A0A] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Salida
                    </label>
                    <button 
                      onClick={() => setNextDay(!nextDay)}
                      className={`text-[9px] font-bold px-2 py-1 rounded-lg transition-colors ${nextDay ? 'bg-[#BF5AF2] text-white' : 'bg-[#2C2C2E] text-[#8E8E93]'}`}
                    >
                      +1 Día
                    </button>
                  </div>
                  <input 
                    type="time"
                    value={salida}
                    onChange={(e) => setSalida(e.target.value)}
                    className="w-full bg-transparent text-white text-xl font-black outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                  />
                </div>
              </div>

              {!isWeekend && (
                <div className="flex items-center justify-between bg-[#0A0A0A] border border-[#2C2C2E] rounded-2xl p-5">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-white tracking-wider">
                      ¿Día Festivo?
                    </label>
                    <span className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-widest mt-1">Marcar si es festivo</span>
                  </div>
                  <button
                    onClick={() => setFestivo(!festivo)}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${festivo ? 'bg-[#30D158]' : 'bg-[#3A3A3C]'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${festivo ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                  </button>
                </div>
              )}

              {hasExtra && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest px-2">
                    Compensación Extras
                  </label>
                  <div className="grid grid-cols-2 gap-3 bg-[#0A0A0A] p-2 rounded-3xl border border-[#2C2C2E]">
                    <button
                      onClick={() => setOpcion('Bolsa')}
                      className={`p-4 rounded-2xl font-black transition-colors ${
                        opcion === 'Bolsa'
                          ? 'bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/20'
                          : 'bg-transparent text-[#8E8E93] hover:text-white'
                      }`}
                    >
                      Bolsa
                    </button>
                    <button
                      onClick={() => setOpcion('Cobrar')}
                      className={`p-4 rounded-2xl font-black transition-colors ${
                        opcion === 'Cobrar'
                          ? 'bg-[#30D158] text-black shadow-lg shadow-[#30D158]/20'
                          : 'bg-transparent text-[#8E8E93] hover:text-white'
                      }`}
                    >
                      Cobrar
                    </button>
                  </div>
                </div>
              )}

              {/* Live Preview Card */}
              <div className="bg-[#0A0A0A] rounded-3xl p-6 border border-[#2C2C2E]">
                <div className="space-y-4">
                  
                  
                  {(previewCalc.extDiur > 0 || previewCalc.extNoct > 0 || previewCalc.festivas > 0 || previewCalc.deber > 0) && (
                    <div className="h-px bg-[#2C2C2E] w-full my-4"></div>
                  )}

                  {previewCalc.total > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#30D158] text-sm font-bold uppercase tracking-widest">Laborables</span>
                      <span className="font-mono text-[#30D158] text-lg font-black">
                        {formatHours(previewCalc.total - previewCalc.extDiur - previewCalc.extNoct - previewCalc.festivas)}
                      </span>
                    </div>
                  )}
                  {previewCalc.extDiur > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#0A84FF] text-sm font-bold uppercase tracking-widest">Extra Laborable</span>
                      <span className="font-mono text-[#0A84FF] text-lg font-black">+{formatHours(previewCalc.extDiur)}</span>
                    </div>
                  )}
                  {previewCalc.extNoct > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#BF5AF2] text-sm font-bold uppercase tracking-widest">Extra Nocturna</span>
                      <span className="font-mono text-[#BF5AF2] text-lg font-black">+{formatHours(previewCalc.extNoct)}</span>
                    </div>
                  )}
                  {previewCalc.festivas > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#FF9F0A] text-sm font-bold uppercase tracking-widest">Festivas</span>
                      <span className="font-mono text-[#FF9F0A] text-lg font-black">+{formatHours(previewCalc.festivas)}</span>
                    </div>
                  )}
                  {previewCalc.deber > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-[#FF453A] text-sm font-bold uppercase tracking-widest">Restada</span>
                      <span className="font-mono text-[#FF453A] text-lg font-black">-{formatHours(previewCalc.deber)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 bg-[#1C1C1E] flex gap-4 mt-auto border-t border-[#2C2C2E]">
              {shift && (
                confirmClear ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-6 bg-[#FF453A] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#FF453A]/20"
                  >
                    Confirmar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="px-6 bg-[#0A0A0A] text-[#FF453A] font-bold py-4 rounded-2xl border border-[#FF453A]/20 hover:bg-[#FF453A]/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )
              )}
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-white text-black font-black py-4 rounded-2xl text-lg shadow-lg shadow-white/10 active:scale-[0.98] transition-transform"
              >
                Guardar Turno
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
