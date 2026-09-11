export function AuroraBorealis({ active = false }: { active?: boolean }) {
  return (
    <div
      className={`aurora ${active ? "active" : ""}`}
      aria-hidden="true"
    >
      <span className="aurora-band aurora-1" />
      <span className="aurora-band aurora-2" />
      <span className="aurora-band aurora-3" />
      <span className="aurora-band aurora-4" />
    </div>
  );
}