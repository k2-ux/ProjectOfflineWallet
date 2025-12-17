import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { View } from 'react-native';
import { store, RootState } from './src/store';
import { useAutoSync } from './src/hooks/useAutoSync';
import { initDb } from './src/storage/initDB';
import ErrorBoundary from './src/components/ErrorBoundary';
import { seedTransactionsIfNeeded } from './src/utils/devSeed';
import { loadInitialPage } from './src/services/transactionLoader';
import { bootstrapAuth } from './src/services/authBootstrap';
import LoginScreen from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';

const AppContent = () => {
  useAutoSync();

  const { isAuthenticated, initialized } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const bootstrap = async () => {
      await initDb();
      await bootstrapAuth();
      await seedTransactionsIfNeeded();
      await loadInitialPage();
    };

    bootstrap();
  }, []);


  if (!initialized) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {isAuthenticated ? <HomeScreen /> : <LoginScreen />}
    </View>
  );;
}
const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
};


export default App;
