# Offline Wallet — How It Works

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [Starting Up](#2-starting-up)
3. [Screens and Navigation](#3-screens-and-navigation)
4. [Login, Logout, and Sessions](#4-login-logout-and-sessions)
5. [Creating a Payment](#5-creating-a-payment)
6. [What Happens When You're Offline](#6-what-happens-when-youre-offline)
7. [Auto-Sync](#7-auto-sync)
8. [Scrolling Through Transactions](#8-scrolling-through-transactions)
9. [Where Data Lives](#9-where-data-lives)
10. [Talking to the Backend](#10-talking-to-the-backend)
11. [Admin Features](#11-admin-features)
12. [What Happens When Things Go Wrong](#12-what-happens-when-things-go-wrong)

---

## 1. What This App Does

This is a mobile wallet app. Users can create payments, view their transaction history, and the app will automatically retry failed or pending payments whenever internet comes back. The core idea is **offline-first**: every transaction is saved to the phone first, and network calls happen after.

---

## 2. Starting Up

When the app opens, three things happen at the same time before any screen is shown:

**Step 1 — Set up the database**
The app creates a local SQLite database on the phone (called `wallet.db`) with a `transactions` table if it doesn't already exist.

**Step 2 — Check if the user is already logged in**
The app looks for a saved login token in the phone's secure storage (keychain). If it finds one and it hasn't expired, the user is treated as still logged in. If the token is missing or expired, the user is logged out.

**Step 3 — Load the first batch of transactions**
The app reads the 50 most recent transactions from the local database so they're ready to display immediately.

Once all three steps finish, the app decides which screen to show: the **Home screen** if logged in, or the **Login screen** if not.

---

## 3. Screens and Navigation

The app has two groups of screens:

**When logged out (Auth screens):**
- **Login screen** — enter email and password
- **Register screen** — create a new account

**When logged in (App screens):**
- **Home screen** — view transactions, add new ones, logout

There is no manual navigation for login/logout. When the login state changes in Redux, the app automatically switches between the two screen groups. No `navigate()` call needed.

---

## 4. Login, Logout, and Sessions

### Logging In

1. User types email and password on the Login screen.
2. The app validates the inputs (correct email format, no empty fields).
3. The app checks if there's an internet connection. Login requires internet.
4. The app sends the credentials to the backend (`POST /auth/login`).
5. The backend returns two tokens: an **access token** and a **refresh token**.
6. Both tokens are saved securely on the phone (in the keychain).
7. The access token is decoded to read the user's **role** (ADMIN, SUPERVISOR, etc.).
8. Redux is updated: `isAuthenticated = true`, role is saved.
9. The app automatically switches to the Home screen.

### Staying Logged In After Closing the App

When the app restarts, it checks the saved token:
- If the token is still valid (not expired), the user goes straight to the Home screen.
- If the token is expired or missing, the user is sent to the Login screen.

### Token Expiry During Use

If a network request fails with a "401 Unauthorized" response, the app automatically tries to get a new access token using the refresh token (`POST /auth/refresh`). If that works, the original request is retried. If the refresh also fails, the user is logged out.

### Logging Out

1. User taps the Logout button.
2. The saved tokens are deleted from the keychain.
3. Redux is updated: `isAuthenticated = false`.
4. The app automatically switches back to the Login screen.

---

## 5. Creating a Payment

When the user taps "Add Transaction" and submits an amount:

1. A unique ID (UUID) is generated for this transaction.
2. The transaction is immediately saved to the local SQLite database with status `PENDING`. **This happens before any network call.**
3. Redux is updated so the transaction appears in the list right away.
4. The app then tries to send the payment to the backend in the background (the user doesn't have to wait for this).

**What happens in the background network call:**

- The app checks if there's internet. If not, it stops here. The transaction stays as `PENDING` and will be retried later.
- If there is internet, the app calls `POST /payments` with the transaction ID and amount.
- If the backend responds with **SUCCESS**, the transaction status is updated to `SUCCESS` in the database and in Redux.
- If the backend responds with **FAILED**, the status is set to `FAILED` and the retry count goes up by 1.
- If there's a network error, the status stays `PENDING` and the retry count goes up by 1.

**Important rule:** Once a transaction reaches `SUCCESS`, it can never be changed back to anything else. This prevents accidental overwrites during syncing.

---

## 6. What Happens When You're Offline

The app is designed to work without internet. Here's the key idea:

**Every transaction is saved locally first.** The network call is just a "best effort" after that.

If you create a payment while offline:
- The transaction is saved to SQLite immediately with status `PENDING`.
- It shows up in your transaction list right away.
- When internet comes back, the app automatically picks it up and tries to send it.

Each transaction keeps a **retry count**. If a transaction fails to sync 3 times, it is no longer retried automatically (it stays stuck at `FAILED`).

---

## 7. Auto-Sync

The app automatically tries to sync any `PENDING` or `FAILED` transactions in three situations:

- When the app first opens
- When internet connection is restored
- When the app comes back to the foreground (from being minimized)

**How syncing works:**

1. The app checks if a sync is already running. If yes, it skips (no double-syncing).
2. It checks if there's internet. If not, it skips.
3. It shows a "Syncing payments..." banner on screen.
4. It fetches up to 10 transactions from the database where the status is `PENDING` or `FAILED` and the retry count is less than 3.
5. It processes them **one at a time** (not all at once) to avoid conflicts.
6. Each one goes through the same payment process described in Section 5.
7. When done, the banner disappears.

---

## 8. Scrolling Through Transactions

**First load:** When the Home screen opens, the 50 most recent transactions are loaded from the local database.

**Loading more:** When the user scrolls to the bottom of the list, the next 50 transactions are loaded from the database and added to the list. This keeps going until there are no more transactions left.

**Pull to refresh:** Pulling down on the list reloads the first 50 transactions from scratch and also refreshes the battery level and network type shown at the top.

---

## 9. Where Data Lives

The app uses two storage systems:

### SQLite (Local Database)

This is the **source of truth**. All transactions are stored here permanently on the device. Even if the app is closed and reopened, the data is still there.

The transactions table stores: `id`, `amount`, `status`, `retryCount`, `createdAt`, `updatedAt`.

### Redux (In-Memory State)

This is a fast, temporary copy of the data used to drive the UI. It mirrors what's in SQLite. When the app restarts, Redux is empty and gets refilled from SQLite. Redux is never saved to disk.

**Rule:** Always write to SQLite first, then update Redux. Never the other way around.

### Keychain (Secure Storage)

The login tokens (access token + refresh token) are stored here. This is encrypted and managed by the operating system. The app uses `react-native-keychain` to read and write tokens.

---

## 10. Talking to the Backend

All API requests automatically include the user's access token in the `Authorization` header.

| What it does | Method | URL |
|---|---|---|
| Login | POST | `/auth/login` |
| Register | POST | `/auth/register` |
| Refresh token | POST | `/auth/refresh` |
| Create/send payment | POST | `/payments` |
| Get payment status | GET | `/payments/:id` |
| Get admin stats | GET | `/admin/stats` |

If any request gets a 401 response, the app silently refreshes the token and retries the request once before giving up.

---

## 11. Admin Features

On the Home screen, a special section is shown only to users with the role `ADMIN` or `SUPERVISOR`. It lets them fetch server statistics from `/admin/stats` — showing things like the server time and their role. If a lower-role user somehow triggers it, the server returns 403 and the app shows "Access denied" cleanly.

The user's role comes from decoding the JWT access token after login. It's stored in Redux and checked wherever role-gating is needed.

---

## 12. What Happens When Things Go Wrong

| Problem | What the app does |
|---|---|
| No internet when logging in | Shows an error before even trying the API |
| Token expired on app open | Logs the user out automatically |
| Any API call returns 401 | Tries to refresh the token silently, then retries |
| No internet when paying | Saves as PENDING, syncs when internet returns |
| Network error during sync | Leaves as PENDING, increments retry count |
| Transaction fails 3 times | Stops retrying (excluded from future syncs) |
| Two syncs triggered at once | Second one is ignored, only one runs at a time |
| A component crashes | ErrorBoundary catches it and shows a "Try Again" screen instead of a blank crash |
| Same payment sent twice | The unique transaction ID prevents duplicates — the database uses `INSERT OR REPLACE` |
