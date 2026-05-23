import React, { useState } from "react";
import { LimousineConfig, DailyScheduleException } from "../../types";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Shield, ShieldOff, ArrowRight, Layers, Repeat, CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { DEFAULT_SCHEDULES_HN_MC, DEFAULT_SCHEDULES_MC_HN } from "../LimousineBooking";

interface ScheduleManagementProps {
  limousineConfig: LimousineConfig;
  onUpdateLimousineConfig: (updated: LimousineConfig) => void;
}

export default function ScheduleManagement({ limousineConfig, onUpdateLimousineConfig }: ScheduleManagementProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedRoute, setSelectedRoute] = useState<string>("Hà Nội - Mộc Châu");
  const [newExtraTime, setNewExtraTime] = useState("");
  
  // Bulk states
  const [showBulk, setShowBulk] = useState(false);
  const [bulkMode, setBulkMode] = useState<"range" | "recurring">("range");
  const [bulkStartDate, setBulkStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bulkEndDate, setBulkEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bulkTime, setBulkTime] = useState("07:00");
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]); // All days by default

  const exceptions = limousineConfig.scheduleExceptions || [];

  const handleToggleBlock = (time: string, date: string = selectedDate) => {
    const isBlocked = exceptions.some(e => e.date === date && e.route === selectedRoute && e.time === time && e.type === 'blocked');
    
    let nextExceptions: DailyScheduleException[];
    if (isBlocked) {
      nextExceptions = exceptions.filter(e => !(e.date === date && e.route === selectedRoute && e.time === time && e.type === 'blocked'));
    } else {
      const newException: DailyScheduleException = {
        id: `exc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        date: date,
        route: selectedRoute,
        time: time,
        type: 'blocked'
      };
      nextExceptions = [...exceptions, newException];
    }
    onUpdateLimousineConfig({ ...limousineConfig, scheduleExceptions: nextExceptions });
  };

  const handleApplyBulk = (type: 'block' | 'unblock') => {
    const start = new Date(bulkStartDate);
    const end = new Date(bulkEndDate);
    
    if (end < start) {
      alert("Ngày kết thúc phải sau ngày bắt đầu!");
      return;
    }

    let nextExceptions = [...exceptions];
    const daysToProcess: string[] = [];
    
    let current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const dayOfWeek = current.getDay();
      
      if (selectedWeekDays.includes(dayOfWeek)) {
        daysToProcess.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }

    if (daysToProcess.length === 0) {
      alert("Không tìm thấy ngày nào phù hợp trong khoảng đã chọn!");
      return;
    }

    if (type === 'block') {
      daysToProcess.forEach(d => {
        const alreadyBlocked = nextExceptions.some(e => e.date === d && e.route === selectedRoute && e.time === bulkTime && e.type === 'blocked');
        if (!alreadyBlocked) {
          nextExceptions.push({
            id: `exc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            date: d,
            route: selectedRoute,
            time: bulkTime,
            type: 'blocked'
          });
        }
      });
    } else {
      nextExceptions = nextExceptions.filter(e => 
        !(daysToProcess.includes(e.date) && e.route === selectedRoute && e.time === bulkTime && e.type === 'blocked')
      );
    }

    onUpdateLimousineConfig({ ...limousineConfig, scheduleExceptions: nextExceptions });
    alert(`Đã ${type === 'block' ? 'khóa' : 'mở'} chuyến ${bulkTime} cho ${daysToProcess.length} ngày thành công!`);
  };

  const handleAddExtra = () => {
    if (!newExtraTime) return;
    
    // Check if duplicate
    const isDuplicate = exceptions.some(e => e.date === selectedDate && e.route === selectedRoute && e.time === newExtraTime);
    const isStandard = (selectedRoute === "Hà Nội - Mộc Châu" ? DEFAULT_SCHEDULES_HN_MC : DEFAULT_SCHEDULES_MC_HN).includes(newExtraTime);
    
    if (isDuplicate || isStandard) {
      alert("Giờ chạy này đã tồn tại trong lịch trình chuẩn hoặc đã được thêm.");
      return;
    }

    const newException: DailyScheduleException = {
      id: `exc_${Date.now()}`,
      date: selectedDate,
      route: selectedRoute,
      time: newExtraTime,
      type: 'extra'
    };

    onUpdateLimousineConfig({ ...limousineConfig, scheduleExceptions: [...exceptions, newException] });
    setNewExtraTime("");
    alert("Đã thêm chuyến tăng cường thành công!");
  };

  const handleRemoveExtra = (id: string) => {
    onUpdateLimousineConfig({
      ...limousineConfig, 
      scheduleExceptions: exceptions.filter(e => e.id !== id)
    });
  };

  const standardSchedules = selectedRoute === "Hà Nội - Mộc Châu" ? DEFAULT_SCHEDULES_HN_MC : DEFAULT_SCHEDULES_MC_HN;
  const extraTrips = exceptions.filter(e => e.date === selectedDate && e.route === selectedRoute && e.type === 'extra');

  const weekDaysLabel = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="space-y-8">
      {/* Header with quick actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-stone-50 p-6 rounded-2xl border border-stone-200">
        <div>
          <h3 className="text-xl font-black text-[#1b4332] uppercase tracking-tight">Điều chỉnh lịch chạy chuyên sâu</h3>
          <p className="text-xs text-stone-500 mt-1">Khóa/mở chuyến đơn lẻ hoặc hàng loạt theo khoảng thời gian.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowBulk(!showBulk)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
              showBulk 
                ? "bg-emerald-600 text-white border-emerald-700 shadow-md" 
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            {showBulk ? "Đóng Khóa Hàng Loạt" : "Khóa Chuyến Hàng Loạt"}
          </button>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-sm">
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <input 
              type="date" 
              className="text-sm font-bold outline-none cursor-pointer border-none bg-transparent" 
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>
          <select 
            className="bg-white px-3 py-2 rounded-xl border border-stone-200 text-sm font-bold outline-none cursor-pointer shadow-sm"
            value={selectedRoute}
            onChange={e => setSelectedRoute(e.target.value)}
          >
            <option>Hà Nội - Mộc Châu</option>
            <option>Mộc Châu - Hà Nội</option>
          </select>
        </div>
      </div>

      {/* Bulk Locking UI */}
      {showBulk && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50/50 p-6 rounded-3xl border-2 border-emerald-200 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-stone-900 uppercase tracking-widest text-sm">Cài đặt khóa chuyến hàng loạt</h4>
              <p className="text-[10px] text-emerald-700 font-bold uppercase">Áp dụng cho tuyến {selectedRoute}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <label className="text-xs font-black text-stone-600 uppercase flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                1. Chọn khung giờ cần xử lý
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {standardSchedules.map(time => (
                  <button 
                    key={`bulk-${time}`}
                    onClick={() => setBulkTime(time)}
                    className={`py-2 px-1 rounded-lg text-[10px] font-black border-2 transition-all cursor-pointer ${
                      bulkTime === time 
                        ? "bg-emerald-600 border-emerald-700 text-white" 
                        : "bg-white border-stone-100 text-stone-500 hover:border-emerald-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-stone-600 uppercase flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
                2. Chọn khoảng thời gian
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Từ ngày</span>
                  <input 
                    type="date" 
                    value={bulkStartDate} 
                    onChange={e => setBulkStartDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Đến ngày</span>
                  <input 
                    type="date" 
                    value={bulkEndDate} 
                    onChange={e => setBulkEndDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {weekDaysLabel.map((day, idx) => (
                  <button
                    key={day}
                    onClick={() => {
                      if (selectedWeekDays.includes(idx)) {
                        setSelectedWeekDays(selectedWeekDays.filter(d => d !== idx));
                      } else {
                        setSelectedWeekDays([...selectedWeekDays, idx]);
                      }
                    }}
                    className={`w-7 h-7 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                      selectedWeekDays.includes(idx)
                        ? "bg-stone-800 text-white"
                        : "bg-white border border-stone-200 text-stone-400"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end gap-3 pb-1">
              <button 
                onClick={() => handleApplyBulk('block')}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Khóa Tất Cả Chuyến {bulkTime}
              </button>
              <button 
                onClick={() => handleApplyBulk('unblock')}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldOff className="w-4 h-4" />
                Mở Tất Cả Chuyến {bulkTime}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard Schedule Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-stone-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Lịch trình chuẩn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
            </h4>
            <span className="text-[10px] text-stone-400 font-bold">Nhấn để Khóa/Mở</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {standardSchedules.map(time => {
              const isBlocked = exceptions.some(e => e.date === selectedDate && e.route === selectedRoute && e.time === time && e.type === 'blocked');
              return (
                <button
                  key={time}
                  onClick={() => handleToggleBlock(time)}
                  className={`py-3 px-2 rounded-xl text-sm font-black transition-all cursor-pointer border-2 flex flex-col items-center gap-1 ${
                    isBlocked 
                      ? "bg-red-50 border-red-200 text-red-600 shadow-inner" 
                      : "bg-white border-stone-100 text-stone-700 hover:border-emerald-500 shadow-sm"
                  }`}
                >
                  {time}
                  {isBlocked ? (
                    <span className="text-[8px] flex items-center gap-0.5 uppercase"><Shield className="w-2 h-2 text-red-400" /> Đã Khóa</span>
                  ) : (
                    <span className="text-[8px] text-emerald-600 flex items-center gap-0.5 uppercase font-black"><Clock className="w-2 h-2" /> Đang Mở</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Extra Trips Management */}
        <div className="space-y-4">
          <h4 className="font-black text-stone-900 uppercase tracking-widest text-xs flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-600" />
            Chuyến tăng cường ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
          </h4>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                type="time" 
                className="flex-1 p-3 border-2 border-dashed border-stone-300 rounded-xl font-black outline-none focus:border-emerald-500 transition-all bg-white"
                value={newExtraTime}
                onChange={e => setNewExtraTime(e.target.value)}
              />
              <button 
                onClick={handleAddExtra}
                className="bg-emerald-600 text-white px-6 rounded-xl font-black text-xs uppercase cursor-pointer hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
              >
                Tăng cường
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden min-h-[140px] shadow-sm">
              {extraTrips.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-stone-300">
                  <Plus className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Chưa có chuyến bổ sung</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {extraTrips.map(extra => (
                    <div key={extra.id} className="flex items-center justify-between p-4 hover:bg-stone-50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-black text-stone-900">{extra.time}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase">Chuyến bổ sung</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveExtra(extra.id)}
                        className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
