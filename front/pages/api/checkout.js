import { mongooseConnect } from "@component/lib/mongoose";
//2 cái import đại diện cho models trong cơ sở dữ liệu
import { Order } from "@component/models/Order";
import { Product } from "@component/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PaymentMethod } from "@component/models/PaymentMethod";
import { Service } from "@component/models/Service";

const stripe = require("stripe")(process.env.STRIPE_SK);

//phương thức POST giúp bảo mật dữ liệu được truyền đi
export default async function handle(req, res) {
  if (req.method !== "POST") {
    res.json("should be a POST request");
    return;
  }
  //Hàm nhận các thông tin truyền vào từ form điền ở trang thanh toán
  const {
    name,
    phone,
    email,
    postalcode,
    address,
    paymentmethod,
    cartProducts,
  } = req.body;
  // await mongooseConnect();

  //Lấy thông tin sản phẩm từ cơ sở dữ liệu sau đó hiện danh sách sản phẩm và
  //chuyển thành uniqueIds để không có sản phẩm trùng lặp khi thêm nhiều sản phẩm
  await mongooseConnect();
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });
  const paymentInfos = await PaymentMethod.findById({ _id: paymentmethod });
  ///

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
          currency: "VND",
          product_data: { id: productInfo._id, name: productInfo.title },
          unit_amount: productInfo.price,
        },
      });
    }
  }

  const session = await getServerSession(req, res, authOptions);
  ///
  ////Hfàm tạo mã sản phẩm ngẫu nhiên
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  for (let i = 0; i < 8; i++) {
    randomId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  //Tạo một đơn hàng mới trong
  //cơ sở dữ liệu với thông tin của người mua và danh sách các mặt hàng (line_items):
  const orderDoc = await Order.create({
    _id: randomId,
    line_items,
    name,
    phone,
    email,
    postalcode,
    address,
    paymentmethods: {
      id: paymentInfos._id,
      name: paymentInfos.paymentName,
      key: paymentInfos.paymentKey,
    },
    status: 1,
    paid: false,
    userEmail: session?.user?.email,
  });
  const shippingFeeSetting = await Service.findOne({ name: "shippingFee" });
  const shippingFeeCents = parseInt(shippingFeeSetting.value || "0");
  const servicerFee = await Service.findOne({ name: "shippingFee" });
  const servicerFeeCents = parseInt(servicerFee.value || "0");
  //session theo thông tin tài khoản đang đăng nhập
  //Nếu không có session thì sẽ không thanh toán được
  //Lưu thông tin email của khách hàng đã điền
  //link thành công và thất bại sẽ được hiển thị khi thanh toán
  //session stripe
  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=1",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=1",
    metadata: { orderId: orderDoc._id.toString() },
    allow_promotion_codes: true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "shipping fee",
          type: "fixed_amount",
          fixed_amount: { amount: shippingFeeCents, currency: "VND" },
        },
        shipping_rate_data: {
          display_name: "service fee",
          type: "fixed_amount",
          fixed_amount: { amount: servicerFeeCents, currency: "VND" },
        },
      },
    ],
  });

  //Trả về URL đến trang thanh toán của Stripe cho client:
  res.json({
    url: stripeSession.url,
  });
}
