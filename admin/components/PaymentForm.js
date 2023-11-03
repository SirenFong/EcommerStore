import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PaymentForm({
  _id,
  paymentName: existingPaymentName,
  paymentKey: existingPaymentKey,
  paymentDescription: existingPaymentDescription,
}) {
  const [paymentName, setPaymentName] = useState(existingPaymentName || "");
  const [paymentKey, setPaymentKey] = useState(existingPaymentKey || "");

  const [paymentDescription, setPaymentDescription] = useState(
    existingPaymentDescription || ""
  );
  //   const [goToPaymentTypes, setGoToPaymentTypes] = useState(false);
  const router = useRouter();
  async function savePayment(ev) {
    ev.preventDefault();
    const data = {
      paymentName,
      paymentKey,
      paymentDescription,
      isDeleted: false,
    };
    if (_id) {
      //update product
      await axios.put("/api/paymentmethods", { ...data, _id });
    } else {
      //create new product
      await axios.post("/api/paymentmethods", data);
    }
    console.log(data);
    setGoToPayment(true);
  }

  if (goToPayment) {
    router.push("/paymentmethods");
  }
  /**router dùng để redirect về trang products sau khi thêm mới 1 sản phẩm */
  /**useRouter giúp chúng ta thực hiện điều này thay vì redirect thông thường */

  return (
    <form onSubmit={savePayment}>
      <label>Tên loại thanh toán</label>
      <input
        type="text"
        placeholder="Nhập tên loại thanh toán"
        value={paymentName}
        onChange={(ev) => setPaymentName(ev.target.value)}
      />

      <label>Mã loại thanh toán</label>
      <input
        type="text"
        placeholder="Mã loại thanh toán"
        value={paymentKey}
        onChange={(ev) => setPaymentKey(ev.target.value)}
      />

      <label>Mô tả chi tiết Loại thanh toán</label>
      <textarea
        placeholder="Nhập mô tả loại thanh toán"
        value={paymentDescription}
        onChange={(ev) => setPaymentDescription(ev.target.value)}
      ></textarea>

      <button type="submit" className="btn-primary">
        Lưu
      </button>
    </form>
  );
}
