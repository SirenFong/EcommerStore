const { createContext, useState, useEffect } = require("react");

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  //Lưu giỏ hàng xuống localStorage trong trình duyệt
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);

  //Kiểm tra xem chuỗi giỏ hàng có lớn hơn 0 không?
  //Nếu có sẽ số giỏ hàng xuống localStorage qua phương thức setItem

  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem("cart", JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  //Hàm useEffect thứ 2 này sẽ kiểm tra xem dữ liệu lưu trong localStorage có tồn tại không?
  //Nếu có thì số trong "cart" sẽ được gán ngược lên cartProducts
  //Điều này đảm bảo rằng mỗi khi "cartProducts" thay đổi,
  //nó sẽ được lưu trữ trong localStorage và khi người dùng truy cập lại trang web,
  //dữ liệu được lấy lại từ localStorage và gán cho "cartProducts".
  useEffect(() => {
    if (ls && ls.getItem("cart")) {
      setCartProducts(JSON.parse(ls.getItem("cart")));
    }
  }, []);

  //Thêm sản phẩm trùng với sản phẩm trước theo Id mà không hiển thị thêm sp
  function addProduct(productId) {
    setCartProducts((prev) => [...prev, productId]);
  }
  //Xóa sản phẩm
  function removeProduct(productId) {
    setCartProducts((prev) => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value, index) => index !== pos);
      }
      return prev;
    });
  }

  ////Hàm xóa danh sách giỏ hàng khi đã đặt hàng
  function clearCart() {
    setCartProducts([]);
    ls?.setItem("cart", JSON.stringify([]));
  }
  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
