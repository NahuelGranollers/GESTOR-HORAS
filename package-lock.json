/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  Download, 
  Plus,
  Trash2,
  FileText,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom Components
import CalendarGrid from './components/CalendarGrid';
import EditSheet from './components/EditSheet';
import StatsView from './components/StatsView';
import ConfigView from './components/ConfigView';
import BackupView from './components/BackupView';

// Types & Helpers
import { WorkConfig, DayShift, DayCalculation, MonthData, MonthCalculations } from './types';
import { calculateDayShift, DEFAULT_CONFIG } from './utils/calculator';

// Time options generator for dropdowns (15 min intervals)
export const TIME_OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
}

export default function App() {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayNamesFull = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const today = new Date();
  const todayDay = today.getDate();
  const isSelectedMonthToday = today.getFullYear() === year && today.getMonth() === month;

  const [selectedDay, setSelectedDay] = useState(() => {
    const t = new Date();
    return t.getFullYear() === year && t.getMonth() === month ? t.getDate() : 1;
  });

  const [masterData, setMasterData] = useState<Record<string, MonthData>>({});
  const [config, setConfig] = useState<WorkConfig>(DEFAULT_CONFIG);

  const [activeTab, setActiveTab] = useState<'calendar' | 'stats' | 'config' | 'backup'>('calendar');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(1);

  const [quickEntrada, setQuickEntrada] = useState(config.horario.entradaDefault);
  const [quickSalida, setQuickSalida] = useState(config.horario.salidaDefault);
  const [confirmClearMonth, setConfirmClearMonth] = useState(false);

  useEffect(() => {
    const storedConfig = localStorage.getItem('gestorHorasConfigV6');
    if (storedConfig) {
      try {
        const pConf = JSON.parse(storedConfig);
        setConfig(pConf);
        setQuickEntrada(pConf.horario.entradaDefault);
        setQuickSalida(pConf.horario.salidaDefault);
      } catch (err) {
        console.error('Failed to parse config', err);
      }
    }

    const storedV6 = localStorage.getItem('gestorHorasDataV6');
    if (storedV6) {
      try {
        setMasterData(JSON.parse(storedV6));
        return;
      } catch (err) {
        console.error('Failed to parse v6 data', err);
      }
    }

    const storedV5 = localStorage.getItem('gestorHorasDataV5');
    if (storedV5) {
      try {
        const parsedV5 = JSON.parse(storedV5);
        const currentKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        
        const migratedMaster: Record<string, MonthData> = {};
        migratedMaster[currentKey] = {};

        for (const key in parsedV5) {
          const numKey = parseInt(key, 10);
          if (!isNaN(numKey) && numKey >= 1 && numKey <= 31) {
            migratedMaster[currentKey][numKey] = parsedV5[key];
          }
        }

        setMasterData(migratedMaster);
        localStorage.setItem('gestorHorasDataV6', JSON.stringify(migratedMaster));
      } catch (err) {
        setMasterData({});
      }
    } else {
      setMasterData({});
    }
  }, []);

  useEffect(() => {
    if (isSelectedMonthToday) {
      setSelectedDay(todayDay);
    } else {
      setSelectedDay(1);
    }
  }, [year, month, isSelectedMonthToday, todayDay]);

  useEffect(() => {
    const shift = masterData[monthKey]?.[selectedDay];
    if (shift && shift.entrada && shift.salida) {
      setQuickEntrada(shift.entrada);
      setQuickSalida(shift.salida);
    } else {
      setQuickEntrada(config.horario.entradaDefault);
      setQuickSalida(config.horario.salidaDefault);
    }
  }, [selectedDay, monthKey, masterData, config]);

  const currentMonthData: MonthData = masterData[monthKey] || {};

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthCalculations: MonthCalculations = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const shift = currentMonthData[d] || {
      entrada: '',
      salida: '',
      descanso: config.horario.descansoDefault,
      ausencia: 0,
      festivo: isWeekend,
      opcion: 'Bolsa',
    };
    monthCalculations[d] = calculateDayShift(d, shift, config, isWeekend);
  }

  let totalBolsa = 0;
  let totalDinero = 0;
  let totalDeber = 0;
  let workingDaysCount = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const calc = monthCalculations[d];
    const shift = currentMonthData[d];
    
    const dateObj = new Date(year, month, d);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const isFest = shift ? shift.festivo : isWeekend;

    if (!isFest) {
      workingDaysCount++;
    }

    if (calc) {
      totalBolsa += calc.bolsa;
      totalDinero += calc.dinero;
      totalDeber += calc.deber;
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
  };

  const handleSaveDayShift = (dayNum: number, newShift: DayShift) => {
    const updatedMonth = {
      ...currentMonthData,
      [dayNum]: newShift,
    };
    const updatedMaster = {
      ...masterData,
      [monthKey]: updatedMonth,
    };
    setMasterData(updatedMaster);
    localStorage.setItem('gestorHorasDataV6', JSON.stringify(updatedMaster));
  };

  const handleClearDayShift = (dayNum: number) => {
    const updatedMonth = { ...currentMonthData };
    delete updatedMonth[dayNum];

    const updatedMaster = {
      ...masterData,
      [monthKey]: updatedMonth,
    };
    setMasterData(updatedMaster);
    localStorage.setItem('gestorHorasDataV6', JSON.stringify(updatedMaster));
  };

  const handleSaveQuickEntry = () => {
    const isWeekend = new Date(year, month, selectedDay).getDay() === 0 || new Date(year, month, selectedDay).getDay() === 6;
    const shift = currentMonthData[selectedDay] || {
      descanso: config.horario.descansoDefault,
      ausencia: 0,
      festivo: isWeekend,
      opcion: 'Bolsa',
    };
    
    handleSaveDayShift(selectedDay, {
      ...shift,
      entrada: quickEntrada,
      salida: quickSalida,
    });
  };

  const handleOpenEditDay = (dayNum: number) => {
    setEditingDay(dayNum);
    setIsEditOpen(true);
  };

  const handleClearMonthData = () => {
    const updatedMaster = {
      ...masterData,
      [monthKey]: {},
    };
    setMasterData(updatedMaster);
    localStorage.setItem('gestorHorasDataV6', JSON.stringify(updatedMaster));
    setConfirmClearMonth(false);
  };

  const handleSaveConfig = (newConfig: WorkConfig) => {
    setConfig(newConfig);
    localStorage.setItem('gestorHorasConfigV6', JSON.stringify(newConfig));
  };

  const handleResetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    localStorage.setItem('gestorHorasConfigV6', JSON.stringify(DEFAULT_CONFIG));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <StatsView
            monthData={currentMonthData}
            monthCalculations={monthCalculations}
            daysInMonth={daysInMonth}
            year={year}
            month={month}
            config={config}
          />
        );
      case 'config':
        return (
          <ConfigView
            config={config}
            onSaveConfig={handleSaveConfig}
            onResetConfig={handleResetConfig}
          />
        );
      case 'backup':
        return (
          <BackupView
            year={year}
            month={month}
            appData={currentMonthData}
            calculations={monthCalculations}
            config={config}
            onImportData={(importedData, importedConfig) => {
              const updatedMaster = { ...masterData, [monthKey]: importedData };
              setMasterData(updatedMaster);
              localStorage.setItem('gestorHorasDataV6', JSON.stringify(updatedMaster));
              if (importedConfig) {
                setConfig(importedConfig);
                localStorage.setItem('gestorHorasConfigV6', JSON.stringify(importedConfig));
              }
              alert('Copia de seguridad restaurada correctamente.');
            }}
          />
        );
      default:
        const selectedDateObj = new Date(year, month, selectedDay);
        const selDayOfWeek = selectedDateObj.getDay();
        const selIsWeekend = selDayOfWeek === 0 || selDayOfWeek === 6;
        
        // Ensure options have current values even if not exactly 15m increment
        const activeEntradaOptions = TIME_OPTIONS.includes(quickEntrada) ? TIME_OPTIONS : [...TIME_OPTIONS, quickEntrada].sort();
        const activeSalidaOptions = TIME_OPTIONS.includes(quickSalida) ? TIME_OPTIONS : [...TIME_OPTIONS, quickSalida].sort();

        return (
          <div className="space-y-6 pb-24">
            
            <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-[32px] p-6 shadow-sm overflow-hidden relative">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-white text-xl font-bold uppercase tracking-widest">{monthNames[month]} {year}</h2>
              </div>
              <div className="flex justify-between items-end relative z-10 pb-4">
                <div className="flex flex-col">
                  <span className="text-[#8E8E93] text-[10px] font-bold uppercase tracking-wider">Bolsa</span>
                  <span className="text-[#0A84FF] text-3xl font-black">+{totalBolsa.toFixed(1)}<span className="text-lg">h</span></span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#8E8E93] text-[10px] font-bold uppercase tracking-wider">Cobrar</span>
                  <span className="text-[#30D158] text-3xl font-black">{totalDinero.toFixed(0)}<span className="text-lg">€</span></span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[#8E8E93] text-[10px] font-bold uppercase tracking-wider">A Deber</span>
                  <span className="text-[#FF453A] text-3xl font-black">-{totalDeber.toFixed(1)}<span className="text-lg">h</span></span>
                </div>
              </div>
            </div>

            <div className="mx-2 bg-[#0A0A0A] rounded-[32px] p-6 sm:p-8 border border-[#2C2C2E] shadow-2xl relative z-20 -mt-12">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <span className="text-[#8E8E93] text-xs font-bold uppercase tracking-wider block mb-1">
                    {isSelectedMonthToday && selectedDay === todayDay ? 'Hoy' : 'Día seleccionado'}
                  </span>
                  <h3 className="text-white font-bold text-2xl tracking-tight">
                    {dayNamesFull[selDayOfWeek]}, {selectedDay}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const prevDate = new Date(year, month, selectedDay - 1);
                      const pYear = prevDate.getFullYear();
                      const pMonth = prevDate.getMonth();
                      const pDay = prevDate.getDate();
                      
                      const pMonthKey = `${pYear}-${String(pMonth + 1).padStart(2, '0')}`;
                      const pShift = masterData[pMonthKey]?.[pDay];
                      
                      if (pShift && pShift.entrada && pShift.salida) {
                        setQuickEntrada(pShift.entrada);
                        setQuickSalida(pShift.salida);
                      } else {
                        alert('No hay registro del día anterior.');
                      }
                    }}
                    className="bg-[#2C2C2E] text-white px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-[#3A3A3C] transition-colors"
                  >
                    Repetir ayer
                  </button>
                  <button
                    onClick={() => handleOpenEditDay(selectedDay)}
                    className="bg-[#2C2C2E] text-white p-2.5 rounded-2xl hover:bg-[#3A3A3C] transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-[#1C1C1E] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Entrada
                  </label>
                  <select 
                    value={quickEntrada}
                    onChange={(e) => setQuickEntrada(e.target.value)}
                    className="w-full bg-transparent text-white text-3xl font-black outline-none border-none p-0 focus:ring-0 appearance-none cursor-pointer" 
                  >
                    {activeEntradaOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex-1 bg-[#1C1C1E] p-4 rounded-3xl border border-[#2C2C2E] flex flex-col relative group">
                  <label className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Salida
                  </label>
                  <select 
                    value={quickSalida}
                    onChange={(e) => setQuickSalida(e.target.value)}
                    className="w-full bg-transparent text-white text-3xl font-black outline-none border-none p-0 focus:ring-0 appearance-none cursor-pointer" 
                  >
                    {activeSalidaOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSaveQuickEntry}
                className="w-full bg-white text-black font-black py-4 rounded-2xl text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 active:scale-[0.98]"
              >
                Guardar Turno
              </button>
              
              {monthCalculations[selectedDay] && currentMonthData[selectedDay] && (
                <div className="mt-8 pt-6 border-t border-[#2C2C2E] grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-[#2C2C2E]">
                    <span className="text-[#8E8E93] font-semibold text-xs uppercase tracking-wider">Trabajadas</span>
                    <span className="text-white font-black text-lg">{monthCalculations[selectedDay].total.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-[#2C2C2E]">
                    <span className="text-[#8E8E93] font-semibold text-xs uppercase tracking-wider">Objetivo</span>
                    <span className="text-white font-black text-lg">{(currentMonthData[selectedDay].festivo || selIsWeekend) ? 0 : config.jornadaDiariaObjetivo}h</span>
                  </div>
                  
                  {monthCalculations[selectedDay].extDiur > 0 && (
                    <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-[#0A84FF]/30">
                      <span className="text-[#8E8E93] font-semibold text-xs uppercase tracking-wider">Ext. Diurna</span>
                      <span className="text-[#0A84FF] font-black text-lg">{monthCalculations[selectedDay].extDiur.toFixed(1)}h</span>
                    </div>
                  )}
                  {monthCalculations[selectedDay].extNoct > 0 && (
                    <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-[#BF5AF2]/30">
                      <span className="text-[#8E8E93] font-semibold text-xs uppercase tracking-wider">Nocturna</span>
                      <span className="text-[#BF5AF2] font-black text-lg">{monthCalculations[selectedDay].extNoct.toFixed(1)}h</span>
                    </div>
                  )}
                  {monthCalculations[selectedDay].deber > 0 && (
                    <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-[#FF453A]/30">
                      <span className="text-[#FF453A] font-semibold text-xs uppercase tracking-wider">Falta</span>
                      <span className="text-[#FF453A] font-black text-lg">{monthCalculations[selectedDay].deber.toFixed(1)}h</span>
                    </div>
                  )}
                  {monthCalculations[selectedDay].festivas > 0 && (
                    <div className="flex justify-between items-center bg-[#1C1C1E] p-3 rounded-xl border border-[#FF9F0A]/30">
                      <span className="text-[#FF9F0A] font-semibold text-xs uppercase tracking-wider">Festiva</span>
                      <span className="text-[#FF9F0A] font-black text-lg">{monthCalculations[selectedDay].festivas.toFixed(1)}h</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <CalendarGrid
              year={year}
              month={month}
              monthData={currentMonthData}
              monthCalculations={monthCalculations}
              config={config}
              selectedDay={selectedDay}
              onSelectDay={handleSelectDay}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <div className="flex justify-center mt-8">
              {confirmClearMonth ? (
                <div className="flex items-center gap-4 bg-[#FF453A]/10 p-4 rounded-3xl border border-[#FF453A]/30">
                  <span className="text-xs font-bold text-[#FF453A]">¿Borrar mes?</span>
                  <button
                    onClick={handleClearMonthData}
                    className="text-xs font-black text-white py-2 px-4 rounded-xl bg-[#FF453A] shadow-lg shadow-[#FF453A]/20"
                  >
                    Sí
                  </button>
                  <button
                    onClick={() => setConfirmClearMonth(false)}
                    className="text-xs font-bold text-white py-2 px-4 rounded-xl bg-[#2C2C2E]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClearMonth(true)}
                  className="flex items-center gap-2 text-xs font-bold text-[#FF453A] hover:text-[#FF453A]/80 transition-colors py-3 px-5 rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/5"
                >
                  <Trash2 className="w-4 h-4" />
                  Borrar mes
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#0A84FF]/30 font-sans pb-safe">
      <header className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-[#2C2C2E] px-4 py-3 flex items-center justify-between shadow-sm pt-safe">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0A84FF] to-[#30D158] flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-lg leading-none">H</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">HorasPro</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full p-4 md:p-6 mb-20 relative">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121214]/90 backdrop-blur-2xl border-t border-[#2C2C2E] px-6 pt-3 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === 'calendar' ? 'text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'calendar' ? 'bg-[#2C2C2E]' : 'bg-transparent'}`}>
              <CalendarIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Registro</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === 'stats' ? 'text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'stats' ? 'bg-[#2C2C2E]' : 'bg-transparent'}`}>
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Resumen</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === 'backup' ? 'text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'backup' ? 'bg-[#2C2C2E]' : 'bg-transparent'}`}>
              <Download className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Datos</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex flex-col items-center gap-1.5 transition-colors ${
              activeTab === 'config' ? 'text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${activeTab === 'config' ? 'bg-[#2C2C2E]' : 'bg-transparent'}`}>
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Ajustes</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isEditOpen && (
          <EditSheet
            isOpen={isEditOpen}
            day={editingDay}
            month={month}
            year={year}
            shift={currentMonthData[editingDay]}
            config={config}
            onSave={(day, newShift) => {
              handleSaveDayShift(day, newShift);
              setIsEditOpen(false);
            }}
            onClear={(day) => {
              handleClearDayShift(day);
              setIsEditOpen(false);
            }}
            onClose={() => setIsEditOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
