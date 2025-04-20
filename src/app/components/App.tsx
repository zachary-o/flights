"use client";

import { mockData } from "@/mockData";
import type { PaginationProps } from "antd";
import { DatePicker, Pagination } from "antd";
import { useEffect, useState } from "react";
import Flight from "./Flight";

import { FlightApiResponse, FlightData } from "./types";

const App = () => {
  const [flights, setFlights] = useState<FlightApiResponse>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); 
  const [paginatedFlights, setPaginatedFlights] = useState<FlightData[]>([]);
  //   const [time, setTime] = useState({
  //     timeFrom: "",
  //     dateFrom: "",
  //     timeTo: "",
  //     dateTo: "",
  //   });

  const onChange = (date: unknown, dateString: unknown) => {
    console.log(date, dateString);
  };

  const onPaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const fetchData = async () => {
    try {
      //   const response = await fetch(
      //     `${process.env.NEXT_PUBLIC_API_URL}access_key=${process.env.NEXT_PUBLIC_SECRET_API_KEY}`
      //   );
      //   const data = await response.json();
      setFlights(mockData);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log("flights", flights);

  useEffect(() => {
    if (flights) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setPaginatedFlights(flights.data.slice(startIndex, endIndex));
    }
  }, [flights, currentPage, pageSize]);
  
  return (
    <>
      <header className="w-full h-20 p-2 border-b border-b-violet-500">
        <div className="flex justify-between mx-auto max-w-screen-md">
          <DatePicker.RangePicker onChange={onChange} />
          <DatePicker.TimePicker placeholder="Time from" />
          <DatePicker.TimePicker placeholder="Time to" />
        </div>
      </header>
      <div className="flex flex-col justify-start max-w-screen-md">
        {flights &&
          flights.data.length > 0 &&
          paginatedFlights.map((flight: FlightData) => (
            <Flight
              key={`${flight.flight.number}-${flight.flight.codeshared.flight_iata}-${flight.flight.codeshared.flight_icao}`}
              {...flight}
            />
          ))}
      </div>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={flights?.data.length || 0}
        onChange={onPaginationChange}
        showSizeChanger
      />
    </>
  );
};

export default App;
