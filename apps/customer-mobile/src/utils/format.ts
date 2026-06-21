import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  formatStr: 'short' | 'long' | 'time' | 'datetime' = 'short'
): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';

  const formats = {
    short: 'MMM d, yyyy',
    long: 'MMMM d, yyyy',
    time: 'HH:mm',
    datetime: 'MMM d, yyyy HH:mm',
  };

  return format(d, formats[formatStr]);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '';

  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `+237 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
