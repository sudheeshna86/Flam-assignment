import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateStudyResult } from "./validateResult.js";

const validQuiz = {
  title: "JavaScript",
  mode: "quiz",
  questions: [{
    id: "q1",
    question: "Which declarations exist?",
    options: ["var", "let", "const", "function"],
    correctAnswer: "var",
    explanation: "var is one JavaScript declaration form.",
  }],
};

describe("validateStudyResult quiz mode", () => {
  it("accepts a valid quiz result", () => {
    assert.equal(validateStudyResult(validQuiz).valid, true);
  });

  it("rejects missing options", () => {
    const result = structuredClone(validQuiz);
    delete result.questions[0].options;
    assert.equal(validateStudyResult(result).valid, false);
  });

  it("rejects the wrong number of options", () => {
    const result = structuredClone(validQuiz);
    result.questions[0].options = ["var", "let", "const"];
    assert.equal(validateStudyResult(result).valid, false);
  });

  it("rejects a correct answer that is not an option", () => {
    const result = structuredClone(validQuiz);
    result.questions[0].correctAnswer = "class";
    assert.equal(validateStudyResult(result).valid, false);
  });

  it("rejects duplicate options", () => {
    const result = structuredClone(validQuiz);
    result.questions[0].options[3] = "var";
    assert.equal(validateStudyResult(result).valid, false);
  });

  it("rejects an empty question", () => {
    const result = structuredClone(validQuiz);
    result.questions[0].question = "";
    assert.equal(validateStudyResult(result).valid, false);
  });

  it("rejects empty questions", () => {
    const result = { ...validQuiz, questions: [] };
    assert.equal(validateStudyResult(result).valid, false);
  });
});
