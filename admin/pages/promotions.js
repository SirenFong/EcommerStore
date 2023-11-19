import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { withSwal } from "react-sweetalert2";
function Promotions({ swal }) {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchAll();
  }, []);
  async function fetchAll() {
    setIsLoading(true);
    await axios.get("/api/promotions").then((res) => {
      setPromotions(res.data);
      setIsLoading(false);
    });
  }
  //Hàm xóa loại sản phẩm
  function deletePromotion(promotion) {
    console.log(promotion);
    swal
      .fire({
        title: "Xóa chương trình khuyến mãi",
        text: `Bạn có muốn xóa ${promotion.title}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonsColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete("/api/promotions?id=" + promotion._id);
          fetchAll();
        }
      });
  }

  return (
    <Layout>
      <div className="bg-gray-100 mt-2  text-gray-700  m-2 text-2xl flex justify-between">
        <div className="flex">
          <Link
            className="bg-primary text-white rounded-md my-1 mx-2 p-2 text-base flex"
            href={"/promotions/newPromotions"}
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
            Thêm mới
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

          <div className="flex gap-3 align-items-center ">
            <div></div>
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
              <td>Hình ảnh sản phẩm</td>
              <td>Tên sản phẩm</td>
              <td>Loại sản phẩm</td>

              <td>Giá bán</td>
              <td>Số lượng</td>
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
            {promotions.map((promotion) => (
              <tr key={promotion._id}>
                <td>{promotion.title}</td>
                <td>{promotion.start}</td>
                <td>{promotion.end}</td>

                <td>
                  <Link
                    className="btn-default"
                    href={"/promotions/edit/" + promotion._id}
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
                  <button
                    onClick={() => deletePromotion(promotion)}
                    className="btn-red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <button className="bg-primary text-white rounded-md py-1 px-2" onClick={() => handleExcelExport()}></button> */}
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <Promotions swal={swal} />);
