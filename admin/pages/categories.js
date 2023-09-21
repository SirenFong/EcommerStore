import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';
function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  /**useEffect gọi tới cái API cũng như trả về data của loại sản phẩm*/
  /**dưới đây là trả về api lấy thông tin loại sản phẩm để hiển thị */
  /**hiển thị danh sách loại sản phẩm trong hàm useState */
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }

  /**Đường link /categories phải trùng với tên file đã đặt */
  /**Tên file ở đây là categories bên trong pages/categories */
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parentCategory }
    if (editedCategory) {
      data._id = editedCategory._id
      await axios.put("/api/categories", data);
      setEditedCategory(null)
      setParentCategory("")
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
  function deleteCategory(category) {
    swal.fire({
      title: 'Xóa loại sản phẩm',
      text: `Bạn có muốn xóa ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonsColor: '#d55',
      reverseButtons: true

    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category
        axios.delete('/api/categories?_id=' + _id)
        fetchCategories();
      }
    })
  }
  return (
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
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}>
            <option value="0">No parent category</option>
            {categories.length > 0 &&
              categories.map(
                (category) => (
                  <option value={category._id}>{category.name}</option>
                ))}
          </select>

        </div>
        {/* <div className="mb-2">
          <label className="block">Properties</label>
          <button className="btn-default text-sm">Add new property</button>
        </div> */}

        <button type="summit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Loại Sản Phẩm</td>
            <td>Doanh mục</td>
            <td></td>
          </tr>
        </thead>

        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-primary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-primary">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (

  <Categories swal={swal} />
)


)