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
import { withSwal } from "react-sweetalert2";
import Footer from "@component/components/Footer";

const ColumnsWrapper = styled.div`
  height: 100%;
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

const Title = styled.div`
  font-size: 1.5em;
  display: flex;
  justify-content: center;
`;

function WishlistPage({ swal }) {
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
  const [isLoading, setIsLoading] = useState(false);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function login() {
    await signIn("google");
  }
  async function saveAddress() {
    const data = { name, phone, email, postalcode, address };
    axios.put("/api/address", data);
    setIsLoading(false);
    await swal.fire({
      title: "Settings saved!",
      icon: "success",
    });
  }

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

  function productRemovedFromWishList(idToRemove) {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== idToRemove)];
    });
  }

  return (
    <>
      <Header key={new Date().getTime()} />
      <Center>
        <ColumnsWrapper className="container">
          <div>
            <WhiteBox>
              <RevealWrapper delay={0}>
                <Title> Danh sách yêu thích của bạn</Title>

                <>
                  {!wishlistLoaded && <Spinner fullWidth={true} />}
                  {wishlistLoaded && (
                    <>
                      <WishedProductsGrid>
                        {wishedProducts.length > 0 &&
                          wishedProducts.map((wp) => (
                            <ProductBox
                              class="border-bottom-0"
                              key={wp._id}
                              {...wp}
                              wished={true}
                              onRemoveFromWishlist={productRemovedFromWishList}
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
              </RevealWrapper>
            </WhiteBox>
          </div>
        </ColumnsWrapper>
      </Center>
      <Footer />
    </>
  );
}

export default withSwal(({ swal }) => <WishlistPage swal={swal} />);
