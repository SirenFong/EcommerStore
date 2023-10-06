import { mongooseConnect } from "@component/lib/mongoose";

//2 cái import đại diện cho models trong cơ sở dữ liệu
import { Order } from "@component/models/Order";
import { Product } from "@component/models/Product";

const stripe = require("stripe")(process.env.STRIPE_SK);

//phương thức POST giúp bảo mật dữ liệu được truyền đi
export default async function handle(req, res) {
  if (req.method !== "POST") {
    res.json("should be a POST request");
    return;
  }
  //Hàm nhận các thông tin truyền vào từ form điền ở trang thanh toán
  const { name, phone, email, postalcode, address, cartProducts } = req.body;
  // await mongooseConnect();

  //Lấy thông tin sản phẩm từ cơ sở dữ liệu sau đó hiện danh sách sản phẩm và
  //chuyển thành uniqueIds để không có sản phẩm trùng lặp khi thêm nhiều sản phẩm
  await mongooseConnect();
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });

  //Tạo một mảng các danh sách dựa trên sản phẩm trong cơ sở dữ liệu và số lượng
  //sản phẩm trong giỏ hàng
  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productsIds.filter((id) => id === productId)?.length || 0;

    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: "vnd",
          product_data: { name: productInfo.title },
          unit_amount: productInfo.price,
        },
      });
    }
  }

  //Tạo một đơn hàng mới trong
  //cơ sở dữ liệu với thông tin của người mua và danh sách các mặt hàng (line_items):
  const orderDoc = await Order.create({
    line_items,
    name,
    phone,
    email,
    postalcode,
    address,
    paid: false,
  });

  //Tạo một session chuyển đến trang thanh toán với Stripe dựa trên thông tin đơn hàng:
  //Lưu thông tin email của khách hàng đã điền
  //link thành công và thất bại sẽ được hiển thị khi thanh toán
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=1",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=1",
    metadata: { orderId: orderDoc._id.toString() },
  });

  //Trả về URL đến trang thanh toán của Stripe cho client:
  res.json({
    url: session.url,
  });
}
