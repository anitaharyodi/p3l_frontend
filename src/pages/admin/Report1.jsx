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

const Report1 = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [reportData, setReportData] = useState([]);

  const fetchReportData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "http://localhost:8000/api/customersPerMonth";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setReportData(response.data.customers_per_month);
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
      key: "total",
      label: "AMOUNT",
    },
  ];

  const totalSum = reportData.reduce((sum, item) => sum + item.total, 0);

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px]">
        New Customer Reports per Month
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
                {item.month}
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
          <p className="mr-[33%] font-semibold text-lg">{totalSum}</p>
        </div>
      </div>
    </section>
  );
};

export default Report1;
