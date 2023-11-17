import { signIn, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@component/components/CartContext";
import { useForm, Controller } from "react-hook-form";
import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";
import Table from "@component/components/Table";
import axios from "axios";
import styled from "styled-components";
import { FaGoogle } from "react-icons/fa";
import Footer from "@component/components/Footer";

import { withSwal } from "react-sweetalert2";
const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

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
const Payment = styled.div`
  display: flex;
  gap: 5px;
`;
const ButtonPayment = styled.div`
  border: 1;

  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 15px;
  background-color: transparent;
  color: #000;
  border: 1px solid #000;
  ${(props) =>
    props.wished
      ? `
    color:red;
  `
      : `
    color:black;
  `}
`;
function CartPage({ swal }) {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);

  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [address, setAddress] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [serviceCost, setserviceCost] = useState([]);
  const [service, setService] = useState([]);
  const [isService, setIsService] = useState(false);
  const [isWished, setIsWished] = useState(false);
  //
  const [paymentmethod, setPaymentMethod] = useState("");
  const [paymentmethods, setPaymentMethods] = useState([]);

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
      localStorage.setItem("cart", JSON.stringify([]));
    }

    axios
      .get("/api/service?name=shippingFee")
      .then((res) => {
        setShippingFee(res.data.value);
      })
      .catch((error) => {
        console.error("Error fetching shipping fee:", error);
        setShippingFee(0);
      });
    setIsService(true);
    axios
      .get("/api/service")
      .then((res) => {
        setserviceCost(res.data.filter((item) => item.name !== "shippingFee"));
      })
      .catch((error) => {
        console.error("Error fetching shipping fee:", error);
        setserviceCost(null);
      });
    setIsService(false);
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    axios.get("/api/address").then((response) => {
      setName(response.data?.name || "");
      setPhone(response.data?.phone || "");
      setEmail(response.data?.email || "");
      setPostalcode(response.data?.postalcode || "");
      setAddress(response.data?.address || "");
    });
    axios.get("/api/paymentmethods").then((result) => {
      setPaymentMethods(result.data);
    });
  }, [session]);
  async function login() {
    await signIn("google");
  }
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

  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      phone,
      email,
      postalcode,
      address,
      paymentmethod,
      cartProducts,
      service,
    });

    if (response.data.url) {
      window.location = response.data.url;
    }
  }
  //tinhs tong tien hoa don
  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    productsTotal += price;
  }

  //Lấy giá trị từ url của cửa sổ thanh toán nếu succes trả về thông báo

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

  ///

  //Đi tới trang web thanh toán
  async function ToPayment() {
    if (paymentmethod != "") {
      if (paymentmethod == "653a7e8993659336603d60a9") {
        goToPayment();
      } else {
        await axios.post("/api/checkout", {
          name,
          phone,
          email,
          postalcode,
          address,
          paymentmethod,
          cartProducts,
        });
        setIsSuccess(true);
        clearCart();
        localStorage.setItem("cart", JSON.stringify([]));
      }
    } else {
      await swal.fire({
        title: "Vui lòng chọn phương thức thanh toán",
        icon: "warning",
      });
    }
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
                      <tr key={product._id}>
                        <ProductInfoCell>
                          <ProductImageBox>
                            <img src={product.images[0]} alt="" />
                          </ProductImageBox>
                          {product.title}
                        </ProductInfoCell>

                        <td>
                          <Button
                            onClick={() => lessOfThisProduct(product._id)}
                          >
                            -
                          </Button>
                          <QuantityLabel>
                            {" "}
                            {
                              cartProducts.filter((id) => id === product._id)
                                .length
                            }
                          </QuantityLabel>{" "}
                          <Button
                            onClick={() => moreOfThisProduct(product._id)}
                          >
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
                    <tr className="subtotal">
                      <td colSpan={2}>Tổng giá trị sản phẩm</td>
                      <td>{productsTotal.toLocaleString()} đ</td>
                    </tr>
                    <tr className="subtotal">
                      <td colSpan={2}>Tiền ship</td>
                      <td>{shippingFee?.toLocaleString()} đ</td>
                    </tr>
                    <tr className="subtotal"></tr>

                    <tr className="subtotal total">
                      <td colSpan={2}>Tổng hóa đơn</td>
                      <td>
                        {(
                          productsTotal + parseInt(shippingFee || 0)
                        ).toLocaleString()}{" "}
                        đ
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Box>
          </RevealWrapper>
          {!session && ( //nếu không thì sẽ login
            <RevealWrapper delay={200}>
              <Box>
                <h2>Đăng nhập để tiếp tục</h2>
                <Button primary onClick={login}>
                  <FaGoogle /> Đăng nhập với Google
                </Button>
              </Box>
            </RevealWrapper>
          )}
          {!!cartProducts?.length && (
            <RevealWrapper delay={200}>
              <Box>
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
                    name="email"
                    value={email}
                    readOnly
                    style={{ color: "darkgrey" }}
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
                </Box>
                <Box>
                  <h2>Phương thức thanh toán</h2>
                  <Payment>
                    <label>Loại sản phẩm</label>

                    <select
                      value={paymentmethod}
                      onChange={(ev) => setPaymentMethod(ev.target.value)}
                    >
                      <option value="">Chưa chọn loại sản phẩm</option>
                      {paymentmethods.length > 0 &&
                        paymentmethods.map((paymentmethod) => (
                          <option value={paymentmethod._id}>
                            {paymentmethod.paymentName}
                          </option>
                        ))}
                    </select>
                  </Payment>
                </Box>

                <Button black block onClick={ToPayment}>
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
export default withSwal(({ swal }, ref) => <CartPage swal={swal} />);
