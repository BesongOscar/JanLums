export interface AnalyticsEvent {
  name:
    | 'login'
    | 'register'
    | 'logout'
    | 'order_viewed'
    | 'order_detail_opened'
    | 'track_screen_viewed'
    | 'active_order_opened'
    | 'order_status_viewed'
    | 'home_screen_viewed'
    | 'account_screen_viewed'
    | 'notifications_screen_viewed'
    | 'qr_scan_started'
    | 'qr_scan_success'
    | 'qr_scan_failed'
    | 'qr_order_opened'
    | 'service_viewed'
    | 'service_added_to_order'
    | 'order_review_opened'
    | 'order_submission_started'
    | 'order_submission_completed'
    | 'notifications_opened'
    | 'notification_opened'
    | 'notification_marked_read'
    | 'notifications_mark_all_read'
    | 'notification_deleted'
    | 'notifications_deleted_all'
    | 'profile_viewed'
    | 'profile_updated'
    | 'profile_update_failed'
    | 'settings_viewed'
    | 'scan_history_viewed';
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
