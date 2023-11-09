import { Category } from "@component/models/Category";
import { Product } from "@component/models/Product";
import { useEffect, useState } from "react";
import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductsGrid from "@component/components/ProductsGrid";
import styled from "styled-components";
import axios from "axios";
import Spinner from "@component/components/Spinner";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5em;
  }
`;
const FiltersWrapper = styled.div`
  display: flex;
  gap: 15px;
`;
const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  color: #444;
  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
    color: #444;
  }
`;

export default function CategoryPage({
  category,
  subCategories,
  products: originalProducts,
}) {
  const defaultSorting = "_id-desc";
  const defaultFilterValues = category.properties.map((p) => ({
    name: p.name,
    value: "all",
  }));
  const [products, setProducts] = useState(originalProducts);
  const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
  const [sort, setSort] = useState(defaultSorting);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  function handleFilterChange(filterName, filterValue) {
    setFiltersValues((prev) => {
      return prev.map((p) => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  }
  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProducts(true);

    //... trước subCategories cho phép truyền số lượng phần tử không xác định vào
    //mảng cho dù mảng đó có bao nhiêu phần tử đi nữa. Nếu subCategories
    //tồn tại và không null, mảng subCategories sẽ được
    //lặp qua và các giá trị _id của từng phần tử sẽ được thêm vào mảng catIds.
    const catIds = [category._id, ...(subCategories?.map((c) => c._id) || [])];
    const params = new URLSearchParams();
    params.set("categories", catIds.join(","));
    params.set("sort", sort);
    filtersValues.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value);
      }
    });
    const url = `/api/products?` + params.toString();
    axios.get(url).then((res) => {
      setProducts(res.data);
      setLoadingProducts(false);
    });
  }, [filtersValues, sort, filtersChanged]);
  return (
    <>
      <Header />
      <Center>
        <CategoryHeader>
          <h1>{category.name}</h1>
          <FiltersWrapper>
            {category.properties.map((prop) => (
              <Filter key={prop.name}>
                <span>{prop.name}:</span>
                <select
                  onChange={(ev) =>
                    handleFilterChange(prop.name, ev.target.value)
                  }
                  value={filtersValues.find((f) => f.name === prop.name).value}
                >
                  <option value="all">All</option>
                  {prop.values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </Filter>
            ))}
            <Filter>
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(ev) => {
                  setSort(ev.target.value);
                  setFiltersChanged(true);
                }}
              >
                <option value="price-asc">Từ giá thấp</option>
                <option value="price-desc">Từ giá cao</option>
                <option value="_id-desc">Sản phẩm mới nhất</option>
                <option value="_id-asc">Sản phẩm cũ</option>
              </select>
            </Filter>
          </FiltersWrapper>
        </CategoryHeader>
        {loadingProducts && <Spinner fullWidth />}
        {!loadingProducts && (
          <div>
            {products.length > 0 && <ProductsGrid products={products} />}
            {products.length === 0 && (
              <div>Xin lỗi, Không tìm thấy sản phẩm</div>
            )}
          </div>
        )}
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const catIds = [category._id, ...subCategories.map((c) => c._id)];
  const products = await Product.find({ category: catIds });
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
