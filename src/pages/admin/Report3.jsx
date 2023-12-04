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

const Report3 = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [reportData, setReportData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [today, setToday] = useState(new Date())

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  
  const fetchReportData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = `https://ah-project.my.id/api/customerJenisKamar?month=${selectedMonth}`;

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
  }, [authToken, selectedMonth]);

  const column = [
    {
      key: "no",
      label: "NO",
    },
    {
      key: "id_jenis_kamar",
      label: "ROOM TYPE",
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
  const chartLabels = reportData.map((item) => item.jenisKamars.jenis_kamar);
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
          text: "Bed Type",
        },
      },
      y: {
        type: "linear",
        stacked: false,
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount",
        },
        ticks: {
          callback: (value) => value,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Guest Stays Report",
      },
    },
    indexAxis: "x",
    barPercentage: 1,
    categoryPercentage: 0.8,
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px]">
        Guest Stays Report
      </div>

      <div className="flex justify-between">
        <p className="text-md mb-4 font-medium">Year : 2023</p>
        <select className="bg-[#1E2131] rounded-md text-white px-2 focus:outline-none cursor-pointer mb-2"
        value={selectedMonth}
        onChange={handleMonthChange}

>
        {months.map(month => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      </div>
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
                {item.jenisKamars.jenis_kamar}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.grup}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.personal}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="bg-white shadow-md rounded-md px-2 py-4 mb-8">
        <div className="flex justify-between ">
          <p className="font-semibold text-lg ml-4">Total: </p>
          <p className="mr-[14%] font-semibold text-lg">
            {totalSum}
          </p>
        </div>
      </div>
      <div className="mb-8 flex justify-center h-[500px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <p className="text-right pb-5">dicetak tanggal {formatDate(today)}</p>
    </section>
  );
};

export default Report3;
