import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { subHours } from "date-fns";
import Linechart from "./Linechart";
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

  // function ordersTotal(orders) {
  //   let sum = 0; //Đặt tổng bằng 0
  //   orders.forEach((order) => {
  //     //Hàm forEach sẽ duyệt qua orders và lấy ra line_items
  //     const { line_items } = order;
  //     line_items.forEach((li) => {
  //       const lineSum = li.quantity * li.price_data.unit_amount; // lấy số lượng đơn đặt * với giá tiền trong data
  //       sum += lineSum; // rồi gán vào hàm tổng đã tạo = với lineSum đã tính theo mức tăng dần
  //     });
  //   });
  //   console.log({ orders });
  //   return new Intl.NumberFormat("sv-SE").format(sum);
  // }

  // const calculateSalesForecast = (orders) => {
  //   const currentMonthOrders = orders.filter(
  //     (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30)
  //   );
  //   const forecast =
  //     currentMonthOrders.length + currentMonthOrders.length * 0.2;
  //   return forecast;
  // };
  const calculateSalesForecast = (ordersMonth) => {
    const currentMonthOrders = ordersMonth.length;
    const forecast = currentMonthOrders + currentMonthOrders * 0.1; //Giả sử tăng 10%
    return Math.round(forecast);
  };

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
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 7)
  );
  const ordersMonth = orders.filter(
    (o) => new Date(o.createdAt) > subHours(new Date(), 24 * 30)
  );

  return (
    <div>
      <h2>Đơn hàng</h2>
      <div className="chart-grid">

        <div className="tile">
          <h3 className="tile-header">Tuần</h3>
          <Linechart />
        </div>


      </div>
      <h2>Đơn hàng</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Hôm nay</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-desc">{ordersToday.length} Tổng đơn ngày</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tuần</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">{ordersWeek.length} Tổng đơn tuần</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Tháng</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">{ordersMonth.length} Tổng đơn tháng</div>
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

      <h2>Dự báo doanh thu</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Dự báo tăng trưởng</h3>
          <div className="tile-number">
            {" "}
            Tăng {calculateSalesForecast(ordersMonth)} %
          </div>
        </div>
        <div className="tile">
          <h3 className="tile-header">Dự báo tiền tháng sau</h3>
          <div className="tile-number">
            {new Intl.NumberFormat("de-DE").format(
              ordersTotal(ordersMonth) +
              (ordersTotal(ordersMonth) *
                calculateSalesForecast(ordersMonth)) /
              100 //Giả sử tăng 10% so với tháng trước
            )}{" "}
            VNĐ
          </div>
        </div>
      </div>
    </div>
    //"Sales Forecast for next month"
    //sẽ được tính toán và hiển thị dự đoán doanh thu
    //cho tháng kế tiếp dựa trên số lượng đơn hàng trong tháng
    //hiện tại và giả thiết tăng 20%.
  );
}
