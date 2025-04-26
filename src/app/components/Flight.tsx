import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Image from "next/image";
import { MappedFlightData } from "./types";

dayjs.extend(utc);

const Flight = (props: MappedFlightData) => {
  const {
    // flightStatus,
    departureTime,
    departureDate,
    departureAirport,
    departureTerminal,
    departureGate,
    arrivalTime,
    arrivalDate,
    arrivalAirport,
    arrivalTerminal,
    arrivalGate,
    // airline,
    // flightNumber,
  } = props;

  const departure = dayjs.utc(departureTime);
  const arrival = dayjs.utc(arrivalTime);

  const durationInMinutes = arrival.diff(departure, "minute");
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  return (
    <div className="w-full flex-1 p-2 border border-gray-500 rounded-sm flex flex-row items-center gap-2">
      {/* DEPARTURE */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
        <p className="text-ellipsis lg:whitespace-nowrap w-full text-center font-semibold text-wrap text-sm lg:text-lg">
          {dayjs(departureDate).format("MMMM D, YYYY")} - Departure
        </p>
        <h2 className="text-ellipsis lg:whitespace-nowrap w-full text-center text-4xl font-extrabold">
          {departure.format("HH:mm")}
        </h2>
        <p className="text-ellipsis lg:whitespace-nowrap w-full text-center text-gray-500 text-wrap text-sm">
          {departureAirport}
        </p>
        <p className="text-ellipsis lg:whitespace-nowrap w-full text-center text-gray-500 text-sm">
          Terminal: {departureTerminal ? "--" : departureTerminal}, Gate:{" "}
          {departureGate === null ? "--" : departureGate}
        </p>
      </div>

      <div className="flex-1 min-w-0 h-[1px] border border-gray-300"></div>

      <div className="relative">
        <Image src="/airplane.png" alt="airplane" width={24} height={24} />
        <p className="absolute top-6 right-2 text-nowrap lg:text-ellipsis lg:whitespace-nowrap w-full text-center">
          {hours}h {minutes}m
        </p>
      </div>

      <div className="flex-1 min-w-0 h-[1px] border border-gray-300"></div>

      {/* ARRIVAL */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
        <p className="text-ellipsis lg:whitespace-nowrap w-full text-center font-semibold text-wrap text-sm">
          {dayjs(arrivalDate).format("MMMM D, YYYY")} - Arrival
        </p>
        <h2 className="text-ellipsis lg:whitespace-nowrap w-full text-center text-4xl font-extrabold">
          {arrival.format("HH:mm")}
        </h2>
        <p className="text-ellipsis lg:whitespace-nowrap w-full text-center text-gray-500 text-wrap text-sm">
          {arrivalAirport}
        </p>
        <p className="text-ellipsis lg:whitespace-nowrap w-full text-center text-gray-500 text-sm text-md">
          Terminal: {arrivalTerminal === null ? "--" : arrivalTerminal}, Gate:{" "}
          {arrivalGate === null ? "--" : arrivalGate}
        </p>
      </div>
    </div>
  );
};
export default Flight;
