import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { networkStyles } from '../styles/styles';

const NetworkStatusBanner = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [justCameOnline, setJustCameOnline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = !!state.isConnected;

            if (isConnected === false && connected === true) {
                setJustCameOnline(true);
                setTimeout(() => setJustCameOnline(false), 2000);
            }

            setIsConnected(connected);
        });

        return () => unsubscribe();
    }, [isConnected]);

    if (isConnected === null) return null;

    if (justCameOnline) {
        return (
            <View style={networkStyles.onlineBanner}>
                <View style={networkStyles.greenDot} />
                <Text style={networkStyles.text}>Back online</Text>
            </View>
        );
    }

    return (
        <View style={
            isConnected
                ? networkStyles.onlineBanner
                : networkStyles.offlineBanner
        }
        >
            <View
                style={isConnected ? networkStyles.greenDot : networkStyles.redDot}
            />
            <Text style={networkStyles.text}>
                {isConnected ? 'Online' : 'Offline'}
            </Text>
        </View>
    );
};

export default NetworkStatusBanner;
