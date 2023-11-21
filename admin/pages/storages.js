import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";

export default function Storage() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [dataExport, setdataExport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState();
  const [categories, setCategories] = useState([]);

  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
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
              (item) =>
                item.category[0] && item.category[0].name === categorySelected
            )
          );
          setIsLoading(false);
        });
      }
    }
  }, [phrase, categorySelected]);
  function searchProducts(phrase) {
    axios
      .get("/api/productsphrase?phrase=" + encodeURIComponent(phrase))
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }

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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Nhập file
          </CSVLink>
        </div>
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
                  placeholder="Nhập tên sản phẩm"
                  aria-label="Search"
                  aria-describedby="button-addon1"
                  value={phrase}
                  onChange={(ev) => setPhrase(ev.target.value)}
                />
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

          <div className="flex gap-3 align-items-center ">
            <div>
              <div className="relative max-w-sm"></div>
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
                  {Array.isArray(product.images) &&
                  product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={`Product Image`}
                      className="w-12 h-12"
                    />
                  ) : (
                    <span>Không có hình ảnh</span>
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
