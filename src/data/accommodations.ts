import { Accommodation } from "../types";

export const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: "acc_1",
    name: "Mường Thanh Luxury Mộc Châu",
    rating: 5,
    type: "Khách sạn 5*",
    description: "Khách sạn 5 sao cao cấp nhất tọa lạc giữa trung tâm thị trấn Mộc Châu. Kiến trúc hiện đại sang trọng, đầy đủ tiện ích chuẩn quốc tế, hồ bơi bốn mùa nước ấm khổng lồ, ẩm thực phong phú.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80"
    ],
    location: "Đường Hoàng Quốc Việt, Thị trấn Nông trường Mộc Châu, Sơn La",
    amenities: ["Hồ bơi nước ấm", "Buffet sáng sang trọng", "Phòng Gym", "Khu Spa cao cấp", "Sky Bar", "Xe đạp đôi miễn phí"],
    roomTypes: [
      {
        name: "Phòng Deluxe King (Giường Đôi)",
        pricePerNight: 1200000,
        capacity: "2 Người lớn, 1 Trẻ em",
        description: "Phòng rộng 35m2, cửa sổ kính lớn view trọn đồi núi chập chùng, bồn tắm nằm cao cấp."
      },
      {
        name: "Phòng Executive Suite (Tổng thống)",
        pricePerNight: 2400000,
        capacity: "2 Người lớn, 2 Trẻ em",
        description: "Phòng khách riêng biệt rộng 75m2, nội thất dát xi mạ cao cấp, dịch vụ quản gia 24/7."
      }
    ]
  },
  {
    id: "acc_2",
    name: "Phoenix Mộc Châu Resort (Rừng thông Bản Áng)",
    rating: 4,
    type: "Resort Sinh Thái",
    description: "Quần thể biệt thự bungalow ẩn mình dưới những rặng thông cổ thụ ngút ngàn của Bản Áng. Một Đà Lạt thu nhỏ giữa lòng Mộc Châu tĩnh lặng, lãng mạn vô cùng, không khí se lạnh, trong lành.",
    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80"
    ],
    location: "Rừng Thông Bản Áng, Đông Sang, Mộc Châu, Sơn La",
    amenities: ["Bungalow riêng tư", "Cắm lều dã ngoại", "Vườn dâu tây Chimi cạnh bên", "Đồi thông thơ mộng", "Cho thuê bếp BBQ", "Xe điện trung chuyển"],
    roomTypes: [
      {
        name: "Bungalow Gỗ Đồi Thông (Chóp tam giác)",
        pricePerNight: 950000,
        capacity: "2 Người lớn",
        description: "Chóp gỗ lãng mạn có gác lửng, ban công gỗ ngắm bình minh hồ Bản Áng mờ sương."
      },
      {
        name: "Biệt thự Gia Đình Phoenix (2 phòng ngủ)",
        pricePerNight: 2200000,
        capacity: "4 Người lớn, 2 Trẻ em",
        description: "Biệt thự gỗ thông rộng 90m2 có gian phòng khách sinh hoạt chung ấm cúng, lò sưởi giả."
      }
    ]
  },
  {
    id: "acc_3",
    name: "The Đồi Chè Homestay Mộc Châu",
    rating: 4,
    type: "Homestay cao cấp",
    description: "Khu vườn nhà gỗ sinh thái độc đáo nép mình cạnh Đồi Chè Trái Tim xanh mướt mát. View trực diện biển chè bát ngát mang lại giấc ngủ ngọt ngào hòa cùng hương trà thơm dịu.",
    images: [
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=cover&w=800&q=80"
    ],
    location: "Bản Ôn (Cạnh đồi chè Trái Tim), Thị trấn Mộc Châu, Sơn La",
    amenities: ["Sân nướng BBQ ngoài trời", "View đồi chè trực diện", "Đốt lửa trại buổi tối", "Thưởng trà buổi sáng lý tưởng", "Hỗ trợ đặt đặc sản địa phương"],
    roomTypes: [
      {
        name: "Căn Nhà Gỗ Thảo Nguyên (Nhà Bungalow)",
        pricePerNight: 650000,
        capacity: "2 Người lớn",
        description: "Căn gỗ mộc mạc xinh tươi với ô cửa sổ gỗ ngắm đồi chè, yên lặng thư thái."
      },
      {
        name: "Nhà Sàn Gỗ Tập Thể (Dành cho nhóm phượt)",
        pricePerNight: 1200000,
        capacity: "Nhóm tối đa 8 người",
        description: "Trải nghiệm nhà sàn rực rỡ sắc màu Tây Bắc dệt nệm bông lau bản xứ ấm áp."
      }
    ]
  }
];
