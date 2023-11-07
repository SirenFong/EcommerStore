import { useEffect } from "react";
import { Chart } from "chart.js";

export default function BestSellingProductsChart({ ordersLast12Months }) {
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

      const productsData = {};

      salesOfMonth.forEach((order) => {
        order.line_items.forEach((item) => {
          const productId = item.product_id;
          const productName = item.name;
          const productQuantity = item.quantity;

          if (productsData[productId]) {
            productsData[productId].totalQuantity += productQuantity;
          } else {
            productsData[productId] = {
              name: productName,
              totalQuantity: productQuantity,
            };
          }
        });
      });

      const sortedProducts = Object.values(productsData).sort(
        (a, b) => b.totalQuantity - a.totalQuantity
      );

      const topProduct = sortedProducts[0];

      monthlySales.push(topProduct ? topProduct.totalQuantity : 0);
    }

    const ctx = document
      .getElementById("bestSellingProductsChart")
      .getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            data: monthlySales,
            label: "Số lượng sản phẩm bán ra",
            backgroundColor: colors,
            borderWidth: 2,
          },
        ],
      },
    });
  }, [ordersLast12Months]);

  return (
    <>
      <h1>Biểu đồ số lượng sản phẩm bán ra trong từng tháng</h1>
      <div>
        <canvas id="bestSellingProductsChart"></canvas>
      </div>
    </>
  );
}
