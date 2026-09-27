import { GoogleGenAI } from "@google/genai";
import { validateStudyResult } from "../validators/studyResultValidator.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateStudySet(userInput, mode = "flashcards") {
  const outputInstructions =
    mode === "quiz"
      ? `Generate 3 to 10 multiple-choice questions.

The JSON MUST follow exactly this structure:

{
  "title": "string",
  "mode": "quiz",
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}

Rules:
- questions must contain between 3 and 10 items.
- Every question must have exactly 4 unique, non-empty options.
- correctAnswer must exactly match one option.
- Every explanation must be a string.`
      : `Generate 3 to 10 useful flashcards.

The JSON MUST follow exactly this structure:

{
  "title": "string",
  "mode": "flashcards",
  "cards": [
    {
      "id": "string",
      "question": "string",
      "answer": "string"
    }
  ]
}

Rules:
- cards must contain between 3 and 10 items.
- Every card must have a unique id.
- Every question and answer must be a non-empty string.`;

  const prompt = `
You are a study assistant.

The user will provide a topic or study notes.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not include explanations outside the JSON.


The title must be a non-empty string.
${outputInstructions}

User input:
${userInput}
`;
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",

    contents: prompt,
  });

  const rawText = response.text;
  // const rawText = "This is not valid JSON";
  // const rawText = JSON.stringify({
  //   title: "JavaScript",
  // });

  if (!rawText || rawText.trim().length === 0) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsedData;

  try {
    parsedData = JSON.parse(rawText);
  } catch (error) {
    throw new Error("Gemini returned malformed JSON.");
  }

  const validation = validateStudyResult(parsedData);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return validation.data;
}
