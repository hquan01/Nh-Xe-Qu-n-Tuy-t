import React from "react";
import { Compass, CalendarDays, Users, Search, Sparkles, MapPin, Ticket } from "lucide-react";
import { motion } from "motion/react";

const heroImg = "/src/assets/images/moc_chau_hero_1779246188232.png";

interface HeroProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchLimousine: (from: string, to: string, date: string, time?: string) => void;
  onSearchCombo: (hotelId: string, date: string, from?: string, to?: string, time?: string) => void;
}

export default function Hero({ activeTab, setActiveTab, onSearchLimousine, onSearchCombo }: HeroProps) {
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getNowTimeString = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Booking inputs are pre-filled with smart defaults as requested
  const [routeFrom, setRouteFrom] = React.useState("Hà Nội");
  const [routeTo, setRouteTo] = React.useState("Mộc Châu");
  const [travelDate, setTravelDate] = React.useState("");
  const [travelTime, setTravelTime] = React.useState("");
  const [guests, setGuests] = React.useState("2");
  const [subType, setSubType] = React.useState<'limousine' | 'combo'>('limousine');

  // Sync subType with active tab
  React.useEffect(() => {
    if (activeTab === 'limousine' || activeTab === 'combo') {
      setSubType(activeTab as any);
      setRouteTo("Mộc Châu");
      if (routeFrom === "") {
        setRouteFrom("Hà Nội");
      }
    }
  }, [activeTab]);

  // Synchronize route inputs intelligently (if one is Hanoi, other is Moc Chau, and vice-versa)
  const handleRouteFromChange = (val: string) => {
    setRouteFrom(val);
    if (!val) {
      setRouteTo("");
    } else if (val === "Hà Nội") {
      setRouteTo("Mộc Châu");
    } else if (val === "Mộc Châu") {
      setRouteTo("Hà Nội");
    }
  };

  const handleRouteToChange = (val: string) => {
    setRouteTo(val);
    if (!val) {
      setRouteFrom("");
    } else if (val === "Hà Nội") {
      setRouteFrom("Mộc Châu");
    } else if (val === "Mộc Châu") {
      setRouteFrom("Hà Nội");
    }
  };

  const swapRoute = () => {
    const temp = routeFrom;
    setRouteFrom(routeTo);
    setRouteTo(temp);
  };

  const provinceOptions = (
    <>
      <option value="">-- Chọn điểm --</option>
      <optgroup label="Cao nguyên Xanh">
        <option value="Mộc Châu">Mộc Châu (Sơn La)</option>
      </optgroup>
      <optgroup label="Hành lang Đồng bằng sông Hồng">
        <option value="Hà Nội">Hà Nội</option>
        <option value="Bắc Ninh">Bắc Ninh</option>
        <option value="Hưng Yên">Hưng Yên</option>
        <option value="Hải Phòng">Hải Phòng</option>
        <option value="Quảng Ninh">Quảng Ninh</option>
        <option value="Hải Dương">Hải Dương</option>
        <option value="Thái Bình">Thái Bình</option>
        <option value="Nam Định">Nam Định</option>
        <option value="Ninh Bình">Ninh Bình</option>
        <option value="Hà Nam">Hà Nam</option>
      </optgroup>
      <optgroup label="Trung du & Tây - Đông Bắc Bộ">
        <option value="Hòa Bình">Hòa Bình</option>
        <option value="Sơn La">Sơn La (Các huyện khác)</option>
        <option value="Vĩnh Phúc">Vĩnh Phúc</option>
        <option value="Phú Thọ">Phú Thọ</option>
        <option value="Bắc Giang">Bắc Giang</option>
        <option value="Thái Nguyên">Thái Nguyên</option>
        <option value="Lạng Sơn">Lạng Sơn</option>
        <option value="Yên Bái">Yên Bái</option>
        <option value="Lào Cai">Lào Cai (Sapa)</option>
        <option value="Hà Giang">Hà Giang</option>
        <option value="Tuyên Quang">Tuyên Quang</option>
        <option value="Cao Bằng">Cao Bằng</option>
      </optgroup>
    </>
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate empty inputs
    if (!routeFrom.trim()) {
      alert("Vui lòng nhập điểm đi!");
      return;
    }
    if (!routeTo.trim()) {
      alert("Vui lòng nhập điểm đến!");
      return;
    }
    if (!travelDate) {
      alert("Vui lòng chọn ngày khởi hành!");
      return;
    }
    if (!travelTime) {
      alert("Vui lòng chọn giờ khởi hành!");
      return;
    }
    
    // Validate past date
    const today = getTodayString();
    if (travelDate < today) {
      alert("Ngày khởi hành không được chọn ở quá khứ!");
      return;
    }
    
    // Validate past time if date is today
    if (travelDate === today) {
      const currentRes = getNowTimeString();
      if (travelTime < currentRes) {
        alert("Giờ khởi hành không được trong quá khứ!");
        return;
      }
    }

    if (subType === 'limousine') {
      setActiveTab("limousine");
      onSearchLimousine(routeFrom, routeTo, travelDate, travelTime);
    } else {
      setActiveTab("combo");
      onSearchCombo("all", travelDate, routeFrom, routeTo, travelTime);
    }
  };

  return (
    <div className="relative bg-stone-900 overflow-hidden" id="hero_wrapper">
      {/* Background Graphic or Real Rendered Image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Mộc Châu Đồi Chè"
          className="w-full h-full object-cover opacity-60 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-950/80" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-32 flex flex-col items-center text-center">
        {/* Floating Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Mộc Châu Khởi Hành Hàng Ngày - Giá Tốt Nhất</span>
        </motion.div>

        {/* Catchy Slogan */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl"
        >
          Xe Limousine Thượng Lưu & Siêu Combo <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-teal-300">Hà Nội ⇌ Mộc Châu</span> Đón Trả Tận Nhà
        </motion.h1>
 
        {/* Explanatory subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-sm sm:text-base md:text-lg text-stone-200 max-w-3xl font-sans"
        >
          Đơn vị vận tải & lữ hành số 1 Tây Bắc. Cam kết giữ đúng số ghế 100%, không bắt khách dọc đường, đưa đón tận nhà cả hai đầu. Đặt Combo Xe & Phòng nghỉ sang trọng (Phoenix, Mường Thanh) ngay hôm nay để tiết kiệm đến 20%!
        </motion.p>

        {/* Search Engine Booking Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-4xl mt-10 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-stone-100 text-left"
          id="search_box_container"
        >
          {/* Booking type tabs */}
          <div className="flex space-x-2 border-b border-stone-100 pb-4 mb-4">
            <button
              onClick={() => setSubType('limousine')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                subType === 'limousine'
                  ? "bg-[#1b4332] text-white"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Đặt Xe VIP Limousine</span>
            </button>
            <button
              onClick={() => setSubType('combo')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                subType === 'combo'
                  ? "bg-[#1b4332] text-white"
                  : "bg-stone-50 text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Combo Xe + Phòng (Tiết kiệm 20%)</span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Route swap / Select Origin */}
            <div className="md:col-span-5 grid grid-cols-9 gap-2 items-center">
              <div className="col-span-4 space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Điểm đi</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-emerald-600 z-10 pointer-events-none" />
                  <select
                    value={routeFrom}
                    onChange={(e) => handleRouteFromChange(e.target.value)}
                    className="w-full pl-9 pr-2 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {provinceOptions}
                  </select>
                </div>
              </div>

              {/* Transit swap button */}
              <div className="col-span-1 flex justify-center pt-5">
                <button
                  type="button"
                  onClick={swapRoute}
                  className="p-1.5 rounded-full bg-stone-100 hover:bg-emerald-100 text-[#1b4332] transition-colors shadow-sm cursor-pointer"
                  title="Đổi chiều đi"
                >
                  ⇄
                </button>
              </div>

              <div className="col-span-4 space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Điểm đến</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-emerald-600 z-10 pointer-events-none" />
                  <select
                    value={routeTo}
                    onChange={(e) => handleRouteToChange(e.target.value)}
                    disabled={subType === 'combo'}
                    className="w-full pl-9 pr-2 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {provinceOptions}
                  </select>
                </div>
              </div>
            </div>

            {/* Travel Date */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Ngày khởi hành</label>
              <div className="relative font-sans">
                <CalendarDays className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="date"
                  value={travelDate}
                  min={getTodayString()}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-semibold text-stone-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Travel Time */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Giờ khởi hành</label>
              <div className="relative font-sans">
                <Compass className="absolute left-3 top-3 w-4 h-4 text-emerald-600 z-10 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-semibold text-[#1b4332] focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Search Submit trigger */}
            <div className="md:col-span-2">
              <button
                type="submit"
                id="search_form_submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-[#1b4332] text-white rounded-lg font-bold text-sm tracking-wide shadow-md shadow-emerald-800/20 hover:from-emerald-700 hover:to-[#122e22] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Tìm kiếm</span>
              </button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-x-6 gap-y-2 text-stone-500 text-xs justify-center sm:justify-start">
            <span>✓ Cam kết 100% giữ chỗ</span>
            <span>✓ Chọn số ghế chính xác</span>
            <span>✓ Không đón khách dọc đường quốc lộ 6</span>
            <span>✓ Khăn lạnh & nước suối miễn phí</span>
          </div>
        </motion.div>

        {/* Agency Trust Authority Numbers */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl text-stone-300 border-t border-stone-800/60 pt-10">
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">15.000+</span>
            <span className="text-[11px] uppercase tracking-wider text-stone-400">Khách hàng hài lòng</span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">30+</span>
            <span className="text-[11px] uppercase tracking-wider text-stone-400">Dàn xe Limousine VIP</span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">4.9 / 5</span>
            <span className="text-[11px] uppercase tracking-wider text-stone-400">Đánh giá TripAdvisor</span>
          </div>
          <div className="space-y-1">
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">100%</span>
            <span className="text-[11px] uppercase tracking-wider text-stone-400">Đảm bảo giữ phòng + vé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
