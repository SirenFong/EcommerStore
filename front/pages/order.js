import { useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Spinner from "@component/components/Spinner";
import WhiteBox from "@component/components/WhiteBox";
import axios from "axios";
import styled from "styled-components";
import Tabs from "@component/components/Tabs";
import SingleOrder from "@component/components/SingleOrder";
import { withSwal } from "react-sweetalert2";
import Footer from "@component/components/Footer";

const ColumnsWrapper = styled.div`
  grid-template-columns: 1fr;
  height: 500px;
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

function OrdersPage({ swal }) {
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
  const [activeTab, setActivetab] = useState("Đơn đặt hàng");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    setAddressLoaded(false);
    setWishListLoaded(false);
    setOrderLoaded(false);

    axios
      .get("/api/address")
      .then((response) => {
        if (response.data) {
          setIsLoading(true);
          setName(response.data?.name || "");
          setPhone(response.data?.phone || "");
          setEmail(response.data?.email || "");
          setPostalcode(response.data?.postalcode || "");
          setAddress(response.data?.address || "");
          setAddressLoaded(true);
        }
        setAddressLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching address data:", error);
        setAddressLoaded(true);
      });

    axios.get("/api/wishlist").then((response) => {
      setWishedProducts(response.data.map((wp) => wp.product));
      setWishListLoaded(true);
    });
    axios
      .get("/api/orders")
      .then((response) => {
        setOrders(
          response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setOrderLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching orders data:", error);
        setOrderLoaded(true);
      });
  }, [session]);

  return (
    <>
      <Header key={new Date().getTime()} />
      <Center>
        <ColumnsWrapper>
          <div>
            <WhiteBox className="container">
              <RevealWrapper delay={0}>
                {/* <Tabs
                  tabs={[
                    "Tất cả",
                    "Chưa thanh toán",
                    "Chờ xác nhận",
                    "Chờ giao hàng",
                    "Đã giao",
                    "Đã hủy",
                    "Trả hàng/Hoàn tiền",
                  ]}
                  active={activeTab}
                  onChange={setActivetab}
                /> */}
                {activeTab === "Đơn đặt hàng" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Đăng nhập để xem đơn hàng !!</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>Bạn chưa có đơn hàng nào !!</p>
                        )}
                        {orders.length > 0 &&
                          orders.map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Đơn chưa thanh toán" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Đăng nhập để xem đơn hàng !!</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>Bạn chưa có đơn hàng nào !!</p>
                        )}
                        {orders.length > 0 &&
                          orders.map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Đơn chờ xác nhận" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Đăng nhập để xem đơn hàng !!</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>Bạn chưa có đơn hàng nào !!</p>
                        )}
                        {orders.length > 0 &&
                          orders
                            .filter((item) => item.status == 1)
                            .map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Đơn chờ giao hàng" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Đăng nhập để xem đơn hàng !!</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>Bạn chưa có đơn hàng nào !!</p>
                        )}
                        {orders.length > 0 &&
                          orders
                            .filter((item) => item.status == 2)
                            .map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Đơn đã giao" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Đăng nhập để xem đơn hàng !!</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>Bạn chưa có đơn hàng nào !!</p>
                        )}
                        {orders.length > 0 &&
                          orders
                            .filter((item) => item.status == 3)
                            .map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Đơn hoàn trả" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Đăng nhập để xem đơn hàng !!</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>Bạn chưa có đơn hàng nào !!</p>
                        )}
                        {orders.length > 0 &&
                          orders
                            .filter((item) => item.status == 0)
                            .map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Đơn đã hủy" && (
                  <>
                    {!orderLoaded && <Spinner fullWidth={true} />}

                    {orderLoaded && (
                      <div>
                        {orders.length === 0 && !session && (
                          <p>Đăng nhập để xem đơn hàng !!</p>
                        )}
                        {orders.length === 0 && session && (
                          <p>Bạn chưa có đơn hàng nào !!</p>
                        )}
                        {orders.length > 0 &&
                          orders
                            .filter((item) => item.status == 0)
                            .map((o) => <SingleOrder {...o} />)}
                      </div>
                    )}
                  </>
                )}
              </RevealWrapper>
            </WhiteBox>
          </div>
        </ColumnsWrapper>
      </Center>
      {/* <Footer /> */}
    </>
  );
}

export default withSwal(({ swal }) => <OrdersPage swal={swal} />);
