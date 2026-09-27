import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
     baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 30000,
});


export async function generateStudySet(input, mode = "flashcards") {
  try {
    const response = await API.post("/generate", {
      input,
      mode,
    });

    const result = response.data;

    if (!result.success) {
      throw new Error(result.error || "Failed to generate study material.");
    }

    if (!result.data) {
      throw new Error("Server returned an empty result.");
    }

    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.error ||
          "Server failed to generate study material.",
        { cause: error },
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("The request took too long. Please try again.", {
        cause: error,
      });
    }

    if (error.message) {
      throw new Error(error.message, { cause: error });
    }

    throw new Error("Something went wrong. Please try again.", {
      cause: error,
    });
  }
}
