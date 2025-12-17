import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles, buttonStyles, typography } from '../styles/styles';

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    // In real apps, log to Crashlytics / Sentry
    console.log('ErrorBoundary caught:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={commonStyles.container}>
          <Text style={typography.h1}>
            Something went wrong
          </Text>
          <Text style={typography.meta}>
            Please restart the app or try again.
          </Text>

          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={this.reset}
          >
            <Text style={buttonStyles.primaryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
