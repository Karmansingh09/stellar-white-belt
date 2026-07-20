import "./App.css";

const voteOptions = [
  {
    id: "A",
    label: "Option A",
    description: "Community proposal alpha.",
    votes: "0",
    accent: "cyan",
  },
  {
    id: "B",
    label: "Option B",
    description: "Community proposal beta.",
    votes: "0",
    accent: "violet",
  },
];

const statusPills = [
  { label: "Connection Status", value: "Not Connected" },
  { label: "Transaction Status", value: "Waiting..." },
];

function App() {
  return (
    <main className="poll-app">
      <div className="aurora aurora-left" aria-hidden="true" />
      <div className="aurora aurora-right" aria-hidden="true" />

      <section className="shell">
        <header className="hero card">
          <div className="hero__copy">
            <span className="eyebrow">Stellar Soroban Voting</span>
            <h1>StellarPoll</h1>
            <p className="subtitle">Vote on-chain using Stellar Soroban.</p>
          </div>

          <div className="hero__actions">
            <button className="primary-button" type="button">
              Connect Wallet
            </button>
            <div className="status-chip status-chip--demo">Demo UI</div>
          </div>
        </header>

        <section className="grid grid--top">
          <article className="card card--wallet">
            <div className="card__heading">
              <span className="card__label">Wallet Panel</span>
              <span className="card__badge card__badge--neutral">Offline</span>
            </div>

            <div className="info-stack">
              <div className="info-row">
                <span className="info-row__label">Wallet Address</span>
                <span className="info-row__value info-row__value--mono">Not Connected</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Connection Status</span>
                <span className="info-row__value">Not Connected</span>
              </div>
            </div>
          </article>

          <article className="card card--contract">
            <div className="card__heading">
              <span className="card__label">Contract Details</span>
              <span className="card__badge card__badge--mint">Soroban</span>
            </div>

            <div className="info-stack">
              <div className="info-row">
                <span className="info-row__label">Contract Address</span>
                <span className="info-row__value info-row__value--mono">CBXXXXXXXXXXXXXXXX</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Transaction Hash</span>
                <span className="info-row__value info-row__value--mono">----</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Transaction Status</span>
                <span className="info-row__value">Waiting...</span>
              </div>
            </div>
          </article>
        </section>

        <section className="grid grid--votes">
          {voteOptions.map((option) => (
            <article key={option.id} className={`card vote-card vote-card--${option.accent}`}>
              <div className="vote-card__top">
                <span className="card__label">Voting Option</span>
                <span className="card__badge">Live</span>
              </div>

              <div>
                <h2>{option.label}</h2>
                <p className="muted">{option.description}</p>
              </div>

              <div className="vote-count">
                <span className="vote-count__label">Votes</span>
                <span className="vote-count__value">{option.votes}</span>
              </div>

              <button className="vote-button" type="button">
                Vote {option.id}
              </button>
            </article>
          ))}
        </section>

        <section className="grid grid--status">
          <article className="card status-card">
            <div className="card__heading">
              <span className="card__label">Session Status</span>
              <span className="card__badge card__badge--dark">Placeholder</span>
            </div>

            <div className="status-list">
              {statusPills.map((item) => (
                <div key={item.label} className="status-pill">
                  <span className="status-pill__label">{item.label}</span>
                  <span className="status-pill__value">{item.value}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default App;