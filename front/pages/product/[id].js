import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";
import { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { WishedProduct } from "@component/models/WishedProduct";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductImages from "@component/components/ProductImages";
import Title from "@component/components/Title";
import WhiteBox from "@component/components/WhiteBox";
import CartIcon from "@component/components/icons/CartIcon";
import styled from "styled-components";
import FlyingButton from "@component/components/FlyingButton";
import ProductReviews from "@component/components/ProductReviews";
import SuggestedProducts from "@component/components/SuggestedProducts";

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
  padding: 5px 0px;
  h5 {
    margin: 0px;
  }
`;
const Price = styled.span`
  font-size: 1.4rem;
  color: #f73b3b;
`;

export default function ProductPage({
  product,
  suggestedProduct,
  wishedNewProducts,
}) {
  const [isClient, setIsClient] = useState(false);
  // Thêm state để theo dõi properties được chọn
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedProperties, setSelectedProperties] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectValue = (propertyName, selectedValue) => {
    setSelectedValues({
      ...selectedValues,
      [propertyName]: selectedValue,
    });
  };

  {
    selectedProperties.length > 0 && (
      <div>
        <p>Thông tin chi tiết:</p>
        <div style={{ display: "flex" }}>
          {selectedProperties.map((selectedProp, index) => (
            <div key={index} style={{ marginRight: "20px" }}>
              <p>
                <strong>{selectedProp.name}:</strong>{" "}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  let separatedArray = [];
  if (product.properties.length > 0) {
    product.properties.forEach((prop) => {
      prop.values.map((i) => {
        let obj = {
          name: prop.name,
          values: i,
        };
        separatedArray.push(obj);
      });
    });
  }

  const [selectedNumber, setSelectedNumber] = useState([]);
  let arr = [];
  function selectNumber(e) {
    e.preventDefault();
    setSelectedNumber([e.target.name, e.target.value]);
  }

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
            <p
              dangerouslySetInnerHTML={{
                __html: product.description.replace(/\n/g, "<br/>"),
              }}
            />

            <p>
              <strong>{product.qty} Sản phẩm có sẵn</strong>
            </p>

            <PriceRow>
              <h5>Giá: </h5>
              <div>
                <Price>{isClient ? product.price.toLocaleString() : ""}đ</Price>{" "}
              </div>
            </PriceRow>

            {/* Lựa chọn properties dưới dạng button */}
            <div>
              {product.properties.map((p, i) => (
                <div key={i}>
                  {p.name}
                  <div style={{ display: "flex" }}>
                    {separatedArray
                      .filter((prop) => prop.name === p.name)
                      .map((prop, index) => (
                        <div key={index}>
                          <button
                            onClick={() => selectValue(prop.name, prop.values)}
                            style={{
                              background:
                                selectedValues[prop.name] === prop.values
                                  ? "blue"
                                  : "white",
                              color:
                                selectedValues[prop.name] === prop.values
                                  ? "white"
                                  : "black",
                              border: "1px solid #ccc",
                              padding: "5px 10px",
                              margin: "5px",
                              cursor: "pointer",
                            }}
                          >
                            {prop.values}
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

<<<<<<< HEAD
=======
            {/* Hiển thị thông tin chi tiết của các property được chọn */}
            {selectedProperties.length > 0 && (
              <div>
                <p>Thông tin chi tiết:</p>
                <div style={{ display: "flex" }}>
                  {selectedProperties.map((selectedProp, index) => (
                    <div key={index} style={{ marginRight: "20px" }}>
                      <p>
                        <strong>{selectedProp.name}:</strong> {selectedProp._id}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="my-2">
              <h6>Số lượng</h6>
              <RowQuantity>
                <ButonQuantity onClick={() => lessOfThisProduct(product._id)}>
                  -
                </ButonQuantity>
                <QuantityLabel>
                  {" "}
                  {cartProducts.filter((id) => id === product._id).length}
                </QuantityLabel>{" "}
                <ButonQuantity
                  onClick={() => moreOfThisProduct(product._id)}
                >
                  +
                </ButonQuantity>
              </RowQuantity>
            </div>

>>>>>>> acc7414 (aaa)
            <div>
              <FlyingButton main _id={product._id} src={product.images?.[0]}>
                <CartIcon />
                Thêm vào giỏ
              </FlyingButton>
            </div>
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
