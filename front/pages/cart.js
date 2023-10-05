import Button from "@component/components/Button";
import { CartContext } from "@component/components/CartContext";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";
import Table from "@component/components/Table";
import axios from "axios";
import { RevealWrapper } from "next-reveal";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2) {
    text-align: right;
  }
  table tr.subtotal td {
    padding: 15px 0;
  }
  table tbody tr.subtotal td:nth-child(2) {
    font-size: 1.4rem;
  }
  tr.total td {
    font-weight: bold;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 80px;
    max-height: 80px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 3px;
`;

const AddressHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [address, setAddress] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  ///sử dụng useEffect để chuyển cửa sổ về trang chủ đồng thời thực thi trạng thái
  //trống cho giỏ hàng
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);
  //Hàm gọi thêm sản phẩm vào giỏ hàng
  function moreOfThisProduct(id) {
    addProduct(id);
  }

  //Hàm gọi xóa sản phẩm vào giỏ hàng
  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }
  ////Đi tới trang web thanh toán
  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      phone,
      mail,
      postalcode,
      address,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }
  ////Lấy giá trị từ url của cửa sổ thanh toán nếu succes trả về thông báo

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Cảm ơn bạn đã đặt hàng</h1>
              <p>
                Chúng tôi sẽ gọi điện thoại cho bạn khi đơn đặt hàng của bạn
                được giao tới.
              </p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <RevealWrapper delay={0}>
            <Box>
              <h2>Đơn hàng của bạn</h2>
              {!cartProducts?.length && <div>Bạn chưa chọn sản phẩm</div>}
              {products?.length > 0 && (
                <Table>
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr>
                        <ProductInfoCell>
                          <ProductImageBox>
                            <img src={product.images[0]} alt="" />
                          </ProductImageBox>
                          {product.title}
                        </ProductInfoCell>

                        <td>
                          <Button onClick={() => lessOfThisProduct(product._id)}>
                            -
                          </Button>
                          <QuantityLabel>
                            {" "}
                            {
                              cartProducts.filter((id) => id === product._id)
                                .length
                            }
                          </QuantityLabel>{" "}
                          <Button onClick={() => moreOfThisProduct(product._id)}>
                            +
                          </Button>
                        </td>
                        <td>
                          {" "}
                          {(
                            cartProducts.filter((id) => id === product._id)
                              .length * product.price
                          ).toLocaleString()}{" "}
                          đ
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td></td>
                      <td></td> <td>{total.toLocaleString()} đ</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Box>
          </RevealWrapper>

          {!!cartProducts?.length && (
            <RevealWrapper delay={200}>
              <Box>
                <h2>NGƯỜI MUA/NHẬN HÀNG</h2>
                <AddressHolder>
                  <Input
                    type="text"
                    placeholder="Tên người nhận"
                    name="name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Số điện thoại"
                    name="phone"
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                  />
                </AddressHolder>
                <Input
                  type="text"
                  placeholder="Địa chỉ E-mail"
                  name="mail"
                  value={mail}
                  onChange={(ev) => setMail(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Postal Code"
                  name="postalcode"
                  value={postalcode}
                  onChange={(ev) => setPostalcode(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Địa chỉ nhận hàng"
                  name="address"
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                />
                <Button black block onClick={goToPayment}>
                  Đặt hàng
                </Button>
              </Box>
            </RevealWrapper>

          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
