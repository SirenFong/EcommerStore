import { FaGoogle } from "react-icons/fa";
import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";

import styled from "styled-components";

import "react-toastify/dist/ReactToastify.css";
import Footer from "@component/components/Footer";
import Logo from "@component/components/icons/Logo";
import FacebookIcon from "@component/components/icons/FbIcon";
import ZaloIcon from "@component/components/icons/ZaloIcon";
import { signIn } from "next-auth/react";

const ColumnsWrapper = styled.div`
  padding: 40px;
  display: flex;
  justify-content: center;
`;

const WhiteBoxLogin = styled.div`
  background-color: #fff;
  border-radius: 10px;
  width: 800px;
  padding: 30px 0px;
`;
const LoginRow = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 30px;
  padding-bottom: 30px;
`;

const Cols = styled.div``;
const InputFlied = styled.div``;
const RowCheckbox = styled.div`
  padding: 15px;
  display: flex;
  justify-content: space-between;
`;
const RowButton = styled.div`
  padding-bottom: 15px;

  display: flex;
  justify-content: center;
  gap: 15px;
`;
const ButtonIcon = styled.button`
  border: 0;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 15px;
  svg {
    height: 23px;
  }
`;

export default function SignInPage({ swal }) {
  async function login() {
    await signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_URL });
  }

  return (
    <>
      <Header key={new Date().getTime()} />
      <Center>
        <ColumnsWrapper>
          <div>
            <WhiteBoxLogin className="container ">
              <LoginRow>
                <Logo />
              </LoginRow>

              <p className="h3 text-center">Đăng nhập</p>

              <form className="container ">
                <InputFlied>
                  <labelInput>Tài khoản</labelInput>

                  <input
                    type="email"
                    id="form2Example1"
                    className="form-control"
                  />
                </InputFlied>

                <InputFlied>
                  <labelInput>Tài khoản</labelInput>
                  <Input
                    type="password"
                    id="form2Example2"
                    className="form-control"
                  />
                </InputFlied>

                <RowCheckbox>
                  <div>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="form2Example31"
                      checked
                    />
                    <label className="form-check-label" for="form2Example31">
                      {" "}
                      Ghi nhớ tài khoản{" "}
                    </label>
                  </div>

                  <div>
                    {" "}
                    <a href="#!">Quên mật khẩu?</a>
                  </div>
                </RowCheckbox>

                <div className="d-flex justify-content-center pb-3">
                  <button type="button" className="btn btn-primary px-3 ">
                    Đăng nhập
                  </button>
                </div>

                <div className="text-center">
                  <p>
                    Bạn chưa có tài khoản ? <a href="/signup">Đăng ký ngay</a>
                  </p>
                  <p>Hoặc đăng nhập bằng:</p>
                  <RowButton>
                    <ButtonIcon type="button" primary onClick={login}>
                      <FaGoogle /> Google
                    </ButtonIcon>
                    <Button primary>
                      <FacebookIcon /> Facebook
                    </Button>
                    <Button primary>
                      <ZaloIcon />
                      Zalo
                    </Button>
                  </RowButton>
                </div>
              </form>
            </WhiteBoxLogin>
          </div>
        </ColumnsWrapper>
      </Center>
      <Footer className={""} />
    </>
  );
}
