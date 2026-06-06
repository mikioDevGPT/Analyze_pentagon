import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  buildThreeHourSlots,
  getOpenVenues,
  getVenueStatus,
  venues,
} from "./src/domain/dining";
import { useLiveNow } from "./src/hooks/useLiveNow";

type Tab = "nearby" | "timeline" | "about";

const colors = {
  ink: "#202821",
  forest: "#234C3D",
  leaf: "#78A96B",
  cream: "#F6F1E6",
  paper: "#FFFDF7",
  orange: "#E8793D",
  paleOrange: "#F8E5D7",
  muted: "#66736B",
  line: "#E2DDD2",
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PentagonEats />
    </SafeAreaProvider>
  );
}

function PentagonEats() {
  const [tab, setTab] = useState<Tab>("nearby");
  const now = useLiveNow();
  const slots = useMemo(() => buildThreeHourSlots(now, 6), [now]);
  const openCount = getOpenVenues(venues, now).length;

  return (
    <SafeAreaView edges={["top", "right", "bottom", "left"]} style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>PENTAGON CITY</Text>
            <Text style={styles.brand}>Pentagon Eats</Text>
          </View>
          <View style={styles.openPill}>
            <View style={styles.dot} />
            <Text style={styles.openText}>{openCount} open</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {([
            ["nearby", "Restaurants"],
            ["timeline", "By time"],
            ["about", "About"],
          ] as const).map(([id, label]) => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ selected: tab === id }}
              key={id}
              onPress={() => setTab(id)}
              style={[styles.tab, tab === id && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {tab === "nearby" && (
            <>
              <View style={styles.hero}>
                <Text style={styles.heroKicker}>WHAT SHOULD WE EAT?</Text>
                <Text style={styles.heroTitle}>Find a nearby meal without the scroll.</Text>
                <Text style={styles.heroBody}>
                  Browse Pentagon City restaurants by published hours, cuisine,
                  price, and official information.
                </Text>
              </View>

              <SectionTitle title="Nearby restaurants" meta={`${venues.length} places`} />
              {venues.map((venue) => {
                const status = getVenueStatus(venue, now);
                return (
                  <View style={styles.card} key={venue.id}>
                    <View style={styles.cardTop}>
                      <View style={styles.cardCopy}>
                        <Text style={styles.name}>{venue.name}</Text>
                        <Text style={styles.meta}>
                          {venue.cuisine} · {venue.price} · {venue.area}
                        </Text>
                      </View>
                      <View style={[styles.status, !status.open && styles.statusClosed]}>
                        <Text style={styles.statusText}>{status.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.description}>{venue.description}</Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.locationCopy}>
                        <Text style={styles.locationLabel}>LOCATION</Text>
                        <Text style={styles.location}>{venue.location}</Text>
                      </View>
                      <TouchableOpacity
                        accessibilityLabel={`Open official information for ${venue.name}`}
                        accessibilityRole="link"
                        onPress={() => Linking.openURL(venue.url)}
                        style={styles.linkButton}
                      >
                        <Text style={styles.linkText}>Official info ↗</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {tab === "timeline" && (
            <>
              <View style={styles.timelineIntro}>
                <Text style={styles.heroKicker}>THREE-HOUR PLANNER</Text>
                <Text style={styles.timelineTitle}>Choose by time of day</Text>
                <Text style={styles.timelineBody}>
                  See which listed restaurants are expected to be open at each
                  three-hour checkpoint, based on published business hours.
                </Text>
              </View>
              {slots.map((slot) => {
                const open = getOpenVenues(venues, slot.at);
                return (
                  <View style={styles.slot} key={slot.at.toISOString()}>
                    <View style={styles.slotTime}>
                      <Text style={styles.slotHour}>{slot.label}</Text>
                      <Text style={styles.slotMeal}>{slot.meal}</Text>
                    </View>
                    <View style={styles.slotCopy}>
                      <Text style={styles.slotCount}>{open.length} expected open</Text>
                      <Text style={styles.slotNames}>
                        {open.length
                          ? open.slice(0, 4).map((venue) => venue.name).join(" · ")
                          : "No listed restaurants are expected to be open"}
                      </Text>
                    </View>
                  </View>
                );
              })}
              <Text style={styles.disclaimer}>
                Holiday and temporary hours may differ. Check the official page
                before visiting.
              </Text>
            </>
          )}

          {tab === "about" && (
            <>
              <SectionTitle title="About Pentagon Eats" meta="Version 1.0" />
              <InfoCard
                title="A focused local guide"
                body="A compact directory for restaurants in Pentagon City and nearby commercial areas."
              />
              <InfoCard
                title="Official sources"
                body="Listings use public hours and links from restaurants and shopping-center directories."
              />
              <InfoCard
                title="Privacy-conscious"
                body="Version 1.0 has no account, device location, advertising, analytics, or tracking."
              />
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function SectionTitle({ title, meta }: { title: string; meta: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionMeta}>{meta}</Text>
    </View>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  shell: { alignSelf: "center", flex: 1, maxWidth: 760, width: "100%" },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", padding: 22 },
  eyebrow: { color: colors.orange, fontSize: 10, fontWeight: "900", letterSpacing: 1.8 },
  brand: { color: colors.ink, fontSize: 27, fontWeight: "900", letterSpacing: -1.2 },
  openPill: { alignItems: "center", backgroundColor: "#E4EEE5", borderRadius: 99, flexDirection: "row", gap: 7, paddingHorizontal: 12, paddingVertical: 8 },
  dot: { backgroundColor: colors.leaf, borderRadius: 4, height: 8, width: 8 },
  openText: { color: colors.forest, fontSize: 12, fontWeight: "800" },
  tabs: { borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: "row", marginHorizontal: 22 },
  tab: { alignItems: "center", flex: 1, paddingVertical: 12 },
  tabActive: { borderBottomColor: colors.orange, borderBottomWidth: 3 },
  tabText: { color: colors.muted, fontSize: 13, fontWeight: "800" },
  tabTextActive: { color: colors.ink },
  content: { gap: 14, padding: 22, paddingBottom: 48 },
  hero: { backgroundColor: colors.forest, borderRadius: 28, padding: 24 },
  heroKicker: { color: "#BFD7C9", fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
  heroTitle: { color: colors.paper, fontSize: 30, fontWeight: "900", letterSpacing: -1.2, lineHeight: 38, marginTop: 10 },
  heroBody: { color: "#D9E8DE", fontSize: 13, lineHeight: 21, marginTop: 12 },
  sectionTitleRow: { alignItems: "baseline", flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: "900" },
  sectionMeta: { color: colors.muted, fontSize: 11, fontWeight: "700" },
  card: { backgroundColor: colors.paper, borderColor: colors.line, borderRadius: 22, borderWidth: 1, padding: 18 },
  cardTop: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" },
  cardCopy: { flex: 1, paddingRight: 10 },
  name: { color: colors.ink, fontSize: 18, fontWeight: "900" },
  meta: { color: colors.orange, fontSize: 11, fontWeight: "800", marginTop: 4 },
  status: { backgroundColor: "#E4EEE5", borderRadius: 99, paddingHorizontal: 9, paddingVertical: 7 },
  statusClosed: { backgroundColor: "#EEEAE3" },
  statusText: { color: colors.forest, fontSize: 9, fontWeight: "900" },
  description: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 13 },
  cardFooter: { alignItems: "flex-end", borderTopColor: colors.line, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 16, paddingTop: 14 },
  locationCopy: { flex: 1, paddingRight: 8 },
  locationLabel: { color: colors.muted, fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  location: { color: colors.ink, fontSize: 10, fontWeight: "700", marginTop: 3 },
  linkButton: { backgroundColor: colors.paleOrange, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 9 },
  linkText: { color: "#A74820", fontSize: 10, fontWeight: "900" },
  timelineIntro: { backgroundColor: colors.forest, borderRadius: 24, padding: 22 },
  timelineTitle: { color: colors.paper, fontSize: 28, fontWeight: "900", marginTop: 8 },
  timelineBody: { color: "#D9E8DE", fontSize: 12, lineHeight: 19, marginTop: 8 },
  slot: { alignItems: "center", backgroundColor: colors.paper, borderColor: colors.line, borderRadius: 18, borderWidth: 1, flexDirection: "row", gap: 16, padding: 16 },
  slotTime: { width: 76 },
  slotHour: { color: colors.ink, fontSize: 20, fontWeight: "900" },
  slotMeal: { color: colors.orange, fontSize: 10, fontWeight: "800", marginTop: 2 },
  slotCopy: { flex: 1 },
  slotCount: { color: colors.ink, fontSize: 13, fontWeight: "900" },
  slotNames: { color: colors.muted, fontSize: 10, lineHeight: 16, marginTop: 4 },
  disclaimer: { color: colors.muted, fontSize: 11, lineHeight: 18, padding: 10 },
  infoCard: { backgroundColor: colors.paper, borderColor: colors.line, borderRadius: 20, borderWidth: 1, padding: 18 },
  infoTitle: { color: colors.ink, fontSize: 16, fontWeight: "900" },
  infoBody: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 6 },
});
