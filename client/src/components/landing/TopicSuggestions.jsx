function TopicSuggestions({ suggestions, onSelect }) {
  return <div className="suggestions"><span>Try a topic</span>{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => onSelect(suggestion)}>{suggestion} <span>+</span></button>)}</div>;
}

export default TopicSuggestions;
