import { OrderStatus } from '../types';
import { getStatusTranslation } from './statusMapper';

export function getOrderStatusDescription(status: OrderStatus): string {
  return getStatusTranslation(status).description;
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return getStatusTranslation(status).label;
}
