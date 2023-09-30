import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.9rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 300px;
  img {
    max-width: 75%;
  }
  div {
    align-items: center;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured({ product }) {
  
  const { addProduct } = useContext(CartContext);

  function addFeaturedToCart() {
    addProduct((prev) => [product._id]);
  }
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <ButtonsWrapper>
                <ButtonLink
                  href={"/products/" + product._id}
                  outline={1}
                  white={1}
                >
                  Khám phá ngay
                </ButtonLink>
                <Button white onClick={addFeaturedToCart}>
                  <CartIcon />
                  Thêm vào giỏ hàng
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>

          <Column>
            <img
              src="https://www.ties.com/blog/wp-content/uploads/2015/09/1920s-style-LibaiFoundation.jpg"
              alt=""
            />
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
