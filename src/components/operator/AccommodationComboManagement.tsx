import React, { useState } from "react";
import { Accommodation, TourCombo } from "../../types";
import AccommodationManagement from "./AccommodationManagement";
import ComboManagement from "./ComboManagement";
import { Building, Compass } from "lucide-react";

interface AccommodationComboManagementProps {
  accommodations: Accommodation[];
  onUpdateAccommodations: (updated: Accommodation[]) => void;
  combos: TourCombo[];
  onUpdateCombos: (updated: TourCombo[]) => void;
}

export default function AccommodationComboManagement({
  accommodations,
  onUpdateAccommodations,
  combos,
  onUpdateCombos
}: AccommodationComboManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<"accommodations" | "combos">("accommodations");

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="flex border-b border-stone-100 bg-stone-50/50">
        <button
          onClick={() => setActiveSubTab("accommodations")}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            activeSubTab === "accommodations"
              ? "bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <Building className={`w-4 h-4 ${activeSubTab === "accommodations" ? "text-emerald-600" : "text-stone-300"}`} />
          Quản lý Khách sạn / Resort
        </button>
        <button
          onClick={() => setActiveSubTab("combos")}
          className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
            activeSubTab === "combos"
              ? "bg-white text-emerald-800 border-b-2 border-emerald-600 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          <Compass className={`w-4 h-4 ${activeSubTab === "combos" ? "text-emerald-600" : "text-stone-300"}`} />
          Quản lý Combo Xe + Phòng
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {activeSubTab === "accommodations" ? (
          <AccommodationManagement 
            accommodations={accommodations} 
            onUpdateAccommodations={onUpdateAccommodations} 
          />
        ) : (
          <ComboManagement 
            combos={combos} 
            onUpdateCombos={onUpdateCombos} 
            accommodations={accommodations} 
          />
        )}
      </div>
    </div>
  );
}
