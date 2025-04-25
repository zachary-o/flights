"use client"

import { mockData } from "@/mockData"
import type { PaginationProps } from "antd"
import { Button, TimePicker } from "antd"

import { DatePicker, Pagination } from "antd"
import { useEffect, useState } from "react"
import Flight from "./Flight"

import dayjs, { Dayjs } from "dayjs"
import utc from "dayjs/plugin/utc"
import {
  FlightApiResponse,
  MappedFlightData,
  Pagination as PaginationType,
} from "./types"
dayjs.extend(utc)

const App = () => {
  const format = "HH:mm"

  const [flights, setFlights] = useState<FlightApiResponse | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [paginatedFlights, setPaginatedFlights] = useState<MappedFlightData[]>(
    []
  )
  const [time, setTime] = useState({
    timeFrom: "",
    dateFrom: "",
    timeTo: "",
    dateTo: "",
  })

  const onChangeDates = (
    date: [Dayjs | null, Dayjs | null] | null,
    dateString: [string, string]
  ) => {
    const utcStart = date?.[0]?.utc().format()
    const utcEnd = date?.[1]?.utc().format()

    setTime((prev) => {
      return {
        ...prev,
        dateFrom: utcStart || "",
        dateTo: utcEnd || "",
      }
    })
  }

  const onChangeTime = (
    time: [Dayjs | null, Dayjs | null] | null,
    timeString: [string, string]
  ) => {
    const timeFrom = timeString[0]
    const timeTo = timeString[1]

    setTime((prev) => {
      return {
        ...prev,
        timeFrom: timeFrom || "",
        timeTo: timeTo || "",
      }
    })
  }

  const onPaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  }

  const fetchData = async () => {
    try {
      //   const response = await fetch(
      //     `${process.env.NEXT_PUBLIC_API_URL}access_key=${process.env.NEXT_PUBLIC_SECRET_API_KEY}`
      //   );
      //   const data = await response.json();
      const mappedFlights: MappedFlightData[] = mockData.data.map(
        (flight: any) => {
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
          }
        }
      )

      const pagination: PaginationType = {
        limit: 100,
        offset: 0,
        count: mappedFlights.length,
        total: mappedFlights.length,
      }
      setFlights({
        data: mappedFlights,
        pagination,
      })
    } catch (error) {
      console.log("error", error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  // console.log("flights", flights)
  // console.log('time', time)

  useEffect(() => {
    if (flights) {
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      const sliced = flights.data.slice(startIndex, endIndex)
      setPaginatedFlights(sliced as MappedFlightData[])
    }
  }, [flights, currentPage, pageSize])
  // {timeFrom: '01:00', dateFrom: '2025-04-19T17:00:00Z', timeTo: '07:30', dateTo: '2025-04-25T17:00:00Z'}

  const handleFilter = () => {
    if (!flights) return
  
    const { dateFrom, dateTo, timeFrom, timeTo } = time
  
    const filtered = flights.data.filter((flight) => {
      const departure = dayjs.utc(flight.departureDate)
  
      const fromDateTime =
        dateFrom && timeFrom
          ? dayjs.utc(`${dayjs(dateFrom).format("YYYY-MM-DD")}T${timeFrom}`)
          : dateFrom
          ? dayjs.utc(dateFrom)
          : null
  
      const toDateTime =
        dateTo && timeTo
          ? dayjs.utc(`${dayjs(dateTo).format("YYYY-MM-DD")}T${timeTo}`)
          : dateTo
          ? dayjs.utc(dateTo)
          : null
  
      const isAfterStart = fromDateTime
        ? departure.isAfter(fromDateTime) || departure.isSame(fromDateTime)
        : true
      const isBeforeEnd = toDateTime
        ? departure.isBefore(toDateTime) || departure.isSame(toDateTime)
        : true
  
      return isAfterStart && isBeforeEnd
    })
  
    const newFlights = { ...flights, data: filtered }
    console.log("newFlights", newFlights)
    setFlights(newFlights)
    setCurrentPage(1)
    setPaginatedFlights(newFlights.data.slice(0, pageSize))
  }
  

  return (
    <>
      <header className="w-full h-20 p-2 border-b border-b-violet-500">
        <div className="flex justify-between mx-auto max-w-screen-md">
          <DatePicker.RangePicker onChange={onChangeDates} />
          <TimePicker.RangePicker
            format={format}
            onChange={onChangeTime}
            minuteStep={5}
          />
          <Button color="primary" variant="filled" onClick={handleFilter}>
            Search
          </Button>
        </div>
      </header>
      <div className="w-full p-2 flex flex-col gap-4 justify-start max-w-screen-md">
        {flights &&
          flights.data.length > 0 &&
          paginatedFlights.map((flight: MappedFlightData) => (
            <Flight key={`${flight.flightNumber}`} {...flight} />
          ))}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={flights?.data.length || 0}
          onChange={onPaginationChange}
          showSizeChanger
        />
      </div>
    </>
  )
}

export default App
