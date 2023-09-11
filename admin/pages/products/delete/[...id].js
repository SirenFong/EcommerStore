import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push("/products");
  }
  return (
    <Layout>
      <h1>Xác nhận xóa sản phẩm {productInfo.title} ?</h1>
      <button>Đồng ý</button>
      <button onClick={goBack}>Hủy bỏ</button>
    </Layout>
  );
}
