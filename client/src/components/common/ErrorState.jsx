function ErrorState({ message, onDismiss, onRetry }) {
  return <div className="error-state" role="alert"><strong>We couldn't build that set.</strong><span>{message}</span><button onClick={onDismiss}>Dismiss</button>{onRetry && <button onClick={onRetry}>Try again</button>}</div>;
}

export default ErrorState;
