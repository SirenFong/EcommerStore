import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();

  //Gọi các thông số như categories, sort, phrase, ...filters từ query
  const { categories, sort, phrase, ...filters } = req.query;
  let [sortField, sortOrder] = (sort || "_id-desc").split("-");

  const productsQuery = {};
  if (categories) {
    productsQuery.category = categories.split(",");
  }
  ////tìm kiếm sản phẩm
  if (phrase) {
    productsQuery["$or"] = [
      { title: { $regex: phrase, $options: "i" } },
      { description: { $regex: phrase, $options: "i" } },
    ];
  }
  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((filterName) => {
      productsQuery["properties." + filterName] = filters[filterName];
    });
  }
  console.log(productsQuery);
  res.json(
    await Product.find(productsQuery, null, {
      sort: { [sortField]: sortOrder === "asc" ? 1 : -1 },
    })
  );

  if (req.method === "GET") {
    res.json(
      await Product.find({})
    );
  }
}

