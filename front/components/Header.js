import Link from "next/link";
import styled from "styled-components";
// import Center from "./Center";
import Center from "@component/components/Center";

const StyledHeader = styled.header`
  background-color: #111;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
`;

const StyledNav = styled.nav`
  display: flex;
  gap: 40px;
`;

export default function Header() {
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>Ecommerces</Logo>
          <StyledNav>
            <NavLink href={"/"}>Trang chủ</NavLink>
            <NavLink href={"/products"}>Toàn bộ sản phẩm</NavLink>
            <NavLink href={"/categories"}>Danh mục sản phẩm</NavLink>
            <NavLink href={"/account"}>Tài khoản</NavLink>
            <NavLink href={"/cart"}>Giỏ hàng (0)</NavLink>
          </StyledNav>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
