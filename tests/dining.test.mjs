import assert from "node:assert/strict";
import test from "node:test";

import {
  buildThreeHourSlots,
  getOpenVenues,
  getVenueStatus,
  isVenueOpen,
  venues,
} from "../src/domain/dining.js";

const venueById = (id) => venues.find((venue) => venue.id === id);

test("Wiseguy is open during a Friday dinner", () => {
  const fridayDinner = new Date("2026-06-06T00:00:00Z");
  assert.equal(isVenueOpen(venueById("wiseguy-pizza"), fridayDinner), true);
});

test("Chick-fil-A is closed on Sunday", () => {
  const sundayNoon = new Date("2026-06-07T16:00:00Z");
  const venue = venueById("chick-fil-a");
  assert.equal(isVenueOpen(venue, sundayNoon), false);
  assert.equal(getVenueStatus(venue, sundayNoon).label, "Closed Sunday");
});

test("Marketplace Cafe follows its published Sunday hours", () => {
  const sundayNoon = new Date("2026-06-07T16:00:00Z");
  const sundayClosing = new Date("2026-06-07T21:00:00Z");
  const venue = venueById("marketplace-cafe");
  assert.equal(isVenueOpen(venue, sundayNoon), true);
  assert.equal(isVenueOpen(venue, sundayClosing), false);
});

test("a venue opens at the exact published opening time", () => {
  const mondayAtEleven = new Date("2026-06-08T15:00:00Z");
  assert.equal(isVenueOpen(venueById("wiseguy-pizza"), mondayAtEleven), true);
});

test("a venue closes at the exact published closing time", () => {
  const mondayAtNine = new Date("2026-06-09T01:00:00Z");
  const venue = venueById("wiseguy-pizza");
  assert.equal(isVenueOpen(venue, mondayAtNine), false);
  assert.equal(getVenueStatus(venue, mondayAtNine).label, "Closed today");
});

test("open venue list reflects public opening hours", () => {
  const earlyMorning = new Date("2026-06-08T11:30:00Z");
  const open = getOpenVenues(venues, earlyMorning).map((venue) => venue.id);
  assert.ok(open.includes("chick-fil-a"));
  assert.ok(open.includes("potomac-tavern"));
  assert.ok(!open.includes("wiseguy-pizza"));
});

test("planner creates three-hour checkpoints", () => {
  const slots = buildThreeHourSlots(new Date("2026-06-08T12:20:00Z"), 4);
  assert.equal(slots.length, 4);
  assert.equal(slots[1].at.getTime() - slots[0].at.getTime(), 3 * 60 * 60 * 1000);
});

test("all venues have a public source URL", () => {
  for (const venue of venues) assert.match(venue.url, /^https:\/\//);
});
