import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { View, Text } from 'react-native';
import { useAutoSync } from './src/hooks/useAutoSync';
import { initDb } from './src/storage/initDB';
import { HomeScreen } from './src/screens/HomeScreen';
import { loadTransactionsFromDB } from './src/services/transactionLoader';

const App = () => {
  // 🔁 start auto-sync listeners
  useAutoSync();

  // 🗄️ initialize database once
  useEffect(() => {
    initDb()
      .then(loadTransactionsFromDB)
      .catch(err => {
        console.error('DB init failed', err);
      });
  }, []);

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <HomeScreen />
      </View>
    </Provider>
  );
};

export default App;
