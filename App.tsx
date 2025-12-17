import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { View } from 'react-native';
import { useAutoSync } from './src/hooks/useAutoSync';
import { initDb } from './src/storage/initDB';
import { HomeScreen } from './src/screens/HomeScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import { seedTransactionsIfNeeded } from './src/utils/devSeed';
import { loadInitialPage } from './src/services/transactionLoader';

const App = () => {
  // 🔁 start auto-sync listeners
  useAutoSync();

  // 🗄️ initialize database once
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initDb();
        await seedTransactionsIfNeeded(); // DEV only
        await loadInitialPage(); // ✅ paginated
      } catch (err) {
        console.error('App bootstrap failed', err);
      }
    };

    bootstrap();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <HomeScreen />
        </View>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
