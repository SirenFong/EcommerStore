import styled from "styled-components";

import Center from "./Center";
import ProductsGrid from "./ProductsGrid";
import ProductBox from "./ProductBox";
import { RevealWrapper } from "next-reveal";
import Link from "next/link";

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
`;
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  margin-top: 30px;
  margin-bottom: 0;
  align-items: center;
  gap: 10px;
  h2 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  a {
    color: #555;
    display: inline-block;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
  background-color: #ddd;
  height: 160px;
  border-radius: 10px;
  align-items: center;
  display: flex;
  justify-content: center;
  color: #555;
  text-decoration: none;
`;

export default function SuggestedProducts({ suggestedproducts, wishedProducts }) {
    return (
        <Center>
            <Title>Có thể bạn sẽ thích</Title>
            <CategoryGrid>
                {suggestedproducts.map((suggestedproducts, index) => (
                    <RevealWrapper key={index} delay={index * 50}>
                        <ProductBox {...suggestedproducts} wished={wishedProducts.includes(suggestedproducts._id)} />
                    </RevealWrapper>
                ))}

            </CategoryGrid>


        </Center>
    );
}
