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
import styled from "styled-components";
import SuggestedProducts from "@component/components/SuggestedProducts";
import Footer from "@component/components/Footer";


const Column = styled.div`
  display: flex;
  align-items: center;
`;
export default function HomePage({
  featuredProduct,
  newProducts,
  wishedNewProducts,
  suggestedProduct,
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishedProducts={wishedNewProducts} />
<<<<<<< HEAD
      <SuggestedProducts suggestedproducts={suggestedProduct} wishedProducts={wishedNewProducts} />
      <Footer />


=======
      <SuggestedProducts
        suggestedproducts={suggestedProduct}
        wishedProducts={wishedNewProducts}
      />
>>>>>>> ec9d39dbf907068a4fa5f50a27e8b7d0fd8254c9
    </div >

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
  //hàm random
  const suggestedProduct = await Product.aggregate([{ $sample: { size: 4 } }]);

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
      suggestedProduct: JSON.parse(JSON.stringify(suggestedProduct)),
      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}
