import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function CouponForm({
  _id,
  name: existingName,
  percent_off: existingPercentoff,
  duration: existingDuration,
}) {
  const [name, setName] = useState(existingName || "");
  const [percent_off, setPercent_off] = useState(existingPercentoff || "");
  const [duration, setDuration] = useState(existingDuration || "");
  const [goToCoupon, setCoupon] = useState(false);
  const router = useRouter();

  async function saveCoupon(ev) {
    ev.preventDefault();
    const data = {
      name,
      percent_off,
      duration,
    };
    if (_id) {
      await axios.put("/api/coupons", { ...data, _id });
    } else {
      await axios.post("/api/coupons", data);
    }
    setCoupon(true);
  }
  if (goToCoupon) {
    router.push("/coupons");
  }

  return (
    <form onSubmit={saveCoupon}>
      <label>Tên Coupon</label>
      <input
        type="text"
        placeholder="Nhập Coupon"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <label>Số tiền giảm (VNĐ)</label>
      <input
        type="text"
        placeholder="Nhập số tiền"
        value={percent_off.toLocaleString()}
        onChange={(ev) => setPercent_off(Number(ev.target.value))}
      />

      <label>Thời hạn sử dụng</label>
      <input
        type="text"
        placeholder="Số lượng sản phẩm"
        value={duration}
        onChange={(ev) => setDuration(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Lưu
      </button>
    </form>
  );
}
