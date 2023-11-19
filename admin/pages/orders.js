import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
// import Link from "next/link";
import { CSVLink, CSVDownload } from "react-csv";
import Link from "next/link";
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
  const [categories, setCategories] = useState([]);
  const [dataExport, setdataExport] = useState([]);
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
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);
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
  const getUsersExport = (event, done) => {
    let result = [];
    console.log(result);
    if (products && products.length > 0) {
      result.push(["Title", "Quantity", "Price", "Category"]);
      products.map((item, index) => {
        let arr = [];
        arr[0] = item.title;
        arr[1] = item.qty;
        arr[2] = item.price;
        arr[3] = item.category[0].name;
        result.push(arr);
      });
      setdataExport(result);
      done();
    }
  };
  return (
    <Layout>
      <div className="bg-white mt-2  text-gray-700 py-2 m-2 text-2xl">
        Danh sách sản phẩm
      </div>
      <div className="bg-gray-100 mt-2  text-gray-700  m-2 text-2xl flex justify-between">
        <div className="  m-2 text-2xl flex gap-3">
          <CSVLink
            data={dataExport}
            filename={"my-file.csv"}
            className="link text-base flex gap-1"
            asyncOnClick={true}
            onClick={getUsersExport}
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Xuất file
          </CSVLink>
          <p>|</p>
          <CSVLink
            data={dataExport}
            filename={"my-file.csv"}
            className="link text-base flex gap-1"
            asyncOnClick={true}
            onClick={getUsersExport}
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Nhập file
          </CSVLink>
          <p>|</p>
        </div>
      </div>
      <div>
        <div className="bg-white px-2 py-3 ">
          <div className=" px-2 mb-2 border-b-2">Tất cả đơn hàng</div>
          <div className=" flex gap-3 justify-centerpt-3 pb-0">
            <div>
              <div className="mb-3 md:w-96">
                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                  <input
                    type="search"
                    className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="button-addon1"
                  />

                  {/* <!--Search button--> */}

                  <button
                    className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                    type="button"
                    id="button-addon1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex align-items-center">
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
            <div>
              <select
                // onChange={(e) => setCategorySelect(e.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="0" s>
                  Chọn loại sản phẩm
                </option>
                {categories.map((category) => (
                  <option value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                // onChange={(e) => setCategorySelect(e.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="0">
                  Phương thức thanh toán
                </option>

                <option value="1">Ship Code</option>

                <option value="2">Chuyển khoản</option>
              </select>
            </div>
            <div>
              <select
                onChange={(e) => setCategorySelect(e.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected value="0">
                  Trạng thái thanh toán
                </option>

                <option value="1">Đã thanh toán </option>

                <option value="2">Chưa thanh toán</option>
              </select>
            </div>
            <div className="flex gap-3 align-items-center ">
              <div>
                <div className="relative max-w-sm">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      class="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                  </div>
                  <input
                    datepicker
                    type="date"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Select date"
                  />
                </div>
              </div>
            </div>
          </div>
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
