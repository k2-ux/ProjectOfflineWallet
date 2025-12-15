Offline Wallet App (React Native CLI)

A mini offline-first wallet application built using React Native CLI (TypeScript) for Android.

This project focuses on architecture, reliability, and edge-case handling rather than UI design.
It simulates a real-world payment flow with offline support, background sync, and idempotent retries.

🚀 Features Overview

Offline-first payment creation

Persistent local storage using SQLite

Idempotent payment retries (no duplicate transactions)

Automatic background sync on network availability

Secure authentication design (no AsyncStorage for tokens)

High-performance transaction list (5,000+ items)

Custom Android native module (battery & network info)

Global error handling

🧱 Architecture Overview

The app is structured using clear separation of concerns:

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

Key Principle

SQLite is the single source of truth.
Redux mirrors database state for fast rendering, but never replaces it.

📁 Project Structure
src/
 ├── api/        # Mock backend APIs
 ├── storage/    # SQLite & secure storage
 ├── store/      # Redux slices (UI cache)
 ├── services/   # Business logic (payments, sync)
 ├── hooks/      # Lifecycle & connectivity hooks
 ├── screens/    # App screens
 ├── components/ # Reusable UI components
 ├── native/     # Android native module bridge
 └── utils/      # Types & helpers

💳 Transaction Engine
Transaction States
INITIATED → PENDING → SUCCESS
                  → FAILED
FAILED → PENDING (retry)

Why INITIATED exists

A transaction is persisted immediately before any network operation begins.
This guarantees safety if the app is killed or the device goes offline mid-action.

🔁 Offline-First & Auto-Sync Logic
Source of Truth

All transactions are written to SQLite first

Network calls only confirm state, never create it

Sync Triggers

The auto-sync engine runs when:

App launches

App returns to foreground

Network becomes available

Sync Algorithm

Query SQLite for transactions where:

Status = PENDING or FAILED

Retry count < 3

Process them sequentially

Update transaction status based on API response

Stop safely on network failure

This guarantees:

No lost payments

No duplicate transactions

Controlled retries with backoff

🔐 Idempotent Payment Strategy

Each transaction:

Uses a client-generated UUID

Is retried using the same ID

The mock backend treats repeated requests with the same ID as safe replays, ensuring idempotency.

⚡ Performance Considerations

SQLite pagination prevents large memory loads

Redux provides fast in-memory reads

FlatList optimizations:

windowing

memoized rows

controlled batch rendering

This allows smooth scrolling with 5,000+ transactions.

📱 Android Native Module

A custom Android native module (Kotlin) exposes:

Battery percentage

Network type (WiFi / Mobile / None)

This demonstrates:

Native ↔ React Native bridging

Android system service usage

Manual ReactPackage registration

🛡 Error Handling

Global error boundary prevents app crashes

Graceful fallback UI in production

No red-screen errors in release builds

🧪 Tested Scenarios

Create payments while offline

Kill app during transaction

Restart app and restore state

Auto-sync when network returns

Retry failed payments safely

Prevent duplicate payments

📌 Why This Project

This repository demonstrates:

Offline-first mobile design

State-machine driven transactions

Reliable retry strategies

App lifecycle awareness

Production-oriented React Native architecture

📝 Notes

React Native CLI only (no Expo)

Android-first implementation

UI intentionally minimal to focus on logic