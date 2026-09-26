function ProgressBar({ current, total }) {
  const progress = total ? (current / total) * 100 : 0;
  return <div className="progress-row"><span>CARD {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}</span><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>;
}

export default ProgressBar;
