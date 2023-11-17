import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function Coupons() {
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/coupons");
        const data = await response.json();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <Layout>
      <div className="bg-white mt-2 text-gray-700 py-2 m-2 text-2xl">
        Danh sách mã giảm giá
      </div>
      <div className="bg-gray-100 mt-2  text-gray-700  m-2 text-2xl flex justify-between">
        <div className="flex">
          <Link
            className="bg-primary text-white rounded-md my-1 mx-2 p-2 text-base flex"
            href={"/coupons/newCoupon"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Thêm Coupon
          </Link>
        </div>
      </div>

      <div className="bg-white px-2 py-3">
        <table className="basic mt-2 py-1 px-2">
          <thead className="border-t-2">
            <tr>
              <td>STT</td>
              <td>Mã Coupon</td>
              <td>Số tiền giảm (VNĐ)</td>
              <td>Số lần sử dụng</td>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>
                  <div className="py-4">
                    <Spinner fullWidth={true} />
                  </div>
                </td>
              </tr>
            )}
            {coupons.map((coupon, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{coupon.name}</td>
                <td>{coupon.percent_off.toLocaleString()} (VNĐ)</td>
                <td>{coupon.duration}</td>
                <td>
                  <Link
                    className="btn-default"
                    href={"/coupons/edit/" + coupon._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit Coupon
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
