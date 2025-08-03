export default function ProgressCard({ percent, label }) {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percent / 100) * circumference;
  
    return (
      <div className="progress-card">
        <svg className="progress-ring" width="100" height="100">
          <circle
            className="progress-ring-bg"
            strokeWidth="8"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className="progress-ring-fill"
            strokeWidth="8"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="progress-text">
          <span className="percent">{percent}%</span>
          <span className="label">{label}</span>
        </div>
      </div>
    );
  }