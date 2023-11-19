import Layout from "@/components/Layout";
import PromotionForm from "@/components/PromotionForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditPromotionPage() {
  const [PromotionInfo, setPromotionInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  //Nhận API từ id
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    axios.get("/api/promotions?id=" + id).then((response) => {
      setPromotionInfo(response.data);
      setIsLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Chỉnh sửa chương trình khuyến mãi</h1>
      {isLoading && (
        <tr>
          <td colSpan={4}>
            <div className="py-4">
              <Spinner fullWidth={true} />
            </div>
          </td>
        </tr>
      )}
      {PromotionInfo && <PromotionForm {...PromotionInfo} />}
    </Layout>
  );
}
