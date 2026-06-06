const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const venues = [
  {
    id: "wiseguy-pizza",
    name: "Wiseguy Pizza",
    cuisine: "New York-style pizza",
    price: "$",
    area: "12th Street",
    location: "710 12th St S, Arlington",
    description: "Large New York-style slices and 18-inch pizzas, including classic, specialty, and vegan options.",
    url: "https://www.wiseguypizza.com/pentagon-city",
    hours: { sun: [[11, 21]], mon: [[11, 21]], tue: [[11, 21]], wed: [[11, 21]], thu: [[11, 23]], fri: [[11, 24]], sat: [[11, 24]] },
  },
  {
    id: "matchbox",
    name: "Matchbox",
    cuisine: "Pizza & American",
    price: "$$",
    area: "Fashion Centre",
    location: "1100 S Hayes St, Arlington",
    description: "Wood-fired thin-crust pizza, mini burgers, and craft beer in a casual bistro setting.",
    url: "https://www.matchboxrestaurants.com/pentagon-city",
    hours: { sun: [[9, 21]], mon: [[11, 21]], tue: [[11, 21]], wed: [[11, 21]], thu: [[11, 21]], fri: [[11, 22]], sat: [[9, 22]] },
  },
  {
    id: "shake-shack",
    name: "Shake Shack",
    cuisine: "Burgers",
    price: "$$",
    area: "Fashion Centre",
    location: "1100 S Hayes St, Arlington",
    description: "Burgers, hot dogs, frozen custard, and shakes for a quick casual meal.",
    url: "https://shakeshack.com/location/pentagon-city-va",
    hours: { sun: [[10, 22]], mon: [[10, 22]], tue: [[10, 22]], wed: [[10, 22]], thu: [[10, 22]], fri: [[10, 23]], sat: [[10, 23]] },
  },
  {
    id: "marketplace-cafe",
    name: "Marketplace Cafe",
    cuisine: "American",
    price: "$$$",
    area: "Nordstrom",
    location: "1400 S Hayes St, Arlington",
    description: "Comfort dishes, soups, salads, sandwiches, and entrees in a relaxed Nordstrom dining space.",
    url: "https://www.nordstrom.com/store-details/nordstrom-the-fashion-centre-at-pentagon-city",
    hours: { sun: [[11, 17]], mon: [[11, 20]], tue: [[11, 20]], wed: [[11, 20]], thu: [[11, 20]], fri: [[11, 20]], sat: [[11, 20]] },
  },
  {
    id: "chick-fil-a",
    name: "Chick-fil-A",
    cuisine: "Chicken",
    price: "$",
    area: "12th Street",
    location: "710 12th St S, Arlington",
    description: "Chicken sandwiches, nuggets, salads, and breakfast options. Closed on Sunday.",
    url: "https://www.chick-fil-a.com/locations/va/pentagon-city-inline/",
    hours: { sun: [], mon: [[6.5, 22]], tue: [[6.5, 22]], wed: [[6.5, 22]], thu: [[6.5, 22]], fri: [[6.5, 22]], sat: [[6.5, 22]] },
  },
  {
    id: "potomac-tavern",
    name: "Potomac Tavern",
    cuisine: "American",
    price: "$$",
    area: "Sheraton",
    location: "900 S Orme St, Arlington",
    description: "A hotel restaurant serving breakfast, lunch, and dinner across a broad range of hours.",
    url: "https://www.marriott.com/en-us/hotels/wasgs-sheraton-pentagon-city-hotel/dining/",
    hours: { sun: [[7, 23]], mon: [[7, 22]], tue: [[7, 22]], wed: [[7, 22]], thu: [[7, 22]], fri: [[7, 22]], sat: [[7, 23]] },
  },
];

export function getLocalParts(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value;
  const weekday = value("weekday").toLowerCase();
  const hour = Number(value("hour"));
  const minute = Number(value("minute"));
  return { day: weekday, decimalHour: hour + minute / 60 };
}

export function isVenueOpen(venue, date) {
  const { day, decimalHour } = getLocalParts(date);
  const ranges = venue.hours[day] ?? [];
  return ranges.some(([open, close]) => decimalHour >= open && decimalHour < close);
}

export function getOpenVenues(list, date) {
  return list.filter((venue) => isVenueOpen(venue, date));
}

export function getVenueStatus(venue, date) {
  const { day, decimalHour } = getLocalParts(date);
  const ranges = venue.hours[day] ?? [];
  const current = ranges.find(([open, close]) => decimalHour >= open && decimalHour < close);
  if (current) return { open: true, label: `Open until ${formatHour(current[1])}` };
  const next = ranges.find(([open]) => decimalHour < open);
  if (next) return { open: false, label: `Opens ${formatHour(next[0])}` };
  return { open: false, label: ranges.length ? "Closed today" : "Closed Sunday" };
}

export function buildThreeHourSlots(start, count = 6) {
  const initial = new Date(start);
  initial.setUTCMinutes(0, 0, 0);
  return Array.from({ length: count }, (_, index) => {
    const at = new Date(initial.getTime() + index * 3 * 60 * 60 * 1000);
    const { decimalHour } = getLocalParts(at);
    return {
      at,
      label: new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(at),
      meal: mealLabel(decimalHour),
    };
  });
}

function mealLabel(hour) {
  if (hour < 10) return "Breakfast";
  if (hour < 14) return "Lunch";
  if (hour < 17) return "Cafe";
  if (hour < 21) return "Dinner";
  return "Late night";
}

function formatHour(value) {
  if (value === 24) return "24:00";
  const hour = Math.floor(value);
  const minutes = value % 1 ? "30" : "00";
  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

export const DAYS = DAY_KEYS;
