import { useEffect } from "react";
import { Chart } from "chart.js";

export default function Doughnutchart() {
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



        const ctx = document.getElementById("myChart1").getContext("2d");
        const data = {
            labels: [
                'Red',
                'Blue',
                'Yellow'
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        };
        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: [
                    'Red',
                    'Blue',
                    'Yellow'
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            },
        });
    }, []);

    return (
        <>
            {/* Bar chart */}
            <h1>Biểu đồ doanh thu từng loại sản phẩm trong tháng này</h1>
            <div>
                <div>
                    <canvas id="myChart1"></canvas>
                </div>
            </div>
        </>
    );
}
