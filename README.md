# FLAM Study Assistant

## 1. Overview

FLAM Study Assistant accepts free-form study notes or a topic and turns them into structured study material through a backend-proxied Google Gemini integration. The result is rendered as an interactive learning workspace with flashcards or a multiple-choice quiz, not as a chatbot.

The frontend is a React + Vite application. The browser talks only to the local Express API; the Gemini API key remains on the server.

## 2. Features

- Free-form study input with character counting, clear action, topic suggestions, and keyboard submit shortcut.
- AI-generated structured flashcard or quiz material.
- Flashcard mode with:
  - 3D question/answer flipping.
  - Previous and next navigation.
  - Mastered-card tracking.
  - Manual mark-for-review tracking.
  - Review mode for marked cards.
  - Progress and session completion state.
- Multiple-choice quiz mode with four validated options per question.
- Immediate correct/incorrect feedback after selecting an option.
- Correct answer and explanation shown after submission.
- Quiz score, progress, wrong-question tracking, and quiz completion state.
- Wrong-answer retesting using the existing question objects locally, without another LLM request.
- Loading skeletons with rotating generation messages.
- Per-request loading states for concurrent generation requests.
- Error presentation, dismissal, retry behavior, API failure handling, and timeout messages.
- Defensive backend and frontend response validation.
- Stale-response protection so an older request cannot replace a newer active result.
- Responsive mobile layout and touch-friendly quiz options.
- Keyboard navigation for flashcards with reduced-motion CSS support.
- Animated transitions and interactive button/card states using CSS.

## 3. Tech Stack

### Frontend

- React and React hooks.
- Vite.
- Axios for the frontend API layer.
- JSX with CSS in `client/src/App.css` and `client/src/index.css`.
- Node's built-in test runner for validation and answer-evaluation tests.

### Backend

- Node.js.
- Express.
- `cors` for cross-origin development requests.
- `dotenv` for server environment loading.
- `@google/genai` for Google Gemini access.

No frontend state-management library is used. Study and quiz state is managed with React hooks in `useStudySession.js`.

## 4. Architecture

```text
User
  |
  v
React UI
  |
  v
client/src/lib/api.js
  |
  | POST http://localhost:5000/api/generate
  v
Express backend
  |
  v
Gemini service
  |
  v
Structured JSON
  |
  v
Backend validation
  |
  v
Axios response
  |
  v
Frontend validation
  |
  v
Interactive flashcard or quiz UI
```

The browser never calls Gemini directly. `server/services/geminiService.js` reads `GEMINI_API_KEY` from the server environment, calls Gemini, parses the JSON response, and performs backend validation. The frontend receives the backend result through `client/src/lib/api.js` and validates it again with `client/src/lib/validateResult.js` before rendering.

Generation mode is sent as part of the existing `/api/generate` request:

```json
{
  "input": "JavaScript closures",
  "mode": "flashcards"
}
```

or:

```json
{
  "input": "JavaScript closures",
  "mode": "quiz"
}
```

## 5. Project Structure

```text
flam-study-assistant/
├── client/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── common/
│       │   │   ├── Header.jsx
│       │   │   ├── LoadingState.jsx
│       │   │   ├── ErrorState.jsx
│       │   │   └── EmptyState.jsx
│       │   ├── landing/
│       │   │   ├── Hero.jsx
│       │   │   ├── PromptInput.jsx
│       │   │   └── TopicSuggestions.jsx
│       │   ├── study/
│       │   │   ├── StudySection.jsx
│       │   │   ├── StudyHeader.jsx
│       │   │   ├── StudyStats.jsx
│       │   │   ├── ProgressBar.jsx
│       │   │   ├── Flashcard.jsx
│       │   │   ├── CardClassification.jsx
│       │   │   ├── CardNavigation.jsx
│       │   │   ├── KeyboardHint.jsx
│       │   │   ├── StudyModeSelector.jsx
│       │   │   └── quiz/
│       │   │       ├── QuizSection.jsx
│       │   │       ├── QuizQuestion.jsx
│       │   │       └── QuizResult.jsx
│       │   └── completion/
│       │       └── CompletionState.jsx
│       ├── hooks/
│       │   └── useStudySession.js
│       └── lib/
│           ├── api.js
│           ├── evaluateAnswer.js
│           ├── evaluateAnswer.test.js
│           ├── validateResult.js
│           └── validateResult.test.js
├── server/
│   ├── package.json
│   ├── index.js
│   ├── controllers/
│   │   └── generateController.js
│   ├── routes/
│   │   └── generateRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   └── validators/
│       └── studyResultValidator.js
└── README.md
```

Important responsibilities:

- `client/src/App.jsx`: application composition and major state routing only.
- `client/src/hooks/useStudySession.js`: generation records, active-result selection, flashcard state, quiz state, wrong-question retesting, review mode, keyboard behavior, and request handling.
- `client/src/lib/api.js`: the only browser-side module that sends requests to the backend.
- `client/src/lib/validateResult.js`: frontend validation for flashcard and quiz result shapes.
- `client/src/components/study/`: flashcard presentation and study controls.
- `client/src/components/study/quiz/`: multiple-choice question presentation and quiz completion UI.
- `server/controllers/generateController.js`: validates input/mode and handles the `/api/generate` request.
- `server/routes/generateRoutes.js`: registers the generation endpoint.
- `server/services/geminiService.js`: builds the mode-specific Gemini prompt, parses JSON, and performs backend validation.
- `server/validators/studyResultValidator.js`: validates backend flashcard and quiz data.

## 6. Data Validation

AI output is unpredictable, so it is never rendered directly.

```text
Gemini response
  -> JSON.parse
  -> backend structural validation
  -> Axios response
  -> frontend structural validation
  -> React rendering
```

For flashcards, validation checks:

- Result is a non-array object.
- `title` is a non-empty string.
- `mode` is `flashcards`.
- `cards` is an array containing 3 to 10 items.
- Card IDs exist and are unique.
- Questions and answers are non-empty strings.

For quiz results, validation checks:

- Result is a non-array object.
- `title` is a non-empty string.
- `mode` is `quiz`.
- `questions` is non-empty.
- Question IDs exist and are unique.
- Each question has non-empty text.
- Each question has exactly four non-empty options.
- Options are unique.
- `correctAnswer` exactly matches one option.
- `explanation` is a string.

## 7. Failure Handling

The application handles:

- Malformed Gemini JSON.
- Empty Gemini responses.
- Missing or invalid titles.
- Missing cards or quiz questions.
- Wrong result shapes.
- Invalid card/question IDs.
- Duplicate IDs or duplicate quiz options.
- Incorrect option counts.
- A correct answer that is not one of the options.
- Network and API failures.
- Request timeouts.
- Frontend validation failures.
- Older responses arriving after newer requests.

Errors are converted into user-facing error state with dismissal and retry support. Invalid AI output is rejected before it reaches the study or quiz UI.

## 8. Stale Request Protection

Each generation receives a unique request ID and is stored as an independent request record. The hook keeps the request's input, mode, status, loading-message index, result, or error together.

Example:

```text
Request 1: React Hooks
Request 2: JavaScript
```

Both requests may run concurrently. If Request 2 completes first, it becomes the active result because it was submitted later. If Request 1 completes afterward, its response is stored under Request 1 but cannot replace the active Request 2 result.

This uses `useRef` counters and request IDs without cancelling in-flight requests.

## 9. Quiz and Retest Flow

```text
Generate quiz material
  -> validated questions and four options
  -> select an option
  -> immediate correct/incorrect feedback
  -> correct answer and explanation
  -> next question
  -> final score
  -> retest wrong questions locally
```

When a quiz option is selected, the question object is evaluated immediately. Options are disabled after the selection. Incorrect questions are stored as complete question objects, not just indexes, so retesting can reuse their original options, correct answers, and explanations.

Retest mode filters to those stored wrong question objects and does not call `/api/generate` or Gemini again. Correctly answered retest questions are removed from the remaining wrong-question list.

## 10. Setup

### Backend

```bash
cd server
npm install
npm start
```

The server listens on `http://localhost:5000`.

Create `server/.env` with the server-side Gemini key:

```env
GEMINI_API_KEY=your_key_here
```

Do not commit a real key or place it in the client.

### Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173` or the next available port.

Useful client commands:

```bash
npm run lint
npm test
npm run build
npm run preview
```

## 11. Testing

The current test script runs the Node built-in test runner against:

- `src/lib/evaluateAnswer.test.js`
- `src/lib/validateResult.test.js`

The tests cover answer normalization and semantic comparison examples, valid quiz results, missing options, invalid option counts, duplicate options, invalid correct answers, empty questions, and malformed quiz structures.

The production verification commands are:

```bash
cd client
npm run lint
npm test
npm run build
```

## 12. Known Limitations

- Quiz generation requires the backend Gemini configuration and network access.
- Quiz retesting and study sessions are held in React memory and are not persisted across refreshes.
- Quiz options and explanations depend on the generated model response, although both backend and frontend validation reject malformed structures.
- Quiz mode uses exact option selection; free-form semantic answer grading is not part of the multiple-choice flow.
- Multiple concurrent requests are supported, with the newest successful submission selected as the active result.

## AI Usage Note

AI tools including GitHub Copilot and ChatGPT were used for development assistance, debugging, architecture discussion, implementation support, testing guidance, and documentation.

## Time Spent

Actual development time: ____________________
