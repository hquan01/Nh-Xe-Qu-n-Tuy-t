import React, { useState } from "react";
import { Coupon } from "../../types";
import { Plus, Trash2, Tag } from "lucide-react";

interface CouponManagementProps {
  coupons: Coupon[];
  onUpdateCoupons: (updated: Coupon[]) => void;
}

export default function CouponManagement({
  coupons,
  onUpdateCoupons,
}: CouponManagementProps) {
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(10);

  const handleAdd = () => {
    if (!newCode.trim()) return;
    const next: Coupon = {
      id: `coupon_${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      discountPercentage: newDiscount,
      isActive: true,
      isPublished: false,
    };
    onUpdateCoupons([...coupons, next]);
    setNewCode("");
  };

  const handleTogglePublished = (id: string, published: boolean) => {
    onUpdateCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isPublished: published } : c)),
    );
  };

  const handleDelete = (id: string) => {
    onUpdateCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[#1b4332]">
        Quản lý Mã giảm giá (Mã KM)
      </h3>

      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            Mã mới
          </label>
          <input
            type="text"
            placeholder="VD: GIAMGIA20"
            className="w-40 p-2 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            % Giảm
          </label>
          <input
            type="number"
            className="w-20 p-2 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={newDiscount}
            onChange={(e) => setNewDiscount(Number(e.target.value))}
          />
        </div>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm Mã
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white p-4 rounded-2xl border border-stone-200 flex justify-between items-center shadow-xs hover:border-emerald-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <Tag className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-black text-stone-800 tracking-tight">
                  {coupon.code}
                </div>
                <div className="text-xs text-emerald-600 font-bold">
                  Giảm {coupon.discountPercentage}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleTogglePublished(
                    coupon.id,
                    !coupon.isPublished,
                  )
                }
                className={`text-[10px] px-2 py-1 rounded font-bold uppercase transition-colors ${coupon.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}
              >
                {coupon.isPublished ? "Đã công bố" : "Chưa công bố"}
              </button>
              <button
                onClick={() => handleDelete(coupon.id)}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-10 text-stone-400 font-medium">
          Chưa có mã giảm giá nào được thiết lập.
        </div>
      )}
    </div>
  );
}
