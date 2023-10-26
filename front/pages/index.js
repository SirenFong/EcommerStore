import { WishedProduct } from "@component/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import Header from "@component/components/Header";
import Featured from "./../components/Featured";
import NewProducts from "@component/components/NewProducts";
import { Setting } from "@component/models/Setting";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HomePage({
  featuredProduct,
  newProducts,
  wishedNewProducts,
}) {
  const [recommends, setRecommends] = useState([]);
  useEffect(() => {

    axios.get("/api/recommends").then((response) => {

      setRecommends(response.data.filter((item) =>
        console.log(item.line_items)
        // item.line_items.map(
        //   (lineitem) => console.log(lineitem))
      ));

    });
    console.log(recommends)
  }, []);
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />


      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
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
