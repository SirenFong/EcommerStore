import Header from "@component/components/Header";
import Featured from "./../components/Featured";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import NewProducts from "@component/components/NewProducts";
import { WishedProduct } from "@component/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function HomePage({
  featuredProduct,
  newProducts,
  wishedNewProducts,
}) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts
        products={newProducts}
        wishedNewProducts={wishedNewProducts}
      />
    </div>
  );
}
//Connect tới admin để hiển thị sản phẩm theo id
export async function getServerSideProps(ctx) {
  const featuredProductId = "651e57a55303da6a212ef2f4";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  // const { user } = await getServerSession(ctx.req, ctx.res, authOptions);
  // const wishedNewProducts = await WishedProduct.find({
  //   userEmail: user.email,
  //   product: newProducts.map((p) => p._id.toString()),
  // });
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
      wishedNewProduct: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}
