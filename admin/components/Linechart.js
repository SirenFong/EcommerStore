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
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            data: monthlySales,
            label: "Doanh thu",
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: colors,
            borderWidth: 2,
          },
        ],
      },
    });

    // Biểu đồ thứ hai (doanh thu dự báo theo quý)
    const quarterlySales = [0, 0, 0, 0];

    for (let i = 0; i < 12; i++) {
      const quarterIndex = Math.floor(i / 3);
      quarterlySales[quarterIndex] += monthlySales[i];
    }

    const forecastedSales = quarterlySales.map((quarter, index) => {
      // Dự báo doanh thu cho quý tiếp theo dựa trên 3 quý trước đó
      if (index >= 3) {
        const previousQuarters = quarterlySales.slice(index - 3, index);
        const average = previousQuarters.reduce((sum, q) => sum + q, 0) / 3;
        return Math.round(average); // Làm tròn giá trị
      }
      return Math.round(quarter); // Làm tròn giá trị
    });

    const ctx2 = document.getElementById("myChart2").getContext("2d");

    new Chart(ctx2, {
      type: "pie",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            data: forecastedSales,
            label: "Doanh thu dự báo (VNĐ)",
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: colors,
            borderWidth: 2,
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
