const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "does",
  "for",
  "from",
  "gives",
  "give",
  "has",
  "have",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "what",
  "when",
  "which",
  "with",
]);

const CONCEPT_SYNONYMS = new Map([
  ["surrounding", "outer"],
  ["enclosing", "outer"],
  ["outside", "outer"],
  ["variables", "variable"],
  ["functions", "function"],
  ["promises", "promise"],
]);

function normalizeTokens(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token))
    .map((token) => CONCEPT_SYNONYMS.get(token) || token);
}

function tokenSet(value) {
  return new Set(normalizeTokens(value));
}

export function evaluateAnswer(userAnswer, expectedAnswer) {
  if (typeof userAnswer !== "string" || userAnswer.trim().length === 0) {
    return {
      correct: false,
      reason: "An answer is required.",
    };
  }

  if (
    typeof expectedAnswer !== "string" ||
    expectedAnswer.trim().length === 0
  ) {
    return {
      correct: false,
      reason: "The expected answer is unavailable.",
    };
  }

  const userTokens = tokenSet(userAnswer);
  const expectedTokens = tokenSet(expectedAnswer);

  if (userTokens.size === 0 || expectedTokens.size === 0) {
    return {
      correct: false,
      reason: "An answer is required.",
    };
  }

  const matchingTokens = [...userTokens].filter((token) =>
    expectedTokens.has(token),
  );
  const userCoverage = matchingTokens.length / userTokens.size;
  const expectedCoverage = matchingTokens.length / expectedTokens.size;
  const correct = userCoverage >= 0.6 && expectedCoverage >= 0.6;

  return {
    correct,
    reason: correct
      ? "The answer matches the expected concepts."
      : "The answer is missing important concepts.",
  };
}
