import { useEffect, useState } from "react";
import { Chart } from "chart.js";

export default function Linechart({ ordersLast12Months }) {
  useEffect(() => {
    // Biểu đồ thứ nhất (doanh thu theo tháng)
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
    const colors = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
    ];

    {
      /**Đầu tiên, trong vòng lặp for đầu tiên, 
  code tính tổng doanh thu từng tháng (monthlySales). 
  Đối với mỗi tháng, nó lọc ra các đơn hàng (ordersLast12Months) 
  tương ứng và tính tổng doanh thu 
  của từng đơn hàng bằng cách nhân số lượng (quantity) 
  với giá (price_data.unit_amount) của từng sản phẩm và sau đó cộng tổng lên. */
    }

    for (let i = 0; i < 12; i++) {
      const salesOfMonth = ordersLast12Months.filter(
        (order) => new Date(order.createdAt).getMonth() === i
      );

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
            label: "Tổng doanh thu",
            backgroundColor: colors,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    });

    // Biểu đồ thứ hai (doanh thu dự báo theo quý)
    const quarterlySales = [];
    const quarters = ["Q1", "Q2", "Q3", "Q4"];

    for (let i = 0; i < 4; i++) {
      const salesOfQuarter = monthlySales.slice(i * 3, (i + 1) * 3);

      const totalQuarterSales = salesOfQuarter.reduce(
        (sum, quarter) => sum + quarter,
        0
      );

      const growthRate =
        i > 0
          ? (totalQuarterSales - quarterlySales[i - 1]) / quarterlySales[i - 1]
          : 0;

      const nextQuarterForecast = Math.round(
        totalQuarterSales + totalQuarterSales * growthRate
      );

      quarterlySales.push(nextQuarterForecast);
    }

    const ctx2 = document.getElementById("myChart2").getContext("2d");

    new Chart(ctx2, {
      type: "line",
      data: {
        labels: quarters,
        datasets: [
          {
            data: quarterlySales,
            label: "Doanh thu dự báo (VNĐ)",
            backgroundColor: colors,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
    });
  }, [ordersLast12Months]);

  return (
    <>
      {/* Bar chart thứ nhất (doanh thu theo tháng) */}
      <h1>Biểu đồ doanh thu theo tháng</h1>
      <div>
        <div>
          <canvas id="myChart"></canvas>
        </div>
      </div>

      {/* Bar chart thứ hai (doanh thu dự báo theo quý) */}
      <h1>Biểu đồ doanh thu dự báo theo quý</h1>
      <div>
        <div>
          <canvas id="myChart2"></canvas>
        </div>
      </div>
    </>
  );
}
