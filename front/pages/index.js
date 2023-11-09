import { WishedProduct } from "@component/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import Header from "@component/components/Header";
import Featured from "./../components/Featured";
import NewProducts from "@component/components/NewProducts";

import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import SuggestedProducts from "@component/components/SuggestedProducts";
import Footer from "@component/components/Footer";
import Featured2 from "@component/components/Featured2";
import { Advertisement } from "@component/models/Advertisement";
import Banner from "@component/components/Banner";
import { CategoryContext } from "@component/components/CategoryContext";
import axios from "axios";

const Column = styled.div`
  display: flex;
  align-items: center;
`;
export default function HomePage({
  featuredProduct,
  featuredProduct2,
  bannerProduct1,
  bannerProduct2,
  bannerProduct3,
  newProducts,
  wishedNewProducts,
  suggestedProduct,
}) {

  const [isClient, setIsClient] = useState(false);
  const [products, setProducts] = useState([]);
  const { lastViewCategory } = useContext(CategoryContext);



  useEffect(() => {

    axios.get("/api/lastcaterogy", { category: lastViewCategory }).then((response) => {
      setProducts(response.data.filter((item) => item.category == lastViewCategory));
    });

  }, [lastViewCategory]);
  console.log(products)
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <div>----</div>
      <Featured2 product={featuredProduct2} />
      <Banner product={[bannerProduct1, bannerProduct2, bannerProduct3]} />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
      <SuggestedProducts
        suggestedproducts={products}
        wishedProducts={wishedNewProducts}
      />
      {suggestedProduct}
    </div>
  );
}

//Connect tới admin để hiển thị sản phẩm theo id
export async function getServerSideProps(ctx) {
  await mongooseConnect();
  ///
  const featuredProductSetting = await Advertisement.findOne({
    name: "featuredProductId1",
  });
  const featuredProductId = featuredProductSetting.value;
  const featuredProduct = await Product.findById(featuredProductId);
  ///
  const featuredProductSetting2 = await Advertisement.findOne({
    name: "featuredProductId2",
  });
  const featuredProductId2 = featuredProductSetting2.value;
  const featuredProduct2 = await Product.findById(featuredProductId2);
  ///
  const bannerProductSetting1 = await Advertisement.findOne({
    name: "bannerProductId1",
  });
  const bannerProductId1 = bannerProductSetting1.value;
  const bannerProduct1 = await Product.findById(bannerProductId1);
  ///

  const bannerProductSetting2 = await Advertisement.findOne({
    name: "bannerProductId2",
  });
  const bannerProductId2 = bannerProductSetting2.value;
  const bannerProduct2 = await Product.findById(bannerProductId2);
  ///
  const bannerProductSetting3 = await Advertisement.findOne({
    name: "bannerProductId3",
  });
  const bannerProductId3 = bannerProductSetting3.value;
  const bannerProduct3 = await Product.findById(bannerProductId3);
  ///
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  //hàm random
  // const suggestedProduct = await Product.aggregate([{ $sample: { size: 4 } }]);


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
      featuredProduct2: JSON.parse(JSON.stringify(featuredProduct2)),
      bannerProduct1: JSON.parse(JSON.stringify(bannerProduct1)),
      bannerProduct2: JSON.parse(JSON.stringify(bannerProduct2)),
      bannerProduct3: JSON.parse(JSON.stringify(bannerProduct3)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),

      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}
