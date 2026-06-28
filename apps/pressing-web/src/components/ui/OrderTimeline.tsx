interface TimelineEntry {
  status: string;
  label: string;
  timestamp?: string;
  actor?: string;
  notes?: string;
  active?: boolean;
  isException?: boolean;
}

interface OrderTimelineProps {
  entries: TimelineEntry[];
}

const statusIcons: Record<string, string> = {
  pending: '\u23F3',
  received: '\uD83D\uDCE5',
  in_wash: '\uD83D\uDCA7',
  in_dry: '\u2600\uFE0F',
  in_press: '\uD83D\uDEC3',
  quality_check: '\uD83D\uDD0D',
  ready: '\u2705',
  out_for_delivery: '\uD83D\uDE9A',
  completed: '\uD83C\uDF89',
  cancelled: '\u274C',
  rewash: '\uD83D\uDD04',
  damaged: '\u26A0\uFE0F',
};

export default function OrderTimeline({ entries }: OrderTimelineProps) {
  return (
    <div className="relative pl-8">
      {entries.map((entry, i) => (
        <div key={i} className="relative pb-6 last:pb-0">
          <div className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 ${
            entry.active
              ? 'bg-primary border-primary text-white'
              : entry.isException
              ? 'bg-danger border-danger text-white'
              : 'bg-white border-neutral-300 text-neutral-400'
          }`}>
            {statusIcons[entry.status] || '\u2022'}
          </div>
          {i < entries.length - 1 && (
            <div className={`absolute left-2.5 top-6 w-0.5 h-full -translate-x-1/2 ${
              entry.active ? 'bg-primary' : 'bg-neutral-200'
            }`} />
          )}
          <div className={`ml-4 ${entry.active ? 'opacity-100' : 'opacity-60'}`}>
            <div className="flex items-center gap-3">
              <span className={`font-semibold text-sm ${entry.active ? 'text-primary' : 'text-neutral-700'}`}>
                {entry.label}
              </span>
              {entry.timestamp && (
                <span className="text-xs text-neutral-400">{entry.timestamp}</span>
              )}
            </div>
            {entry.actor && (
              <p className="text-xs text-neutral-500 mt-0.5">{entry.actor}</p>
            )}
            {entry.notes && (
              <p className={`text-xs mt-1 ${entry.isException ? 'text-danger' : 'text-neutral-500'}`}>
                {entry.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
