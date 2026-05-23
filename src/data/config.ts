import { LimousineConfig, SharedCarConfig, Coupon, LocationPoint } from "../types";

export const DEFAULT_LIMOUSINE_CONFIG: LimousineConfig = {
  weekendPriceStandard: 300000,
  weekendPriceVip: 330000,
  weekdayDiscountPercentage: 10,
  scheduleExceptions: []
};

export const DEFAULT_SHARED_CAR_CONFIG: SharedCarConfig = {
  weekendPriceStandard: 350000,
  weekdayDiscountPercentage: 10
};

export const INITIAL_COUPONS: Coupon[] = [
  { id: "c1", code: "MOCCHAU10", discountPercentage: 10, isActive: true },
  { id: "c2", code: "WELCOME20", discountPercentage: 20, isActive: true }
];

export const INITIAL_LOCATIONS: LocationPoint[] = [
  // Hà Nội - Pickup
  { id: "p1", name: "BigC Thăng Long (Cổng sau)", type: "pickup", city: "Hà Nội", serviceType: "limousine" },
  { id: "p2", name: "Thành phố Hoàng gia (Cổng chính)", type: "pickup", city: "Hà Nội", serviceType: "limousine" },
  { id: "p3", name: "Ngõ 90 Nguyễn Tuân", type: "pickup", city: "Hà Nội", serviceType: "limousine" },
  { id: "p4", name: "Đón Tận Nơi Tại Hà Nội ( Phụ thu 50.000đ- 200.000đ tùy điểm đón )", type: "pickup", city: "Hà Nội", serviceType: "both" },
  
  // Hà Nội - Dropoff
  { id: "d5", name: "Trả Tận Nơi Tại Hà Nội ( Phụ thu 50.000đ- 200.000đ tùy điểm đón )", type: "dropoff", city: "Hà Nội", serviceType: "both" },
  { id: "d6", name: "BigC Thăng Long (Cổng sau)", type: "dropoff", city: "Hà Nội", serviceType: "limousine" },
  { id: "d7", name: "Thành phố Hoàng gia (Cổng chính)", type: "dropoff", city: "Hà Nội", serviceType: "limousine" },

  // Mộc Châu - Pickup
  { id: "p5", name: "Thị trấn Mộc Châu (Tận nơi Khách sạn/Homestay)", type: "pickup", city: "Mộc Châu", serviceType: "both" },
  { id: "p6", name: "Cổng khu du lịch Thác Dải Yếm ( Phụ thu )", type: "pickup", city: "Mộc Châu", serviceType: "limousine" },
  { id: "p7", name: "Cổng khu du lịch Rừng thông Bản Áng", type: "pickup", city: "Mộc Châu", serviceType: "limousine" },
  { id: "p8", name: "Cổng khu du lịch Cầu Kính Bạch Long ( Phụ thu )", type: "pickup", city: "Mộc Châu", serviceType: "limousine" },

  // Mộc Châu - Dropoff
  { id: "d1", name: "Thị trấn Mộc Châu (Tận nơi Khách sạn/Homestay)", type: "dropoff", city: "Mộc Châu", serviceType: "both" },
  { id: "d2", name: "Cổng khu du lịch Thác Dải Yếm ( Phụ thu )", type: "dropoff", city: "Mộc Châu", serviceType: "limousine" },
  { id: "d3", name: "Cổng khu du lịch Rừng thông Bản Áng", type: "dropoff", city: "Mộc Châu", serviceType: "limousine" },
  { id: "d4", name: "Văn phòng Xe Đi Mộc Châu", type: "dropoff", city: "Mộc Châu", serviceType: "limousine" }
];
