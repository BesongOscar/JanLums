import * as Sentry from 'sentry-expo';
import { CONFIG } from '../config/environment';

export function initializeSentry() {
  if (!CONFIG.sentryDsn) return;

  Sentry.init({
    dsn: CONFIG.sentryDsn,
    environment: CONFIG.env,
    enabled: true,
  });
}