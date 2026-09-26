function StudyStats({ mastered, review, total, quizMode = false }) {
  return <div className="study-stats"><span><b className="stat-good">{mastered}</b> {quizMode ? "correct" : "mastered"}</span><span><b className="stat-review">{review}</b> {quizMode ? "wrong" : "to review"}</span>{total !== undefined && <span><b>{total}</b> total</span>}</div>;
}

export default StudyStats;
