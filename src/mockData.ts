export const mockData = {
  pagination: {
    limit: 100,
    offset: 0,
    count: 20,
    total: 371917,
  },
  data: Array.from({ length: 20 }, (_, i) => ({
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
      scheduled: `2025-04-20T${String(15 + (i % 5)).padStart(
        2,
        "0"
      )}:40:00+00:00`,
      estimated: `2025-04-20T${String(15 + (i % 5)).padStart(
        2,
        "0"
      )}:45:00+00:00`,
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
      scheduled: `2025-04-20T${String(18 + (i % 3)).padStart(
        2,
        "0"
      )}:30:00+00:00`,
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
  })),
};
