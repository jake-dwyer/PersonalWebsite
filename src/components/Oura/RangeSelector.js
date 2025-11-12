const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

function RangeSelector({ value, onChange, onRefresh, loading }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {RANGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            value === option.value
              ? 'border-primary text-primary'
              : 'border-outline text-secondary hover:text-primary'
          }`}
          disabled={value === option.value}
        >
          {option.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onRefresh}
        className="rounded-full border border-outline px-4 py-2 text-sm text-secondary transition-colors hover:border-primary hover:text-primary"
        disabled={loading}
      >
        {loading ? 'Refreshing…' : 'Refresh data'}
      </button>
    </div>
  );
}

export default RangeSelector;
