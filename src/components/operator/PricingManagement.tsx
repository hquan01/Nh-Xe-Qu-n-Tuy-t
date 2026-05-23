import React from "react";
import { LimousineConfig, SharedCarConfig } from "../../types";

interface PricingManagementProps {
  limousineConfig: LimousineConfig;
  onUpdateLimousineConfig: (updated: LimousineConfig) => void;
  sharedCarConfig: SharedCarConfig;
  onUpdateSharedCarConfig: (updated: SharedCarConfig) => void;
}

export default function PricingManagement({ limousineConfig, onUpdateLimousineConfig, sharedCarConfig, onUpdateSharedCarConfig }: PricingManagementProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[#1b4332]">Quản lý Giá vé & Giảm giá</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Limousine Pricing */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-600 rounded-full" />
            Xe Limousine
          </h4>
          <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-stone-500 block mb-1">Giá chuẩn (Cuối tuần)</label>
               <input 
                 type="number" 
                 className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                 value={limousineConfig.weekendPriceStandard} 
                 onChange={e => onUpdateLimousineConfig({...limousineConfig, weekendPriceStandard: Number(e.target.value)})} 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-stone-500 block mb-1">Giá VIP (Cuối tuần)</label>
               <input 
                 type="number" 
                 className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                 value={limousineConfig.weekendPriceVip} 
                 onChange={e => onUpdateLimousineConfig({...limousineConfig, weekendPriceVip: Number(e.target.value)})} 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-emerald-600 block mb-1">Giảm giá Ngày thường (%)</label>
               <input 
                 type="number" 
                 className="w-full p-2.5 border border-emerald-200 bg-emerald-50 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                 value={limousineConfig.weekdayDiscountPercentage} 
                 onChange={e => onUpdateLimousineConfig({...limousineConfig, weekdayDiscountPercentage: Number(e.target.value)})} 
               />
               <p className="text-[10px] text-stone-400 mt-1">Giá ngày thường (T2-T5) = Giá cuối tuần * (100% - {limousineConfig.weekdayDiscountPercentage}%)</p>
               <p className="text-[10px] text-stone-400">Cuối tuần tính từ Thứ 6 đến Chủ Nhật.</p>
             </div>
          </div>
        </div>
        
        {/* Shared Car Pricing */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full" />
            Xe Ghép
          </h4>
          <div className="space-y-4">
             <div>
               <label className="text-xs font-bold text-stone-500 block mb-1">Giá chuẩn (Cuối tuần)</label>
               <input 
                 type="number" 
                 className="w-full p-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                 value={sharedCarConfig.weekendPriceStandard} 
                 onChange={e => onUpdateSharedCarConfig({...sharedCarConfig, weekendPriceStandard: Number(e.target.value)})} 
               />
             </div>
             <div>
               <label className="text-xs font-bold text-blue-600 block mb-1">Giảm giá Ngày thường (%)</label>
               <input 
                 type="number" 
                 className="w-full p-2.5 border border-blue-200 bg-blue-50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                 value={sharedCarConfig.weekdayDiscountPercentage} 
                 onChange={e => onUpdateSharedCarConfig({...sharedCarConfig, weekdayDiscountPercentage: Number(e.target.value)})} 
               />
               <p className="text-[10px] text-stone-400 mt-1">Giá ngày thường (T2-T5) = Giá cuối tuần * (100% - {sharedCarConfig.weekdayDiscountPercentage}%)</p>
               <p className="text-[10px] text-stone-400">Cuối tuần tính từ Thứ 6 đến Chủ Nhật.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
