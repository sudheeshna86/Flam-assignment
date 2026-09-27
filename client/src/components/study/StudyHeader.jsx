import StudyStats from "./StudyStats";

function StudyHeader({
  title,
  reviewMode,
  mastered,
  review,
  total,
  quizMode = false,
}) {
  return (
    <div className="study-heading">
      <div>
        <p className="eyebrow">
          {reviewMode ? "REVIEW MODE" : quizMode ? "QUIZ" : "STUDY SESSION"}
        </p>
        <h2>{reviewMode ? "Let's reinforce these concepts." : title}</h2>
        <p>
          {reviewMode
            ? `Review ${total} difficult ${total === 1 ? "card" : "cards"}.`
            : quizMode
              ? "Choose the best answer."
              : "Build recall one card at a time."}
        </p>
      </div>
      <StudyStats
        mastered={mastered}
        review={review}
        total={total}
        quizMode={quizMode}
      />
    </div>
  );
}

export default StudyHeader;
