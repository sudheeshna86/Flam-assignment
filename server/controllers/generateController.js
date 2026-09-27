import { generateStudySet } from "../services/geminiService.js";

export async function generateController(req, res) {
  try {
    const { input, mode = "flashcards" } = req.body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Input is required.",
      });
    }
    if (mode !== "flashcards" && mode !== "quiz") {
      return res.status(400).json({
        success: false,
        error: "Mode must be flashcards or quiz.",
      });
    }
    const delay = input.toLowerCase().includes("javascript") ? 5000 : 1000;

    await new Promise((resolve) => setTimeout(resolve, delay));
    const result = await generateStudySet(input.trim(), mode);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Generation error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to generate study material.",
    });
  }
}
