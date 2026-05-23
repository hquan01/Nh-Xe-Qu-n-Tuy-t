import React, { useState } from "react";
import { LocationPoint } from "../../types";
import { Plus, Trash2, MapPin } from "lucide-react";

interface LocationManagementProps {
  locations: LocationPoint[];
  onUpdateLocations: (updated: LocationPoint[]) => void;
}

export default function LocationManagement({ locations, onUpdateLocations }: LocationManagementProps) {
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<"pickup" | "dropoff">("pickup");
  const [newCity, setNewCity] = useState<"Hà Nội" | "Mộc Châu">("Hà Nội");
  const [newService, setNewService] = useState<"limousine" | "shared" | "both">("both");

  const handleAdd = () => {
    try {
      if (!newName.trim()) {
        alert("Vui lòng nhập tên điểm!");
        return;
      }
      
      const next: LocationPoint = {
        id: `loc_${Date.now()}`,
        name: newName.trim(),
        type: newType,
        city: newCity,
        serviceType: newService
      };
      
      const currentLocations = Array.isArray(locations) ? locations : [];
      onUpdateLocations([...currentLocations, next]);
      setNewName("");
      alert("Đã thêm điểm mới thành công!");
    } catch (error) {
      console.error("Error adding location:", error);
      alert("Có lỗi xảy ra khi thêm điểm!");
    }
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    const currentLocations = Array.isArray(locations) ? locations : [];
    onUpdateLocations(currentLocations.filter(l => l.id !== id));
    alert("Đã xóa điểm thành công!");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-[#1b4332]">Quản lý Điểm đón & trả khách</h3>
      
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Tên điểm mới</label>
          <input 
            type="text" 
            placeholder="VD: Cổng BigC Thăng Long" 
            className="w-64 p-2 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Loại điểm</label>
          <select 
            className="w-32 p-2 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={newType}
            onChange={e => setNewType(e.target.value as "pickup" | "dropoff")}
          >
            <option value="pickup">Điểm Đón</option>
            <option value="dropoff">Điểm Trả</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Thành phố</label>
          <select 
            className="w-32 p-2 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={newCity}
            onChange={e => setNewCity(e.target.value as "Hà Nội" | "Mộc Châu")}
          >
            <option value="Hà Nội">Hà Nội</option>
            <option value="Mộc Châu">Mộc Châu</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Dành cho xe</label>
          <select 
            className="w-36 p-2 border border-emerald-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={newService}
            onChange={e => setNewService(e.target.value as "limousine" | "shared" | "both")}
          >
            <option value="both">Tất cả (Cả 2)</option>
            <option value="limousine">Xe Limousine</option>
            <option value="shared">Xe Ghép</option>
          </select>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Thêm Điểm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hanoi Points */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-stone-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-4 bg-blue-500 rounded-full" />
            Điểm Đón & Trả tại Hà Nội
          </h4>
          <div className="space-y-2">
            {(Array.isArray(locations) ? locations : []).filter(l => l.city === "Hà Nội" || !l.city).map(loc => (
              <div key={loc.id} className="bg-white p-3 rounded-xl border border-stone-200 flex justify-between items-center group">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${loc.type === 'pickup' ? 'text-blue-500' : 'text-orange-500'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-800 tracking-tight">{loc.name}</span>
                      {loc.serviceType === "limousine" && <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm font-bold">LIMO</span>}
                      {loc.serviceType === "shared" && <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm font-bold">GHÉP</span>}
                      {(!loc.serviceType || loc.serviceType === "both") && <span className="text-[8px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm font-bold">ALL</span>}
                    </div>
                    <span className={`block text-[10px] font-bold uppercase ${loc.type === 'pickup' ? 'text-blue-400' : 'text-orange-400'}`}>
                      {loc.type === 'pickup' ? 'Điểm Đón' : 'Điểm Trả'} {!loc.city && "(Chưa phân vùng)"}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(loc.id)}
                  className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Moc Chau Points */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-stone-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-4 bg-emerald-500 rounded-full" />
            Điểm Đón & Trả tại Mộc Châu
          </h4>
          <div className="space-y-2">
            {(Array.isArray(locations) ? locations : []).filter(l => l.city === "Mộc Châu").map(loc => (
              <div key={loc.id} className="bg-white p-3 rounded-xl border border-stone-200 flex justify-between items-center group">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${loc.type === 'pickup' ? 'text-blue-500' : 'text-orange-500'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-800 tracking-tight">{loc.name}</span>
                      {loc.serviceType === "limousine" && <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm font-bold">LIMO</span>}
                      {loc.serviceType === "shared" && <span className="text-[8px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm font-bold">GHÉP</span>}
                      {(!loc.serviceType || loc.serviceType === "both") && <span className="text-[8px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm font-bold">ALL</span>}
                    </div>
                    <span className={`block text-[10px] font-bold uppercase ${loc.type === 'pickup' ? 'text-blue-400' : 'text-orange-400'}`}>
                      {loc.type === 'pickup' ? 'Điểm Đón' : 'Điểm Trả'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(loc.id)}
                  className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
