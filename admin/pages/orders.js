import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
// import Link from "next/link";

import * as XLSX from "xlsx";
export default function OrdersPage() {
  ////const csvConfig = mkConfig({ useKeysAsHeaders: true });

  // Add a click handler that will run the `download` function.
  // `download` takes `csvConfig` and the generated `CsvOutput`
  // from `generateCsv`.

  const inactiveButton = "flex gap-1 p-1";
  const activeButton = inactiveButton + " bg-highlight text-black rounded-sm ";
  //Được sử dụng như tạo 1 đường dẫn tới cho trang web đồng thời kích thoạt hiệu ứng khi đang ở trang web đó
  // const inactiveIcon = "w-6 h-6";
  // const activeIcon = inactiveIcon + " text-primary";
  ////
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("0");
  const [istatus, setIsStatus] = useState(null);

  useEffect(() => {
    ////
    if (status == 0) {
      setIsLoading(true);
      axios.get("/api/orders").then((response) => {
        setOrders(response.data);
        setIsLoading(false);
      });
    }
    if (status == 1) {
      setIsLoading(true);
      axios.get("/api/orders").then((response) => {
        setOrders(response.data.filter((item) => item.status == 1));
        setIsLoading(false);
      });
    }
    if (status == 2) {
      setIsLoading(true);
      axios.get("/api/orders").then((response) => {
        setOrders(response.data.filter((item) => item.status == 2));
        setIsLoading(false);
      });
    }
    if (status == 3) {
      setIsLoading(true);
      axios.get("/api/orders").then((response) => {
        setOrders(response.data.filter((item) => item.status == 3));
        setIsLoading(false);
      });
    }
    if (status == 4) {
      setIsLoading(true);
      axios.get("/api/orders").then((response) => {
        setOrders(response.data.filter((item) => item.status == 4));
        setIsLoading(false);
      });
    }
    if (status == 5) {
      setIsLoading(true);
      axios.get("/api/orders").then((response) => {
        setOrders(response.data.filter((item) => item.status == 0));
        setIsLoading(false);
      });
    }
  }, [status]);

  function updateStatus(order, newStatus) {
    const data = {
      _id: order._id,
      status: newStatus,
    };
    setIsLoading(true);

    // Gọi API để cập nhật trạng thái đơn hàng
    axios.put("/api/orders", data);
    // Giảm số lượng sản phẩm (if needed)
    // ...

    // Cập nhật danh sách đơn hàng sau khi cập nhật trạng thái
    axios.get("/api/orders").then((response) => {
      setOrders(response.data.filter((item) => item.status === istatus));
      setIsLoading(false);
    });
  }
  function access(order) {
    const data = {
      _id: order._id,
      status: order.status + 1,
    };
    setIsLoading(true);

    // Gọi API để cập nhật trạng thái đơn hàng
    axios.put("/api/orders", data);
    // Giảm số lượng sản phẩm
    order.line_items.forEach(async (item) => {
      const productData = await axios.get(
        `/api/products?id=${item.price_data.product_data.id}`
      );
      const product = productData.data;

      // Kiểm tra số lượng còn lại trước khi giảm
      if (product.qty >= item.quantity) {
        await axios.put("/api/products", {
          _id: product._id,
          qty: product.qty - item.quantity,
        });
      } else {
        console.error("Sản phẩm không có đủ số lượng để giảm!");
      }
    });

    // Cập nhật danh sách đơn hàng sau khi giảm số lượng sản phẩm
    axios.get("/api/orders").then((response) => {
      setOrders(response.data.filter((item) => item.status === istatus));
      setIsLoading(false);
    });
  }

  //Chưa làm được
  function cancer(order) {
    const data = {
      _id: order._id,
      status: 0,
    };
    setIsLoading(true);
    axios.put("/api/orders", data);
    setIsLoading(true);

    axios.get("/api/orders").then((response) => {
      setOrders(response.data.filter((item) => item.status == istatus));
      setIsLoading(false);
    });
  }
  const handleExcelExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(orders);

    XLSX.utils.book_append_sheet(wb, ws, "Comments");
    XLSX.writeFile(wb, "survey-data.xlsx");
  };
  return (
    <Layout>
      <h1>Đơn đạt hàng</h1>
      <div>
        <button
          className="bg-primary text-white rounded-md py-1 px-2"
          onClick={() => handleExcelExport()}
        ></button>
        <div className="center ">
          <select
            value={status}
            onChange={(ev) => {
              setStatus(ev.target.value), setIsStatus(ev.target.value);
            }}
          >
            <option value="0">tất cả</option>
            <option value="1">Đơn chờ xác nhận</option>
            <option value="2">Đơn đã xác nhận</option>
            <option value="3">Đơn đã bàn giao cho đơn vị vận chuyển</option>
            <option value="4">Đơn đã giao</option>
            <option value="5">Đơn đã hủy</option>
          </select>
        </div>
      </div>
      <table className="basic">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Thanh toán</th>
            <th>Thông tin khách hàng</th>
            <th>Danh sách sản phẩm mua</th>
            <th>Phương thước thanh toán</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "Yes" : "No"}
                </td>

                <td>
                  <tr>
                    <tr>Name: {order.name}</tr>
                    <tr>Email: {order.email}</tr>
                    <tr>Phone: {order.phone}</tr>
                  </tr>
                </td>

                <td>
                  {order.line_items.map((l) => (
                    <>
                      {l.price_data?.product_data.name} x{l.quantity}
                      <br />
                    </>
                  ))}
                </td>
                <td>{order.paymentmethods?.name}</td>
                <td>
                  {order.status == 0
                    ? "Đã hủy"
                    : "" || order.status == 1
                    ? "Đang chờ xác nhận"
                    : "" || order.status == 2
                    ? "Đã xác nhận"
                    : "" || order.status == 3
                    ? "Đang giao"
                    : "" || order.status == 4
                    ? "Đã giao"
                    : "" || order.status == 5
                    ? "Đổi trả hàng"
                    : ""}
                </td>
                <td>
                  <div className="center flex ">
                    {order.status == 1 ? (
                      <button
                        onClick={() => access(order)}
                        className="btn-success mr-1"
                      >
                        Xác nhận
                      </button>
                    ) : "" || order.status == 2 ? (
                      <button
                        onClick={() => updateStatus(order, 3)}
                        className="btn-success mr-1"
                      >
                        Giao Hàng
                      </button>
                    ) : "" || order.status == 3 ? (
                      <button
                        onClick={() => updateStatus(order, 4)}
                        className="btn-success mr-1"
                      >
                        Hoàn Tất
                      </button>
                    ) : "" || order.status == 4 ? (
                      ""
                    ) : (
                      ""
                    )}
                    {order.status == 1 ? (
                      <button onClick={() => cancer(order)} className="btn-red">
                        Hủy
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
