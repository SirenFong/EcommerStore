import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";
import Spinner from "@component/components/Spinner";
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
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;

const AddressHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalcode, setPostalcode] = useState("");
  const [address, setAddress] = useState("");
  const [loaded, setLoaded] = useState(false);
  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }
  async function login() {
    await signIn("google");
  }

  function saveAddress() {
    const data = { name, email, phone, postalcode, address };
    axios.put("/api/address", data);
  }
  //lất thông tin từ monggo lên các thanh input
  useEffect(() => {
    axios.get("/api/address").then((response) => {
      setName(response.data.name);
      setPhone(response.data.phone);
      setEmail(response.data.email);
      setPostalcode(response.data.postalcode);
      setAddress(response.data.address);
      setLoaded(true);
    });
  }, []);
  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <h2>Danh sách</h2>
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2> tài khoản</h2>

                {!loaded && <Spinner fullWidth={true} />}
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
                  <Button black block onClick={saveAddress}>
                    Lưu
                  </Button>
                  <hr />
                </>

                {session && (
                  <Button primary onClick={logout}>
                    Logout
                  </Button>
                )}
                {!session && (
                  <Button primary onClick={login}>
                    Login with Google
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
