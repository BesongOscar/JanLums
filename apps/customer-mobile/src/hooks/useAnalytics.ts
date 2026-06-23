export interface AnalyticsEvent {
  name:
    | 'order_viewed'
    | 'order_detail_opened'
    | 'track_screen_viewed'
    | 'active_order_opened'
    | 'order_status_viewed'
    | 'qr_scan_started'
    | 'qr_scan_success'
    | 'qr_scan_failed'
    | 'qr_order_opened';
  properties?: Record<string, unknown>;
}

export interface AnalyticsTracker {
  track(event: AnalyticsEvent): void;
}

const noopTracker: AnalyticsTracker = {
  track: () => {},
};

let tracker: AnalyticsTracker = noopTracker;

export function setAnalyticsTracker(custom: AnalyticsTracker) {
  tracker = custom;
}

export function useAnalytics() {
  return tracker;
}
