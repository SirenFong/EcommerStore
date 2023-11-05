import styled from "styled-components";
import Center from "./Center";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import FlyingButton from "./FlyingButton";
import { RevealWrapper } from "next-reveal";
const Bg = styled.div`
 background-color: #222;
  color: #fff;
 display:flex;
 justify-content: center;
  margin:20px 200px;
`;
const Title = styled.h1`
  margin: 10px;
  font-weight: normal;
  font-size: 0.5rem;
  color:#222;
  @media screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
const Price = styled.h2`
color:red;
  margin-bottom: 10px;
  font-weight: normal;
  font-size: 0.5rem;
  @media screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;
const ColumnsWrapper = styled.div`
 background-color: #345;
 display: inline-grid;
  grid-template-columns: auto auto auto;
 
  gap:50px
  padding: 50px;
  }
`;
const Column = styled.div`


  
  padding: 10px;
  font-size: 5px;
  text-align: center;

  align-items: center;
  margin:10px;
  img {
    max-width: 100%;
    max-height: 100%;
  }

`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin: 25px;
  background-color: #fff;
  
`;
const CenterImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ImgColumn = styled(Column)`
  & > div {
    width: 100%;
  }
`;

const ContentWrapper = styled.div``;

export default function Banner1({ product, product2, product3, }) {

  return (
    <Bg>
      <Center>
        <Title>Sản phẩm nổi bật</Title>
        <ColumnsWrapper>
          <ButtonsWrapper>
            <ButtonLink
              href={"/product/" + product[0]._id}
              outline={1}
              white={1}
            >
              <Column>
                <CenterImg>
                  <img className={"main"} src={product[0].images?.[0]} alt="" />
                </CenterImg>
                <div>

                  <Title>{product[0].title}</Title>
                  <Price>{product[0].price} VNĐ</Price>
                </div>
              </Column>
            </ButtonLink>

          </ButtonsWrapper>
          <ButtonsWrapper>
            <ButtonLink
              href={"/product/" + product[1]._id}
              outline={1}
              white={1}
            >
              <Column>
                <CenterImg>
                  <img className={"main"} src={product[1].images?.[0]} alt="" />
                </CenterImg>
                <div>

                  <Title>{product[1].title}</Title>
                  <Price>{product[0].price} VNĐ</Price>

                </div>
              </Column>
            </ButtonLink>

          </ButtonsWrapper>
          <ButtonsWrapper>
            <ButtonLink
              href={"/product/" + product[2]._id}
              outline={1}
              white={1}
            >
              <Column>
                <CenterImg>
                  <img className={"main"} src={product[2].images?.[0]} alt="" />
                </CenterImg>
                <div>

                  <Title>{product[2].title}</Title>
                  <Price>{product[0].price} VNĐ</Price>
                </div>
              </Column>
            </ButtonLink>

          </ButtonsWrapper>

        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
