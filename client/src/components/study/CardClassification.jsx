function CardClassification({ onReview, onMastered }) {
  return <div className="classification"><button className="button button-review" onClick={onReview}>↺ <span>Need review</span></button><button className="button button-mastered" onClick={onMastered}>✓ <span>Got it</span></button></div>;
}

export default CardClassification;
