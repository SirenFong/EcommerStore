import { FaGoogle } from "react-icons/fa";
import Button from "@component/components/Button";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import { withSwal } from "react-sweetalert2";
import Footer from "@component/components/Footer";
import Logo from "@component/components/icons/Logo";
import FacebookIcon from "@component/components/icons/FbIcon";
import ZaloIcon from "@component/components/icons/ZaloIcon";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import { useState } from "react";
import register_validate from "@component/lib/validate";
import { useRouter } from "next/router";

const ColumnsWrapper = styled.div`
  background-color: #222;
  padding: 40px;
  display: flex;
  justify-content: center;
`;

const StyledInput = styled.input`
  /* Add your input styles here */
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  margin-bottom: 10px;
`;
const InputField = styled.div``;
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

function SignUpPage({ swal }) {
  async function logins() {
    await signIn("google");
  }
  const [show, setShow] = useState({ password: false, cfpassword: false });
  const router = useRouter();
  //formik hook
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      cfpassword: "",
    },
    validate: register_validate,
    onSubmit,
  });

  async function onSubmit(values) {
    const option = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    //Lưu ý có thể sẽ thay đổi khi up lên vercel
    await fetch("http://localhost:4000/api/auth/signup", option)
      .then((res) => res.json())
      .then((data) => {
        if (data) router.push("http://localhost:4000/signin");
      });
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

              <p className="h3 text-center">Đăng Ký </p>

              <form className="container" onSubmit={formik.handleSubmit}>
                <InputField>
                  <label htmlFor="name">Họ và tên:</label>
                  <StyledInput
                    type="name"
                    id="name"
                    {...formik.getFieldProps("name")}
                    className="form-control"
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <span>{formik.errors.name}</span>
                  ) : (
                    <></>
                  )}
                </InputField>

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
                    type={show.password ? "text" : "password"}
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

                <InputField>
                  <label htmlFor="cfpassword">Xác nhận mật khẩu:</label>
                  <StyledInput
                    type={show.cfpassword ? "text" : "password"}
                    name="cfpassword"
                    id="cfpassword"
                    placeholder="Confirm Password"
                    {...formik.getFieldProps("cfpassword")}
                    className="form-control"
                  />
                  {formik.errors.cfpassword && formik.touched.cfpassword ? (
                    <span>{formik.errors.cfpassword}</span>
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
                  <button type="submit" className="btn btn-primary px-3 ">
                    Tạo tài khoản
                  </button>
                </div>

                <div className="text-center">
                  <p>
                    Bạn đã có tài khoản ? <a href="/signin">Đăng nhập ngay</a>
                  </p>
                  <p>Hoặc đăng nhập bằng:</p>
                  <RowButton>
                    <ButtonIcon primary onClick={logins}>
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

export default withSwal(({ swal }) => <SignUpPage swal={swal} />);
