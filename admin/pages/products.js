import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { useRouter } from "next/router";

export default function Products() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [dataExport, setdataExport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categorySelected, setCategorySelected] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const formatter = new Intl.NumberFormat("en-US");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            (item) =>
              item.category[0] && item.category[0].name === categorySelected
          )
        );
        setIsLoading(false);
      });
    }
  }, [categorySelected]);

  useEffect(() => {
    const filtered = products.filter(
      (item) =>
        item.title &&
        item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchValue]);

  const getUsersExport = (event, done) => {
    let result = [];
    console.log(result);
    if (products && products.length > 0) {
      result.push([
        "Tên sản phẩm",
        "Số lượng còn lại",
        "Giá tiền",
        "Loại sản phẩm",
        "danh mục",
      ]);

      const filteredProducts =
        selectedProduct && selectedProduct.value !== "Tất cả sản phẩm"
          ? products.filter((item) =>
              item.title.toLowerCase().includes(searchValue.toLowerCase())
            )
          : products; // If "Tất cả sản phẩm" is selected, use all products
      filteredProducts.forEach((item, index) => {
        let arr = [];
        arr[0] = item.title;
        arr[1] = item.qty;
        arr[2] = item.price;
        arr[3] = item.category[0].name;
        arr[4] = item.category[0].parent;
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
        <div className="flex">
          <Link
            className="bg-primary text-white rounded-md my-1 mx-2 p-2 text-base flex"
            href={"/products/newProduct"}
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
            Thêm sản phẩm
          </Link>
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
                  placeholder="Nhập vào tên sản phẩm"
                  aria-label="Search"
                  aria-describedby="button-addon1"
                  value={phrase}
                  onChange={(ev) => setPhrase(ev.target.value)}
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

          <div className="flex gap-3 align-items-center ">
            <div></div>
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
              <td>Giá bán</td>
              <td>Giảm giá (%)</td>
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

            {filteredProducts.map((product, index) => (
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
                <td>{product.title}</td>
                {/* <td>{product.category[0].name}</td> */}

                <td>{formatter.format(product.price)}</td>
                <td>{product.discount}</td>
                {/* <td>{product.qty}</td> */}
                <td>
                  <Link
                    className="btn-default"
                    href={"/products/edit/" + product._id}
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
                    Edit Product
                  </Link>
                  <Link
                    className="btn-red"
                    href={"/products/delete/" + product._id}
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
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
