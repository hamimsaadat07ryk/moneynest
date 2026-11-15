# Use MoneyNest on your phone (with Google Drive)

You do these steps **once**. Allow about 30 minutes. Do them in order.
Your PC app keeps working exactly as before. The phone copy and the PC copy share your data through a folder called **MoneyNest** in your own Google Drive.

Words used below: **PC app** = the one you start with `start-windows.bat`. **Phone app** = the copy on the internet that you open on your phone.

---

## Part 1. Get a Google "Client ID" (free, about 10 minutes)

This is the key that lets MoneyNest save files in *your* Drive. Only you can use it for your data.

1. On your PC open https://console.cloud.google.com and sign in with the Google account whose Drive you want to use.
2. Accept the terms if it asks.
3. Click the **project picker** at the top (next to the Google Cloud logo) > **New project**. Name it `MoneyNest` > **Create**. Make sure `MoneyNest` is the selected project afterwards.
4. Open the menu (three lines, top left) > **APIs & Services** > **Library**. Search **Google Drive API** > click it > **Enable**.
5. Menu > **APIs & Services** > **OAuth consent screen** (Google may call it **Google Auth Platform**). Click **Get started** and fill in:
   - App name: `MoneyNest`
   - User support email: your email
   - Audience: **External**
   - Contact email: your email
   - Tick the agreement box > **Continue / Create**.
6. Open **Data Access** (left side) > **Add or remove scopes**. Find and tick this one:
   `.../auth/drive.file` ("See, edit, create and delete only the specific Drive files you use with this app").
   Click **Update** > **Save**. (Only this one scope. It cannot see your other Drive files.)
7. Open **Audience** (left side) > under *Publishing status* click **Publish app** > **Confirm**.
   Why: if you leave it in "Testing", Google makes you sign in again every 7 days. Publishing is fine because the app only uses that one safe scope and nobody else uses your key.
8. Open **Clients** (left side) > **Create client**:
   - Application type: **Web application**
   - Name: `MoneyNest web`
   - **Authorized JavaScript origins** > **Add URI**, and add these two (write them exactly, no `/` at the end, no page name):
     - `http://localhost:8765`
     - `https://YOURNAME.github.io` (replace YOURNAME with your GitHub user name from Part 2. If you do not have it yet, add only the first one now and come back after Part 2 to add the second.)
   - Leave "Authorized redirect URIs" empty > **Create**.
9. A box shows your **Client ID**. It looks like `123456789-abcdef.apps.googleusercontent.com`. **Copy it.** You do not need the "client secret".
   (Changes to origins can take up to a few minutes, sometimes longer, before they work.)

---

## Part 2. Put the phone copy on the internet (free, about 15 minutes)

1. Open the file `MoneyNest\static\config.js` in Notepad. Paste your Client ID between the quotes:
   `googleClientId: '123456789-abcdef.apps.googleusercontent.com'` > save.
2. Go to https://github.com and create a free account (pick a short user name, for example `hamim07`). Verify your email.
3. Click **+** (top right) > **New repository**. Name: `moneynest`. Choose **Public** > **Create repository**.
   (Public is fine. The repository holds only the app, never your money data.)
4. On the new repository page click **uploading an existing file**.
5. Open the `MoneyNest\static` folder on your PC. Select **everything inside it** (the folders `css`, `fonts`, `icons`, `js` and the files `index.html`, `report.html`, `config.js`, `manifest.webmanifest`, `sw-app.js`, `sw.js`). Drag it into the GitHub page. Wait until all files finish uploading, then click **Commit changes**.
6. In the repository open **Settings** > **Pages**. Under *Build and deployment* > *Source* choose **Deploy from a branch**. Branch: **main**, folder **/ (root)** > **Save**.
7. Wait 1 to 3 minutes and refresh. The page shows your link: `https://YOURNAME.github.io/moneynest/`. Open it on your PC to check that MoneyNest loads.
8. Go back to Google Cloud (Part 1 step 8) > **Clients** > open `MoneyNest web` > add `https://YOURNAME.github.io` to the JavaScript origins (only the part up to `.github.io`) > **Save**.

---

## Part 3. Connect the PC app first

1. Start the PC app with `start-windows.bat` and open http://localhost:8765. (Close the browser tab first and reopen it so the new files load.)
2. Open **Settings** > the **Google Drive** card > **Connect Google Drive**.
3. Pick your Google account. If Google shows "Google hasn't verified this app", click **Advanced** > **Go to MoneyNest** and then **Continue / Allow**.
4. The status should say **Saved to Google Drive**. In Google Drive you will now see a folder **MoneyNest**. **Never delete or rename that folder.**

## Part 4. Connect the phone

1. On your phone open `https://YOURNAME.github.io/moneynest/` in Chrome (Android) or Safari (iPhone).
2. Create a PIN for the phone (it can be different from the PC PIN).
3. Open **Settings** > **Google Drive** > **Connect Google Drive**, choose the same Google account and allow.
4. Your entries from the PC appear on the phone. Done!
5. Add it to your home screen: Chrome menu (three dots) > **Add to Home screen**. On iPhone: Share button > **Add to Home Screen**.

## How it works day to day

- Add entries on the phone or the PC. They sync within a few seconds when the device is online. No PC needs to be on.
- The phone works without internet too. It saves locally and syncs when it is back online.
- Phone entries reach the **PC database** the next time you open the PC app (it pulls them from Drive and saves them in `MoneyNestData`).
- Google sign-in lasts about an hour. If the badge says **Tap to reconnect Google Drive**, tap it once.
- Keep your phone's date and time on **Automatic**. The newest edit wins, so a wrong clock can make an older edit look newer.

## How your data is kept safe

- Each device writes only its **own** file (`moneynest-device-...json`). A device can never overwrite another device's file.
- A device that has lost its data (new phone, cleared browser) reads everything back from Drive.
- Deleting an entry only adds a "deleted" marker. Drive files are never deleted by the app.
- A permanent backup `moneynest-backup-YYYY-MM.json` is created once a month and never changed. Google Drive also keeps old versions and a Trash for 30 days.
- Your PC database and its daily/monthly backups in `MoneyNestData` still work as before. Keep copying that folder somewhere safe now and then.

## Quick test (5 minutes)

1. On the phone add an expense "test phone".
2. Wait 10 seconds, then on the PC open the app and tap **Sync with Drive now** in Settings > Google Drive. The entry should appear.
3. On the PC add "test pc". On the phone open Settings > **Sync with Drive now**. It should appear.
4. Delete both test entries.

## If something goes wrong

- **"redirect_uri_mismatch" or "origin_mismatch"**: the website address is missing in *Authorized JavaScript origins* (Part 1 step 8). It must be exactly `https://YOURNAME.github.io` or `http://localhost:8765`. Wait a few minutes after saving.
- **"Access blocked: app not verified" or "access_denied"**: Part 1 step 7 (Publish app) was skipped, or your email must be added under *Audience > Test users* if the app is still in Testing.
- **Status says "Drive problem: Google Drive API has not been used..."**: do Part 1 step 4 (Enable Google Drive API), wait a minute, then tap Sync again.
- **Phone does not show PC entries**: connect the PC first (Part 3), tap *Sync with Drive now* on the PC, then on the phone. Both must use the **same Google account**.
- **Page changes do not show on the phone**: close and reopen the app; the phone copy updates itself when online.
- **Updating the app later**: replace the changed files in your GitHub repository the same way as in Part 2 step 5.
- **You forgot the phone PIN**: clear this site's data in the phone browser settings, open the page, create a new PIN and connect Drive again. Your data returns from Drive.
