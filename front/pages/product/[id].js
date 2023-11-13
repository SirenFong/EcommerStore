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
  category,
  suggestedProduct,
  wishedNewProducts,
}) {
  const [isClient, setIsClient] = useState(false);
  // Thêm state để theo dõi properties được chọn
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  {
    selectedProperties.length > 0 && (
      <div>
        <p>Thông tin chi tiết:</p>
        <div style={{ display: "flex" }}>
          {selectedProperties.map((selectedProp, index) => (
            <div key={index} style={{ marginRight: "20px" }}>
              <p>
                <strong>{selectedProp.name}:</strong>{" "}
                {selectedProp.values?.map((value, index) => (
                  <span key={index}>{value}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Thay đổi hàm toggleSelectedProperty
  const toggleSelectedProperty = (prop) => {
    setSelectedProperties((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (selectedProp) => selectedProp.name === prop.name
      );

      if (isAlreadySelected) {
        return prevSelected.filter(
          (selectedProp) => selectedProp.name !== prop.name
        );
      } else {
        return [...prevSelected, prop];
      }
    });
  };

  // Thay đổi hàm isSelectedProperty
  const isSelectedProperty = (prop) => {
    return selectedProperties.some(
      (selectedProp) => selectedProp._id === prop._id
    );
  };
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
            <p>{product.qty} Sản phẩm có sẵn</p>
            {/* Lựa chọn properties dưới dạng button */}
            <div>
              {product.properties.map((prop, index) => (
                <button
                  key={index}
                  onClick={() => toggleSelectedProperty(prop)}
                  style={{
                    background: isSelectedProperty(prop) ? "blue" : "white",
                    color: isSelectedProperty(prop) ? "white" : "black",
                    border: "1px solid #ccc",
                    padding: "5px 10px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                >
                  {prop.name}: {prop._id}
                </button>
              ))}
            </div>

            {/* Hiển thị thông tin chi tiết của các property được chọn */}
            {selectedProperties.length > 0 && (
              <div>
                <p>Thông tin chi tiết:</p>
                <div style={{ display: "flex" }}>
                  {selectedProperties.map((selectedProp, index) => (
                    <div key={index} style={{ marginRight: "20px" }}>
                      <p>
                        <strong>{selectedProp.name}:</strong>{" "}
                        {selectedProp._id}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PriceRow>
              <div>
                <Price>{isClient ? product.price.toLocaleString() : ""}đ</Price>{" "}
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
