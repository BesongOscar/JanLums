import * as Sentry from '@sentry/react-native';
import { CONFIG } from '../config/environment';

export function initializeSentry() {
  if (CONFIG.sentryDsn) {
    Sentry.init({
      dsn: CONFIG.sentryDsn,
      environment: CONFIG.env,
      enableAutoPerformanceTracing: true,
      tracesSampleRate: CONFIG.isProduction ? 0.2 : 1.0,
      attachScreenshot: false,
      enableWatchdogTerminationTracking: false,
      enabled: true,
    });
  }
}

export default Sentry;
