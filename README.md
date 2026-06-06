# Pentagon Eats

Pentagon Eats is an Expo/React Native dining guide for Pentagon City and nearby
commercial areas in Arlington, Virginia.

The first release includes:

- restaurant cards with cuisine, price, location, and official links;
- open/closed status calculated from published business hours;
- a three-hour planner showing available dining choices by time of day;
- no account, device location, advertising, or analytics.

## Run

Expo SDK 56 requires Node.js 22.13 or later.

```bash
npm install
npm test
npm run typecheck
npm run web
```

`npm install` generates the app icon, splash image, adaptive icon, and favicon.

Before store submission:

- replace `com.example.pentagoneats` in `app.json`;
- replace the App Store Connect ID in `eas.json`;
- recheck every restaurant's current hours;
- add production support and privacy-policy URLs.

## Project map

- `App.tsx`: restaurant list, three-hour planner, and about screen.
- `src/domain/dining.js`: venue data and opening-hours calculations.
- `tests/dining.test.mjs`: schedule and source-link tests.
- `preview/index.html`: dependency-free visual preview.
- `docs`: research, privacy, App Review notes, and release checklist.

Business hours change. Store a verification date when moving venue data to a
remote CMS, recheck official sources regularly, and keep each official link
available for final confirmation.
