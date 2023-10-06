import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";
import Tabs from "@component/components/Tabs";
import Title from "@component/components/Title";
import WhiteBox from "@component/components/WhiteBox";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";



const ColsWrapper = styled.div`
  display:grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin: 40px 0;
  p{
    margin:5px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  console.log(session)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [address, setAddress] = useState("");


  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }
  async function login() {
    await signIn('google');
  }
  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put('/api/address', data);
  }
  // useEffect(() => {

  //   setAddressLoaded(false);
  //   setWishlistLoaded(false);
  //   setOrderLoaded(false);
  //   axios.get('/api/address').then(response => {
  //     console.log(response)
  //     // setName(response.data.name);
  //     // setEmail(response.data.email);
  //     // setCity(response.data.city);
  //     // setPostalCode(response.data.postalCode);
  //     // setStreetAddress(response.data.streetAddress);
  //     // setCountry(response.data.country);
  //     // setAddressLoaded(true);
  //   });

  // },);
  // function productRemovedFromWishlist(idToRemove) {
  //   setWishedProducts(products => {
  //     return [...products.filter(p => p._id.toString() !== idToRemove)];
  //   });
  // }
  return (
    <>
      <Header />

      <Center>g
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <h2>Danh sách sản phẩm</h2>
              </WhiteBox>

            </RevealWrapper>

          </div>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <h2>Thông tin chi tiết tài khoản</h2>

                <Input
                  type="text"
                  placeholder="Họ Tên Tài Khoản"
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
                {/* <Button black block onClick={saveAddress}>
                  Đặt hàng
                </Button> */}
                <hr />
                {session && (
                  <Button primary onClick={() => signOut()}>Logout</Button>
                )}
                {!session && (
                  <Button primary onClick={login}>Login</Button>
                )}
              </WhiteBox>
            </RevealWrapper>


          </div>
        </ColsWrapper>



      </Center>
    </>
  );
}