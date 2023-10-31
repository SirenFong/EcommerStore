import { WishedProduct } from "@component/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import Header from "@component/components/Header";
import Featured from "./../components/Featured";
import NewProducts from "@component/components/NewProducts";
import { Setting } from "@component/models/Setting";
import { useState, useEffect } from "react";
import WhiteBox from "@component/components/WhiteBox";
import styled from "styled-components";
import ProductImages from "@component/components/ProductImages";
import FlyingButton from "@component/components/FlyingButton";
import CartIcon from "@component/components/icons/CartIcon";
import Center from "@component/components/Center";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;
const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
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
`;

const ImgColumn = styled(Column)`
  & > div {
    width: 100%;
  }
`;
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

export default function HomePage({
  featuredProduct,
  newProducts,
  wishedNewProducts,
}) {
  const [suggestedProduct, setSuggestedProduct] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Hàm này sẽ gợi ý sản phẩm và cập nhật state khi trang web tải lên
    function suggestRandomProduct() {
      const randomIndex = Math.floor(Math.random() * newProducts.length);
      const randomProduct = newProducts[randomIndex];
      setSuggestedProduct(randomProduct);
    }
    // Gọi hàm gợi ý sản phẩm khi trang web tải lên
    suggestRandomProduct();
  }, [newProducts]);
  
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />

      {/* Hiển thị sản phẩm được gợi ý */}
      <ColWrapper>
        {suggestedProduct && (
          <div>
            <Center>
              <Title>Có thể bạn sẽ thích</Title>
              <ColWrapper>
                <WhiteBox>
                  <Title>{suggestedProduct.title}</Title>

                  <ProductImages images={suggestedProduct.images} />

                  <PriceRow>
                    <div>
                      <Price>
                        {isClient
                          ? suggestedProduct.price.toLocaleString()
                          : ""}
                        đ
                      </Price>
                    </div>
                  </PriceRow>
                  <div>
                    <FlyingButton
                      main
                      _id={suggestedProduct._id}
                      src={suggestedProduct.images?.[0]}
                    >
                      <CartIcon />
                      Thêm vào giỏ
                    </FlyingButton>
                  </div>
                </WhiteBox>
              </ColWrapper>
            </Center>
          </div>
        )}
      </ColWrapper>
    </div>
  );
}

//Connect tới admin để hiển thị sản phẩm theo id
export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const featuredProductSetting = await Setting.findOne({
    name: "featuredProductId",
  });

  const featuredProductId = featuredProductSetting.value;
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: newProducts.map((p) => p._id.toString()),
      })
    : [];
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}
