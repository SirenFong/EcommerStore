import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductsGrid from "@component/components/ProductsGrid";
import Title from "@component/components/Title";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@component/models/WishedProduct";
import { getServerSession } from "next-auth";

export default function ProductsPage({ products, wishedProduct }) {
  return (
    <>
      <Header />
      <Center>
        <Title>Xem tất cả</Title>
        <ProductsGrid products={products} wishedProduct={wishedProduct} />
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  // const { user } = await getServerSession(ctx.req, ctx.res, authOptions);

  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: newProducts.map((p) => p._id.toString()),
      })
    : [];
  //   const wishedProducts = await WishedProduct.find({
  //     userEmail: user.email,
  //     product: products.map((p) => p._id.toString()),
  //   });

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProduct: wishedProducts.map((i) => i.product.toString()),
    },
  };
}
