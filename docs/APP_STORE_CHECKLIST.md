# App Store release checklist

1. Enroll in the Apple Developer Program and complete identity verification.
2. Replace `com.example.pentagoneats` with a unique bundle identifier.
3. Create the App Store Connect record and replace `ascAppId` in `eas.json`.
4. Recheck restaurant hours from official sources immediately before submission.
5. Host the privacy policy and support page at public HTTPS URLs.
6. Complete App Privacy answers; the intended version 1.0 answer is Data Not Collected.
7. Run `npm install`, `npm test`, `npm run typecheck`, and `npx expo-doctor`.
8. Build with `npx eas-cli build --platform ios --profile production`.
9. Upload with `npx eas-cli submit --platform ios --profile production`.
10. Add screenshots, metadata, review contact details, and App Review notes.
11. Select the processed build and submit it for review in App Store Connect.

Use original artwork and descriptions. Do not copy restaurant menus, logos, or
photographs without permission. Published business hours may change, so the app
must keep an official source link on every listing.
