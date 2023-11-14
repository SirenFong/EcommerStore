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
import { useContext, useEffect, useState } from "react";
import SuggestedProducts from "@component/components/SuggestedProducts";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { WishedProduct } from "@component/models/WishedProduct";
import Button from "@component/components/Button";
import { CartContext } from "@component/components/CartContext";

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
  padding:5px 0px;
  h5{
    margin:0px
  }
`;
const Price = styled.span`
  font-size: 1.4rem;
  color:#F73B3B;
`;
const RowQuantity = styled.span`
padding:10px 0px;
border:1.5px solid #818181;
border-radius:5px;
input[type=number] {
    -moz-appearance:textfield; 
    height:40px;
  width:50px;
  border:none;
  text-align:center;
  appearance: none;/* Firefox */
}

`;
const QuantityLabel = styled.span`
  padding: 0 3px;
`;

const AddressHolder = styled.div`
  display: flex;
  gap: 5px;
`;
const Payment = styled.div`
  display: flex;
  gap: 5px;
`;
const ButonQuantity = styled.button`
  border:1px solid #818181;
  background-color:#fff;
  height:40px;
  width:30px;
  border:none;
  border-radius:5px;
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
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
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
                {/* {selectedProp.values?.map((value, index) => (
                  <span key={index}>{value}</span>
                ))} */}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // Thay đổi hàm toggleSelectedProperty
  // const toggleSelectedProperty = (prop) => {
  //   setSelectedProperties((prevSelected) => {
  //     const isAlreadySelected = prevSelected.some(
  //       (selectedProp) => selectedProp.name === prop.name
  //     );

  //     if (isAlreadySelected) {
  //       return prevSelected.filter(
  //         (selectedProp) => selectedProp.name !== prop.name
  //       );
  //     } else {
  //       return [...prevSelected, prop];
  //     }
  //   });
  // };

  // Thay đổi hàm isSelectedProperty
  const isSelectedProperty = (prop) => {
    return selectedProperties.some(
      (selectedProp) => selectedProp._id === prop._id
    );
  };
  console.log(product)
  let separatedArray = [];
  if (product.properties.length > 0) {
    product.properties.forEach(prop => {
      prop.values.map((i) => {
        let obj = {
          name: prop.name,
          values: i,
        };
        separatedArray.push(obj);
      }

      )



    })
  }


  //Hàm gọi thêm sản phẩm vào giỏ hàng
  function moreOfThisProduct(id) {
    addProduct(id);
  }

  //Hàm gọi xóa sản phẩm vào giỏ hàng
  function lessOfThisProduct(id) {
    removeProduct(id);
  }



  const [selectedNumber, setSelectedNumber] = useState([]);
  let arr = []
  function selectNumber(e) {
    e.preventDefault();

    setSelectedNumber([e.target.name, e.target.value])


  }
  console.log(selectedNumber);
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

            <p>{product.qty} Sản phẩm có sẵn</p>
            <PriceRow>
              <h5>Giá: </h5>
              <div>
                <Price>{isClient ? product.price.toLocaleString() : ""}đ</Price>{" "}
              </div>


            </PriceRow>
            {/* Lựa chọn properties dưới dạng button */}
            <div>
              {product.properties.map((p, i) => (
                <div key={i} >

                  {p.name}
                  <div style={{ display: "flex" }}>
                    {separatedArray.map((prop, index) => (
                      p.name == prop.name &&
                      <div key={index} >

                        <button
                          value={prop.values}
                          name={prop.name}

                          onClick={selectNumber}
                          style={{
                            background: isSelectedProperty(prop) ? "blue" : "white",
                            color: isSelectedProperty(prop) ? "white" : "black",
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

            {/* Hiển thị thông tin chi tiết của các property được chọn */}
            {/* {selectedProperties.length > 0 && (
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
            )} */}
            <div className="my-2">
              <h6>Số lượng</h6>
              <RowQuantity>
                <ButonQuantity
                  onClick={() => lessOfThisProduct(product._id)}
                >-</ButonQuantity>
                <QuantityLabel>
                  {" "}
                  {
                    cartProducts.filter((id) => id === product._id)
                      .length
                  }
                </QuantityLabel>{" "}

                <ButonQuantity
                  onClick={() => moreOfThisProduct(product._id, properties)}
                >+</ButonQuantity>
              </RowQuantity>
            </div>


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
      </Center >
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
