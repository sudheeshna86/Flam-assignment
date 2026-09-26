import CardClassification from "./CardClassification";
import CardNavigation from "./CardNavigation";
import Flashcard from "./Flashcard";
import KeyboardHint from "./KeyboardHint";
import ProgressBar from "./ProgressBar";
import StudyHeader from "./StudyHeader";

function StudySection({ result, cards, currentCard, currentCardIndex, isFlipped, reviewMode, masteredCount, reviewCount, canGoPrevious, canGoNext, onFlip, onPrevious, onNext, onMastered, onReview }) {
  if (!currentCard) return null;
  return <section className="study-section"><div className="flashcard-panel"><StudyHeader title={result.title} reviewMode={reviewMode} mastered={masteredCount} review={reviewCount} total={cards.length} /><ProgressBar current={currentCardIndex + 1} total={cards.length} /><Flashcard card={currentCard} flipped={isFlipped} onFlip={onFlip} /><CardClassification onReview={onReview} onMastered={onMastered} /><CardNavigation canGoPrevious={canGoPrevious} canGoNext={canGoNext} onPrevious={onPrevious} onNext={onNext} onFlip={onFlip} /><KeyboardHint /></div></section>;
}

export default StudySection;
