import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { generateStudySet } from "../lib/api";
import { validateStudyResult } from "../lib/validateResult";

const loadingMessages = [
  "Reading your notes...",
  "Finding key concepts...",
  "Structuring your flashcards...",
  "Preparing your study session...",
];

export default function useStudySession() {
  const [generationRequests, setGenerationRequests] = useState([]);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [dismissedErrorId, setDismissedErrorId] = useState(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState(new Set());
  const [reviewCards, setReviewCards] = useState(new Set());
  const [reviewMode, setReviewMode] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const [studyMode, setStudyMode] = useState("flashcards");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSubmittedCard, setQuizSubmittedCard] = useState(null);
  const [quizLastAnswerCorrect, setQuizLastAnswerCorrect] = useState(null);
  const [quizAnsweredCount, setQuizAnsweredCount] = useState(0);
  const [quizCorrectCount, setQuizCorrectCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [retestMode, setRetestMode] = useState(false);
  const [retestCorrectCount, setRetestCorrectCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  const nextRequestIdRef = useRef(1);
  const activeRequestIdRef = useRef(null);

  const pendingRequests = useMemo(
    () => generationRequests.filter((request) => request.status === "loading"),
    [generationRequests]
  );
  const errorRequest = useMemo(
    () => [...generationRequests].reverse().find(
      (request) => request.status === "error" && request.id !== dismissedErrorId
    ),
    [dismissedErrorId, generationRequests]
  );
  const activeRequest = generationRequests.find(
    (request) => request.id === activeRequestId
  );
  const result = activeRequest?.result || null;
  const loading = pendingRequests.length > 0;
  const error = errorRequest?.error || null;

  const cards = useMemo(() => {
    if (!result) return [];
    if (!Array.isArray(result.cards)) return [];
    if (reviewMode) return result.cards.filter((card) => reviewCards.has(card.id));
    return result.cards;
  }, [result, reviewMode, reviewCards]);
  const currentCard = cards[currentCardIndex];

  const quizCards = useMemo(() => {
    if (!result || !Array.isArray(result.questions)) return [];
    if (retestMode) return wrongQuestions;
    return result.questions;
  }, [result, retestMode, wrongQuestions]);
  const quizCurrentCard = quizSubmitted && quizSubmittedCard
    ? quizSubmittedCard
    : quizCards[quizIndex];
  const canGoPrevious = currentCardIndex > 0;
  const canGoNext = currentCardIndex < cards.length - 1;

  useEffect(() => {
    if (pendingRequests.length === 0) return undefined;
    const timer = window.setInterval(() => {
      setGenerationRequests((requests) => requests.map((request) => {
        if (request.status !== "loading") return request;
        return { ...request, messageIndex: (request.messageIndex + 1) % loadingMessages.length };
      }));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [pendingRequests.length]);

  const resetQuiz = useCallback(() => {
    setQuizIndex(0);
    setQuizAnswer("");
    setQuizSubmitted(false);
    setQuizSubmittedCard(null);
    setQuizLastAnswerCorrect(null);
    setQuizAnsweredCount(0);
    setQuizCorrectCount(0);
    setWrongQuestions([]);
    setQuizComplete(false);
    setRetestMode(false);
    setRetestCorrectCount(0);
  }, []);

  const generate = useCallback(async (input, mode = "flashcards") => {
    const requestId = nextRequestIdRef.current++;
    setDismissedErrorId(null);
    setGenerationRequests((requests) => [...requests, {
      id: requestId,
      input,
      mode,
      status: "loading",
      messageIndex: 0,
    }]);

    try {
      const data = await generateStudySet(input, mode);
      const validation = validateStudyResult(data);
      if (!validation.valid) throw new Error(validation.error);

      setGenerationRequests((requests) => requests.map((request) =>
        request.id === requestId ? { ...request, status: "success", result: validation.data } : request
      ));

      if (activeRequestIdRef.current === null || requestId > activeRequestIdRef.current) {
        activeRequestIdRef.current = requestId;
        setActiveRequestId(requestId);
        setSessionComplete(false);
        setReviewMode(false);
        setStudyMode(validation.data.mode);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setMastered(new Set());
        setReviewCards(new Set());
        resetQuiz();
      }
    } catch (generationError) {
      console.error("Generation failed:", generationError);
      setGenerationRequests((requests) => requests.map((request) =>
        request.id === requestId
          ? { ...request, status: "error", error: generationError.message || "Something went wrong. Please try again." }
          : request
      ));
    }
  }, [resetQuiz]);

  const toggleFlip = useCallback(() => setIsFlipped((flipped) => !flipped), []);
  const nextCard = useCallback(() => {
    setCurrentCardIndex((index) => Math.min(cards.length - 1, index + 1));
    setIsFlipped(false);
  }, [cards.length]);
  const previousCard = useCallback(() => {
    setCurrentCardIndex((index) => Math.max(0, index - 1));
    setIsFlipped(false);
  }, []);

  const finishOrMove = useCallback(() => {
    if (currentCardIndex === cards.length - 1) setSessionComplete(true);
    else nextCard();
  }, [cards.length, currentCardIndex, nextCard]);

  const markMastered = useCallback(() => {
    if (!currentCard) return;
    setMastered((items) => new Set(items).add(currentCard.id));
    setReviewCards((items) => {
      const next = new Set(items);
      next.delete(currentCard.id);
      return next;
    });
    if (reviewMode && cards.length > 1) {
      if (currentCardIndex >= cards.length - 1) setCurrentCardIndex(cards.length - 2);
      setIsFlipped(false);
    } else finishOrMove();
  }, [cards.length, currentCard, currentCardIndex, finishOrMove, reviewMode]);

  const markForReview = useCallback(() => {
    if (!currentCard) return;
    setReviewCards((items) => new Set(items).add(currentCard.id));
    finishOrMove();
  }, [currentCard, finishOrMove]);

  const startReview = useCallback(() => {
    setStudyMode("flashcards");
    setReviewMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  }, []);

  const startQuiz = useCallback(() => {
    setStudyMode("quiz");
    setReviewMode(false);
    resetQuiz();
  }, [resetQuiz]);

  const startFlashcards = useCallback(() => {
    setStudyMode("flashcards");
    setQuizComplete(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, []);

  const selectQuizAnswer = useCallback((option) => {
    if (!quizCurrentCard || quizSubmitted) return;
    const correct = option === quizCurrentCard.correctAnswer;
    setQuizAnswer(option);
    setQuizSubmitted(true);
    setQuizSubmittedCard(quizCurrentCard);
    setQuizLastAnswerCorrect(correct);
    setQuizAnsweredCount((count) => count + 1);
    if (correct) {
      setQuizCorrectCount((count) => count + 1);
      if (retestMode) {
        setRetestCorrectCount((count) => count + 1);
        setWrongQuestions((questions) => questions.filter((question) => question.id !== quizCurrentCard.id));
      }
    } else {
      setWrongQuestions((questions) => questions.some((question) => question.id === quizCurrentCard.id) ? questions : [...questions, quizCurrentCard]);
    }
  }, [quizCurrentCard, quizSubmitted, retestMode]);

  const nextQuizQuestion = useCallback(() => {
    if (!quizCurrentCard) return;
    if (retestMode && wrongQuestions.length === 0) {
      setQuizComplete(true);
      return;
    }
    if (!retestMode && quizIndex >= quizCards.length - 1) {
      setQuizComplete(true);
      return;
    }
    if (retestMode) {
      setQuizIndex((index) => Math.min(index, quizCards.length - 1));
    } else {
      setQuizIndex((index) => index + 1);
    }
    setQuizAnswer("");
    setQuizSubmitted(false);
    setQuizSubmittedCard(null);
    setQuizLastAnswerCorrect(null);
  }, [quizCards.length, quizCurrentCard, quizIndex, retestMode, wrongQuestions.length]);

  const startRetest = useCallback(() => {
    if (wrongQuestions.length === 0) return;
    setStudyMode("quiz");
    setRetestMode(true);
    setQuizIndex(0);
    setQuizAnswer("");
    setQuizSubmitted(false);
    setQuizSubmittedCard(null);
    setQuizLastAnswerCorrect(null);
    setQuizAnsweredCount(0);
    setRetestCorrectCount(0);
    setQuizComplete(false);
  }, [wrongQuestions.length]);

  const startNewSession = useCallback(() => {
    setGenerationRequests([]);
    activeRequestIdRef.current = null;
    setActiveRequestId(null);
    setDismissedErrorId(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setMastered(new Set());
    setReviewCards(new Set());
    setReviewMode(false);
    setSessionComplete(false);
    setStudyMode("flashcards");
    resetQuiz();
  }, [resetQuiz]);

  const dismissError = useCallback(() => {
    if (errorRequest) setDismissedErrorId(errorRequest.id);
  }, [errorRequest]);
  const retry = useCallback(() => {
    if (errorRequest) generate(errorRequest.input, errorRequest.mode);
  }, [errorRequest, generate]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (studyMode !== "flashcards" || !result || loading || sessionComplete || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") { event.preventDefault(); toggleFlip(); }
      if (event.key === "ArrowLeft") previousCard();
      if (event.key === "ArrowRight") nextCard();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, nextCard, previousCard, result, sessionComplete, studyMode, toggleFlip]);

  return {
    result, loading, error, pendingRequests,
    cards, currentCard, currentCardIndex, isFlipped,
    reviewMode, sessionComplete, canGoPrevious, canGoNext,
    masteredCount: mastered.size, reviewCount: reviewCards.size,
    studyMode, quizCards, quizCurrentCard, quizIndex, quizAnswer,
    quizSubmitted, quizLastAnswerCorrect, quizAnsweredCount, quizCorrectCount,
    wrongAnswerCount: wrongQuestions.length, quizComplete, retestMode, retestCorrectCount,
    selectQuizAnswer, generate, retry, toggleFlip, nextCard, previousCard,
    markMastered, markForReview, startReview, startQuiz, startFlashcards,
    nextQuizQuestion, startRetest, startNewSession, dismissError,
  };
}
