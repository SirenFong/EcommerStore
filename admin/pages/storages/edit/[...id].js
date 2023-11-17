import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditStogarePage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  //Nhận API từ id
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
      setIsLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Chỉnh sửa sản phẩm</h1>
      {isLoading && (
        <tr>
          <td colSpan={4}>
            <div className="py-4">
              <Spinner fullWidth={true} />
            </div>
          </td>
        </tr>
      )}
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}
