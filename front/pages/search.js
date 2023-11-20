import { debounce } from "lodash";
import { WishedProduct } from "@component/models/WishedProduct";
import { Product } from "@component/models/Product";
import { useCallback, useEffect, useState } from "react";
import { mongooseConnect } from "@component/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";
import ProductsGrid from "@component/components/ProductsGrid";
import Spinner from "@component/components/Spinner";
import axios from "axios";
import styled from "styled-components";

const SearchInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 1.4rem;
`;
const InputWrapper = styled.div`
  position: sticky;
  top: 68px;
  margin: 25px 0;
  padding: 5px 0;
  background-color: transparent;
`;
const Wrapper = styled.div`
  margin: 0px 200px;
`;

export default function SearchPage({ wishedProducts }) {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  ///Được sử dụng để delay việc thực thi một hàm nào đó.
  //Ví dụ khi user nhập vào ô search, chúng ta không thực thi
  //ngay câu lệnh tìm kiếm mà đợi một khoảng
  //thời gian sau khi user đã ngừng việc nhập.
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((response) => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }
  return (
    <>
      <Header />
      <Center>
        <Wrapper>
          <InputWrapper>
            <SearchInput
              autoFocus
              value={phrase}
              onChange={(ev) => setPhrase(ev.target.value)}
              placeholder="Nhập tên sản phẩm..."
            />
          </InputWrapper>
          {!isLoading && phrase !== "" && products.length === 0 && (
            <h2>Không có kết quả tìm kiếm &quot;{phrase}&quot;</h2>
          )}
          {isLoading && <Spinner fullWidth={true} />}
          {!isLoading && products.length > 0 && (
            <ProductsGrid products={products} wishedProducts={wishedProducts} />
          )}
        </Wrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });

  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user.email,
        product: products.map((p) => p._id.toString()),
      })
    : [];

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map((i) => i.product.toString()),
    },
  };
}
