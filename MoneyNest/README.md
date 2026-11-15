# MoneyNest - your money tracker (PC only)

Tracks deposits, expenses, daily limit, monthly budget, savings, wishlist, **lend / borrow (Loans)**, streaks and monthly PDF reports.
Everything is stored on **this PC** (and, only if you set it up, copied to your own Google Drive for the phone).

## Start it

1. Install Python 3 from https://www.python.org/downloads/ (tick **Add python.exe to PATH**). Nothing else is needed.
2. Double-click **`start-windows.bat`** (Mac/Linux: `start-mac-linux.sh`). Keep the black window open while you use the app.
3. Your browser opens http://localhost:8765. First time: create a PIN.

Windows will not show a firewall question any more, because the app now listens on this PC only.
To start it automatically with Windows: press `Win+R`, type `shell:startup`, and put a shortcut to `start-windows.bat` there.

## Where your data lives (it can no longer be erased by replacing the app)

Your database is **not inside the app folder**. It is here:

- Windows: `C:\Users\<your name>\MoneyNestData\moneynest.db`
- Backups: `C:\Users\<your name>\MoneyNestData\backups\`
  - one backup per day for the last 30 days
  - one backup per month, kept forever

You can delete, move, update or re-unzip the app folder and your data stays. The black window prints the exact path.
Please copy the `MoneyNestData` folder to a USB drive or cloud folder once in a while.

**Importing your older data:** if you used the first version, start the new one once. If the old
`data\moneynest.db` is still next to `server.py`, it is copied into `MoneyNestData` automatically (the original is not touched).
If your old app folder is somewhere else, copy its `data\moneynest.db` to `C:\Users\<your name>\MoneyNestData\` **before** the first start.
Also keep using the same browser at http://localhost:8765: it may still hold a copy of your entries and will upload
them to the new database after you create a PIN.

**Restore from a backup:** close the black window, copy a file from `backups\` over `moneynest.db`, start the app again.

## New in this version

- **Greeting header** with your name (Settings > Profile and look), the date, and a time-based greeting (morning / afternoon / evening / night).
- **Light and dark theme**: tap the sun/moon button at the top, or choose Light / Dark / Auto in Settings. The choice is remembered.
- **Gentle glow animations**: cards, bars, rings and numbers ease in when a page opens. (They switch off automatically if your PC is set to "reduce motion".)
- **Emoji** on categories, accounts, wishlist items and quick-add shortcuts. In any edit form you can tap an emoji or type/paste your own.
- **Streak badge** (🔥): counts the days in a row you stayed within your daily limit. Tap it for the last 7 days and your best streak. Set a daily limit first.
- **Quick add**: one-tap expenses on Home. Bus (৳10 / ৳15) and Cigarette (৳10 / ৳23, under Entertainment) are ready. Each tap adds an expense dated today and shows an **Undo** button. Add, edit or delete shortcuts in Settings > Quick-add shortcuts. "Other" opens the full form for a different amount.
- **Loan due dates**: when you add *I lent* or *I borrowed* you can set a due date (or tap *In 1 week* / *In 1 month*). Overdue and soon-due loans show badges on the person page, in the Loans list, and as an alert on Home. Repayments are matched to the oldest loan first.
- **Monthly report (PDF)**: Charts page or Settings > *Monthly report (PDF)*. Pick the month, press *Save as PDF / Print*, and choose **Save as PDF** as the destination. Turn off "Headers and footers" in the print window for a cleaner page.

## Phone + Google Drive (optional)

Follow **SETUP-GOOGLE-DRIVE.md** to use MoneyNest on your phone. Entries from the phone and the PC are shared through a
"MoneyNest" folder in your own Google Drive. Nothing is ever deleted from Drive, and the PC app keeps its own database and backups.
Without the setup, the app works on this PC only, exactly as before.

## Loans (lend and borrow)

Open **Loans** in the menu.

- **Add person** creates a person with an automatic ID (P-001, P-002 ...). Each person keeps their own history, so you can lend to or borrow from the same person many times.
- On a person's page use the four buttons: **I lent**, **They paid me back**, **I borrowed**, **I paid back**.
- The page shows who owes whom, the totals, and every entry with a running balance. Tap an entry to edit or delete it.
- Loan entries change your account balances (Cash / bKash / Bank) but are **not** counted as income or expense, so your daily limit, monthly budget and charts are not affected.
- *Settings > Data on your PC > Export loans CSV* opens in Excel.

## How the other numbers work

- **Daily limit:** each day shows spent vs your limit. *Saved today* = limit - spent. The "Saved by staying under your limit" chart adds that up through the month.
- **Monthly budget:** what is left and the safe amount to spend per remaining day.
- **Wishlist:** *Add savings* sets money aside (it stays in your account but is subtracted from "Available"). *Use savings* records the purchase as an expense and can mark the item bought. Wishlist purchases do not count against the daily limit or monthly budget.
- **Transfers** (e.g. Bank to bKash) move money between accounts without being income or expense.

## If something looks wrong

- The top badge should say **Saved on your PC**. If it says "Not saved to PC", the black window is closed. Start the app again; your changes are kept in the browser and are sent to the PC automatically.
- 5 wrong PINs lock sign-in for a short time.
