import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import Image from "next/image"
import { MappedFlightData } from "./types"

dayjs.extend(utc)

const Flight = (props: MappedFlightData) => {
  const {
    flightStatus,
    departureTime,
    departureDate,
    departureAirport,
    departureTerminal = "",
    departureGate = "",
    arrivalTime,
    arrivalDate,
    arrivalAirport,
    arrivalTerminal = "",
    arrivalGate = "",
    airline,
    flightNumber,
  } = props

  const departure = dayjs.utc(departureTime)
  const arrival = dayjs.utc(arrivalTime)
  
  const durationInMinutes = arrival.diff(departure, "minute")
  const hours = Math.floor(durationInMinutes / 60)
  const minutes = durationInMinutes % 60
  
  return (
    <div className="w-full p-2 border border-gray-500 rounded-sm flex flex-row items-center gap-2">
      {/* DEPARTURE */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
        <p className="font-medium text-ellipsis whitespace-nowrap w-full text-center">
          {dayjs(departureDate).format("MMMM D, YYYY")} - Departure
        </p>
        <h2 className="text-ellipsis whitespace-nowrap w-full text-center">
          {dayjs.utc(departureTime, "HH:mm:ssZ").format("HH:mm")}
        </h2>
        <p className="text-ellipsis whitespace-nowrap w-full text-center">
          {departureAirport}
        </p>
        <p className="text-ellipsis whitespace-nowrap w-full text-center">
          Terminal: {departureTerminal}, Gate: {departureGate}
        </p>
      </div>

      <div className="flex-1 min-w-0 h-[1px] border border-gray-300"></div>

      <div className="relative">
        <Image src="/airplane.png" alt="airplane" width={24} height={24} />
        <p className="absolute top-6">
          {hours}h {minutes}m
        </p>
      </div>

      <div className="flex-1 min-w-0 h-[1px] border border-gray-300"></div>

      {/* ARRIVAL */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
        <p className="font-medium text-ellipsis whitespace-nowrap w-full text-center">
          {dayjs(arrivalDate).format("MMMM D, YYYY")} - Arrival
        </p>
        <h2 className="text-ellipsis whitespace-nowrap w-full text-center">
          {dayjs.utc(arrivalTime, "HH:mm:ssZ").format("HH:mm")}
        </h2>
        <p className="text-ellipsis whitespace-nowrap w-full text-center">
          {arrivalAirport}
        </p>
        <p className="text-ellipsis whitespace-nowrap w-full text-center">
          Terminal: {arrivalTerminal}, Gate: {arrivalGate}
        </p>
      </div>
    </div>
  )
}
export default Flight
