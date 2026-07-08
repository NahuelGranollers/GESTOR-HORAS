/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MonthData, MonthCalculations, WorkConfig } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  monthData: MonthData;
  monthCalculations: MonthCalculations;
  config: WorkConfig;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarGrid({
  year,
  month,
  selectedDay,
  onSelectDay,
  monthData,
  monthCalculations,
  config,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayLabels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const gridCells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    gridCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push(d);
  }

  return (
    <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-1">
          <span>{monthNames[month]}</span>
          <span className="text-[#8E8E93] font-normal">{year}</span>
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={onPrevMonth}
            className="p-2 rounded-full border border-[#2C2C2E] bg-[#0A0A0A] hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={onNextMonth}
            className="p-2 rounded-full border border-[#2C2C2E] bg-[#0A0A0A] hover:bg-[#2C2C2E] text-[#8E8E93] hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-2">
        {dayLabels.map((lbl, idx) => (
          <div 
            key={idx} 
            className={`text-xs font-semibold ${
              idx >= 5 ? 'text-[#FF9F0A]' : 'text-[#8E8E93]'
            }`}
          >
            {lbl}
          </div>
        ))}

        {gridCells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const saved = monthData[day];
          const calc = monthCalculations[day];
          const isToday = isCurrentMonth && day === todayDate;
          const isSelected = day === selectedDay;

          const currentDate = new Date(year, month, day);
          const dayOfWeek = currentDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isFestive = saved?.festivo || isWeekend;

          let statusColorClass = 'bg-transparent text-white hover:bg-[#2C2C2E]';
          let textColor = isFestive ? 'text-[#FF9F0A]' : 'text-white';
          let dotColor = null;

          if (calc) {
            const hasDeber = calc.deber > 0;
            const hasExtra = calc.extDiur > 0 || calc.extNoct > 0 || calc.festivas > 0;
            const hasWorked = calc.total > 0;

            if (hasDeber) {
              dotColor = 'bg-[#FF453A]'; // Red - Falta
            } else if (hasExtra) {
              dotColor = 'bg-[#0A84FF]'; // Blue - Extra
            } else if (hasWorked) {
              dotColor = 'bg-[#30D158]'; // Green - Trabajado
            } else if (isFestive) {
              dotColor = 'bg-[#FF9F0A]'; // Orange - Festivo (not worked)
            }
          } else if (isFestive) {
            dotColor = 'bg-[#FF9F0A]';
          }

          if (isSelected) {
            statusColorClass = 'bg-[#3A3A3C] ring-2 ring-white/50 text-white font-bold';
            textColor = 'text-white';
          } else if (isToday) {
            statusColorClass = 'bg-[#2C2C2E] text-white font-bold ring-1 ring-[#8E8E93]';
          }

          return (
            <button
              key={`day-${day}`}
              onClick={() => onSelectDay(day)}
              className={`aspect-square w-full rounded-full flex flex-col items-center justify-center transition-all relative ${statusColorClass}`}
            >
              <span className={`text-[15px] z-10 ${textColor}`}>
                {day}
              </span>
              {dotColor && (
                <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#30D158]"></span><span className="text-[10px] text-[#8E8E93] uppercase font-bold">Trabajado</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF453A]"></span><span className="text-[10px] text-[#8E8E93] uppercase font-bold">Falta</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0A84FF]"></span><span className="text-[10px] text-[#8E8E93] uppercase font-bold">Extra</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF9F0A]"></span><span className="text-[10px] text-[#8E8E93] uppercase font-bold">Festivo</span></div>
      </div>
    </div>
  );
}
