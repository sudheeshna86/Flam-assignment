function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-dot" /> AI-POWERED STUDY ASSISTANT
        </p>
        <h1>
          Turn your notes into <em>interactive</em> knowledge.
        </h1>
        <p className="hero-description">
          Paste a topic, concept, or your study notes. We'll turn them into
          focused flashcards you can actually practice.
        </p>
      </div>
      <div className="hero-number" aria-hidden="true">
        01<span>/</span>01
      </div>
    </section>
  );
}

export default Hero;
