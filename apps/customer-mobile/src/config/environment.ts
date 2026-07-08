import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

const ENV = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || extra?.apiUrl || 'http://10.0.2.2:3015/api/v1',
  env: process.env.EXPO_PUBLIC_ENV || extra?.env || 'development',
  appName: process.env.EXPO_PUBLIC_APP_NAME || extra?.appName || 'JanLums',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || extra?.sentryDsn || '',
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY || extra?.posthogKey || '',
};

export const CONFIG = {
  ...ENV,
  isDevelopment: ENV.env === 'development',
  isStaging: ENV.env === 'staging',
  isProduction: ENV.env === 'production',
};
