import { ReactNode } from 'react';

interface PageTemplateProps {
  activeTab: string;
  subNavBar?: ReactNode;
  panelTitle?: string;
  sectionTitle?: string;
  filterSlot?: ReactNode;
  filters?: ReactNode;
  subFilters?: ReactNode;
  table?: ReactNode;
  modal?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export default function PageTemplate({
  panelTitle,
  sectionTitle,
  filterSlot,
  filters,
  subFilters,
  table,
  modal,
  footer,
  children,
}: PageTemplateProps) {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">{panelTitle}</h1>
      </div>

      <div className="filter-band">
        {filterSlot && (
          <div className="flex justify-end items-center gap-3 mb-3">
            {filterSlot}
          </div>
        )}
        {filters && (
          <div className="flex justify-end gap-2 flex-wrap">
            {filters}
          </div>
        )}
        {subFilters && (
          <div className="mt-3 pt-3 border-t border-neutral-200">
            {subFilters}
          </div>
        )}
      </div>

      <div className="data-table">
        {sectionTitle && (
          <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-800">{sectionTitle}</h2>
          </div>
        )}
        {table}
        {children}
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between text-sm text-neutral-500">
            {footer}
          </div>
        )}
      </div>

      {modal}
    </div>
  );
}
