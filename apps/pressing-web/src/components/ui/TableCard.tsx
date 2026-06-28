import { ReactNode } from 'react';

interface TableCardProps {
  title?: string;
  headerActions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export default function TableCard({ title, headerActions, filters, children, footer }: TableCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded shadow-sm">
      {title && (
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
          {headerActions}
        </div>
      )}
      {filters && <div className="px-6 py-4 border-b border-neutral-200">{filters}</div>}
      <div>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-neutral-200 text-sm text-neutral-500">
          {footer}
        </div>
      )}
    </div>
  );
}
