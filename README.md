Offline Wallet App (React Native CLI)

A mini offline-first wallet application built using React Native CLI (TypeScript) for Android.

This project focuses on architecture, reliability, and edge-case handling rather than UI design.
It simulates a real-world payment flow with offline support, background sync, and idempotent retries.

## Features Overview

Offline-first payment creation

Persistent local storage using SQLite

Idempotent payment retries (no duplicate transactions)

Automatic background sync on network availability

Secure authentication design (no AsyncStorage for tokens)

High-performance transaction list (5,000+ items)

Custom Android native module (battery & network info)

Global error handling

## Architecture Overview

The app is structured using clear separation of concerns:

UI (Screens / Components)

Hooks (Lifecycle, Auto Sync)

Services (Business Logic)

Store (Redux – UI Cache)

Storage (SQLite – Source of Truth)

Native (Android System APIs)

Key Principle

SQLite is the single source of truth.
Redux mirrors database state for fast rendering, but never replaces it.



1. Project Structure

The project is organized by responsibility, not by feature or UI screens alone.

api: contains mock backend APIs used to simulate payment processing.

storage :handles all local persistence, including SQLite initialization and queries. This layer owns data durability.

store: contains Redux slices used purely as a UI cache. Redux does not persist data.

services: implements core business logic such as payment creation, retries, and background sync.

hooks: encapsulates lifecycle-driven logic like auto-sync, network awareness, and app foreground handling.

screens: contain top-level app screens.

components: contain reusable UI components such as status banners and list rows.

native: exposes a custom Android native module for battery and network information.

utils

2.  Transaction Engine
Transaction States

Each transaction follows a deliberate state machine:

INITIATED => user intent captured

PENDING => system has started processing

SUCCESS  => payment confirmed

FAILED  => processing failed

FAILED  => PENDING =>retry when conditions improve


##  Authentication & App State

Authentication is handled using a mock login API with tokens stored securely using the Android Keystore (via react-native-keychain).Login is only allowed when network connectivity is available. Auth tokens are validated during app bootstrap.

Tokens include an expiry timestamp and are validated during app bootstrap.  
If a token is missing or expired, the user is logged out automatically.

AsyncStorage is intentionally avoided for auth data due to security concerns.

A logout action clears secure auth data and resets application state.


# Offline-First & Auto-Sync Logic

** Source of Truth

i. All transactions are written to SQLite first, before any network call is made.

ii. SQLite is treated as the single source of truth.
iii. the network layer is only responsible for confirming or updating the state of an existing transaction — it never creates new data.

This ensures that user actions are always preserved, regardless of connectivity or app lifecycle interruptions.

**When Sync Runs

The auto-sync engine is designed to run automatically at safe lifecycle moments:

i. When the app launches

ii. When the app returns to the foreground

iii. When network connectivity becomes available

iv. This avoids relying on manual user actions while also preventing unnecessary background work.

**Sync Strategy

During sync, the app queries SQLite for transactions that meet the following conditions:

i. Status is PENDING or FAILED

ii. Retry count is below a defined limit

iii.These transactions are then processed sequentially, not in parallel, to avoid race conditions.

For each transaction:

i. The API is called using the existing transaction ID

ii. The status is updated based on the response

iii. If a network error occurs, the sync stops safely and will resume later


**This approach guarantees that:

i. No payments are lost

ii. Transactions are never duplicated

iii. Retries are controlled and predictable

iv. Network instability does not corrupt state

**Each transaction:

i. Uses a client-generated UUID

ii. Is retried using the same ID

iii. Never creates a new record during retry
iv.The mock backend treats repeated requests with the same ID as safe replays, ensuring idempotency and preventing duplicate processing.

 ** Performance Considerations :

i.SQLite pagination prevents large memory loads

ii.Redux provides fast in-memory reads

iii.FlatList optimizations:

windowing,memoized rows,controlled batch rendering

This allows smooth scrolling with 5,000+ transactions.

# Android Native Module

A custom Android native module (Kotlin) exposes:

i.Battery percentage

ii.Network type (WiFi / Mobile / None)

This demonstrates:

Native android to React Native bridging,Android system service usage,Manual ReactPackage registration

# Error Handling

Global error boundary prevents app crashes

Graceful fallback UI in production

No red-screen errors in release builds

# Tested Scenarios

Create payments while offline

Kill app during transaction

Restart app and restore state

Auto-sync when network returns

Retry failed payments safely

Prevent duplicate payments

# Why This Project

This repository demonstrates:

Offline-first mobile design

State-machine driven transactions

Reliable retry strategies

App lifecycle awareness

Production-oriented React Native architecture
