import { OrderStatus } from '../types';

export type FilterKey = 'all' | 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';

export const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export const FILTER_STATUS_MAP: Record<FilterKey, OrderStatus[]> = {
  all: [
    'pending', 'received', 'tagged', 'in_wash', 'in_dry', 'in_press',
    'quality_check', 'ready', 'out_for_delivery', 'completed', 'cancelled',
    'rewash', 'damaged', 'on_hold',
  ],
  pending: ['pending'],
  in_progress: [
    'received', 'tagged', 'in_wash', 'in_dry', 'in_press',
    'quality_check', 'out_for_delivery', 'rewash', 'damaged', 'on_hold',
  ],
  ready: ['ready'],
  completed: ['completed'],
  cancelled: ['cancelled'],
};
