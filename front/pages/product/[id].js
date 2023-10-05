import Button from "@component/components/Button";
import { CartContext } from "@component/components/CartContext";
import { useContext } from "react";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductImages from "@component/components/ProductImages";
import Title from "@component/components/Title";
import WhiteBox from "@component/components/WhiteBox";
import CartIcon from "@component/components/icons/CartIcon";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import styled from "styled-components";
import FlyingButton from "@component/components/FlyingButton";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

export default function ProductPage({ product }) {
  return (
    <>
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>${product.price}</Price>
              </div>
              <div>
                <FlyingButton main _id={product._id} src={product.images?.[0]}>
                  <CartIcon />Add to cart
                </FlyingButton>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>

      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    }
  }
}