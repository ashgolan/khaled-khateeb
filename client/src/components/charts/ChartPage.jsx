import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { chart as ChartJS } from "chart.js/auto";
import { getDataByTotals } from "../../utils/getDataByTotals";
// import ChartDataLabels from "chartjs-plugin-datalabels";
function ChartPage({ report, setShowChart, showChart, fetchingData }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "סכום",
        data: [],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FFC107",
          "#FF5722",
          "#E91E63",
          "#673AB7",
          "#00BCD4",
          "#FF9800",
          "#8BC34A",
          "#795548",
          "#9C27B0",
          "#607D8B",
        ],
        borderWidth: 1,
      },
    ],
  });
  const chartOptions = {
    // plugins: {
    //   datalabels: {
    //     color: "#ffffff",
    //     formatter: function (value) {
    //       return Math.round(value);
    //     },
    //   },
    // },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const getChart = (data) => {
    if (report?.clientName) {
      data = data.filter((item) => item.clientName === report?.clientName);
    }
    if (report?.strains) {
      data = data.filter((item) => item.strains === report?.strains);
    }
    if (report?.month?.value && report?.year) {
      setChartData({
        labels: Object?.keys(
          getDataByTotals(data)[report?.year]?.find(
            (item) => item.month === report?.month?.value
          )?.dayInTheMonth || []
        ),
        datasets: [
          {
            ...chartData.datasets[0],
            data: Object?.values(
              getDataByTotals(data)[report?.year]?.find(
                (item) => item.month === report?.month?.value
              )?.dayInTheMonth || []
            ),
          },
        ],
      });
    } else if (report?.year) {
      setChartData({
        labels: getDataByTotals(data)[report?.year]?.map((item) => item.month),
        datasets: [
          {
            ...chartData.datasets[0],
            data: getDataByTotals(data)[report?.year]?.map(
              (item) => item.totalAmount
            ),
          },
        ],
      });
    }
  };
  // const showChartHandler = () => {
  //   report?.type === "expensesCharts" || report?.type === "/expenses"
  //     ? getChart(fetchingData?.expensesData)
  //     : report?.type === "sleevesBidsCharts" || report?.type === "/sleevesBids"
  //     ? getChart(fetchingData?.sleevesBidsData)
  //     : report?.type === "workersExpensesCharts" ||
  //       report?.type === "/workersExpenses"
  //     ? getChart(fetchingData?.workersExpensesData)
  //     : getChart(fetchingData?.salesData);
  //   setShowChart(true);
  // };
  const dataMap = {
    "expensesCharts": fetchingData?.expensesData,
    "/expenses": fetchingData?.expensesData,
    "/personalProductExpenses": fetchingData?.personalProductExpensesData,
    "personalProductExpensesCharts": fetchingData?.personalProductExpensesData,
    "/personalWorkers": fetchingData?.personalWorkersData,
    "personalWorkersCharts": fetchingData?.personalWorkersData,
    "/personalSales": fetchingData?.personalSalesData,
    "personalSalesCharts": fetchingData?.personalSalesData,
    "/personalRkrExpenses": fetchingData?.personalRkrExpensesData,
    "personalRkrExpensesCharts": fetchingData?.personalRkrExpensesData,
    "/personalInvestments": fetchingData?.personalInvestmentsData,
    "personalInvestmentsCharts": fetchingData?.personalInvestmentsData,
    "sleevesBidsCharts": fetchingData?.sleevesBidsData,
    "/sleevesBids": fetchingData?.sleevesBidsData,
    "workersExpensesCharts": fetchingData?.workersExpensesData,
    "/workersExpenses": fetchingData?.workersExpensesData,
  };
  
  const showChartHandler = () => {
    const chartData = dataMap[report?.type] || fetchingData?.salesData;
    getChart(chartData);
    setShowChart(true);
  };
  return (
    <div className="chart-container">
      {report?.year && <button onClick={showChartHandler}>הצג מידע</button>}
      {showChart && <Bar data={chartData} options={chartOptions} />}
    </div>
  );
}

export default ChartPage;
