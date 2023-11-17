// ProductPrice.js
import React from "react";
import styled from "styled-components";

const DiscountedPrice = styled.span`
  font-size: 1.4rem;
  padding: 15px 0px;
  text-decoration: line-through;
  color: #999;
`;

const DiscountPercentage = styled.span`
  font-size: 1.4rem;
  padding: 15px;
  color: #f73b3b;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 0px;
  align-items: center;
  h5 {
    margin: 0px;
  }
  > div {
    display: flex;
    gap: 10px;
  }
`;
const Price = styled.span`
  display: flex;
  margin: 15px;
  font-size: 1.4rem;
  color: #000;
`;

const ProductPrice = ({ discount, finalPrice, price, isClient }) => (
  <PriceRow>
    <h5>Giá:</h5>
    <div>
      {discount > 0 ? (
        <>
          <Price>{isClient ? finalPrice.toLocaleString() : ""}đ</Price>
          <DiscountedPrice>
            {isClient ? price.toLocaleString() : ""}đ
          </DiscountedPrice>
          <DiscountPercentage>-{discount}%</DiscountPercentage>
        </>
      ) : (
        <Price>{isClient ? price.toLocaleString() : ""}đ</Price>
      )}
    </div>
  </PriceRow>
);

export default ProductPrice;
