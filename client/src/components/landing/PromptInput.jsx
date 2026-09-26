import { useEffect, useRef } from "react";
import TopicSuggestions from "./TopicSuggestions";

function PromptInput({ value, onChange, onGenerate, loading, onClear, suggestions, generationMode, onGenerationModeChange }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
  }, [value]);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedInput = value.trim();

    if (!trimmedInput) {
      return;
    }

    onGenerate(trimmedInput, generationMode);
  }

  function handleKeyDown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  return (
    <div className="input-area"><form className="prompt-form" onSubmit={handleSubmit}><label htmlFor="study-notes">What do you want to study?</label><div className="study-mode-selector input-mode-selector" role="group" aria-label="Generation mode"><button type="button" className={generationMode === "flashcards" ? "is-active" : ""} onClick={() => onGenerationModeChange("flashcards")} aria-pressed={generationMode === "flashcards"}>Flashcards</button><button type="button" className={generationMode === "quiz" ? "is-active" : ""} onClick={() => onGenerationModeChange("quiz")} aria-pressed={generationMode === "quiz"}>Quiz</button></div><div className="prompt-textarea-wrap"><textarea ref={textareaRef} id="study-notes" value={value} onChange={(event) => onChange(event.target.value.slice(0, 5000))} onKeyDown={handleKeyDown} placeholder="Paste your notes or enter a topic..." rows={3} maxLength={5000} />{value && <button type="button" className="clear-button" onClick={onClear} aria-label="Clear study input">×</button>}</div><div className="prompt-meta"><span>{value.length.toLocaleString()} / 5,000</span><span className="prompt-key">⌘ Enter <small>to generate</small></span></div><button className="button button-primary generate-button" type="submit" disabled={value.trim().length === 0}>{loading ? "Generating" : "Generate study set"} <span>↗</span></button></form><TopicSuggestions suggestions={suggestions} onSelect={onChange} /></div>
  );
}

export default PromptInput;