import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductImages from "@component/components/ProductImages";
import Title from "@component/components/Title";
import WhiteBox from "@component/components/WhiteBox";
import CartIcon from "@component/components/icons/CartIcon";
import styled from "styled-components";
import FlyingButton from "@component/components/FlyingButton";
import ProductReviews from "@component/components/ProductReviews";
import { useEffect, useState } from "react";
import SuggestedProducts from "@component/components/SuggestedProducts";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { WishedProduct } from "@component/models/WishedProduct";

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

export default function ProductPage({
  product,
  suggestedProduct,
  wishedNewProducts,
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
                <Price>{isClient ? product.price.toLocaleString() : ""}đ</Price>
              </div>
              <div>
                <FlyingButton main _id={product._id} src={product.images?.[0]}>
                  <CartIcon />
                  Thêm vào giỏ
                </FlyingButton>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>

        <ProductReviews product={product} />

        <SuggestedProducts
          productId={product._id}
          suggestedproducts={suggestedProduct}
          wishedProducts={wishedNewProducts}
        />
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  console.log(context);
  await mongooseConnect();
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 4,
  });
  const { id } = context.query;
  const product = await Product.findById(id);
  const category = product.category;
  //hàm random
  // Tạo truy vấn MongoDB để lấy các sản phẩm thuộc cùng danh mục
  // const suggestedProduct = await Product.aggregate([
  //   { $match: { category: category, _id: { $ne: product._id } } }, // Lọc sản phẩm thuộc cùng danh mục
  //   { $sample: { size: 4 } }, // Lấy ngẫu nhiên 4 sản phẩm
  // ]);
  const suggestedProduct = await Product.find({ _id: { $ne: product._id } });
  const session = await getServerSession(context.req, context.res, authOptions);
  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: newProducts.map((p) => p._id.toString()),
      })
    : [];

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      suggestedProduct: JSON.parse(JSON.stringify(suggestedProduct)),
      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}
