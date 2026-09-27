function CardNavigation({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onFlip,
}) {
  return (
    <div className="navigation">
      <button
        className="button button-ghost"
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        <span>←</span> Previous
      </button>
      <button className="button button-flip" onClick={onFlip}>
        Flip card <span>Space</span>
      </button>
      <button
        className="button button-ghost"
        onClick={onNext}
        disabled={!canGoNext}
      >
        Next <span>→</span>
      </button>
    </div>
  );
}

export default CardNavigation;
