function EmptyState() {
  return (
    <section className="empty-state" aria-label="Empty study deck">
      <div className="empty-illustration" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="eyebrow">YOUR NEXT SESSION</p>
      <h2>Your study deck is waiting.</h2>
      <p>Generate your first set and turn passive notes into active recall.</p>
    </section>
  );
}

export default EmptyState;
