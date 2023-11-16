import Link from "next/link";
import styled from "styled-components";
// import Center from "./Center";
import Center from "@component/components/Center";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";
import SearchIcon from "./icons/SearchIcon";
import UsersIcon from "./icons/UsersIcon";
import Logo from "./icons/Logo";
import Cart from "./icons/Cart";
import CartIcon from "./icons/CartIcon";
import Bell from "./icons/Bell";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "./Button";
import { FaGoogle } from "react-icons/fa";
import CategoriesPage from "@component/pages/categories";
import axios from "axios";

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 3;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const SideIcons = styled.div`
  display: flex;
  align-items: center;
  a {
    display: inline-block;
    min-width: 20px;
    color: black;
    svg {
      width: 30px;
      height: 30px;
    }
  }
`;

export default function Header({}) {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const { data: session } = useSession();

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function login() {

  }
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }

  return (
    ///
    <div>
      <nav className="navbar navbar-expand-lg navbar-white bg-white">
        <div className="container-lg">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand " href="/">
            <Logo />
          </a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  href={"/"}
                >
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={"/products"}>
                  Tất cả sản phẩm
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  role="button"
                  aria-expanded="false"
                  href={"/categories"}
                >
                  Danh mục sản phẩm
                </Link>
                {/* <ul className="dropdown-menu">
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <li style={{ display: "flex", gap: "5px", justifyContent: "center" }} value={category._id}>{category.name}</li>
                    ))}




                </ul> */}
              </li>
            </ul>
            <SideIcons>
              <Link href={"/search"}>
                <SearchIcon />
              </Link>

              <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
                <BarsIcon />
              </NavButton>
            </SideIcons>
          </div>
          <div class="d-flex p-6 gap-4 align-items-center ">
            <ul class="navbar-nav">
              <a
                class="nav-link dropdown-toggle hidden-arrow"
                href="/cart"
                id="navbarDropdownMenuLink"
                role="button"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                <i>
                  <Cart />
                </i>
                <span class="badge rounded-pill badge-notification bg-danger">
                  {cartProducts.length}
                </span>
              </a>
            </ul>

            {!session && ( //nếu không thì sẽ login
              <Link primary href={"/login"}>
                Đăng nhập
              </Link>
            )}
            {session && ( //Nếu tồn tại session thì hiện logout
              <li className="navbar-nav nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle dropdown-center"
                  href={"/categories"}
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={session?.user?.image}
                    class="rounded-circle"
                    height="25"
                    loading="lazy"
                  />
                </Link>
                <ul className="dropdown-menu dropdown-menu-end">
                  {session ? (
                    <li>
                      <Link className="dropdown-item" href="/account">
                        Thông tin tài khoản
                      </Link>
                    </li>
                  ) : null}
                  <li>
                    <Link className="dropdown-item" href="/order">
                      Đơn hàng đã đặt
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/wishlist">
                      Danh sách yêu thích
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/setting">
                      Cài đặt
                    </Link>
                  </li>
                  <li>
                    <Button className="dropdown-item" onClick={logout}>
                      Đăng xuất
                    </Button>
                  </li>
                </ul>
              </li>
            )}
          </div>
        </div>
      </nav>
    </div>
    ///
  );
}
