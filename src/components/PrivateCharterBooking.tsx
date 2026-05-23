import React from "react";
import { User, Phone, MessageCircle } from "lucide-react";

export default function PrivateCharterBooking({ onAddBooking, currentUser }: any) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm text-center">
      <h2 className="text-xl font-bold mb-2">Thuê Xe Riêng</h2>
      <p className="text-stone-500 mb-6 font-sans">4-7-9-16 chỗ - Hợp đồng theo giờ/chuyến - Giá: 1.500.000đ - 3.500.000đ</p>
      
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => {
             window.location.href = "tel:0971050324";
          }}
          className="py-3 bg-[#1b4332] text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Gọi điện
        </button>
        <button 
          onClick={() => {
             window.open("https://zalo.me/0971050324", "_blank");
          }}
          className="py-3 bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Chat Zalo
        </button>
      </div>
    </div>
  );
}
