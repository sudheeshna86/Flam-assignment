export function validateStudyResult(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      valid: false,
      error: "AI response must be an object.",
    };
  }

  if (
    typeof data.title !== "string" ||
    data.title.trim().length === 0
  ) {
    return {
      valid: false,
      error: "AI response contains an invalid title.",
    };
  }

  if (data.mode !== "flashcards" && data.mode !== "quiz") {
    return { valid: false, error: "AI response has an invalid mode." };
  }

  if (data.mode === "quiz") {
    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      return { valid: false, error: "AI quiz response must contain questions." };
    }
    const ids = new Set();
    for (const question of data.questions) {
      if (!question || typeof question !== "object" || Array.isArray(question)) {
        return { valid: false, error: "A quiz question has an invalid structure." };
      }
      if (typeof question.id !== "string" || question.id.trim().length === 0 || ids.has(question.id)) {
        return { valid: false, error: "Every quiz question must have a unique ID." };
      }
      ids.add(question.id);
      if (typeof question.question !== "string" || question.question.trim().length === 0) {
        return { valid: false, error: "Every quiz question must have text." };
      }
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        return { valid: false, error: "Every quiz question must have exactly 4 options." };
      }
      if (question.options.some((option) => typeof option !== "string" || option.trim().length === 0)) {
        return { valid: false, error: "Quiz options must be non-empty strings." };
      }
      const options = question.options.map((option) => option.trim());
      if (new Set(options.map((option) => option.toLowerCase())).size !== 4) {
        return { valid: false, error: "Quiz options must be unique." };
      }
      if (typeof question.correctAnswer !== "string" || !options.includes(question.correctAnswer.trim())) {
        return { valid: false, error: "The correct answer must match one option exactly." };
      }
      if (typeof question.explanation !== "string") {
        return { valid: false, error: "Every quiz question must have an explanation." };
      }
    }
    return { valid: true, data };
  }

  if (!Array.isArray(data.cards)) {
    return {
      valid: false,
      error: "AI response must contain a cards array.",
    };
  }

  if (data.cards.length < 3 || data.cards.length > 10) {
    return {
      valid: false,
      error: "AI response must contain between 3 and 10 cards.",
    };
  }

  const ids = new Set();

  for (const card of data.cards) {
    if (!card || typeof card !== "object" || Array.isArray(card)) {
      return {
        valid: false,
        error: "A card has an invalid structure.",
      };
    }

    if (
      typeof card.id !== "string" ||
      card.id.trim().length === 0
    ) {
      return {
        valid: false,
        error: "Every card must have a valid ID.",
      };
    }

    if (ids.has(card.id)) {
      return {
        valid: false,
        error: "Card IDs must be unique.",
      };
    }

    ids.add(card.id);

    if (
      typeof card.question !== "string" ||
      card.question.trim().length === 0
    ) {
      return {
        valid: false,
        error: "Every card must have a question.",
      };
    }

    if (
      typeof card.answer !== "string" ||
      card.answer.trim().length === 0
    ) {
      return {
        valid: false,
        error: "Every card must have an answer.",
      };
    }
  }

  return {
    valid: true,
    data,
  };
}