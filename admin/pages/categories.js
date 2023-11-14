import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  /**useEffect gọi tới cái API cũng như trả về data của loại sản phẩm*/
  /**dưới đây là trả về api lấy thông tin loại sản phẩm để hiển thị */
  /**hiển thị danh sách loại sản phẩm trong hàm useState */
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    setIsLoading(true);
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
      setIsLoading(false);
    });
  }

  /**Đường link /categories phải trùng với tên file đã đặt */
  /**Tên file ở đây là categories bên trong pages/categories */
  //Lưu Category
  async function saveCategory(ev) {
    ev.preventDefault();

    if (!validate()) {
      return;
    }

    const data = {
      name,
      parentCategory,

    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
      setParentCategory("");
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");

    fetchCategories();
    await swal.fire({
      title: "Lưu thành công!",
      icon: "success",
    });
  }

  //Hàm chỉnh sửa Property
  async function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);


  }

  //Hàm xóa loại sản phẩm
  function deleteCategory(category) {
    swal
      .fire({
        title: "Xóa loại sản phẩm",
        text: `Bạn có muốn xóa ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonsColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }



  ///////

  const validate = () => {
    let isValid = true;


    if (name == "") {
      isValid = false;
      toast.error("Tên không được để trống");
    }
    if (parentCategory == "") {
      isValid = false;
      toast.error("Vui lòng loại sản phẩm chọn để trống");
    }

    return isValid;
  };
  return (
    <>
      <ToastContainer />
      <Layout>
        <h1>Loại sản phẩm</h1>
        <label>
          {editedCategory
            ? `Sửa loại sản phẩm ${editedCategory.name}`
            : "Tên loại sản phẩm mới"}
        </label>
        <form onSubmit={saveCategory} c>
          <div className="flex gap-1">
            <input
              type="text"
              onChange={(ev) => setName(ev.target.value)}
              value={name}
              placeholder={"Tên loại sản phẩm"}
            />
            <select
              onChange={(ev) => setParentCategory(ev.target.value)}
              value={parentCategory}
            >
              <option value="0">No parent category</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option value={category._id}>{category.name}</option>
                ))}
            </select>
          </div>

          <div className="flex gap-1">
            {editedCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditedCategory(null);
                  setName("");
                  setParentCategory("");

                }}
                className="btn-default"
              >
                Cancel
              </button>
            )}
            <button type="summit" className="btn-primary py-1">
              Save
            </button>
          </div>
          <div className="bg-white px-2 py-3 ">
            <div className=" px-2 mb-2 border-b-2">Tất cả loại sản phẩm</div>
            <div className=" flex gap-3 justify-centerpt-3 pb-0">

              <div>
                <div className="mb-3 md:w-96">
                  <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                    <input
                      type="search"
                      className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="button-addon1" />

                    {/* <!--Search button--> */}

                    <button
                      className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                      type="button"
                      id="button-addon1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5">
                        <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd" />
                      </svg>
                    </button>

                  </div>
                </div>

              </div>

              <div className="flex gap-3 align-items-center ">

                <div>
                  <div className="relative max-w-sm">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input datepicker type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>
        {!editedCategory && (
          <table className="basic mt-2">
            <thead>
              <tr>
                <td>Loại Sản Phẩm</td>
                <td>Danh mục</td>
                <td></td>
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

              {categories.length > 0 &&
                categories.map((category, properties) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td>
                      <button
                        onClick={() => editCategory(category)}
                        className="btn-default mr-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="btn-red"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </Layout>
    </>

  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
