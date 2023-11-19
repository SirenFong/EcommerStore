import { mongooseConnect } from "@component/lib/mongoose";
import { Review } from "@component/models/Review";
import { getSession } from "next-auth";

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json({ error: "Bạn vui lòng đăng nhập để đánh giá" });
    }

    const { title, description, stars, product } = req.body;
    const reviewData = {
      title,
      description,
      stars,
      product,
      user: session.user.id, // Add the user ID to the review data
    };

    const newReview = await Review.create(reviewData);
    return res.json(newReview);
  }

  if (req.method === "GET") {
    const { product } = req.query;
    const reviews = await Review.find({ product }, null, {
      sort: { createdAt: -1 },
    });
    return res.json(reviews);
  }
}
