Offline Wallet App (React Native CLI)

A mini offline-first wallet application built using React Native CLI (TypeScript) for Android.

This project focuses on architecture, reliability, and edge-case handling rather than UI design.
It simulates a real-world payment flow with offline support, background sync, idempotent retries, and secure authentication.




https://github.com/user-attachments/assets/25e27276-0f89-4548-a9df-9a18477142f4


📱 Screenshots
<p align="center"> <img src="https://github.com/user-attachments/assets/b67d613f-d42a-4226-9d7b-332df45687ed" width="300"/> <img src="https://github.com/user-attachments/assets/53913e5c-7894-45e1-9ed8-a833d38454ee" width="300"/> <img src="https://github.com/user-attachments/assets/b92a7ffa-f421-4584-8e9a-d8eab339f6c7" width="300"/> </p>
🚀 Features Overview

Offline-first payment creation

Persistent local storage using SQLite

Idempotent payment retries (no duplicate transactions)

Automatic background sync on network availability

Secure authentication (no AsyncStorage for tokens)

High-performance transaction list (5,000+ items)

Custom Android native module (battery & network info)

Global error handling

🛠 Installation (Important Fix)

If build fails due to jcenter() issue:

Open:

node_modules/react-native-sqlite-storage/platforms/android/build.gradle


Replace:

repositories {
    jcenter()
}


With:

repositories {
    mavenCentral()
    google()
}

🏗 Architecture Overview

The app follows clear separation of concerns:

UI (Screens / Components)

Hooks (Lifecycle, Auto Sync)

Services (Business Logic)

Store (Redux – UI Cache)

Storage (SQLite – Source of Truth)

Native (Android System APIs)

Key Principle

SQLite is the single source of truth.
Redux mirrors database state for fast rendering but never replaces it.

📂 Project Structure (Simplified)

The project is organized by responsibility:

api/ → Backend API calls

storage/ → SQLite initialization & queries

store/ → Redux slices (UI cache only)

services/ → Payment engine & sync logic

hooks/ → Lifecycle & connectivity logic

screens/ → Top-level app screens

components/ → Reusable UI components

native/ → Android native module bridge

utils/ → Types & helpers

🔁 Transaction Engine

Each transaction follows a deliberate state machine:

INITIATED → PENDING → SUCCESS
                    → FAILED
FAILED → PENDING (retry)

Why INITIATED exists

User intent is persisted to SQLite before any network call.
This guarantees safety if the app is killed or the device goes offline mid-action.

🔐 Authentication & App State

Secure token storage using Android Keystore (react-native-keychain)

Login allowed only when network is available

Token expiry validated during app bootstrap

Automatic logout on invalid/expired token

AsyncStorage intentionally avoided for auth data

🔄 Offline-First & Auto-Sync Logic
Source of Truth

All transactions are written to SQLite first

Network layer only confirms or updates state

Backend never creates transaction IDs

When Sync Runs

Auto-sync triggers automatically:

On app launch

When app returns to foreground

When network becomes available

Sync Strategy

During sync:

Query SQLite for:

Status = PENDING or FAILED

Retry count below limit

Process sequentially (no parallel race conditions)

Update status based on backend response

Stop safely on network failure

Guarantees

No lost payments

No duplicate transactions

Controlled retries

Safe recovery after crash

Idempotency

Each transaction:

Uses a client-generated UUID

Reuses the same ID for retries

Backend treats duplicate IDs as safe replays

⚡ Performance Considerations

SQLite pagination prevents large memory loads

Redux provides fast in-memory reads

FlatList optimizations:

Windowing

Memoized rows

Controlled batch rendering

Smooth scrolling tested with 5,000+ transactions.

📱 Android Native Module

Custom Android module (Kotlin) exposes:

Battery percentage

Network type (WiFi / Mobile / None)

Demonstrates:

Native-to-React Native bridging

Android system service usage

Manual ReactPackage registration

🛡 Error Handling

Global error boundary

Graceful fallback UI

No red-screen crashes in release builds

🧪 Tested Scenarios

Create payments while offline

Kill app during transaction

Restart and restore state

Auto-sync when network returns

Retry failed payments safely

Prevent duplicate processing

🎯 Why This Project

This repository demonstrates:

Offline-first mobile architecture

State-machine driven transactions

Idempotent backend integration






Crash-safe persistence

Lifecycle-aware synchronization

Production-oriented React Native design
