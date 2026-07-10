/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DayShift, WorkConfig } from '../types';
import { calculateDayShift, formatHours, shiftSpansInterval } from '../utils/calculator';
import { X, Trash2, Clock, ChevronRight } from 'lucide-react';
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
  onPrevDay?: () => void;
  onNextDay?: () => void;
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
  onPrevDay,
  onNextDay,
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
  const [salida, setSalida] = useState('');
  const [nextDay, setNextDay] = useState(false);
  const [festivo, setFestivo] = useState(false);
  const [opcion, setOpcion] = useState<'Bolsa' | 'Cobrar'>('Bolsa');
  const [confirmClear, setConfirmClear] = useState(false);
  const [notas, setNotas] = useState('');

  // Human breaks (meal & dinner)
  const [comida, setComida] = useState(false);
  const [cena, setCena] = useState(false);
  const [userToggledComida, setUserToggledComida] = useState(false);
  const [userToggledCena, setUserToggledCena] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfirmClear(false);
      if (shift) {
        setEntrada(shift.entrada ?? '');
        setSalida(shift.salida ?? '');
        setNextDay(shift.nextDay || false);
        setFestivo(shift.festivo);
        setOpcion(shift.opcion || 'Bolsa');
        setNotas(shift.notas || '');
        
        setComida(shift.comida !== undefined ? shift.comida : shiftSpansInterval(shift.entrada, shift.salida, shift.nextDay || false, 14, 15));
        setCena(shift.cena !== undefined ? shift.cena : shiftSpansInterval(shift.entrada, shift.salida, shift.nextDay || false, 21, 22));
        setUserToggledComida(shift.comida !== undefined);
        setUserToggledCena(shift.cena !== undefined);
      } else {
        const entD = config.horario.entradaDefault || '09:00';
        const salD = config.horario.salidaDefault || '14:00';
        setEntrada(entD);
        setSalida(salD);
        setNextDay(false);
        setFestivo(isWeekend);
        setOpcion('Bolsa');
        setNotas('');

        const defaultComida = shiftSpansInterval(entD, salD, false, 14, 15);
        const defaultCena = shiftSpansInterval(entD, salD, false, 21, 22);
        setComida(defaultComida);
        setCena(defaultCena);
        setUserToggledComida(false);
        setUserToggledCena(false);
      }
    }
  }, [isOpen, day, month, year, shift, isWeekend, config]);

  // Handle auto-detection updates when entry/exit change unless overridden
  useEffect(() => {
    if (!userToggledComida && entrada && salida) {
      setComida(shiftSpansInterval(entrada, salida, nextDay, 14, 15));
    }
  }, [entrada, salida, nextDay, userToggledComida]);

  useEffect(() => {
    if (!userToggledCena && entrada && salida) {
      setCena(shiftSpansInterval(entrada, salida, nextDay, 21, 22));
    }
  }, [entrada, salida, nextDay, userToggledCena]);

  const previewShift: DayShift = {
    entrada,
    salida,
    nextDay,
    descanso: shift?.descanso || 0,
    ausencia: 0,
    festivo,
    opcion,
    notas,
    comida,
    cena,
  };
  const previewCalc = calculateDayShift(day, previewShift, config, isWeekend);

  const handleSave = () => {
    onSave(day, {
      entrada,
      salida,
      nextDay,
      descanso: shift?.descanso || 0,
      ausencia: 0,
      festivo,
      opcion,
      notas,
      comida,
      cena,
    });
  };

  const handleSaveAndPrev = () => {
    handleSave();
    if (onPrevDay) onPrevDay();
  };

  const handleSaveAndNext = () => {
    handleSave();
    if (onNextDay) onNextDay();
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
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 transition-opacity"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1C1C1E] border border-[#2C2C2E] rounded-t-[28px] z-50 overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[620px] pb-safe"
          >
            {/* Drag Handle Indicator */}
            <div className="w-10 h-1 bg-[#3A3A3C] rounded-full mx-auto my-2.5 shrink-0" />

            {/* Header */}
            <div className="px-5 pb-3 pt-1 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[#0A84FF] text-[10px] font-bold uppercase tracking-wider block mb-0.5">Editor de Turno</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold tracking-tight text-white">
                    {dayNames[dayOfWeek]}, {day} {monthNames[month]}
                  </h3>
                  <div className="flex bg-[#2C2C2E] rounded-lg overflow-hidden ml-1 border border-[#3A3A3C]">
                    <button onClick={handleSaveAndPrev} className="px-1.5 py-1 hover:bg-[#3A3A3C] transition-colors border-r border-[#3A3A3C]">
                      <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93] rotate-180" />
                    </button>
                    <button onClick={handleSaveAndNext} className="px-1.5 py-1 hover:bg-[#3A3A3C] transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-[#8E8E93]" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#2C2C2E] text-[#8E8E93] hover:text-white flex items-center justify-center transition-colors border border-[#3A3A3C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4">
              {/* Form Grid */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 bg-[#0A0A0A] p-2.5 rounded-2xl border border-[#2C2C2E] flex flex-col relative group">
                    <label className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Entrada
                    </label>
                    <input
                      type="time" 
                      value={entrada}
                      onChange={(e) => setEntrada(e.target.value)}
                      className="w-full bg-transparent text-white text-base font-bold outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                    />
                  </div>
                  <div className="flex-1 bg-[#0A0A0A] p-2.5 rounded-2xl border border-[#2C2C2E] flex flex-col relative group">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Salida
                      </label>
                      <button 
                        onClick={() => setNextDay(!nextDay)}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-colors ${nextDay ? 'bg-[#BF5AF2] text-white' : 'bg-[#2C2C2E] text-[#8E8E93]'}`}
                      >
                        +1 Día
                      </button>
                    </div>
                    <input
                      type="time" 
                      value={salida}
                      onChange={(e) => setSalida(e.target.value)}
                      className="w-full bg-transparent text-white text-base font-bold outline-none border-none p-0 focus:ring-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full" 
                    />
                  </div>
                </div>
              </div>

              {/* Meal / Dinner breaks */}
              <div className="grid grid-cols-2 gap-3 bg-[#0A0A0A] p-2 rounded-2xl border border-[#2C2C2E]">
                <button
                  onClick={() => {
                    setComida(!comida);
                    setUserToggledComida(true);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between gap-1.5 ${
                    comida
                      ? 'bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/40'
                      : 'bg-[#1C1C1E] text-[#8E8E93] border border-transparent hover:text-white'
                  }`}
                >
                  <span className="truncate">🍲 Comida (14-15h)</span>
                  <span className="text-[8px] px-1 bg-black/40 rounded uppercase tracking-wider shrink-0">{comida ? 'Sí' : 'No'}</span>
                </button>
                <button
                  onClick={() => {
                    setCena(!cena);
                    setUserToggledCena(true);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between gap-1.5 ${
                    cena
                      ? 'bg-[#BF5AF2]/20 text-[#BF5AF2] border border-[#BF5AF2]/40'
                      : 'bg-[#1C1C1E] text-[#8E8E93] border border-transparent hover:text-white'
                  }`}
                >
                  <span className="truncate">🌙 Cena (21-22h)</span>
                  <span className="text-[8px] px-1 bg-black/40 rounded uppercase tracking-wider shrink-0">{cena ? 'Sí' : 'No'}</span>
                </button>
              </div>

              {/* Día Festivo */}
              <div className="flex items-center justify-between bg-[#0A0A0A] border border-[#2C2C2E] rounded-2xl p-2.5">
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-white">
                    ¿Día Festivo?
                  </label>
                  <span className="text-[9px] text-[#8E8E93] uppercase font-bold tracking-wider mt-0.5">Marcar si no laborable</span>
                </div>
                <button
                  onClick={() => setFestivo(!festivo)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors ${festivo ? 'bg-[#30D158]' : 'bg-[#3A3A3C]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${festivo ? 'translate-x-5' : 'translate-x-0'} shadow-sm`} />
                </button>
              </div>

              {/* Compensación Extras */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-widest px-1">
                  Compensación Extras
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#0A0A0A] p-1.5 rounded-2xl border border-[#2C2C2E]">
                  <button
                    onClick={() => setOpcion('Bolsa')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      opcion === 'Bolsa'
                        ? 'bg-[#0A84FF] text-white shadow-sm font-black'
                        : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    Bolsa
                  </button>
                  <button
                    onClick={() => setOpcion('Cobrar')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      opcion === 'Cobrar'
                        ? 'bg-[#30D158] text-black shadow-sm font-black'
                        : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    Cobrar
                  </button>
                </div>
              </div>

              {/* Notas / Lugar */}
              <div className="bg-[#0A0A0A] p-2.5 rounded-2xl border border-[#2C2C2E] flex flex-col">
                <label className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-1">
                  Notas / Lugar
                </label>
                <input
                  type="text"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Oficina central, remoto..."
                  className="w-full bg-transparent text-white text-xs outline-none border-none p-0 focus:ring-0 placeholder-[#8E8E93]/40"
                />
              </div>

              {/* Live Preview Card */}
              <div className="bg-[#0A0A0A] rounded-2xl p-3 border border-[#2C2C2E]">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#8E8E93] text-[9px] font-bold uppercase tracking-widest">Totales</span>
                    <span className="font-mono text-white font-black">
                      {formatHours(previewCalc.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#30D158] text-[9px] font-bold uppercase tracking-widest">Laborables</span>
                    <span className="font-mono text-[#30D158] font-black">
                      {formatHours(Math.max(0, previewCalc.total - previewCalc.extDiur - previewCalc.extNoct - previewCalc.festivas))}
                    </span>
                  </div>
                  
                  {(previewCalc.extDiur > 0 || previewCalc.extNoct > 0 || previewCalc.festivas > 0 || previewCalc.deber > 0) && (
                    <div className="h-px bg-[#2C2C2E] w-full my-1" />
                  )}
                  {previewCalc.extDiur > 0 && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#0A84FF] font-semibold uppercase tracking-wider">Extra Laborable</span>
                      <span className="font-mono text-[#0A84FF] font-bold">+{formatHours(previewCalc.extDiur)}</span>
                    </div>
                  )}
                  {previewCalc.extNoct > 0 && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#BF5AF2] font-semibold uppercase tracking-wider">Extra Nocturna</span>
                      <span className="font-mono text-[#BF5AF2] font-bold">+{formatHours(previewCalc.extNoct)}</span>
                    </div>
                  )}
                  {previewCalc.festivas > 0 && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#FF9F0A] font-semibold uppercase tracking-wider">Festivas</span>
                      <span className="font-mono text-[#FF9F0A] font-bold">+{formatHours(previewCalc.festivas)}</span>
                    </div>
                  )}
                  {previewCalc.deber > 0 && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#FF453A] font-semibold uppercase tracking-wider">Restada</span>
                      <span className="font-mono text-[#FF453A] font-bold">-{formatHours(previewCalc.deber)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#1C1C1E] flex gap-3 shrink-0 border-t border-[#2C2C2E]">
              {shift && (
                confirmClear ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 bg-[#FF453A] text-white font-bold py-2.5 rounded-xl shadow-lg shadow-[#FF453A]/20 text-xs shrink-0"
                  >
                    Confirmar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="px-3 bg-[#0A0A0A] text-[#FF453A] font-bold py-2.5 rounded-xl border border-[#FF453A]/20 hover:bg-[#FF453A]/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )
              )}
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-white text-black font-black py-2.5 rounded-xl text-sm shadow-lg shadow-white/10 active:scale-[0.98] transition-all"
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
