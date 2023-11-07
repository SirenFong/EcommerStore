import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { subHours } from "date-fns";
import Linechart from "./Linechart";
import BestSellingProductsChart from "./BestSellingProductsChart";
export default function HomeStats() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setIsLoading(false);
    });
  }, []);

  function ordersTotal(orders) {
    let sum = 0;
    orders.forEach((order) => {
      const { line_items } = order;
      line_items.forEach((li) => {
        const lineSum = li.quantity * li.price_data.unit_amount;
        sum += lineSum;
      });
    });
    return sum;
  }

  if (isLoading) {
    return (
      <div className="my-4">
        <Spinner fullWidth={true} />
      </div>
    );
  }

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 12)
  );
  const ordersWeek = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 12 * 7)
  );
  const ordersMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 12 * 30)
  );

  //Lưu trữ ngày giờ hiện tại
  const currentDate = new Date();
  // Lấy tất cả đơn hàng trong 12 tháng gần đây
  //chứa tất cả các đơn hàng được tạo trong vòng 12 tháng gần đây.
  //Bằng cách so sánh ngày hiện tại trừ đi 12 tháng
  //Hợp lệ đơn hàng sẽ được giữ lại
  const ordersLast12Months = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    const twelveMonthsAgo = new Date(currentDate);
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 12);
    return orderDate >= twelveMonthsAgo;
  });

  return (
    <div>
      <h2>Biểu đồ</h2>
      <div className="chart-grid">
        <div className="tile">
          <h3 className="tile-header">Bán hàng trong năm</h3>
          <Linechart ordersLast12Months={ordersLast12Months} />
        </div>
        <div className="tile">
          <h3 className="tile-header">Bán hàng trong năm</h3>
          <BestSellingProductsChart ordersLast12Months={ordersLast12Months} />
        </div>
      </div>
      <h2>Đơn hàng</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Hôm nay</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-desc">
            {" "}
            Tổng {ordersToday.length} đơn ngày hôm nay
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tuần</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">
            {" "}
            Tổng {ordersWeek.length} đơn tuần này
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tháng</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">
            {" "}
            Tổng {ordersMonth.length} đơn tháng này
          </div>
        </div>
      </div>
      <h2>Doanh thu</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Hôm nay</h3>
          <div className="tile-number">
            {" "}
            {ordersTotal(ordersToday).toLocaleString()} VNĐ
          </div>
          <div className="tile-desc">{ordersToday.length} Tổng đơn hôm nay</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tuần</h3>
          <div className="tile-number">
            {" "}
            {ordersTotal(ordersWeek).toLocaleString()} VNĐ
          </div>
          <div className="tile-desc">{ordersWeek.length} Tổng đơn tuần</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tháng</h3>
          <div className="tile-number">
            {" "}
            {ordersTotal(ordersMonth).toLocaleString()} VNĐ
          </div>
          <div className="tile-desc">{ordersMonth.length} Tổng đơn tháng</div>
        </div>
      </div>
    </div>
  );
}
