import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
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
    ev.preventDefault;
    axios.post("/api/categories", { name });
    setName("");
    fetchCategories();
  }
  return (
    <Layout>
      <h1>Loại sản phẩm</h1>
      <label>Tên loại sản phẩm mới</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          type="text"
          onChange={(ev) => setName(ev.target.value)}
          value={name}
          placeholder={"Tên loại sản phẩm"}
        />
        <select className="mb-0">
          <option value="0">No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-2">
        <thead>
          <tr>  
            <td>Loại Sản Phẩm</td>
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
                  <button className="btn-primary">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
