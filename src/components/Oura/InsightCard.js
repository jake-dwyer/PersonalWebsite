function InsightCard({ title, metric, delta, helper }) {
  return (
    <article className="border border-outline p-5">
      <p className="font-plex text-xs uppercase tracking-[0.2em] text-secondary">{title}</p>
      <p className="mt-3 font-geist text-3xl text-primary">{metric}</p>
      {delta && <p className="font-plex text-xs text-secondary">{delta}</p>}
      {helper && <p className="mt-2 font-geist text-sm text-secondary">{helper}</p>}
    </article>
  );
}

export default InsightCard;
