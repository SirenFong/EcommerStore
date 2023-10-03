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

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
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
const Currency = styled.span`
  font-size: 1.2rem;
`;
export default function ProductPage({ product, price }) {
  const { addProduct } = useContext(CartContext);
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
                <PriceRow>
                  <Price>
                    {product.price.toLocaleString()} <Currency>đ</Currency>
                  </Price>
                </PriceRow>
              </div>
              <div>
                <Button primary onClick={() => addProduct(product._id)}>
                  <CartIcon />
                  Add to cart
                </Button>
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
    },
  };
}
