import styled from "styled-components";
import Center from "./Center";

import CartIcon from "./icons/CartIcon";
import FlyingButton from "./FlyingButton";
import { RevealWrapper } from "next-reveal";
import { useEffect } from "react";
import { useContext } from "react";
import { CategoryContext } from "./CategoryContext";

const Bg = styled.div`
 background-color: #222;
  color: #fff;
  padding: 100px ;
  margin:20px 200px;
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img.main {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
    margin-left: auto;
    margin-right: auto;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    & > div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
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
const CenterImg = styled.div`

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  img {
      max-width: 100%;
     
    }
`;
const ButtonLink = styled.button`
color:#fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16%;
  border-radius:5px ;
  border-color: #fff;
background-color: #222;

`;
const ImgColumn = styled(Column)`

  & > div {
    width: 100%;
  }
`;

const ContentWrapper = styled.div``;


export default function Featured({ product }) {
  const { addCategory, clearCategory } = useContext(CategoryContext);
  const url = "/product/" + product._id;
  function addcategoryId() {
    clearCategory();
    addCategory(product.category);
    window.location.href = url;

  }
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <RevealWrapper origin={"left"} delay={0}>
                <ContentWrapper>
                  <Title>{product.title}</Title>
                  <Desc>{product.description}</Desc>
                  <ButtonsWrapper>
                    <ButtonLink
                      onClick={() => addcategoryId(product.category)}
                      outline={1}
                      white={1}
                    >
                      Xem thêm
                    </ButtonLink>
                    <FlyingButton
                      white={1}
                      _id={product._id}
                      src={product.images?.[0]}
                    >
                      <CartIcon />
                      Thêm vào giỏ
                    </FlyingButton>
                  </ButtonsWrapper>
                </ContentWrapper>
              </RevealWrapper>
            </div>
          </Column>

          <RevealWrapper delay={0}>
            <ImgColumn>
              <CenterImg>
                <img className={"main"} src={product.images?.[0]} alt="" />
              </CenterImg>
            </ImgColumn>
          </RevealWrapper>

        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
