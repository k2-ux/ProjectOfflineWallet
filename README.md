# 💳 Offline Wallet App

A mini **offline-first wallet application** built with **React Native CLI (TypeScript)** for Android.

This project prioritizes architecture, reliability, and edge-case handling over UI polish — simulating a real-world payment flow with offline support, background sync, idempotent retries, and secure authentication.

---

## 📱 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/b67d613f-d42a-4226-9d7b-332df45687ed" width="280"/>
  <img src="https://github.com/user-attachments/assets/53913e5c-7894-45e1-9ed8-a833d38454ee" width="280"/>
  <img src="https://github.com/user-attachments/assets/b92a7ffa-f421-4584-8e9a-d8eab339f6c7" width="280"/>
</p>

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📴 Offline-first payments | Create payments without any network connection |
| 🗄️ SQLite persistence | All transactions stored locally as the source of truth |
| 🔁 Idempotent retries | Client-generated UUIDs prevent duplicate transactions |
| 🔄 Auto background sync | Syncs automatically on launch, foreground, or reconnect |
| 🔐 Secure auth | Android Keystore via `react-native-keychain` — no AsyncStorage |
| ⚡ High-performance list | Smooth scrolling tested with 5,000+ transactions |
| 📡 Native Android module | Kotlin module exposing battery level and network type |
| 🛡️ Global error handling | Error boundary with graceful fallback UI |

---

## 🛠️ Installation

```bash
# Clone the repository
git clone <repo-url>
cd offline-wallet-app

# Install dependencies
npm install

# Run on Android
npx react-native run-android
```

### ⚠️ Known Build Fix

If the build fails due to a `jcenter()` deprecation error, open:

```
node_modules/react-native-sqlite-storage/platforms/android/build.gradle
```

Replace:

```gradle
repositories {
    jcenter()
}
```

With:

```gradle
repositories {
    mavenCentral()
    google()
}
```

---

## 🏗️ Architecture

The app follows a strict separation of concerns across six layers:

```
UI (Screens / Components)
        ↓
Hooks (Lifecycle, Auto Sync)
        ↓
Services (Business Logic)
        ↓
Store (Redux – UI Cache)
        ↓
Storage (SQLite – Source of Truth)
        ↓
Native (Android System APIs)
```

> **Key Principle:** SQLite is the single source of truth. Redux mirrors database state for fast rendering but never replaces it.

---

## 📂 Project Structure

```
src/
├── api/          # Backend API calls
├── storage/      # SQLite initialization & queries
├── store/        # Redux slices (UI cache only)
├── services/     # Payment engine & sync logic
├── hooks/        # Lifecycle & connectivity hooks
├── screens/      # Top-level app screens
├── components/   # Reusable UI components
├── native/       # Android native module bridge
└── utils/        # Types & helpers
```

---

## 🔁 Transaction State Machine

Each transaction follows a deliberate state machine to guarantee safety:

```
INITIATED → PENDING → SUCCESS
                    ↘ FAILED → PENDING (retry)
```

| State | Meaning |
|---|---|
| `INITIATED` | User intent persisted to SQLite before any network call |
| `PENDING` | Network request in progress |
| `SUCCESS` | Backend confirmed |
| `FAILED` | Network or server error; eligible for retry |

> **Why `INITIATED` exists:** User intent is written to SQLite *before* any network call. This guarantees no payment is lost if the app is killed or the device goes offline mid-action.

---

## 🔐 Authentication

- Tokens stored via **Android Keystore** (`react-native-keychain`)
- Login permitted **only when network is available**
- Token expiry validated on every app bootstrap
- Automatic logout on invalid or expired tokens
- `AsyncStorage` intentionally avoided for all auth data

---

## 🔄 Offline-First & Sync Logic

### Source of Truth

All transactions are written to SQLite first. The network layer only confirms or updates state — the backend never creates transaction IDs.

### When Sync Runs

Auto-sync triggers on:
- App launch
- App returns to foreground
- Network becomes available

### Sync Strategy

```
1. Query SQLite for PENDING or FAILED transactions below retry limit
2. Process sequentially (no parallel race conditions)
3. Update status based on backend response
4. Stop safely on network failure
```

### Guarantees

✅ No lost payments  
✅ No duplicate transactions  
✅ Controlled retry limits  
✅ Safe crash recovery  

### Idempotency

Each transaction uses a **client-generated UUID** that is reused on every retry. The backend treats duplicate IDs as safe replays.

---

## ⚡ Performance

- **SQLite pagination** prevents large memory loads
- **Redux** provides fast in-memory reads for rendering
- **FlatList optimizations:**
  - Windowing (only renders visible rows)
  - Memoized row components
  - Controlled batch rendering

Smooth scrolling tested with **5,000+ transactions**.

---

## 📡 Android Native Module

A custom Kotlin module exposes device information to JavaScript:

| API | Returns |
|---|---|
| `getBatteryLevel()` | Battery percentage |
| `getNetworkType()` | `WiFi` / `Mobile` / `None` |

This demonstrates:
- Native-to-React Native bridging
- Android system service usage
- Manual `ReactPackage` registration

---

## 🛡️ Error Handling

- Global **error boundary** catches uncaught JS errors
- Graceful fallback UI instead of red-screen crashes
- No crash screens in release builds

---

## 🧪 Tested Scenarios

- [x] Create payments while offline
- [x] Kill app during a transaction
- [x] Restart and restore state correctly
- [x] Auto-sync when network returns
- [x] Retry failed payments safely
- [x] Prevent duplicate transaction processing

---

## 🎯 Why This Project

This repository demonstrates production-oriented React Native engineering:

- **Offline-first mobile architecture**
- **State-machine driven transactions**
- **Idempotent backend integration**
- **Crash-safe persistence**
- **Lifecycle-aware synchronization**
- **Secure credential storage**
