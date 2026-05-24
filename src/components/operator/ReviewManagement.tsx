import React, { useState, useEffect } from "react";
import { Review, Destination } from "../../types";
import { collection, query, onSnapshot, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Trash2, MessageSquare, Star, Search, Filter, RefreshCw, MapPin, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReviewManagementProps {
  destinations: Destination[];
}

export default function ReviewManagement({ destinations }: ReviewManagementProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    const q = query(collection(db, "reviews"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Review[] = [];
      snapshot.forEach((doc) => fetched.push(doc.data() as Review));
      fetched.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setReviews(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.")) {
      try {
        await deleteDoc(doc(db, "reviews", id));
      } catch (error) {
        alert("Không thể xóa đánh giá. Vui lòng thử lại.");
      }
    }
  };

  const getDestinationName = (id: string) => {
    return destinations.find(d => d.id === id)?.name || "Địa điểm không xác định";
  };

  const filteredReviews = reviews.filter(rev => {
    const matchesSearch = 
      rev.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDestinationName(rev.destinationId).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === null || rev.rating === filterRating;
    
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight">Quản lý Đánh giá</h2>
          <p className="text-xs text-stone-500 font-medium">Kiểm duyệt và quản lý phản hồi của khách hàng ({reviews.length})</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm đánh giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500 transition-all w-60"
            />
          </div>
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-2">
            <Filter className="w-4 h-4 text-stone-400 ml-2" />
            <select 
              className="bg-transparent py-2 px-2 text-xs font-bold border-none outline-none"
              value={filterRating || ""}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Tất cả sao</option>
              <option value="5">5 Sao</option>
              <option value="4">4 Sao</option>
              <option value="3">3 Sao</option>
              <option value="2">2 Sao</option>
              <option value="1">1 Sao</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white p-20 rounded-[2.5rem] text-center border-2 border-dashed border-stone-100">
          <MessageSquare className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <h3 className="text-stone-900 font-black text-lg">Không tìm thấy đánh giá nào</h3>
          <p className="text-stone-500 text-sm mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={review.id}
              className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Destination Tag */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shrink-0">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">
                    {getDestinationName(review.destinationId)}
                  </span>
                </div>
                <div className="flex ml-auto space-x-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-current' : 'text-stone-100'}`} />
                  ))}
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}`} 
                  className="w-10 h-10 rounded-full border-2 border-stone-50" 
                  alt="avatar" 
                />
                <div className="flex flex-col">
                  <h4 className="text-sm font-black text-stone-900 leading-none mb-1">{review.userName}</h4>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tight">{review.userEmail || "Anonymous"}</p>
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs text-stone-600 leading-relaxed font-sans mb-6 line-clamp-4 italic border-l-4 border-stone-100 pl-4 py-1 bg-stone-50/50 rounded-r-xl">
                "{review.comment}"
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-50">
                <div className="flex items-center space-x-1.5 text-stone-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {new Date(review.timestamp).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                
                <button 
                  onClick={() => handleDelete(review.id)}
                  className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  title="Xóa đánh giá"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
