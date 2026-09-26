function CompletionState({ total, mastered, review, onReview, onNew }) {
  return <section className="completion-state"><div className="completion-check">✓</div><p className="eyebrow">SESSION ARCHIVED</p><h2>Session complete.</h2><p>You completed your study session. A little progress, made tangible.</p><div className="completion-stats"><div><strong>{total}</strong><span>Studied</span></div><div><strong>{mastered}</strong><span>Mastered</span></div><div><strong>{review}</strong><span>Review</span></div></div><div className="completion-actions"><button className="button button-secondary" onClick={onReview} disabled={!review}>Review difficult cards</button><button className="button button-primary" onClick={onNew}>Start new session <span>→</span></button></div></section>;
}

export default CompletionState;
