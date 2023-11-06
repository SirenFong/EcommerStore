import { useEffect } from "react";
import { Chart } from "chart.js";

export default function Linechart({ ordersLast12Months }) {
  useEffect(() => {
    const monthlySales = [];
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    for (let i = 0; i < 12; i++) {
      const salesOfMonth = ordersLast12Months.filter(
        (order) => new Date(order.createdAt).getMonth() === i
      );
      console.log(salesOfMonth);
      const totalSales = salesOfMonth.reduce((sum, order) => {
        const lineItems = order.line_items;
        const lineSum = lineItems.reduce((subSum, li) => {
          return subSum + li.quantity * li.price_data.unit_amount;
        }, 0);

        return sum + lineSum;
      }, 0);

      monthlySales.push(totalSales);
    }

    const ctx = document.getElementById("myChart").getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            data: monthlySales,
            label: "Doanh thu",
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderWidth: 2,
          },
        ],
      },
    });
  }, [ordersLast12Months]);

  return (
    <>
      {/* Bar chart */}
      <h1>Biểu đồ doanh thu từng tháng</h1>
      <div>
        <div>
          <canvas id="myChart"></canvas>
        </div>
      </div>
    </>
  );
}
