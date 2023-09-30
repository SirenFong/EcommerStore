import Header from "@component/components/Header";
import Featured from "./../components/Featured";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import NewProducts from "@component/components/NewProducts";

export default function HomePage({ featuredProduct, newProducts }) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </div>
  );
}
//Connect tới admin để hiển thị sản phẩm theo id
export async function getServerSideProps() {
  const featuredProductId = "650c05b6225196fe6d3664b1";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}
