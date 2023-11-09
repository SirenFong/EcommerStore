import styled from "styled-components";
import Link from "next/link";
import { useContext, useState } from "react";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import axios from "axios";

import Button from "./Button";
import { CategoryContext } from "@component/components/CategoryContext";
import { useEffect } from "react";


const ProductWrapper = styled.div`
  background-color: #fff;
  padding: 30px;
  button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
`;

const WhiteBox = styled.button`
  background-color: #fff;
  box-shadow-sm: 0 0.125rem 0.25rem rgba($black, 0.075);
  padding: 20px;
  height: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  position: relative;
  img {
    max-width: 100%;
    max-height: 200px;
  }
`;

const Title = styled.button`
  font-weight: normal;
  font-size: 0.9rem;
  color: inherit;
  text-decoration: none;
  margin: 0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: left;
  }
`;

const WishlistButton = styled.button`
  border: 0;
  width: 60px !important;
  height: 60px;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  cursor: pointer;
  ${(props) =>
    props.wished
      ? `
    color:red;
  `
      : `
    color:black;
  `}
  svg {
    width: 24px;
  }
`;

export default function ProductBox({
  _id,
  title,
  description,
  price,
  images,
  wished = false,
  onRemoveFromWishlist = () => { },
  props,
}) {
  const url = "/product/" + _id;

  const { lastViewCategory, addCategory, clearCategory } = useContext(CategoryContext);
  const [domLoaded, setDomLoaded] = useState(false);



  const formatter = new Intl.NumberFormat("en-US");
  const formattedPrice = formatter.format(price);
  const [isWished, setIsWished] = useState(wished);
  function addToWishlist(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const nextValue = !isWished;
    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }
    axios
      .post("/api/wishlist", {
        product: _id,
      })
      .then(() => { });
    setIsWished(nextValue);
  }
  function addcategoryId(_id) {
    clearCategory();
    addCategory(_id);
    window.location.href = url;
  }
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  return (

    <>
      {domLoaded && (<ProductWrapper>

        <WhiteBox onClick={() => addcategoryId(_id)}>
          <div>
            <WishlistButton wished={isWished} onClick={addToWishlist}>
              {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
            </WishlistButton>
            <img src={images?.[0]} alt="" />
          </div>

        </WhiteBox>


        <ProductInfoBox>
          <Title onClick={() => addcategoryId(_id)}>{title}</Title>
          <PriceRow>
            <Price>{formattedPrice} đ</Price>
            <FlyingButton _id={_id} src={images?.[0]}>
              Thêm vào giỏ hàng
            </FlyingButton>
          </PriceRow>
        </ProductInfoBox>
      </ProductWrapper>)}
    </>


  );
}
