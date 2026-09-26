function QuizResult({ retestMode, answered, correct, wrongCount, onRetest, onStudyAgain, onNew }) {
  return <section className="quiz-result"><div className="completion-check">{wrongCount === 0 ? "✓" : "!"}</div><p className="eyebrow">{retestMode ? "RETEST COMPLETE" : "QUIZ COMPLETE"}</p><h2>{retestMode ? "Keep reinforcing." : "Quiz complete."}</h2><p>{retestMode ? `${wrongCount === 0 ? "All mistakes corrected!" : `${wrongCount} ${wrongCount === 1 ? "card remains" : "cards remain"}.`}` : `${correct} / ${answered} correct. ${wrongCount} incorrect.`}</p><div className="quiz-result-actions">{wrongCount > 0 && <button className="button button-secondary" onClick={onRetest}>Retest wrong answers</button>}<button className="button button-secondary" onClick={onStudyAgain}>Study again</button><button className="button button-primary" onClick={onNew}>New study set <span>→</span></button></div></section>;
}

export default QuizResult;
