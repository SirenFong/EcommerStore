import Center from "@component/components/Center";
import Header from "@component/components/Header";
import ProductBox from "@component/components/ProductBox";
import { Category } from "@component/models/Category";
import { Product } from "@component/models/Product";
import styled from "styled-components";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const CategoryTitle = styled.h2`
  display: flex;
  margin-top: 30px;
  margin-bottom: 0;
  align-items: center;
  gap: 10px;
  h2 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  a {
    color: #555;
    display: inline-block;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

// const ShowAllSquare = styled(Link)`
//   background-color: #ddd;
//   height: 160px;
//   border-radius: 10px;
//   align-items: center;
//   display: flex;
//   justify-content: center;
//   color: #555;
//   text-decoration: none;
// `;

export default function CategoriesPage({ mainCategories, categoriesProducts }) {
  return (
    <>
      <Header />
      <Center>
        {mainCategories.map((cat) => (
          <CategoryWrapper>
            <CategoryTitle>{cat.name}</CategoryTitle>
            <CategoryGrid>
              {categoriesProducts[cat._id].map((p) => (
                <ProductBox {...p} />
              ))}
            </CategoryGrid>
          </CategoryWrapper>
        ))}
      </Center>
    </>
  );
}

//Lấy ra các danh mục cha trong danh mục sản phẩm
export async function getServerSideProps() {
  const categories = await Category.find();
  const mainCategories = categories.filter((c) => !c.parent);
  const categoriesProducts = {}; //catId = [products]

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString();
    const childCatIds = categories
      .filter((c) => c?.parent?.toString() === mainCatId)
      .map((c) => c._id.toString());
    const categoriesIds = [mainCatId, ...childCatIds];
    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 4,
      sort: { _id: -1 },
    });
    categoriesProducts[mainCat._id] = products;
  }

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
    },
  };
}
