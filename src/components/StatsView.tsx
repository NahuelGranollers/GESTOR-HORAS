/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MonthData, MonthCalculations, WorkConfig } from '../types';
import { Award, BarChart3, TrendingUp, Calendar, Moon, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsViewProps {
  year: number;
  month: number;
  monthData: MonthData;
  monthCalculations: MonthCalculations;
  daysInMonth: number;
  config: WorkConfig;
}

export default function StatsView({
  year,
  month,
  monthData,
  monthCalculations,
  daysInMonth,
  config,
}: StatsViewProps) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  let totalWorkedHours = 0;
  let totalDíasTrabajados = 0;
  let totalNightHours = 0;
  let totalHolidayHours = 0;
  let totalBolsa = 0;
  let totalDinero = 0;
  let totalDeber = 0;
  let workingDaysCount = 0;

  for (let i = 1; i <= daysInMonth; i++) {
    const shift = monthData[i];
    const calc = monthCalculations[i];
    const dateObj = new Date(year, month, i);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const isFest = shift ? shift.festivo : isWeekend;

    if (!isFest) {
      workingDaysCount++;
    }

    if (shift && shift.entrada && shift.salida) {
      totalDíasTrabajados++;
    }

    if (calc) {
      totalWorkedHours += calc.total;
      totalNightHours += calc.extNoct;
      totalHolidayHours += calc.festivas;
      totalBolsa += calc.bolsa;
      totalDinero += calc.dinero;
      totalDeber += calc.deber;
    }
  }

  const averageHours = totalDíasTrabajados > 0 ? totalWorkedHours / totalDíasTrabajados : 0;
  const targetMes = workingDaysCount * config.jornadaDiariaObjetivo;

  // Calculate current week hours (assuming Monday is start of week)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday
  const daysSinceMonday = (currentDayOfWeek + 6) % 7;
  
  let weekWorkedHours = 0;
  for (let i = 0; i <= 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysSinceMonday + i);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const calc = monthCalculations[d.getDate()];
      if (calc) {
        weekWorkedHours += calc.total;
      }
    }
  }

  const targetSemana = config.semanaHorasObjetivo;
  const pctSemana = Math.min(100, Math.max(0, (weekWorkedHours / targetSemana) * 100));
  const pctMes = Math.min(100, Math.max(0, (totalWorkedHours / targetMes) * 100));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#0A84FF]" />
        <h3 className="text-lg font-bold text-white">
          Estadísticas de {monthNames[month]} {year}
        </h3>
      </div>

      {/* Progress Bars */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest">Semana Actual</span>
            <span className="text-xl font-bold text-white">{weekWorkedHours.toFixed(1)}h <span className="text-sm text-[#8E8E93]">/ {targetSemana}h</span></span>
          </div>
          <div className="h-4 bg-[#2C2C2E] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pctSemana}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${pctSemana >= 100 ? 'bg-[#30D158]' : 'bg-[#0A84FF]'}`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-[#8E8E93] uppercase tracking-widest">Mes Completo</span>
            <span className="text-xl font-bold text-white">{totalWorkedHours.toFixed(1)}h <span className="text-sm text-[#8E8E93]">/ {targetMes}h</span></span>
          </div>
          <div className="h-4 bg-[#2C2C2E] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${pctMes}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${pctMes >= 100 ? 'bg-[#30D158]' : 'bg-[#0A84FF]'}`}
            />
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 flex flex-col items-center text-center">
          <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest block mb-1">Bolsa Generada</span>
          <span className="text-3xl font-black text-[#0A84FF]">+{totalBolsa.toFixed(1)}h</span>
        </div>
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6 flex flex-col items-center text-center">
          <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest block mb-1">Extra Cobrado</span>
          <span className="text-3xl font-black text-[#30D158]">{totalDinero.toFixed(0)}€</span>
        </div>
      </div>

      {/* Grid Cards Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Promedio diario */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-5 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest block">Media Diaria</span>
            <span className="text-lg font-bold text-white mt-0.5">{averageHours.toFixed(2)}h</span>
          </div>
        </div>

        {/* Días registrados */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-5 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#30D158]/10 flex items-center justify-center text-[#30D158]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest block">Fichajes</span>
            <span className="text-lg font-bold text-white mt-0.5">{totalDíasTrabajados} d</span>
          </div>
        </div>

        {/* Horas Nocturnas */}
        <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-5 flex flex-col gap-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest block">Nocturnas</span>
            <span className="text-lg font-bold text-purple-400 mt-0.5">{totalNightHours.toFixed(1)}h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
