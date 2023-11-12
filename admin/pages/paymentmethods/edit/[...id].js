import Layout from "@/components/Layout";
import PaymentForm from "@/components/PaymentForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditPaymentMethodPage() {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  console.log(router);
  //Nhận API từ id
  useEffect(() => {
    if (!id) {
      return;
    }
    setIsLoading(true);
    axios.get("/api/paymenttypes?id=" + id).then((response) => {
      setPaymentInfo(response.data);
      setIsLoading(false);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Chỉnh sửa loại thanh toán</h1>
      {isLoading && (
        <tr>
          <td colSpan={4}>
            <div className="py-4">
              <Spinner fullWidth={true} />
            </div>
          </td>
        </tr>
      )}
      {paymentInfo && <PaymentForm {...paymentInfo} />}
    </Layout>
  );
}
