const ICONS = {
  Retirement: "🏦", Finance: "💰", Budgeting: "📊", Default: "📈",
};

export default function ComingSoon({ title }) {
  return (
    <div className="page">
      <div className="soon-board">
        <div className="soon-icon">{ICONS[title] || ICONS.Default}</div>
        <h1>{title}</h1>
        <div className="soon-tag">Coming soon</div>
        <p>We're building {title.toLowerCase()} tools to help you plan smarter and grow with confidence.</p>
        <div className="soon-bars">
          <span style={{ height: "40%" }} /><span style={{ height: "70%" }} />
          <span style={{ height: "55%" }} /><span style={{ height: "90%" }} />
          <span style={{ height: "65%" }} />
        </div>
      </div>
    </div>
  );
}
