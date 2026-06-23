export interface AnalyticsEvent {
  name:
    | 'order_viewed'
    | 'order_detail_opened'
    | 'track_screen_viewed'
    | 'active_order_opened'
    | 'order_status_viewed';
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
