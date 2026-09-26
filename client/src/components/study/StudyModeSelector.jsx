function StudyModeSelector({ mode, onFlashcards, onQuiz }) {
  return <div className="study-mode-selector" role="group" aria-label="Study mode"><button className={mode === "flashcards" ? "is-active" : ""} onClick={onFlashcards} aria-pressed={mode === "flashcards"}>Flashcards</button><button className={mode === "quiz" ? "is-active" : ""} onClick={onQuiz} aria-pressed={mode === "quiz"}>Quiz</button></div>;
}

export default StudyModeSelector;
