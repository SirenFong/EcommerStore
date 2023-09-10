import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const router = useRouter();
  const [goToProducts, setGoToProducts] = useState(false);

  async function createProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    await axios.post("/api/products", data);
    setGoToProducts(true);
  }
  /**router dùng để redirect về trang products sau khi thêm mới 1 sản phẩm */
  /**useRouter giúp chúng ta thực hiện điều này thay vì redirect thông thường */
  if (goToProducts) {
    router.push("/products");
  }

  return (
    /**useState dùng để thay đổi trạng thái khi thêm sản phẩm */
    /**Thằng setTitle sẽ thay đổi thành 1 trạng thái mới của thằng title */
    /**Dùng axios để xử lý các vấn đề liên quan đến API */
    <form onSubmit={createProduct}>
      <label>Tên sản phẩm</label>
      <input
        type="text"
        placeholder="Nhập tên sản phẩm"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Mô tả chi tiết</label>
      <textarea
        placeholder="Nhập mô tả sản phẩm"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      <label>Giá tiền ( VNĐ )</label>
      <input
        type="number"
        placeholder="Giá tiền"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Lưu
      </button>
    </form>
  );
}
