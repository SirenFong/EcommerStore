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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withSwal } from "react-sweetalert2";
import Footer from "@component/components/Footer";
import {
    validEmail,
    validPhone,
    validName,
    validPostCode,
    validAddress,
    validSpace,
} from "@component/context/Regex";
import Logo from "@component/components/icons/Logo";


const ColumnsWrapper = styled.div`
background-color:#222;
padding:40px ;
display:flex;
justify-content: center;
`;

const ColsWrapper = styled.div`
 
`;
const WhiteBoxLogin = styled.div`
  background-color: #fff;
  border-radius: 10px;
  width:800px;

`;
const Cols = styled.div`


`;

function LoginPage({ swal }) {

    return (
        <>

            <Header key={new Date().getTime()} />
            <Center>
                <ColumnsWrapper>
                    <div>
                        <WhiteBoxLogin className="container ">

                            <div className="d-flex justify-content-center pt-4 pb-3"><Logo /></div>
                            <p className="h3 text-center" >Đăng nhập</p>

                            <form className="container ">

                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form2Example1">Tài khoản</label>
                                    <input type="email" id="form2Example1" className="form-control" />

                                </div>


                                <div className="form-outline mb-4">
                                    <label className="form-label" for="form2Example2">Mật khẩu</label>
                                    <input type="password" id="form2Example2" className="form-control" />

                                </div>


                                <div className="row mb-4">
                                    <div className="col d-flex justify-content-center">

                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="form2Example31" checked />
                                            <label className="form-check-label" for="form2Example31"> Remember me </label>
                                        </div>
                                        
                                    </div>

                        
                                </div>

                                <button type="button" className="btn btn-primary btn-block mb-4">Sign in</button>


                                <div className="text-center">
                                    <p>Not a member? <a href="#!">Register</a></p>
                                    <p>or sign up with:</p>
                                    <button type="button" className="btn btn-link btn-floating mx-1">
                                        <i className="fab fa-facebook-f"></i>
                                    </button>

                                    <button type="button" className="btn btn-link btn-floating mx-1">
                                        <i className="fab fa-google"></i>
                                    </button>

                                    <button type="button" className="btn btn-link btn-floating mx-1">
                                        <i className="fab fa-twitter"></i>
                                    </button>

                                    <button type="button" className="btn btn-link btn-floating mx-1">
                                        <i className="fab fa-github"></i>
                                    </button>
                                </div>
                            </form>

                        </WhiteBoxLogin>
                    </div>
                </ColumnsWrapper>
            </Center>
            <Footer />
        </>
    );
}

export default withSwal(({ swal }) => <LoginPage swal={swal} />);
