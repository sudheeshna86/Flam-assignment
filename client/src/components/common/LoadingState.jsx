function LoadingState({ requests }) {
  return <div aria-live="polite">{requests.map((request) => <section className="loading-state" key={request.id}><div className="skeleton-card"><div className="skeleton-line short" /><div className="skeleton-line" /><div className="skeleton-line medium" /><div className="skeleton-orbit" /></div><p className="eyebrow">GENERATION {request.id} / {request.input}</p><h2>{["Reading your notes...", "Finding key concepts...", "Structuring your flashcards...", "Preparing your study session..."][request.messageIndex]}</h2><div className="loading-dots"><span /><span /><span /></div></section>)}</div>;
}

export default LoadingState;
