import Layout from "@/components/Layout";
import CouponForm from "@/components/CouponForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditCouponPage() {
  const [CouponInfo, setCouponInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  //Nhận API từ id
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    axios.get("/api/coupons?id=" + id).then((response) => {
      setCouponInfo(response.data);
      setIsLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Chỉnh sửa Coupon</h1>
      {isLoading && (
        <tr>
          <td colSpan={4}>
            <div className="py-4">
              <Spinner fullWidth={true} />
            </div>
          </td>
        </tr>
      )}
      {CouponInfo && <CouponForm {...CouponInfo} />}
    </Layout>
  );
}
