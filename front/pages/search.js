import Center from "@component/components/Center";
import Header from "@component/components/Header";
import Input from "@component/components/Input";
import ProductsGrid from "@component/components/ProductsGrid";
import Spinner from "@component/components/Spinner";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

import styled from "styled-components";

const SearchInput = styled(Input)`
  padding: 5px 10px;
  border-radius: 5px;
  font-size:1.4rem;
`;
const InputWrapper = styled.div`
  position:sticky;
  top:68px;
  margin: 25px 0;
  padding: 5px 0;
  background-color: #eeeeeeaa;
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  ///Được sử dụng để delay việc thực thi một hàm nào đó. Ví dụ khi user nhập vào ô search, chúng ta không thực thi ngay câu lệnh tìm kiếm mà đợi một khoảng thời gian sau khi user đã ngừng việc nhập.
  const debouncedSearch = useCallback(
    debounce(searchProducts, 500), []
  );
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios.get('/api/products?phrase=' + encodeURIComponent(phrase))
      .then(response => {
        setProducts(response.data);
        setIsLoading(false);
      });
  }
  return (
    <>
      <Header />
      <Center>
        <InputWrapper>
          <SearchInput
            autoFocus
            value={phrase}
            onChange={ev => setPhrase(ev.target.value)}
            placeholder="Search for products..." />
        </InputWrapper>
        {!isLoading && phrase !== '' && products.length === 0 && (
          <h2>Không có kết quả tìm kiếm "{phrase}"</h2>
        )}
        {isLoading && (
          <Spinner fullWidth={true} />
        )}
        {!isLoading && products.length > 0 && (
          <ProductsGrid products={products} />
        )}

      </Center>
    </>
  );
}