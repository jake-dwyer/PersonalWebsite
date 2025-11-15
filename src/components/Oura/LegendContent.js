function LegendContent({ payload = [] }) {
  return (
    <div className="flex flex-wrap justify-end gap-4 font-mono text-sm text-[#A1A1A1]">
      {payload.map((entry) => (
        <div
          key={entry.value ?? entry.dataKey}
          className="flex items-center gap-2"
        >
          <span
            className="block h-2 w-2 rounded-sm"
            style={{
              backgroundColor: entry.color || entry.payload?.stroke || "#fff",
            }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default LegendContent;
