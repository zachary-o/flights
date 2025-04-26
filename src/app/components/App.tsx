"use client";

import { LoadingOutlined } from "@ant-design/icons";
import type { PaginationProps } from "antd";
import { Button, DatePicker, Flex, Pagination, Spin, TimePicker } from "antd";
import { useEffect, useState } from "react";
import Flight from "./Flight";

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  FlightApiResponse,
  FlightData,
  MappedFlightData,
  Pagination as PaginationType,
} from "./types";
dayjs.extend(utc);

const App = () => {
  const format = "HH:mm";

  const [isLoading, setIsLoading] = useState(false);
  const [originalFlights, setOriginalFlights] = useState<MappedFlightData[]>(
    []
  );
  const [flights, setFlights] = useState<FlightApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [paginatedFlights, setPaginatedFlights] = useState<MappedFlightData[]>(
    []
  );
  const [time, setTime] = useState({
    timeFrom: "",
    dateFrom: "",
    timeTo: "",
    dateTo: "",
  });

  const onChangeDates = (date: [Dayjs | null, Dayjs | null] | null) => {
    const utcStart = date?.[0]?.utc().format();
    const utcEnd = date?.[1]?.utc().format();

    setTime((prev) => {
      return {
        ...prev,
        dateFrom: utcStart || "",
        dateTo: utcEnd || "",
      };
    });
  };

  const onChangeTime = (
    time: [Dayjs | null, Dayjs | null] | null,
    timeString: [string, string]
  ) => {
    const timeFrom = timeString[0];
    const timeTo = timeString[1];

    setTime((prev) => {
      return {
        ...prev,
        timeFrom: timeFrom || "",
        timeTo: timeTo || "",
      };
    });
  };

  const fetchData = async (params: { offset?: number } = {}) => {
    setIsLoading(true);
    try {
      const { offset = 0 } = params;
      const queryParams = new URLSearchParams({
        access_key: process.env.NEXT_PUBLIC_SECRET_API_KEY || "",
        limit: "100",
        offset: offset.toString(),
      });

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }?${queryParams.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      const mappedFlights: MappedFlightData[] = data.data.map(
        (flight: FlightData) => {
          return {
            flightStatus: flight.flight_status,
            departureTime: flight.departure.scheduled,
            departureDate: flight.departure.scheduled,
            departureAirport: flight.departure.airport,
            departureTerminal: flight.departure.terminal,
            departureGate: flight.departure.gate,
            arrivalTime: flight.arrival.scheduled,
            arrivalDate: flight.arrival.scheduled,
            arrivalAirport: flight.arrival.airport,
            arrivalTerminal: flight.arrival.terminal,
            arrivalGate: flight.arrival.gate,
            airline: flight.airline.name,
            flightNumber: flight.flight.number,
          };
        }
      );
      const pagination: PaginationType = {
        limit: data.pagination.limit,
        offset: data.pagination.offset,
        count: data.pagination.count,
        total: data.pagination.total,
      };
      setFlights({
        data: mappedFlights,
        pagination,
      });
      setOriginalFlights(mappedFlights);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (flights) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const sliced = flights.data.slice(startIndex, endIndex);
      setPaginatedFlights(sliced as MappedFlightData[]);
    }
  }, [flights, currentPage, pageSize]);

  const onPaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);

    const offset = (page - 1) * pageSize;
    fetchData({ offset });
  };

  const handleRestFilters = () => {
    setTime({
      timeFrom: "",
      dateFrom: "",
      timeTo: "",
      dateTo: "",
    });
    setFlights((prev) => ({
      ...prev!,
      data: originalFlights,
    }));
    setPaginatedFlights(originalFlights.slice(0, pageSize));
    setCurrentPage(1);
  };

  const handleFilter = () => {
    if (!flights) return;

    const { dateFrom, dateTo, timeFrom, timeTo } = time;

    const filtered = flights.data.filter((flight) => {
      const departure = dayjs.utc(flight.departureDate);

      const fromDateTime =
        dateFrom && timeFrom
          ? dayjs.utc(`${dayjs(dateFrom).format("YYYY-MM-DD")}T${timeFrom}`)
          : dateFrom
          ? dayjs.utc(dateFrom)
          : null;

      const toDateTime =
        dateTo && timeTo
          ? dayjs.utc(`${dayjs(dateTo).format("YYYY-MM-DD")}T${timeTo}`)
          : dateTo
          ? dayjs.utc(dateTo)
          : null;

      const isAfterStart = fromDateTime
        ? departure.isAfter(fromDateTime) || departure.isSame(fromDateTime)
        : true;
      const isBeforeEnd = toDateTime
        ? departure.isBefore(toDateTime) || departure.isSame(toDateTime)
        : true;

      return isAfterStart && isBeforeEnd;
    });

    const newFlights = { ...flights, data: filtered };
    setFlights(newFlights);
    setCurrentPage(1);
    setPaginatedFlights(newFlights.data.slice(0, pageSize));
  };

  return (
    <>
      <header className="w-full mx-auto h-20 p-2 flex items-center justify-center border-b border-b-violet-500 max-w-screen-2xl">
        <div className="w-full flex flex-row gap-4 ">
          <DatePicker.RangePicker
            value={[
              time.dateFrom ? dayjs(time.dateFrom) : null,
              time.dateTo ? dayjs(time.dateTo) : null,
            ]}
            onChange={onChangeDates}
          />
          <TimePicker.RangePicker
            minuteStep={5}
            format={format}
            value={[
              time.timeFrom ? dayjs(time.timeFrom, format) : null,
              time.timeTo ? dayjs(time.timeTo, format) : null,
            ]}
            onChange={onChangeTime}
          />
          <Button color="primary" variant="filled" onClick={handleFilter}>
            Search
          </Button>
          {(time.dateFrom !== "" ||
            time.dateTo !== "" ||
            time.timeFrom !== "" ||
            time.timeTo !== "") && (
            <Button color="danger" variant="text" onClick={handleRestFilters}>
              Reset
            </Button>
          )}
        </div>
      </header>
      <div className="w-full mx-auto p-2 flex flex-col gap-4 max-w-screen-2xl">
        {!isLoading && (
          <>
            {flights && paginatedFlights.length > 0 ? (
              <>
                {paginatedFlights.map((flight: MappedFlightData) => (
                  <Flight key={flight.flightNumber} {...flight} />
                ))}
                <Pagination
                  className="self-end"
                  current={currentPage}
                  pageSize={pageSize}
                  total={flights?.data.length || 0}
                  onChange={onPaginationChange}
                  showSizeChanger
                />
              </>
            ) : (
              <div className="text-center text-gray-500 text-xl mt-10">
                No flights found.
              </div>
            )}
          </>
        )}
      </div>

      <Flex align="center" gap="middle">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          spinning={isLoading}
          fullscreen
        />
      </Flex>
    </>
  );
};

export default App;
