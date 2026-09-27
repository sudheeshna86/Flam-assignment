import { useState } from "react";

import CompletionState from "./components/completion/CompletionState";
import EmptyState from "./components/common/EmptyState";
import ErrorState from "./components/common/ErrorState";
import Header from "./components/common/Header";
import LoadingState from "./components/common/LoadingState";

import Hero from "./components/landing/Hero";
import PromptInput from "./components/landing/PromptInput";

import StudySection from "./components/study/StudySection";
import QuizSection from "./components/study/quiz/QuizSection";

import useStudySession from "./hooks/useStudySession";

import "./App.css";

const suggestions = [
  "JavaScript",
  "React Hooks",
  "DBMS",
  "Computer Networks",
  "Operating Systems",
  "Machine Learning",
];

function App() {
  const [input, setInput] = useState("");
  const [generationMode, setGenerationMode] = useState("flashcards");

  const study = useStudySession();

  const showLanding = !study.result;

  function startNewSession() {
    setInput("");
    study.startNewSession();
  }

  return (
    <div className="app-shell" id="top">
      <Header />

      <main>
        {showLanding && <Hero />}

        <div className="prompt-section">
          <PromptInput
            value={input}
            onChange={setInput}
            onGenerate={study.generate}
            loading={study.loading}
            onClear={() => setInput("")}
            suggestions={suggestions}
            generationMode={generationMode}
            onGenerationModeChange={setGenerationMode}
          />
        </div>

        {/* LOADING DISPLAY */}
        {study.pendingRequests.length > 0 && (
          <div className="loading-section">
            <LoadingState requests={study.pendingRequests} />
          </div>
        )}

        {study.error && (
          <ErrorState
            message={study.error}
            onDismiss={study.dismissError}
            onRetry={study.retry}
          />
        )}

        {showLanding && !study.error && study.pendingRequests.length === 0 && (
          <EmptyState />
        )}

        {study.result?.mode === "flashcards" && !study.sessionComplete && (
          <StudySection
            result={study.result}
            cards={study.cards}
            currentCard={study.currentCard}
            currentCardIndex={study.currentCardIndex}
            isFlipped={study.isFlipped}
            reviewMode={study.reviewMode}
            masteredCount={study.masteredCount}
            reviewCount={study.reviewCount}
            canGoPrevious={study.canGoPrevious}
            canGoNext={study.canGoNext}
            onFlip={study.toggleFlip}
            onPrevious={study.previousCard}
            onNext={study.nextCard}
            onMastered={study.markMastered}
            onReview={study.markForReview}
          />
        )}

        {study.result?.mode === "quiz" && (
          <QuizSection
            result={study.result}
            cards={study.quizCards}
            currentCard={study.quizCurrentCard}
            currentIndex={study.quizIndex}
            answer={study.quizAnswer}
            submitted={study.quizSubmitted}
            lastAnswerCorrect={study.quizLastAnswerCorrect}
            answeredCount={study.quizAnsweredCount}
            correctCount={study.quizCorrectCount}
            wrongCount={study.wrongAnswerCount}
            complete={study.quizComplete}
            retestMode={study.retestMode}
            retestCorrectCount={study.retestCorrectCount}
            onAnswerChange={study.selectQuizAnswer}
            onNext={study.nextQuizQuestion}
            onRetest={study.startRetest}
            onStudyAgain={study.startQuiz}
            onNew={startNewSession}
          />
        )}

        {study.result && study.sessionComplete && (
          <CompletionState
            total={study.result.cards.length}
            mastered={study.masteredCount}
            review={study.reviewCount}
            onReview={study.startReview}
            onNew={startNewSession}
          />
        )}
      </main>

      <footer>
        <span>FLAM / LEARN WITH INTENT</span>

        <span>
          Built for focused study <i>↗</i>
        </span>
      </footer>
    </div>
  );
}

export default App;
