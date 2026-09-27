import ProgressBar from "../ProgressBar";
import StudyHeader from "../StudyHeader";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";

function QuizSection({
  result,
  cards,
  currentCard,
  currentIndex,
  answer,
  submitted,
  lastAnswerCorrect,
  answeredCount,
  correctCount,
  wrongCount,
  complete,
  retestMode,
  retestCorrectCount,
  onAnswerChange,
  onNext,
  onRetest,
  onStudyAgain,
  onNew,
}) {
  if (complete)
    return (
      <QuizResult
        retestMode={retestMode}
        answered={answeredCount}
        correct={retestMode ? retestCorrectCount : correctCount}
        wrongCount={wrongCount}
        onRetest={onRetest}
        onStudyAgain={onStudyAgain}
        onNew={onNew}
      />
    );
  if (!currentCard) return null;
  return (
    <div className="quiz-panel">
      <StudyHeader
        title={result.title}
        reviewMode={false}
        mastered={correctCount}
        review={wrongCount}
        total={cards.length}
        quizMode
      />
      <ProgressBar current={currentIndex + 1} total={cards.length} />
      <QuizQuestion
        question={currentCard}
        selectedAnswer={answer}
        answered={submitted}
        isCorrect={lastAnswerCorrect}
        onSelect={onAnswerChange}
        onNext={onNext}
        isLast={
          retestMode ? wrongCount <= 1 : currentIndex === cards.length - 1
        }
      />
    </div>
  );
}

export default QuizSection;
