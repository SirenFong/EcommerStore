import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@component/models/WishedProduct";
import { getServerSession } from "next-auth";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductsGrid from "@component/components/ProductsGrid";
import Footer from "@component/components/Footer";
import styled from "styled-components";

const Wraper = styled.div`
  display: flex; /* Height of the footer */
  height: 100%;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 10px 10px;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
`;

const WrapperColomnRight = styled.div`
  right: 0;
  color: black;
  text-align: center;
`;
export default function ProductsPage({ products, wishedProducts }) {
  return (
    <>
      <Header />
      <Center>
        <Wraper>
          <WrapperColomnRight>
            <Title>Tất cả sản phẩm</Title>

            <ProductsGrid products={products} wishedProducts={wishedProducts} />
          </WrapperColomnRight>
        </Wraper>
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: products.map((p) => p._id.toString()),
      })
    : [];

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map((i) => i.product.toString()),
    },
  };
}
