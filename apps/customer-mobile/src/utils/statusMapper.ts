import { OrderStatus } from '../types';
import { statusColors } from '../config/colors';

export interface StatusTranslation {
  label: string;
  description: string;
  color: string;
  backgroundColor: string;
  icon: string;
  showInTimeline: boolean;
  timelinePosition: number;
  isTerminal: boolean;
}

export const STATUS_MAP: Record<OrderStatus, StatusTranslation> = {
  pending: {
    label: 'Order Placed',
    description: 'Your order has been received and is awaiting confirmation.',
    color: statusColors.pending.color,
    backgroundColor: statusColors.pending.background,
    icon: 'clock-outline',
    showInTimeline: true,
    timelinePosition: 1,
    isTerminal: false,
  },
  received: {
    label: 'Received at Branch',
    description: 'Your garments have been received at our branch.',
    color: statusColors.received.color,
    backgroundColor: statusColors.received.background,
    icon: 'home-check',
    showInTimeline: true,
    timelinePosition: 2,
    isTerminal: false,
  },
  tagged: {
    label: 'Garments Tagged',
    description: 'Your garments have been tagged and are ready for processing.',
    color: statusColors.tagged.color,
    backgroundColor: statusColors.tagged.background,
    icon: 'tag',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: false,
  },
  in_wash: {
    label: 'Washing in Progress',
    description: 'Your garments are being washed.',
    color: statusColors.in_wash.color,
    backgroundColor: statusColors.in_wash.background,
    icon: 'water',
    showInTimeline: true,
    timelinePosition: 3,
    isTerminal: false,
  },
  in_dry: {
    label: 'Drying',
    description: 'Your garments are being dried.',
    color: statusColors.in_dry.color,
    backgroundColor: statusColors.in_dry.background,
    icon: 'weather-windy',
    showInTimeline: true,
    timelinePosition: 4,
    isTerminal: false,
  },
  in_press: {
    label: 'Ironing',
    description: 'Your garments are being ironed.',
    color: statusColors.in_press.color,
    backgroundColor: statusColors.in_press.background,
    icon: 'iron',
    showInTimeline: true,
    timelinePosition: 5,
    isTerminal: false,
  },
  quality_check: {
    label: 'Quality Inspection',
    description: 'Your garments are undergoing quality inspection.',
    color: statusColors.quality_check.color,
    backgroundColor: statusColors.quality_check.background,
    icon: 'check-circle',
    showInTimeline: true,
    timelinePosition: 6,
    isTerminal: false,
  },
  ready: {
    label: 'Ready for Pickup',
    description: 'Your garments are ready! Please pick them up at your branch.',
    color: statusColors.ready.color,
    backgroundColor: statusColors.ready.background,
    icon: 'check-circle',
    showInTimeline: true,
    timelinePosition: 7,
    isTerminal: false,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    description: 'Your garments are on the way to you.',
    color: statusColors.out_for_delivery.color,
    backgroundColor: statusColors.out_for_delivery.background,
    icon: 'truck-delivery',
    showInTimeline: true,
    timelinePosition: 8,
    isTerminal: false,
  },
  completed: {
    label: 'Completed',
    description: 'Your order has been completed. Thank you!',
    color: statusColors.completed.color,
    backgroundColor: statusColors.completed.background,
    icon: 'check-all',
    showInTimeline: true,
    timelinePosition: 9,
    isTerminal: true,
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Your order has been cancelled.',
    color: statusColors.cancelled.color,
    backgroundColor: statusColors.cancelled.background,
    icon: 'close-circle',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: true,
  },
  rewash: {
    label: 'Being Rewashed',
    description: 'Your garments need additional cleaning. No extra charge.',
    color: statusColors.rewash.color,
    backgroundColor: statusColors.rewash.background,
    icon: 'refresh',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: false,
  },
  damaged: {
    label: 'Issue Reported',
    description: 'An issue was found with your garment. Our team will contact you.',
    color: statusColors.damaged.color,
    backgroundColor: statusColors.damaged.background,
    icon: 'alert',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: true,
  },
  on_hold: {
    label: 'On Hold',
    description: 'Your order is on hold. Our team will contact you shortly.',
    color: statusColors.on_hold.color,
    backgroundColor: statusColors.on_hold.background,
    icon: 'pause-circle',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: false,
  },
};

export function getStatusTranslation(status: OrderStatus): StatusTranslation {
  return STATUS_MAP[status] ?? STATUS_MAP.pending;
}

export function getProgressPercent(status: OrderStatus): number {
  const timelineStatuses: OrderStatus[] = [
    'pending', 'received', 'tagged', 'in_wash',
    'in_dry', 'in_press', 'quality_check', 'ready', 'completed',
  ];

  const index = timelineStatuses.indexOf(status);
  if (index === -1) return 0;

  return Math.round((index / (timelineStatuses.length - 1)) * 100);
}

export function getTimelineStatuses(): OrderStatus[] {
  return Object.entries(STATUS_MAP)
    .filter(([, translation]) => translation.showInTimeline)
    .sort(([, a], [, b]) => a.timelinePosition - b.timelinePosition)
    .map(([status]) => status as OrderStatus);
}
