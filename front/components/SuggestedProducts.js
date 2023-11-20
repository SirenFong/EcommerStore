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
  productId,
  salesProducts
}) {
  const url = "/product/" + productId;
  const router = useRouter();
  console.log(salesProducts)
  const { lastViewCategory } = useContext(CategoryContext);

  const filtered = suggestedproducts.filter(
    (item) => item.category == lastViewCategory
  );

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
  console.log(filtered)
  return (
    <Center>
      <Title>Các sản phẩm tương tự</Title>
      <CategoryGrid interval={100}>
        {filtered?.length > 0 &&
          filtered.map((filtered, index) => (
            <RevealWrapper
              onClick={() => handleProductClick(filtered._id)}
              key={filtered._id}
              delay={index * 50}
            >
              <ProductBox
                {...filtered}
                wished={wishedProducts.includes(filtered._id)}

              />
            </RevealWrapper>
          ))}
      </CategoryGrid>
    </Center>
  );
}
