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
