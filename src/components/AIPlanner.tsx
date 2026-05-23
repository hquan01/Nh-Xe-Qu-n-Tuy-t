import React, { useState } from "react";
import { Sparkles, Printer, Copy, RefreshCw, Star, ArrowRight, Compass, ShieldCheck, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Localized fun loading phrases
const LOADING_PHRASES = [
  "Trợ lý Xe Đi Mộc Châu đang sải bước trên đồi chè Trái Tim lộng gió...",
  "Đang dầm sương sớm trên thung lũng mận Nà Ka tuyển mộ địa điểm đỉnh...",
  "Hỏi ý kiến bản làng Đông Sang sắp xếp bữa tối cá suối nướng ngon lành...",
  "Liên hệ điều hành DCar Limousine 9 chỗ bố trí lộ trình di chuyển mượt mà nhất...",
  "Hoàn thiện cẩm nang đặc sản cải mèo, trâu gác bếp và bê chao nóng hổi...",
  "Khắc họa bản đồ tọa độ check-in sống ảo, cầu kính Bạch Long kỷ lục..."
];

export default function AIPlanner() {
  const [duration, setDuration] = useState("2 ngày 1 đêm");
  const [style, setStyle] = useState("Check-in sống ảo thoải mái");
  const [budget, setBudget] = useState("Tầm trung / Đầy đủ tiện nghi");
  const [groupType, setGroupType] = useState("Cặp đôi lãng mạn");
  const [notes, setNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<{title: string, uri: string}[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setItinerary(null);
    setGroundingSources([]);
    setCopied(false);

    // Loop phrases
    let index = 0;
    setProgressText(LOADING_PHRASES[0]);
    const phraseInterval = setInterval(() => {
      index = (index + 1) % LOADING_PHRASES.length;
      setProgressText(LOADING_PHRASES[index]);
    }, 2800);

    try {
      const response = await fetch("/api/chat-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration,
          style,
          budget,
          groupType,
          notes
        })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Lỗi máy chủ: ${response.status}`);
      }
      
      const data = await response.json();
      clearInterval(phraseInterval);
      
      if (data.success && data.itinerary) {
        setItinerary(data.itinerary);
        
        // Extract grounding sources
        if (data.groundingMetadata?.groundingChunks) {
          const sources = data.groundingMetadata.groundingChunks
            .filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({
              title: chunk.web.title,
              uri: chunk.web.uri
            }));
          setGroundingSources(sources);
        }
      } else {
        throw new Error(data.message || "Không có dữ liệu lịch trình trả về.");
      }
    } catch (error: any) {
      clearInterval(phraseInterval);
      console.error("Failed to generate AI itinerary:", error);
      
      let errorDisplay = `❌ Lỗi: ${error.message}`;
      if (error.message?.includes("429") || error.message?.includes("Quota")) {
        errorDisplay = "⚠️ Hệ thống đang đạt giới hạn lượt yêu cầu miễn phí (Quota Limit). Quý khách vui lòng đợi khoảng 60 giây và nhấn 'Thiết Kế Tour' lần nữa để hệ thống đặt lại phiên bản mới nhất.";
      }
      
      setItinerary(errorDisplay);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!itinerary) return;
    navigator.clipboard.writeText(itinerary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Convert basic markdown tags into visual beautiful HTML elements programmatically
  const renderFormattedItinerary = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={index} className="text-base font-extrabold text-[#1b4332] mt-6 mb-2 border-b border-stone-100 pb-1 font-sans">
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={index} className="text-lg font-extrabold text-[#1b4332] mt-8 mb-3 flex items-center space-x-1.5 font-sans">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full inline-block" />
            <span>{trimmed.replace("##", "").trim()}</span>
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={index} className="text-xl font-extrabold text-[#1b4332] mt-10 mb-4 border-l-4 border-emerald-600 pl-3.5 pb-0.5 font-sans">
            {trimmed.replace("#", "").trim()}
          </h2>
        );
      }

      // Bullet points
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        let content = trimmed.slice(1).trim();
        // Replace bold items within bullets
        const formatted = replaceBoldMarkdown(content);
        return (
          <li key={index} className="ml-5 list-disc text-xs text-stone-600 leading-relaxed py-1 font-sans">
            {formatted}
          </li>
        );
      }

      // Default paragraphs
      if (trimmed.length > 0) {
        return (
          <p key={index} className="text-xs text-stone-600 leading-relaxed py-1.5 font-sans">
            {replaceBoldMarkdown(trimmed)}
          </p>
        );
      }

      return <div key={index} className="h-1.5" />;
    });
  };

  const replaceBoldMarkdown = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    if (parts.length === 1) return text;
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-stone-900">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="ai_itinerary_planner_section">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="relative inline-flex items-center space-x-1 border border-emerald-500/20 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
          <span>Xe Đi Mộc Châu AI Assistant</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] tracking-tight mt-3">
          Trợ Lý Ảo Thiết Kế Lịch Trình Mộc Châu
        </h2>
        <p className="text-stone-500 mt-2 text-sm font-sans">
          Cung cấp mong muốn của bạn, hệ thống Xe Đi Mộc Châu AI (powered by Google Gemini) sẽ kết nối dữ liệu Google Search để thiết kế tour độc bản cho bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form controls */}
        <div className="lg:col-span-4 bg-white border border-stone-200 p-6 rounded-3xl shadow-sm text-left">
          <form onSubmit={handleGenerate} className="space-y-5">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-widest border-b border-stone-100 pb-2 flex items-center space-x-1.5">
              <Compass className="w-4.5 h-4.5 text-emerald-600" />
              <span>Yêu cầu thiết kế</span>
            </h3>

            {/* Pick duration */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-semibold block">1. Thời gian dự định đi:</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="1 ngày khứ hồi">Chạy trốn 1 ngày (Khứ hồi trong ngày)</option>
                <option value="2 ngày 1 đêm">Cuối tuần thư giãn 2 Ngày 1 Đêm</option>
                <option value="3 ngày 2 đêm">Sâu sắc Mộc Châu 3 Ngày 2 Đêm</option>
                <option value="4 ngày 3 đêm">Trải nghiệm kỳ vĩ 4 Ngày 3 Đêm</option>
              </select>
            </div>

            {/* Companion type */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-semibold block">2. Bạn đi du lịch cùng ai?</label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="Cặp đôi lãng mạn">Cặp đôi / Hưởng tuần trăng mật lãng mạn</option>
                <option value="Gia đình có cả trẻ em và người già">Gia đình có cả trẻ em / người già</option>
                <option value="Đoàn nhóm bạn bè thân/Đồng nghiệp">Đoàn nhóm bạn bè thân / Đồng nghiệp</option>
                <option value="Độc hành chinh phục thiên nhiên">Độc hành tự do / Thích yên lặng một mình</option>
              </select>
            </div>

            {/* Travel style */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-semibold block">3. Phong cách chuyến đi ưa thích:</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="Check-in sống ảo thoải mái">Sống ảo check-in (Đồi chè, thác nước, thung lũng hoa)</option>
                <option value="Nghỉ dưỡng ẩm thực thư thái">Nghỉ dưỡng trọn vẹn, thưởng thức ẩm thực bản địa</option>
                <option value="Tìm hiểu văn hóa thiểu số Thái và người Mông">Tìm hiểu và giao lưu văn hóa dân tộc Thái/Mông</option>
                <option value="Cực phượt thám hiểm núi rừng Pha Luông">Cực phượt thám hiểm núi rừng (Leo đỉnh Pha Luông)</option>
              </select>
            </div>

            {/* Budget options */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-semibold block">4. Ngân sách dự kiến:</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-sm bg-white text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="Tiết kiệm tối đa / Ngủ homestay gỗ">Tiết kiệm / Bình dân (Sát sườn thực tế, ngủ Homestay bản)</option>
                <option value="Tầm trung / Đầy đủ tiện nghi và khách sạn 3 sao">Tầm trung / Đầy đủ tiện nghi và Khách sạn 3-4 sao</option>
                <option value="Luxury cao cấp / Nghỉ dưỡng resort 5 sao">Luxury cao cấp (Bungalow đồi thông, resort 5 sao)</option>
              </select>
            </div>

            {/* Additional requirements */}
            <div className="space-y-1">
              <label className="text-xs text-stone-700 font-semibold block">5. Yêu cầu/Lưu ý đặc biệt (với món ăn, người đi):</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Thích ăn nhiều mận hậu Tây Bắc, muốn check-in cầu kính Bạch Long, thong thả không leo dốc cao..."
                rows={3}
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-xs text-stone-810 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Trigger Button */}
            <button
              type="submit"
              id="ai_build_itinerary_btn"
              disabled={isLoading}
              className={`w-full py-3.5 bg-gradient-to-r from-emerald-600 to-[#1b4332] text-white rounded-xl font-bold text-sm tracking-wide shadow-md shadow-emerald-800/20 hover:from-emerald-700 hover:to-[#122e22] transition-colors flex items-center justify-center space-x-2 cursor-pointer ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              )}
              <span>{isLoading ? "Đang lên lịch trình bằng AI..." : "Thiết Kế Tour Bằng AI"}</span>
            </button>
          </form>
        </div>

        {/* Right Output details */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm min-h-[460px] flex flex-col justify-between print:border-none print:shadow-none bg-radial from-slate-50/50 to-white">
            
            {/* Top Toolbar */}
            <div className="px-6 py-4 bg-stone-50/80 border-b border-stone-100 flex justify-between items-center print:hidden">
              <span className="text-xs font-bold text-[#1b4332] tracking-wider uppercase">Lịch trình của bạn</span>
              {itinerary && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    id="copy_itinerary_btn"
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all text-xs flex items-center space-x-1 cursor-pointer"
                    title="Sao chép toàn bộ"
                  >
                    {copied ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline font-semibold">{copied ? "Đã chép" : "Chép"}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    id="print_itinerary_btn"
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all text-xs flex items-center space-x-1 cursor-pointer"
                    title="In bản cứng / Tải PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline font-semibold">In Tour</span>
                  </button>
                </div>
              )}
            </div>

            {/* Inner Content Block */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center text-left" id="print_area">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 space-y-6 max-w-sm mx-auto"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#1b4332] flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-[#1b4332] text-sm sm:text-base animate-pulse">Trợ lý AI đang hội ý...</h4>
                      <p className="text-stone-500 text-xs leading-relaxed font-sans min-h-[40px]">
                        {progressText}
                      </p>
                    </div>
                  </motion.div>
                )}

                {!isLoading && !itinerary && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 text-stone-400 space-y-4 max-w-sm mx-auto"
                    id="planner_empty_view"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto">
                      <Sparkles className="w-7 h-7 text-emerald-600 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1b4332] text-sm">Chưa Có Bản Lịch Trình Nào</h4>
                      <p className="text-stone-400 text-xs mt-1 max-w-xs mx-auto font-sans">
                        Hãy chọn thời gian, phong cách và đối tượng hành khách, sau đó nhấn nút <b>"Thiết Kế Tour Bằng AI"</b> để cá nhân hóa hoàn toàn trải nghiệm của bạn.
                      </p>
                    </div>
                  </motion.div>
                )}

                {!isLoading && itinerary && (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose max-w-none text-stone-800"
                    id="compiled_itinerary_output"
                  >
                    {!itinerary.startsWith("❌") && (
                      <div className="border bg-emerald-50/50 p-4 rounded-2xl border-emerald-100 flex items-start space-x-3 text-emerald-800 text-xs leading-relaxed mb-6 print:hidden">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold block text-emerald-950">Lịch trình thiết kế hoàn tất!</span>
                          Lịch trình này đã được tối ưu hóa cho di chuyển bằng xe Limousine VIP từ Hà Nội dọc Quốc lộ 6. Bạn có thể nhấn <b>In Tour</b> để tải nhanh file PDF về máy điện thoại của bạn.
                        </div>
                      </div>
                    )}

                    {/* Formatted printed container */}
                    <div className={`space-y-1 ${itinerary.startsWith("❌") ? "text-red-600 bg-red-50 p-4 rounded-xl border border-red-100" : ""}`}>
                      {renderFormattedItinerary(itinerary)}
                    </div>

                    {itinerary && !itinerary.startsWith("❌") && groundingSources.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-stone-100 print:block">
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em]">
                            Nguồn tham khảo thời gian thực từ Google Search
                          </h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {groundingSources.map((source, idx) => (
                            <a 
                              key={idx}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] bg-white text-stone-500 px-4 py-2 rounded-xl border border-stone-100 shadow-sm hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all flex items-center space-x-2 group"
                            >
                              <span className="truncate max-w-[180px] font-bold">{source.title}</span>
                              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </a>
                          ))}
                        </div>
                        <p className="mt-4 text-[9px] text-stone-400 font-medium italic opacity-70">
                          * Dữ liệu được trợ lý ảo Gemini tổng hợp trực tiếp từ kết quả tìm kiếm Google mới nhất.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Support Callout */}
            {itinerary && !isLoading && (
              <div className="px-6 py-4 bg-[#1b4332] text-stone-100 text-xs rounded-b-3xl flex flex-wrap justify-between items-center gap-2 print:hidden">
                <span className="font-sans font-medium">Bản lịch trình ưng ý? Trò chuyện với Điều hành để book trọn gói ưu đãi 20%</span>
                <a
                  href="tel:0971050324"
                  className="px-4 py-1.5 bg-amber-500 font-bold hover:bg-amber-600 transition-colors rounded-lg text-stone-900"
                >
                  Gọi Tư Vấn Booking
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
