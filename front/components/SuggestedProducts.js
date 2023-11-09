import styled from "styled-components";
import Center from "./Center";
import ProductBox from "./ProductBox";
import { RevealWrapper } from "next-reveal";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { CategoryContext } from "@component/components/CategoryContext";
import { useContext } from "react";
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

export default function SuggestedProducts({
  suggestedproducts,
  wishedProducts = [],
}) {
  const router = useRouter();

  // Xử lý chuyển hướng khi nhấn vào sản phẩm
  const handleProductClick = (productId) => {
    // Thực hiện chuyển hướng đến trang sản phẩm cụ thể dựa trên productId
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    // Đặt sự kiện xử lý khi chuyển hướng
    router.events.on("routeChangeComplete", () => {
      // Reload trang sau khi chuyển hướng
      // router.reload();
    });

    return () => {
      router.events.off("routeChangeComplete");
    };
  }, [router]);

  return (
    <Center>
      <Title>
        Các sản phẩm tương tự
      </Title>
      <CategoryGrid interval={100}>
        {suggestedproducts?.length > 0 &&
          suggestedproducts.map((suggestedproduct, index) => (
            <RevealWrapper
              onClick={() => handleProductClick(suggestedproduct._id)}
              key={suggestedproduct._id}
              delay={index * 50}
            >
              <ProductBox
                {...suggestedproduct}
                wished={wishedProducts.includes(suggestedproduct._id)}
              />
            </RevealWrapper>
          ))}
      </CategoryGrid>
    </Center>
  );
}
