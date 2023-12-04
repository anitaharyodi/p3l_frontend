import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Report4 = () => {
  const authToken = localStorage.getItem("tokenPegawai");
  const [reportData, setReportData] = useState([]);

  const [today, setToday] = useState(new Date())

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const formatCurrency = (number) => {
    return `Rp ${new Intl.NumberFormat("id-ID").format(number)}`;
  };

  const fetchReportData = () => {
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const apiURL = "https://ah-project.my.id/api/topCustomer";

    axios
      .get(apiURL, axiosConfig)
      .then((response) => {
        setReportData(response.data.top_customers);
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
      key: "nama",
      label: "CUSTOMER NAME",
    },
    {
      key: "total_reservations",
      label: "TOTAL RESERVATIONS",
    },
    {
      key: "total_payment",
      label: "TOTAL PAYMENT",
    },
  ];

  return (
    <section>
      <div className="h2 text-accent p-2 rounded-lg font-semibold text-[30px] uppercase font-tertiary tracking-[2px]">
      5 customers with the most reservations
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
                {item.nama}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {item.reservations[0].total_reservations}
              </TableCell>
              <TableCell className="font-medium text-gray-600">
                {formatCurrency(item.reservations[0].total_payment)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-right py-5">dicetak tanggal {formatDate(today)}</p>
    </section>
  )
}

export default Report4