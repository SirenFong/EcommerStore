const { createContext, useState, useEffect } = require("react");

export const CategoryContext = createContext({});

<<<<<<< HEAD
export function CategoryProvider({ children }) {
  //Lưu giỏ hàng xuống localStorage trong trình duyệt
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [lastViewCategory, setLastViewCategory] = useState([]);

  //Kiểm tra xem chuỗi giỏ hàng có lớn hơn 0 không?
  //Nếu có sẽ số giỏ hàng xuống localStorage qua phương thức setItem
=======
export function CategoryContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [lastViewCategories, setlastViewCategories] = useState([]);
>>>>>>> eeafbc9f60a2cc7e5eaaee59ea844efffe06c101

  useEffect(() => {
    if (lastViewCategory?.length > 0) {
      ls?.setItem("lastViewCategoryId", JSON.stringify(lastViewCategory));
    }
<<<<<<< HEAD
  }, [lastViewCategory]);

  //Hàm useEffect thứ 2 này sẽ kiểm tra xem dữ liệu lưu trong localStorage có tồn tại không?
  //Nếu có thì số trong "cart" sẽ được gán ngược lên cartProducts
  //Điều này đảm bảo rằng mỗi khi "cartProducts" thay đổi,
  //nó sẽ được lưu trữ trong localStorage và khi người dùng truy cập lại trang web,
  //dữ liệu được lấy lại từ localStorage và gán cho "cartProducts".
=======
  }, [lastViewCategories]);

>>>>>>> eeafbc9f60a2cc7e5eaaee59ea844efffe06c101
  useEffect(() => {
    if (ls && ls.getItem("lastViewCategoryId")) {
      setLastViewCategory(JSON.parse(ls.getItem("lastViewCategoryId")));
    }
  }, []);

<<<<<<< HEAD
  //Thêm sản phẩm trùng với sản phẩm trước theo Id mà không hiển thị thêm sp
  function addCategory(categoryId) {
    setLastViewCategory((prev) => [...prev, categoryId]);
  }
  function clearCategory() {
    setLastViewCategory([]);
    ls?.setItem("lastViewCategoryId", JSON.stringify([]));
=======
  function addCategory(categoryId) {
    setlastViewCategories((prev) => [...prev, categoryId]);
>>>>>>> eeafbc9f60a2cc7e5eaaee59ea844efffe06c101
  }

  return (
    <CategoryContext.Provider
      value={{
        lastViewCategory,
        setLastViewCategory,
        addCategory,
        clearCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}
