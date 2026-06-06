export interface Venue {
  id: string;
  name: string;
  cuisine: string;
  price: string;
  area: string;
  location: string;
  description: string;
  url: string;
  hours: Record<string, Array<[number, number]>>;
}

export interface TimeSlot {
  at: Date;
  label: string;
  meal: string;
}

export const venues: Venue[];
export function getLocalParts(date: Date): { day: string; decimalHour: number };
export function isVenueOpen(venue: Venue, date: Date): boolean;
export function getOpenVenues(list: Venue[], date: Date): Venue[];
export function getVenueStatus(venue: Venue, date: Date): { open: boolean; label: string };
export function buildThreeHourSlots(start: Date, count?: number): TimeSlot[];
export const DAYS: string[];
