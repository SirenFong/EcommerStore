import { FaGoogle } from "react-icons/fa";
import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@component/components/Footer";
import Logo from "@component/components/icons/Logo";
import FacebookIcon from "@component/components/icons/FbIcon";
import ZaloIcon from "@component/components/icons/ZaloIcon";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import { useState } from "react";
import login_validate from "@component/lib/validate";
import { useRouter } from "next/router";

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

const InputField = styled.div``;

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

const StyledInput = styled.input`
  /* Add your input styles here */
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

export default function SignInPage({ swal }) {
  async function login() {
    await signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_URL });
  }
  const router = useRouter();
  const [show, setShow] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: login_validate,
    onSubmit,
  });

  console.log(formik.errors);

  async function onSubmit(values) {
    const status = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });
    if (status.ok) router.push(status.url);
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
              <form className="container" onSubmit={formik.handleSubmit}>
                <InputField>
                  <label htmlFor="email">Email:</label>
                  <StyledInput
                    type="email"
                    id="email"
                    {...formik.getFieldProps("email")}
                    className="form-control"
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <span>{formik.errors.email}</span>
                  ) : (
                    <></>
                  )}
                </InputField>

                <InputField>
                  <label htmlFor="password">Mật khẩu:</label>
                  <StyledInput
                    type={`${show ? "text" : "password"}`}
                    name="password"
                    id="password"
                    placeholder="password"
                    {...formik.getFieldProps("password")}
                    className="form-control"
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <span>{formik.errors.password}</span>
                  ) : (
                    <></>
                  )}
                </InputField>

                <RowCheckbox>
                  <div>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="form2Example31"
                      checked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="form2Example31"
                    >
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
                  <button type="submit" className="btn btn-primary px-3">
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
