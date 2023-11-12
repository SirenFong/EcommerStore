import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";

import Spinner from "@component/components/Spinner";
import WhiteBox from "@component/components/WhiteBox";
import axios from "axios";
import styled from "styled-components";

import { withSwal } from "react-sweetalert2";
import Footer from "@component/components/Footer";
import { validEmail, validPhone, validName, validPostCode, validAddress, validSpace } from '../context/regex.js';
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
 display: grid;
  grid-template-columns: auto auto ;
  gap: 5px;
  padding:5px 2px;
  
`;

const Avatar = styled.div`
  height:100px;
  weight:70px;
  gap: 5px;
  boder-radius:50px;
  margin:0px 10px;

  display: flex;
  justify-content: center;
  img{
 
    height:70px;
  weight:70px;
  
  }

`;
const Title = styled.div`

margin:0px;
p{
  margin:2px;
}
`;
const Wrapper = styled.div`

`;
const WrapperRow = styled.div`
 display: flex;
 p{
  margin:0px 50px;
 color:#FD3333;
 }
`;

function AccountPage({ swal }) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  // const [email, setEmail] = useState("");
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
    validate();
    // const data = { name, phone, email, postalcode, address };
    // axios.put("/api/address", data);
    // setIsLoading(false);
    // await swal.fire({
    //   title: "Settings saved!",
    //   icon: "success",
    // });
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
  const [email, setEmail] = useState('');
  console.log(validPhone)
  const [emailErr, setEmailErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);

  const [nameErr, setNameErr] = useState(false);
  const [postCodeErr, setPostCodeErr] = useState(false);
  const [space, setSpace] = useState(false);
  const validate = () => {
    // if (email == "" || name == "" || phone == "" || postalcode == "") {
    //   setSpace(true);
    // }

    if (!validEmail.test(email)) {
      setEmailErr(true);
    }
    if (validEmail.test(email)) {
      setEmailErr(false);
    }
    if (!validPhone.test(phone)) {
      setPhoneErr(true);
    }
    if (validPhone.test(phone)) {
      setPhoneErr(false);
    }
    if (!validName.test(name.toString())) {
      setNameErr(true);
    }
    if (validName.test(name)) {
      setNameErr(false);
    }
    if (!validPostCode.test(postalcode)) {
      setPostCodeErr(true);
    }
    if (validPostCode.test(postalcode)) {
      setPostCodeErr(false);
    }
  };
  console.log(phoneErr)
  return (
    <>
      <Header key={new Date().getTime()} />
      <Center>
        <ColumnsWrapper>

          <div>
            <WhiteBox className="container">
              <RevealWrapper delay={100}>
                <h2 className="text-center">{session ? "Thông tin tài khoản" : "Đăng nhập"}</h2>
                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <>
                    <Avatar><img
                      src={session?.user?.image}
                      class="rounded-circle"
                      height="25"

                      loading="lazy"
                    /></Avatar>
                    <AddressHolder>
                      <div>
                        <Title>Họ tên
                          {name == "" && <p> họ tên không được để trống</p>}
                          {nameErr && name != "" && <p> Họ và tên không đúng định dạng</p>}</Title>
                        <Input
                          type="text"
                          placeholder="Tên người nhận"
                          name="name"
                          value={name}
                          onChange={(ev) => setName(ev.target.value)}
                        />


                      </div>
                      <div>
                        <Title>Số điện thoại
                          {phone == "" && <p> số điện thoại khong được để trống</p>}
                          {phoneErr && phone != "" && <p> số điện thoại không đúng định dạng</p>}

                        </Title>
                        <Input
                          type="text"
                          placeholder="Số điện thoại"
                          name="phone"
                          value={phone}
                          onChange={(ev) => setPhone(ev.target.value)}
                        />
                      </div>
                    </AddressHolder>
                    <AddressHolder>
                      <div>
                        <Title>Email
                          {email == "" && <p> email không được để trống</p>}
                          {emailErr && email != "" && <p>Họ và tên không đúng định dạng</p>}
                        </Title>
                        <Input
                          type="text"
                          placeholder="Địa chỉ E-mail"
                          name="email"
                          value={email}
                          onChange={(ev) => setEmail(ev.target.value)}
                        />

                      </div>
                      <div>
                        <Title>Mã bưu chính

                          {postCodeErr && <p>Mã bưu chính không đúng định dạng</p>}
                        </Title>
                        <Input
                          type="text"
                          placeholder="Postal Code"
                          name="postalcode"
                          value={postalcode}
                          onChange={(ev) => setPostalcode(ev.target.value)}
                        />
                      </div>
                    </AddressHolder>
                    <div>
                      <Title>Địa chỉ
                        {address == "" && <p> Địa chỉ không được để trống</p>}
                        <p>Họ và tên không đúng định dạng</p>
                      </Title>
                      <Input
                        type="text"
                        placeholder="Địa chỉ nhận hàng"
                        name="address"
                        value={address}
                        onChange={(ev) => setAddress(ev.target.value)}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button style={{ margin: "30px 0px", width: "50%" }} primary block onClick={saveAddress}>
                        Cập nhật
                      </Button>
                    </div>

                  </>
                )}

                {session && ( //Nếu tồn tại session thì hiện logout
                  <div style={{ display: "flex", justifyContent: "center", }}>
                    <Button style={{ backgroundColor: "#FD3333" }} black onClick={logout}>
                      Đăng xuất
                    </Button>
                  </div>

                )}
                {!session && ( //nếu không thì sẽ login
                  <Button primary onClick={login}>
                    <FaGoogle /> Đăng nhập với Google
                  </Button>
                )}
              </RevealWrapper>
            </WhiteBox>
          </div>
        </ColumnsWrapper>
      </Center >
      <Footer />
    </>
  );
}

export default withSwal(({ swal }) => <AccountPage swal={swal} />);
