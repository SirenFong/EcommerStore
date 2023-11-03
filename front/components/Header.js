import Link from "next/link";
import styled from "styled-components";
// import Center from "./Center";
import Center from "@component/components/Center";
import { useContext, useState } from "react";
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


export default function Header(
) {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [mainCategories, , setMainCategories] = useState();
  const { data: session } = useSession();
  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function login() {
    await signIn("google");
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
                <Link className="nav-link active" aria-current="page" href={"/"}>
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={"/products"}>
                  danh sách sản phẩm
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  href={"/categories"}
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  doanh mục sản phẩm
                </Link>
                <ul className="dropdown-menu">


                </ul>
              </li>

              <li className="nav-item">
                <a className="nav-link disabled">Disabled</a>
              </li>
            </ul>
            <form className="d-flex center" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>

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
                <i ><Cart /></i>
                <span class="badge rounded-pill badge-notification bg-danger">{cartProducts.length}</span>
              </a>

            </ul>



            <ul class="navbar-nav">

              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle hidden-arrow"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i ><Bell /></i>
                  <span class="badge rounded-pill badge-notification bg-danger">1</span>
                </a>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a class="dropdown-item" href="#">Some news</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">Another news</a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </li>
                </ul>
              </li>

            </ul>
            {!session && ( //nếu không thì sẽ login
              <Button primary onClick={login}>
                <FaGoogle /> Đăng nhập với Google
              </Button>
            )}
            {session && ( //Nếu tồn tại session thì hiện logout
              <li className="navbar-nav nav-item dropdown ">
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
                <ul className="dropdown-menu ">
                  <li>
                    <span className="px-2">{session?.user?.name}</span>
                  </li>

                  <li>
                    <Link className="dropdown-item" href={"/account"}>
                      Thông tin tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href={"/order"}>
                      đơn hàng đã đặt
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href={"/wishlist"}>
                      danh sách yêu thích
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" href={"/setting"}>
                      Cài đặt
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href={"/logout"}>
                      đăng xuất
                    </Link>
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

//Lấy ra các danh mục cha trong danh mục sản phẩm
export async function getServerSideProps(ctx) {
  const categories = await Category.find();
  const mainCategories = categories.filter((c) => !c.parent);
  const categoriesProducts = {}; //catId = [products]
  const allFetchedProductsId = [];

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString();
    const childCatIds = categories
      .filter((c) => c?.parent?.toString() === mainCatId)
      .map((c) => c._id.toString());
    const categoriesIds = [mainCatId, ...childCatIds];
    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    allFetchedProductsId.push(...products.map((p) => p._id.toString()));
    categoriesProducts[mainCat._id] = products;
  }

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
      userEmail: session?.user.email,
      product: allFetchedProductsId,
    })
    : [];

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishedProducts: wishedProducts.map((i) => i.product.toString()),
    },
  };
}
