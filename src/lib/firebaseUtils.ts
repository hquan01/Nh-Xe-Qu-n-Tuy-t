import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import { Booking, BlockedSeat, LimousineConfig, SharedCarConfig, TourCombo, Accommodation, Coupon, LocationPoint, Destination, GuideArticle, AppNotification } from "../types";

// Let's get things from localStorage
export const getDeviceId = (): string => {
  let id = localStorage.getItem("xemc_device_id");
  if (!id) {
    id = "dev_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("xemc_device_id", id);
  }
  return id;
};

export const getLocalList = <T>(key: string, defaultValue: T[]): T[] => {
  try {
    const val = localStorage.getItem(`xemc_${key}`);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const setLocalList = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(`xemc_${key}`, JSON.stringify(data));
    window.dispatchEvent(new Event("xedimocchau_db_update"));
  } catch (e) {
    console.error(e);
  }
};

export const saveBookingToFirebase = async (booking: Booking) => {
  // Sync to local first for immediate feedback
  const current = getLocalList<Booking>("bookings", []);
  const existingIndex = current.findIndex(b => b.id === booking.id);
  if (existingIndex > -1) {
    current[existingIndex] = booking;
  } else {
    current.push(booking);
  }
  setLocalList("bookings", current);

  if (true) { // Try saving to Firebase regardless of auth state
    console.log("Attempting to save booking to Firebase");
    try {
      // Remove undefined values and add deviceId
      const sanitizedBooking = JSON.parse(JSON.stringify(booking));
      sanitizedBooking.deviceId = getDeviceId();
      await setDoc(doc(db, "bookings", booking.id), sanitizedBooking);
      console.log("Booking saved to Firebase successfully");
    } catch (error) {
      console.warn("Could not sync booking to Firebase, saved locally:", error);
    }
  }
};

export const updateBookingStatusInFirebase = async (bookingId: string, booking: Booking) => {
  // Sync to local first
  const current = getLocalList<Booking>("bookings", []);
  const existingIndex = current.findIndex(b => b.id === bookingId);
  if (existingIndex > -1) {
    current[existingIndex] = booking;
  } else {
    current.push(booking);
  }
  setLocalList("bookings", current);

  if (true) { // Allow updating without real auth if needed
    try {
      // Remove undefined values
      const sanitizedBooking = JSON.parse(JSON.stringify(booking));
      await setDoc(doc(db, "bookings", bookingId), sanitizedBooking, { merge: true });
    } catch (error) {
      console.warn("Could not update booking status to Firebase, saved locally:", error);
    }
  }
};

export const saveBlockedSeatToFirebase = async (seat: BlockedSeat) => {
  const key = seat.seatId + seat.tripId + seat.travelDate;
  const current = getLocalList<BlockedSeat>("blocked_seats", []);
  const exists = current.some(s => s.tripId === seat.tripId && s.travelDate === seat.travelDate && s.seatId === seat.seatId);
  if (!exists) {
    current.push(seat);
  }
  setLocalList("blocked_seats", current);

  if (true) {
    try {
      await setDoc(doc(db, "blocked_seats", key), seat);
    } catch (error) {
      console.warn("Could not save blocked seat to Firebase, saved locally:", error);
    }
  }
};

export const deleteBlockedSeatFromFirebase = async (seat: BlockedSeat) => {
  const key = seat.seatId + seat.tripId + seat.travelDate;
  const current = getLocalList<BlockedSeat>("blocked_seats", []);
  const nextList = current.filter(s => !(s.seatId === seat.seatId && s.tripId === seat.tripId && s.travelDate === seat.travelDate));
  setLocalList("blocked_seats", nextList);

  if (true) {
    try {
      await deleteDoc(doc(db, "blocked_seats", key));
    } catch (error) {
      console.warn("Could not delete blocked seat from Firebase, removed locally:", error);
    }
  }
};

export const saveConfigToFirebase = async (key: string, data: any) => {
  try {
    const configsStr = localStorage.getItem(`xemc_configs`) || "{}";
    const configs = JSON.parse(configsStr);
    configs[key] = data;
    localStorage.setItem(`xemc_configs`, JSON.stringify(configs));
    window.dispatchEvent(new Event("xedimocchau_db_update"));
  } catch (e) {
    console.error(e);
  }

  // Attempt to save to Firebase even if auth.currentUser is not present
  try {
    const sanitizedData = JSON.parse(JSON.stringify(data));
    await setDoc(doc(db, "configs", "global"), { [key]: sanitizedData }, { merge: true });
    console.log(`Config ${key} saved to Firebase successfully`);
  } catch (error: any) {
    console.error(`ERROR: Could not save config ${key} to Firebase (permissions/network):`, error);
    if (error.code === 'permission-denied') {
       alert(`Lỗi: Bạn không có quyền sửa nội dung này trên máy chủ (Permission Denied).`);
    } else {
       alert(`Lỗi khi lưu ${key} lên máy chủ: ${error.message || 'Lỗi mạng'}. Dữ liệu chỉ được lưu tạm thời trên máy này.`);
    }
    console.warn("Saved locally only.");
  }
};

export const saveUserToFirebase = async (userId: string, data: any) => {
  const current = getLocalList<any>("users", []);
  const existingIndex = current.findIndex(u => u.id === userId);
  if (existingIndex > -1) {
    current[existingIndex] = { ...current[existingIndex], ...data };
  } else {
    current.push({ id: userId, ...data });
  }
  setLocalList("users", current);

  if (true) {
    try {
      await setDoc(doc(db, "users", userId), data, { merge: true });
    } catch (error) {
      console.warn("Could not save user to Firebase, saved locally:", error);
    }
  }
};

export const saveNotificationToFirebase = async (notification: AppNotification) => {
  if (true) {
    try {
      // Remove undefined values
      const sanitizedNotification = JSON.parse(JSON.stringify(notification));
      await setDoc(doc(db, "notifications", notification.id), sanitizedNotification);
    } catch (error) {
      console.warn("Could not save notification to Firebase:", error);
    }
  }
};
