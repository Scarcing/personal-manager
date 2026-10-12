# Personal

Personal tasklist, monthly budget and calendar, with a responsive website and an offline Android app.

## Website

Run `node scripts/serve.mjs`, then open http://127.0.0.1:4173. No install or build step is required. Hosting serves `dist/` over HTTPS. The service worker caches the app for offline use. Data is local to each browser/device; there is no automatic cloud sync. Settings provides JSON backup export/import to transfer records.

- Tasks: name, description, comma-separated tags, deadline, and one level of subtasks. Completing a folder completes its children; reopening a child reopens its folder. All incomplete deadlines appear in the calendar.
- Budget: revenue, game expenses, subscriptions and food. Positive amounts, automatic date when blank, monthly revenue/expense/balance totals and category breakdowns, comma-separated transaction tags and tag filtering. Bank account balance is a manually entered snapshot, separate from monthly net and not automatically adjusted by transactions. Currency defaults to HKD and can be changed in Settings (formatting only; no exchange conversion).
- Calendar: click a date for quick entry or use the + button for the selected date. Blank time means all day. Ordinary reminders default off and fire at the event start when enabled. Whole-word birthday/bday names repeat annually and remind at midnight automatically. February 29 birthdays use March 1 in non-leap years.
- Task reminders fire at local midnight the calendar day before a deadline. Website notifications require HTTPS, permission, and the app to be open. Reminders from the past 24 hours are delivered when reopening. Browser task delivery is once per record and deadline.

## Android

The native Java project in `android/` embeds the same website offline and bridges reminders to Android AlarmManager. It does not depend on a hosted website or account. Export and import backups through Android's document picker.

1. Run `node scripts/sync-android.mjs` after website changes.
2. Open `android/` in Android Studio with JDK 17, Android SDK 35 and Gradle 8.9. Let Android Studio sync the project (it can generate the Gradle wrapper).
3. Build > Build App Bundle(s) / APK(s) > Build APK(s), or run `gradle assembleDebug` from `android/` if Gradle is installed.
4. Install `android/app/build/outputs/apk/debug/app-debug.apk` on Android 8 or newer.
5. Tap Enable notifications and permit Notifications plus Alarms & reminders. Without exact alarm permission, reminders may be delayed. Force-stopping the app disables delivery until reopening; manufacturer battery restrictions can also delay alarms.

Android schedules reminders while closed, restores them after reboot, and reschedules birthdays annually. Dates use the device's local timezone. Task/event instants already scheduled are preserved through timezone changes; reopen Personal to recalculate them for the current zone.

## Verification

`node --test tests/*.test.mjs` checks task timing, annual birthdays, opt-in event reminders, monthly totals and backup validation. `node --check dist/app.js` checks browser JavaScript syntax. Native builds require the Android SDK/JDK; they are not included in the workspace runtime.


