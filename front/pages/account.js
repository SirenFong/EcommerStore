import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";
import ProductBox from "@component/components/ProductBox";
import Spinner from "@component/components/Spinner";
import WhiteBox from "@component/components/WhiteBox";
import axios from "axios";
import styled from "styled-components";
import Tabs from "@component/components/Tabs";
import SingleOrder from "@component/components/SingleOrder";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
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

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const AddressHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishlistLoaded, setWishListLoaded] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActivetab] = useState("Danh sách yêu thích");
  const [orders, setOrders] = useState([]);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function login() {
    await signIn("google");
  }
  function saveAddress() {
    const data = { name, phone, email, postalcode, address };
    axios.put("/api/address", data);
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    setAddressLoaded(false);
    setWishListLoaded(false);
    setOrderLoaded(false);

    axios.get("/api/address").then((response) => {
      setName(response.data.name);
      setPhone(response.data.phone);
      setEmail(response.data.email);
      setPostalcode(response.data.postalcode);
      setAddress(response.data.address);
      setAddressLoaded(true);
    });
    axios.get("/api/wishlist").then((response) => {
      setWishedProducts(response.data.map((wp) => wp.product));
      setWishListLoaded(true);
    });
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setOrderLoaded(true);
    });
  }, [session]);

  function productRemovedFromWishList(idToRemove) {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== idToRemove)];
    });
  }
  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <WhiteBox>
              <RevealWrapper delay={0}>
                <Tabs
                  tabs={["Danh sách yêu thích", "Đơn đặt hàng"]}
                  active={activeTab}
                  onChange={setActivetab}
                />
                {activeTab === "Đơn đặt hàng" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && (
                          <p>Đăng nhập để tạo đơn hàng !!</p>
                        )}
                        {orders.length > 0 &&
                          orders.map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Danh sách yêu thích" && (
                  <>
                    {!wishlistLoaded && <Spinner fullWidth={true} />}
                    {wishlistLoaded && (
                      <>
                        <WishedProductsGrid>
                          {wishedProducts.length > 0 &&
                            wishedProducts.map((wp) => (
                              <ProductBox
                                key={wp._id}
                                {...wp}
                                wished={true}
                                onRemoveFromWishlist={
                                  productRemovedFromWishList
                                }
                              />
                            ))}
                        </WishedProductsGrid>

                        {wishedProducts.length === 0 && (
                          <>
                            {session && (
                              <>
                                <p>Bạn chưa thích sản phẩm nào !!</p>
                              </>
                            )}
                            {!session && (
                              <p>Đăng nhập để thêm sản phẩm yêu thích</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </RevealWrapper>
            </WhiteBox>
          </div>
          <div>
            <WhiteBox>
              <RevealWrapper delay={100}>
                <h2>{session ? "Thông tin tài khoản" : "Đăng nhập"}</h2>
                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <>
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
                      onChange={(ev) => setEmail(ev.target.value)}
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
                    <Button primary block onClick={saveAddress}>
                      Lưu thông tin
                    </Button>
                  </>
                )}
                <hr />
                {session && ( //Nếu tồn tại session thì hiện logout
                  <Button black onClick={logout}>
                    Đăng xuất
                  </Button>
                )}
                {!session && ( //nếu không thì sẽ login
                  <Button primary onClick={login}>
                    <FaGoogle /> Đăng nhập với Google
                  </Button>
                )}
              </RevealWrapper>
            </WhiteBox>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
