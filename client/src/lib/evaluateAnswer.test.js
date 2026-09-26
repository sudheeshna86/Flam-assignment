import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateAnswer } from "./evaluateAnswer.js";

describe("evaluateAnswer", () => {
  it("accepts an exact match", () => {
    assert.equal(evaluateAnswer("var, let, and const", "var, let, and const").correct, true);
  });

  it("accepts different capitalization", () => {
    assert.equal(evaluateAnswer("JAVASCRIPT", "javascript").correct, true);
  });

  it("accepts different spacing and punctuation", () => {
    assert.equal(evaluateAnswer("var,let,const", "var, let, and const").correct, true);
  });

  it("treats connector words such as and as formatting", () => {
    assert.equal(evaluateAnswer("var let const", "var, let, and const").correct, true);
  });

  it("accepts equivalent phrasing with known concept synonyms", () => {
    assert.equal(
      evaluateAnswer(
        "An inner function can access variables from the surrounding scope.",
        "A closure gives an inner function access to variables from its outer scope."
      ).correct,
      true
    );
  });

  it("accepts a concise equivalent sentence", () => {
    assert.equal(
      evaluateAnswer(
        "JavaScript is dynamically typed.",
        "JavaScript is a dynamically typed language."
      ).correct,
      true
    );
  });

  it("rejects unrelated concepts", () => {
    assert.equal(evaluateAnswer("for, while, and do while", "var, let, and const").correct, false);
  });

  it("rejects an empty answer", () => {
    assert.equal(evaluateAnswer("   ", "var, let, and const").correct, false);
  });
});
