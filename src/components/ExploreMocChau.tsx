import React, { useState } from "react";
import { Destination } from "../types";
import { Clock, Info, Check, Sparkles, MapPin, Compass } from "lucide-react";
import { motion } from "motion/react";

interface ExploreMocChauProps {
  destinations: Destination[];
}

export default function ExploreMocChau({ destinations }: ExploreMocChauProps) {
  const [displayCount, setDisplayCount] = useState(4);
  const visibleDestinations = destinations.slice(0, displayCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="explore_moc_chau_section">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          Cẩm Nang Tây Bắc
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] tracking-tight mt-3">
          Tọa Độ Check-in Mộc Châu "Sống Ảo" Đẹp Nhất
        </h2>
        <p className="text-stone-500 mt-2 text-sm font-sans">
          Mộc Châu bốn mùa ngập tràn hương sắc hoa trái thiên nhiên mộc mạc. Điểm qua danh sách các tọa độ vàng không thể bỏ lỡ khi xách vali lướt trên cao nguyên.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {visibleDestinations.map((dest) => (
          <div
            key={dest.id}
            id={`dest_card_${dest.id}`}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-lg transition-all flex flex-col sm:flex-row h-full"
          >
            {/* Visual Thumbnail */}
            <div className="sm:w-1/2 h-52 sm:h-auto relative overflow-hidden shrink-0">
              <img
                src={dest.image || null}
                alt={dest.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-stone-900/95 backdrop-blur-xs text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm">
                {dest.tag}
              </div>
            </div>

            {/* Inner Content info */}
            <div className="p-6 sm:w-1/2 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-1 text-[10px] uppercase font-bold text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{dest.distance}</span>
                </div>
                <h3 className="font-extrabold text-[#1b4332] text-base leading-snug">
                  {dest.name}
                </h3>
                <p className="text-stone-500 text-[11px] leading-relaxed font-sans">{dest.description}</p>
              </div>

              {/* Tips block */}
              <div className="space-y-2 pt-3 border-t border-stone-100">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Thời gian lý tưởng:</span>
                </div>
                <p className="text-[10px] text-stone-600 font-sans leading-tight mt-1">{dest.bestTime}</p>

                <div className="flex items-start space-x-1.5 text-xs font-bold text-[#1b4332] mt-2">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mẹo hay du lịch: <p className="font-normal text-stone-600 text-[10px] inline font-sans leading-relaxed">{dest.tips}</p></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayCount < destinations.length && (
        <div className="mt-12 text-center">
          <button 
            onClick={() => setDisplayCount(prev => prev + 4)}
            className="bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-lg shadow-emerald-900/10"
          >
            Xem thêm địa điểm
          </button>
        </div>
      )}

      <div className="bg-[#1b4332] text-stone-100 rounded-3xl p-8 mt-12 text-center max-w-4xl mx-auto relative overflow-hidden shadow-md">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center space-x-2">
          <Compass className="w-5.5 h-5.5 text-emerald-400 animate-spin-slow" />
          <span>Bạn cần đặt một chuyến đi đến các địa danh này?</span>
        </h3>
        <p className="text-stone-300 text-xs mt-1.5 max-w-xl mx-auto font-sans leading-relaxed">
          Sử dụng gói Combo hoặc thuê trọn xe phục vụ khứ hồi đón tại nhà riêng Hà Nội. Điều hành viên của Xe Đi Mộc Châu hỗ trợ tư vấn thiết kế lộ trình chụp ảnh đẹp nhất Tây Bắc miễn phí.
        </p>
        <div className="mt-5">
          <a
            href="tel:0971050324"
            className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-transform hover:scale-[1.02]"
          >
            Liên Hệ Đặt Lịch Trình Chụp Ảnh: 0971.050.324
          </a>
        </div>
      </div>
    </div>
  );
}
