import Header from "@component/components/Header";
import Featured from "./../components/Featured";
import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";

export default function HomePage({ product }) {
  return (
    <div>
      <Header />
      <Featured product={product} />
    </div>
  );
}
//Connect tới admin để hiển thị sản phẩm theo id
export async function getServerSideProps() {
  const featuredProductId = "650c05b6225196fe6d3664b1";
  await mongooseConnect();
  const product = await Product.findById(featuredProductId);
  return {
    props: { product: JSON.parse(JSON.stringify(product)) },
  };
}
