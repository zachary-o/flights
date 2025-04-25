export const mockData = {
  pagination: {
    limit: 100,
    offset: 0,
    count: 20,
    total: 371917,
  },
  data: Array.from({ length: 20 }, (_, i) => {
    const departureHour = 10 + (i % 5) // 10..14
    const departureScheduled = `2025-04-20T${String(departureHour).padStart(
      2,
      "0"
    )}:40:00+00:00`
    const departureEstimated = `2025-04-20T${String(departureHour).padStart(
      2,
      "0"
    )}:45:00+00:00`

    const arrivalHour = departureHour + 2
    const arrivalMinute = 40 + 30 // = 70 (so becomes hour + 1, minute 10)
    const finalArrivalHour = arrivalHour + Math.floor(arrivalMinute / 60)
    const finalArrivalMinute = arrivalMinute % 60

    const arrivalScheduled = `2025-04-20T${String(finalArrivalHour).padStart(
      2,
      "0"
    )}:${String(finalArrivalMinute).padStart(2, "0")}:00+00:00`

    return {
      flight_date: "2025-04-20",
      flight_status: "active",
      departure: {
        airport: `Zhuhai Airport ${i + 1}`,
        timezone: "Asia/Shanghai",
        iata: "ZUH",
        icao: "ZGSD",
        terminal: "T1",
        gate: `B${10 + i}`,
        delay: 5 + i,
        scheduled: departureScheduled,
        estimated: departureEstimated,
        actual: null,
        estimated_runway: null,
        actual_runway: null,
      },
      arrival: {
        airport: `Jinan ${i + 1}`,
        timezone: "Asia/Shanghai",
        iata: "TNA",
        icao: "ZSJN",
        terminal: null,
        gate: null,
        baggage: null,
        scheduled: arrivalScheduled,
        delay: null,
        estimated: null,
        actual: null,
        estimated_runway: null,
        actual_runway: null,
      },
      airline: {
        name: "China Express Air",
        iata: "G5",
        icao: "HXA",
      },
      flight: {
        number: `833${i}`,
        iata: `G5833${i}`,
        icao: `HXA833${i}`,
        codeshared: {
          airline_name: "Shandong Airlines",
          airline_iata: "SC",
          airline_icao: "CDG",
          flight_number: `119${i}`,
          flight_iata: `SC119${i}`,
          flight_icao: `CDG119${i}`,
        },
      },
      aircraft: null,
      live: null,
    }
  }),
}
