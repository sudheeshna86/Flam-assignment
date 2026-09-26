function Flashcard({ card, flipped, onFlip }) {
  return <button className={`flashcard-shell ${flipped ? "is-flipped" : ""}`} onClick={onFlip} aria-label={flipped ? "Show question" : "Reveal answer"} aria-pressed={flipped}><span className="flashcard-inner"><span className="flashcard-face flashcard-front"><span className="card-label">QUESTION <i>01</i></span><strong>{card.question}</strong><span className="card-hint">Click or press space to reveal <span>↗</span></span></span><span className="flashcard-face flashcard-back"><span className="card-label">ANSWER <i>02</i></span><strong>{card.answer}</strong><span className="card-hint">Click or press space to see the question <span>↗</span></span></span></span></button>;
}

export default Flashcard;
