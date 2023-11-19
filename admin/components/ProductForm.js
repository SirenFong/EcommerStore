import { ReactSortable } from "react-sortablejs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import SweetAlert2 from "react-sweetalert2";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  qty: existingQty,
  price: existingPrice,
  discount: existingDiscount,
  finalPrice: existingFinalPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [swalProps, setSwalProps] = useState({});
  const [title, setTitle] = useState(existingTitle || "");
  const [properties, setProperties] = useState(assignedProperties || []);
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [discount, setDiscount] = useState(Number(existingDiscount) || 0);
  const [qty, setQty] = useState(existingQty || "");
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState(existingFinalPrice);
  const numeral = require("numeral");

  useEffect(() => {
    setCategoriesLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setCategoriesLoading(false);
      setProperties(
        properties.map(({ name, values }) => ({
          name,
          values: values.join(","),
        }))
      );
    });
  }, []);

  function handlePriceChange(ev) {
    const formattedPrice = numeral(ev.target.value).value();
    setPrice(formattedPrice);

    // Tính giá tiền cuối cùng khi giá trị discount thay đổi
    const calculatedFinalPrice =
      discount > 0
        ? formattedPrice - formattedPrice * (discount / 100)
        : formattedPrice;
    setFinalPrice(calculatedFinalPrice);
  }

  //Xóa
  const deleteByIndex = (index) => {
    setImages((oldValues) => {
      return oldValues.filter((_, i) => i !== index);
    });
  };

  //Giá trị nhận vào title,des,price
  //Xác định bởi _id qua phương thức PUT để cập nhật 1 sản phẩm
  //Kiểm tra nếu _id tồn tại sẽ tiến hành cập nhật sản phẩm
  //Nếu không sẽ tạo mới sản phẩm
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      qty,
      discount: Number(discount), // Ensure it's a number
      finalPrice,
      images,
      category,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);

    }
    setSwalProps({
      show: true,
      title: 'Basic Usage',
      text: 'Hello World',
    });
    
    setGoToProducts(true);
  }
  /**router dùng để redirect về trang products sau khi thêm mới 1 sản phẩm */
  /**useRouter giúp chúng ta thực hiện điều này thay vì redirect thông thường */
  if (goToProducts) {
    router.push("/products");
  }
  //update photo to aws và lưu link ảnh vào monggo
  async function uploadImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  //set image cho form thêm
  function uploadImagesOrder() {
    setImages(images);
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  //Hàm thay đổi tên Property
  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  //Hàm thay đổi giá trị values
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  return (  /**useState dùng để thay đổi trạng thái khi thêm sản phẩm */
    /**Thằng setTitle sẽ thay đổi thành 1 trạng thái mới của thằng title */
    /**Dùng axios để xử lý các vấn đề liên quan đến API */
    <>
      <SweetAlert2 {...swalProps} />
      <form onSubmit={saveProduct}>
        <label>Tên sản phẩm</label>
        <input
          type="text"
          placeholder="Nhập tên sản phẩm"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <label>Loại sản phẩm</label>
        <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
          <option value="">Chưa chọn loại sản phẩm</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {categoriesLoading && <Spinner />}
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  className="mb-0"
                  type="text"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="Property name (example: color)"
                />
                <input
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  value={property.values}
                  type="text"
                  placeholder="value"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <label>Hình ảnh</label>
        <div className="mb-8 flex flex-wrap gap-2">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={uploadImagesOrder}
          >
            {!!images?.length &&
              images.map((link, index) => (
                <div
                  key={link}
                  className=" h-24 bg-white p-4 shadow-sm rounded-sm
              border border-gray-200"
                >
                  <img src={link} alt="" className="rounded-lg" />
                  <div>
                    <button
                      className="btn-default"
                      onClick={() => deleteByIndex(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 p-1 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="i w-24 h-24 cursor-pointer border text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white border border-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Add image</div>
            <input type="file" onChange={uploadImage} className="hidden" />
          </label>
        </div>
        <label>Mô tả chi tiết</label>
        <textarea
          placeholder="Nhập mô tả sản phẩm"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>

        <label>Giá tiền ( VNĐ )</label>
        <input
          type="text"
          placeholder="Giá tiền"
          value={numeral(price).format("0,0")}
          onChange={handlePriceChange}
        />

        <label>Giảm giá (%) </label>
        <input
          type="text"
          placeholder="Giảm x%"
          value={discount}
          onChange={(ev) => setDiscount(Number(ev.target.value))}
        />

        <div>
          <label>
            Giá tiền sau khi giảm <span>{numeral(finalPrice).format("0,0")}</span>{" "}
            ( VNĐ )
          </label>
        </div>

        <label>Số lượng sản phẩm</label>
        <input
          type="number"
          placeholder="Số lượng sản phẩm"
          value={qty}
          onChange={(ev) => setQty(ev.target.value)}
        />
        <button type="submit" className="btn-primary">
          Lưu
        </button>
      </form>
    </>


  );
}
