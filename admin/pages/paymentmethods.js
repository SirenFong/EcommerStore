import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Paymentmethods({ swal }) {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchPayment()


    }, []);
    function fetchPayment() {
        setIsLoading(true)
        axios.get("/api/paymentmethods").then((response) => {
            setPayments(response.data.filter((item) => item.isDeleted == false));
            setIsLoading(false)
        });
    }
    function deletepayment(payment) {
        swal.fire({
            title: "Xóa loại thanh toán",
            text: `Bạn có muốn xóa ${payment.paymentName}?`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, Delete!",
            confirmButtonsColor: "#d55",
            reverseButtons: true,
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const { _id } = payment;
                    await axios.delete("/api/paymentmethods?_id=" + _id);
                    fetchPayment()
                }

            });
    }
    // function editpayment(payment) {
    //     swal.fire({
    //         title: "Cập nhật loại thanh toán",
    //         text: `Bạn có muốn xóa ${payment.paymentName}?`,

    //         showCancelButton: true,
    //         cancelButtonText: "Cancel",
    //         confirmButtonText: "Yes, Delete!",
    //         confirmButtonsColor: "#d55",
    //         reverseButtons: true,
    //         html: `
    //         <p>select an action</p>
    //        <div>
    //        <label>Tên loại thanh toán</label>
    //        <input
    //            type="text"
    //            placeholder="Nhập tên loại thanh toán"
    //            value={paymentName}
    //            onChange={(ev) => setPaymentName(ev.target.value)}
    //        />

    //        <label>Mã loại thanh toán</label>
    //        <input
    //            type="text"
    //            placeholder="Mã loại thanh toán"
    //            value={paymentKey}
    //            onChange={(ev) => setPaymentKey(ev.target.value)}
    //        />

    //        <label>Mô tả chi tiết Loại thanh toán</label>
    //        <textarea
    //            placeholder="Nhập mô tả loại thanh toán"
    //            value={paymentDescription}
    //            onChange={(ev) => setPaymentDescription(ev.target.value)}
    //        ></textarea>




    //        <button type="submit" className="btn-primary">
    //            Lưu
    //        </button>
    //        </div>`
    //     })
    //         .then(async (result) => {
    //             if (result.isConfirmed) {
    //                 const { _id } = payment;

    //                 await axios.delete("/api/paymentmethods?_id=" + _id);

    //             }
    //         });
    // }
    return (
        <Layout>
            <Link
                className="bg-primary text-white rounded-md py-1 px-2"
                href={"/paymentmethods/newPaymentMethod"}
            >
                Thêm loại thanh toán mới
            </Link>

            <table className="basic mt-2 py-1 px-2 ">
                <thead>
                    <tr>
                        <td>Tên loại thanh toán</td>
                        <td>mã loại thanh toán</td>
                        <td>Mô tả</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2} >
                                <div className="py-4">
                                    <Spinner fullWidth={true} />
                                </div>

                            </td>
                        </tr>

                    )}

                    {payments.map((payment) => (
                        <tr key={payment._id}>
                            <td>{payment.paymentName}</td>
                            <td>{payment.paymentKey}</td>
                            <td>{payment.paymentDescription}</td>
                            <td>
                                <Link
                                    className="btn-default"
                                    href={"/paymentmethods/edit/" + payment._id}>
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
                                    Edit Product
                                </Link>
                                {/* <button
                                    onClick={() => editpayment(payment)}
                                    className="btn"
                                >
                                    edit
                                </button> */}
                                <button
                                    onClick={() => deletepayment(payment)}
                                    className="btn-red"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }, ref) => <Paymentmethods swal={swal} />);