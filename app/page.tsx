import Link from "next/link";

const features = [
  {
    icon: "⌘",
    title: "Coding Lab",
    text: "Practise DSA and programming with an in-browser coding workspace.",
  },
  {
    icon: "◎",
    title: "Aptitude & Exams",
    text: "Prepare for placement aptitude, GATE, CAT and company-style tests.",
  },
  {
    icon: "▣",
    title: "Resume Studio",
    text: "Build, improve and analyse your resume with guided recommendations.",
  },
  {
    icon: "◈",
    title: "Interview Prep",
    text: "Technical, HR and communication practice in one focused workspace.",
  },
  {
    icon: "↗",
    title: "Performance",
    text: "Track practice history, strengths, weak areas and overall readiness.",
  },
  {
    icon: "✦",
    title: "AI Coach",
    text: "Turn your performance into a personalised preparation roadmap.",
  },
];

const steps = [
  ["01", "Create your profile", "Add education, skills, projects and career goals."],
  ["02", "Practise every day", "Code, solve aptitude questions and prepare for interviews."],
  ["03", "Understand your progress", "See your strengths, weak areas and practice trends."],
  ["04", "Get placement-ready", "Follow your personalised roadmap and improve consistently."],
];

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <Link href="/" className="brand" aria-label="Smart Placement Preperation Portal home">
          <span className="brand-mark">SP</span>
          <span>
            Smart Placement<span>Preperation Portal</span>
          </span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>

          {/* User must sign in before accessing dashboard */}
          <Link href="/auth/login">Dashboard</Link>
        </div>

        {/* Get Started → Sign In */}
        <Link href="/auth/login" className="button button-small">
          Get Started <span>→</span>
        </Link>
      </nav>

      <section className="hero section">
        <div className="hero-copy">
          <Reveal>
            <div className="eyebrow">
              ✦ All-in-one placement preparation
            </div>
          </Reveal>

          <Reveal className="delay-1">
            <h1>
              Prepare <em>Smarter.</em>
              <br />
              Practise <em>Better.</em>
              <br />
              Get Placed.
            </h1>
          </Reveal>

          <Reveal className="delay-2">
            <p className="hero-text">
              One focused portal for coding, aptitude, DSA, competitive exams,
              interviews, resumes and AI-powered improvement.
            </p>
          </Reveal>

          <Reveal className="delay-3">
            <div className="hero-actions">
              {/* Start Your Journey → Sign In */}
              <Link href="/auth/login" className="button">
                Start Your Journey <span>→</span>
              </Link>

              <a href="#features" className="button button-ghost">
                Explore Features
              </a>
            </div>
          </Reveal>

          <Reveal className="delay-4">
            <div className="hero-checks">
              <span>✓ Online coding lab</span>
              <span>✓ AI recommendations</span>
              <span>✓ Performance analytics</span>
              <span>✓ PDF reports</span>
            </div>
          </Reveal>
        </div>

        <Reveal className="delay-2">
          <div className="dashboard-card">
            <div className="card-top">
              <span>Smart Placement Preparation Portal Dashboard</span>
              <span className="streak">🔥 12 day streak</span>
            </div>

            <div className="readiness">
              <span>Placement Readiness</span>
              <strong>74%</strong>

              <div className="progress">
                <i style={{ width: "74%" }} />
              </div>
            </div>

            <div className="mini-grid">
              {[
                "Coding 82%",
                "Aptitude 71%",
                "DSA 68%",
                "Interview 64%",
                "Resume 86%",
                "Communication 67%",
              ].map((x) => (
                <div key={x}>{x}</div>
              ))}
            </div>

            <div className="card-bottom">
              <div className="chart">
                <span>Weekly progress</span>

                <div className="bars">
                  {[42, 58, 51, 70, 79, 64, 91].map((h, i) => (
                    <i key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              <div className="recommend">
                <span>AI recommendation</span>
                <p>
                  Focus on Dynamic Programming, DBMS and technical interviews.
                </p>
                <b>View plan →</b>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="features" className="section feature-section">
        <Reveal>
          <div className="section-heading">
            <div className="eyebrow">Everything in one place</div>
            <h2>Your complete preparation workspace.</h2>
            <p>
              No switching between scattered tools. Practise, analyse and
              improve from one portal.
            </p>
          </div>
        </Reveal>

        <div className="feature-grid">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              className={`delay-${(i % 4) + 1}`}
            >
              <article className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <span className="card-arrow">↗</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how" className="section how-section">
        <Reveal>
          <div className="section-heading">
            <div className="eyebrow">Simple workflow</div>
            <h2>From preparation to placement.</h2>
          </div>
        </Reveal>

        <div className="steps">
          {steps.map(([num, title, text], i) => (
            <Reveal key={num} className={`step delay-${i + 1}`}>
              <article className="step-card">
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="cta section">
        <Reveal>
          <div className="cta-box">
            <div>
              <div className="eyebrow">Built for serious preparation</div>
              <h2>Ready to make your preparation measurable?</h2>
              <p>
                Start with your profile and let Smart Placement Preparation Portal organise the rest.
              </p>
            </div>

            {/* Open Smart Placement Preparation Portal → Sign In */}
            <Link href="/auth/login" className="button">
              Open Smart Placement Preparation Portal <span>→</span>
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}