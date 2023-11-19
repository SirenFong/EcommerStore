import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";

export default function Storage() {
  const [products, setProducts] = useState([]);
  const [dataExport, setdataExport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState();
  const [categories, setCategories] = useState([]);

  /**useEffect gọi tới cái API cũng như trả về data */
  /**dưới đây là trả về api lấy thông tin sản phẩm để hiển thị */
  /**hiển thị danh sách sản phẩm trong hàm useState */
  useEffect(() => {
    if (!categorySelected) {
      setIsLoading(true);
      axios.get("/api/products").then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      });
    } else {
      if (categorySelected) setIsLoading(true);
      axios.get("/api/products").then((response) => {
        setProducts(
          response.data.filter(
            (item) => item.category[0].name == categorySelected
          )
        );
        setIsLoading(false);
      });
    }
  }, [categorySelected]);

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const getUsersExport = (event, done) => {
    let result = [];
    console.log(result);
    if (products && products.length > 0) {
      result.push([
        "Tên sản phẩm",
        "Số lượng còn lại",
        "Giá tiền",
        "Loại sản phẩm",
        "Danh mục",
        "Thuộc tính",
      ]);
      products.map((item, index) => {
        let arr = [];
        arr[0] = item.title;
        arr[1] = item.qty;
        arr[2] = item.price;
        arr[3] = item.category[0].name;
        arr[4] = item.category[0].parent;
        arr[5] = item.properties;

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
          <Link className="link text-base flex gap-1" href={"/categories"}>
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
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            Loại sản phẩm
          </Link>
        </div>
        {/* <div className="flex">
          <button type="button" onClick={handleOpen}>
            Click Me to Open Modal
          </button>
        </div> */}
      </div>

      <div className="bg-white px-2 py-3 ">
        <div className=" px-2 mb-2 border-b-2">Tất cả sản phẩm</div>
        <div className=" flex gap-3 justify-center">
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
              </div>
            </div>
          </div>

          <div className="flex gap-3 align-items-center ">
            <div>
              <select
                onChange={(ev) => setCategorySelected(ev.target.value)}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected>Chọn loại sản phẩm</option>
                {categories.map((category) => (
                  <option value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
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
        <table className="basic mt-2 py-1 px-2 ">
          <thead className="border-t-2">
            <tr>
              <td>STT</td>
              <td>Hình ảnh sản phẩm</td>
              <td>Tên sản phẩm</td>
              <td>Loại sản phẩm</td>
              <td>Có thể bán</td>
              <td>Tồn kho</td>
              <td>Ngày nhập</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={2}>
                  <div className="py-4">
                    <Spinner fullWidth={true} />
                  </div>
                </td>
              </tr>
            )}

            {products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>
                  {product.images && (
                    <img src={product.images} alt="" className="w-12 h-12" />
                  )}
                </td>
                <Link className="title" href={"/products/edit/" + product._id}>
                  {product.title}
                </Link>
                <td>{product.category[0].name}</td>
                <td>{product.qty}</td>
                <td>{product.qty}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
