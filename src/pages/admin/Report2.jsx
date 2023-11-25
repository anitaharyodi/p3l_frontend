import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Report2 = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [reportData, setReportData] = useState([]);

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  const fetchReportData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/totalPendapatan";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setReportData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching report 1 data: ", error);
      });
  };

  useEffect(() => {
    fetchReportData();
  }, [authToken]);

  const column = [
    {
      key: "no",
      label: "NO",
    },
    {
      key: "month",
      label: "MONTH",
    },
    {
      key: "grup",
      label: "GROUP",
    },
    {
      key: "personal",
      label: "PERSONAL",
    },
    {
      key: "total",
      label: "TOTAL",
    },
  ];

  const totalSum = reportData.reduce((sum, item) => sum + item.total, 0);

  // For Graph
  const chartLabels = reportData.map((item) => item.bulan);
  const grupData = reportData.map((item) => item.grup);
  const personalData = reportData.map((item) => item.personal);
  const totalData = reportData.map((item) => item.total);

  // Chart data
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Group",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: grupData,
      },
      {
        label: "Personal",
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        data: personalData,
      },
      {
        label: "Total",
        backgroundColor: "rgba(255,206,86,0.4)",
        borderColor: "rgba(255,206,86,1)",
        borderWidth: 1,
        data: totalData,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    scales: {
      x: {
        type: "category",
        stacked: false,
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        type: "linear",
        stacked: false,
        beginAtZero: true,
        title: {
          display: true,
          text: "Income (in IDR)",
        },
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Income Report",
      },
    },
    indexAxis: "x",
    barPercentage: 1,
    categoryPercentage: 0.8,
  };

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px]">
        Monthly Income Report
      </div>

      <p className="text-md mb-4 font-medium">Year : 2023</p>
      <Table aria-label="Report 1">
        <TableHeader columns={column}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {reportData.map((item, i) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-gray-600">
                {i + 1}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.bulan}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.grup !== 0 ? formatCurrency(item.grup) : "-"}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.personal !== 0 ? formatCurrency(item.personal) : "-"}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.total !== 0 ? formatCurrency(item.total) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="bg-white shadow-md rounded-md px-2 py-4 mb-8">
        <div className="flex justify-between ">
          <p className="font-semibold text-lg ml-4">Total: </p>
          <p className="mr-[14%] font-semibold text-lg">
            {formatCurrency(totalSum)}
          </p>
        </div>
      </div>
      <div className="mb-8 flex justify-center h-[500px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </section>
  );
};

export default Report2;
