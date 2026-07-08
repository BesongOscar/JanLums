import { Linking } from 'react-native';

export type DeepLinkRoute = 'order_detail' | 'notification_detail' | 'account' | 'orders_list' | 'unknown';

export interface DeepLinkTarget {
  route: DeepLinkRoute;
  params: Record<string, string>;
}

const SCHEME_PREFIX = 'janlums://';

function stripPrefix(url: string): string {
  const lower = url.toLowerCase().trim();
  if (lower.startsWith(SCHEME_PREFIX)) {
    return url.slice(SCHEME_PREFIX.length);
  }
  const httpMatch = lower.match(/^https?:\/\/(?:[^/]+)\/(.+)/);
  if (httpMatch) {
    return httpMatch[1];
  }
  return url;
}

export function parseDeepLink(url: string): DeepLinkTarget {
  const path = stripPrefix(url);

  const orderMatch = path.match(/^orders\/(.+)/);
  if (orderMatch) {
    return { route: 'order_detail', params: { id: orderMatch[1] } };
  }

  const notificationMatch = path.match(/^notifications\/(.+)/);
  if (notificationMatch) {
    return { route: 'notification_detail', params: { id: notificationMatch[1] } };
  }

  if (path === 'account' || path === 'account/') {
    return { route: 'account', params: {} };
  }

  if (path === 'orders' || path === 'orders/') {
    return { route: 'orders_list', params: {} };
  }

  return { route: 'unknown', params: { original: url } };
}

export function getNavigationPath(target: DeepLinkTarget): string {
  switch (target.route) {
    case 'order_detail':
      return `/orders/${encodeURIComponent(target.params.id)}`;
    case 'notification_detail':
      return `/(tabs)/notifications/${encodeURIComponent(target.params.id)}`;
    case 'account':
      return '/(tabs)/account';
    case 'orders_list':
      return '/(tabs)/orders';
    default:
      return '/(tabs)';
  }
}

export function createDeepLink(route: DeepLinkRoute, params?: Record<string, string>): string {
  switch (route) {
    case 'order_detail':
      return `${SCHEME_PREFIX}orders/${params?.id ?? ''}`;
    case 'notification_detail':
      return `${SCHEME_PREFIX}notifications/${params?.id ?? ''}`;
    case 'account':
      return `${SCHEME_PREFIX}account`;
    case 'orders_list':
      return `${SCHEME_PREFIX}orders`;
    default:
      return SCHEME_PREFIX;
  }
}
