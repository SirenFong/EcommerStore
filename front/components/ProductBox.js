import styled from "styled-components";
import { useContext, useState } from "react";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import axios from "axios";

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
  border: none;
  box-shadow-sm: 0 0.125rem 0.25rem rgba($black, 0.075);
  padding: 20px;
  height: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  img {
    max-width: 100%;
    max-height: 200px;
  }
`;

const DiscountedPrice = styled.span`
  font-size: 1.1rem;
  padding: 15px 0px;
  text-decoration: line-through;
  color: #999;
`;

const DiscountPercentage = styled.span`
  font-size: 1.1rem;
  padding: 15px;
  color: #f73b3b;
`;

const Title = styled.button`
  background: transparent;
  border: none;
  font-weight: normal;
  font-size: 1rem;
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
  font-size: 1.2rem;
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
  discount,
  finalPrice,
  category,
  images,
  wished = false,
  saled,
  onRemoveFromWishlist = () => {},
  props,
}) {
  const url = "/product/" + _id;
  console.log(saled);
  const { addCategory, clearCategory } = useContext(CategoryContext);
  const [promotions, setPromotions] = useState([]);
  const [domLoaded, setDomLoaded] = useState(false);
  const formatter = new Intl.NumberFormat("en-US");
  const formattedPrice = formatter.format(finalPrice);
  const [isWished, setIsWished] = useState(wished);
  console.log(isWished);
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
      .then(() => {});
    setIsWished(nextValue);
  }

  function addcategoryId(category) {
    clearCategory();
    addCategory(category);
    window.location.href = url;
  }
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  useEffect(() => {
    axios.get("/api/promotions").then((response) => {
      setPromotions(response.data);
    });
  }, []);
  console.log(promotions);
  const [pro, setPro] = useState([]);
  const [id, setid] = useState([]);
  useEffect(() => {
    promotions.map((p) => {
      p.condition.map((i) => {
        setPro(i.values);
      });
    });
    pro.map((i, index) => {
      setid(index);
    });
  }, []);

  const [sales, setSales] = useState();
  console.log(id);

  console.log(pro);
  return (
    <>
      {domLoaded && (
        <ProductWrapper>
          <WhiteBox onClick={() => addcategoryId(category)}>
            <div>
              <WishlistButton wished={isWished} onClick={addToWishlist}>
                {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
              </WishlistButton>
              <img src={images?.[0]} alt="" />
            </div>
          </WhiteBox>

          <ProductInfoBox>
            <Title onClick={() => addcategoryId(category)}>{title}</Title>
            <PriceRow>
              {discount > 0 ? (
                <>
                  <Price>{formattedPrice} đ</Price>
                  <DiscountedPrice>{price} đ</DiscountedPrice>
                  <DiscountPercentage>-{discount}%</DiscountPercentage>
                </>
              ) : (
                <Price>{formattedPrice} đ</Price>
              )}
            </PriceRow>
            <FlyingButton _id={_id} src={images?.[0]}>
              Thêm vào giỏ hàng
            </FlyingButton>
          </ProductInfoBox>
        </ProductWrapper>
      )}
    </>
  );
}
