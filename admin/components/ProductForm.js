import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  qty: existingQty,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");

  const [productProperties, setProductProperties] = useState(
    assignedProperties || []
  );
  console.log(productProperties);
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [qty, setQty] = useState(existingQty || "");
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState(new Set());
  const numeral = require("numeral");
  ////load loại sản phẩm lên thanh select
  useEffect(() => {
    setCategoriesLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setCategoriesLoading(false);
    });
  }, []);

  //Xóa theo index :v
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
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      //update product
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create new product
      await axios.post("/api/products", data);
    }
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
      // files.forEach(file => data.append('file', file));
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);

      // console.log(res.data)
      // for (const file of files) {
      //   data.append('file', file)
      // }

      // const res = await axios.post('/api/upload', data)
      // console.log(res.data)
    }
  }
  //set image cho form thêm
  function uploadImagesOrder() {
    setImages(images);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let categoryInfo = categories.find(({ _id }) => _id === category);

    propertiesToFill.push(...categoryInfo.properties);

    while (categoryInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === categoryInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      categoryInfo = parentCat;
    }
  }
  const [checkedvalues, setValue] = useState([]);

  function setProductProp(p, e) {
    e.preventDefault();

    const { value, checked } = e.target;

    if (checked) {
      setProductProperties((prevProperties) => [
        ...prevProperties,
        {
          name: p.name,
          value: value, // Use the value from the checkbox
        },
      ]);
    } else {
      setProductProperties((prevProperties) =>
        prevProperties.filter((prop) => prop.value !== value)
      );
    }
  }
  console.log(checkedvalues);
  // function setProductProp(index, p, value) {

  //   setProductProperties((prev) => ({ ...prev, [p.name]: value }));

  //   console.log(productProperties)
  // }
  // console.log(propertiesToFill)
  return (
    /**useState dùng để thay đổi trạng thái khi thêm sản phẩm */
    /**Thằng setTitle sẽ thay đổi thành 1 trạng thái mới của thằng title */
    /**Dùng axios để xử lý các vấn đề liên quan đến API */
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
        {categories.length > 0 &&
          categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
      </select>

      {categoriesLoading && <Spinner />}

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p, index) => (
          <div className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>

            <div
              className="flex gap-2"
              value={p.name}
              // onChange={(ev) => setProductProp(index, p, ev.target.value)}
              onChange={(e) => setProductProp(p, e)}
            >
              {p.values.map((item, index) => (
                <div key={index} className="box-checked">
                  <div>{item}</div>
                  <input
                    className="box-checked-input"
                    value={item}
                    type="checkbox"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

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
        {/* {!images?.length && (
          <div>Không có hình ảnh cho sản phẩm này</div>
        )}* */}
      </div>
      <label>Mô tả chi tiết</label>
      <textarea
        placeholder="Nhập mô tả sản phẩm"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      <label>Giá tiền ( VNĐ )</label>
      {/* <input
        type="text"
        placeholder="Giá tiền"
        value={numeral(price).format("0,0")}
        onChange={(ev) => {
          const formattedPrice = numeral(
            ev.target.value.replace(".","")
          ).value();
          setPrice(formattedPrice);
        }}
      /> */}
      <input
        type="text"
        placeholder="Giá tiền"
        value={numeral(price).format("0,0")}
        onChange={(ev) => {
          const formattedPrice = numeral(ev.target.value).value();
          setPrice(formattedPrice);
        }}
      />
      {/* <input
        type="number"
        placeholder="price"
        value={price.toLocaleString("vi-VN")} // Sử dụng 'vi-VN' để định dạng số tiền theo định dạng của Việt Nam
        onChange={(ev) => setPrice(ev.target.value)}
      /> */}
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
  );
}
