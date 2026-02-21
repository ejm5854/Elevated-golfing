import { useNavigate } from "react-router-dom";
import { courses } from "../courses.js";

const publicCourses = courses.filter((c) => c.type === "Public").slice(0, 3);

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span>⛳</span> Central Valley Golf
        </div>
        <h1>
          Score Together,<br />
          <span>Win Together.</span>
        </h1>
        <p className="hero-sub">
          Real-time scorecards and live leaderboards for your crew.
          Explore every course in Fresno, Clovis, and Madera — no downloads, just share a link.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("/new-round")}>
            ⛳ Start New Round
          </button>
          <button className="btn-secondary" onClick={() => navigate("/courses")}>
            Browse Courses →
          </button>
        </div>
      </section>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item">
            <div className="stat-number">{courses.length}</div>
            <div className="stat-label">Local Courses</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">Cities Covered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">18</div>
            <div className="stat-label">Holes Tracked</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Live</div>
            <div className="stat-label">Score Updates</div>
          </div>
        </div>
      </div>

      {/* Featured Public Courses */}
      <div className="section">
        <div className="section-header section-header-row">
          <div>
            <div className="section-eyebrow">Play Local</div>
            <h2 className="section-title">Featured Public Courses</h2>
            <p className="section-sub">Tee times open to everyone in the Fresno, Clovis & Madera area.</p>
          </div>
          <button className="link-btn" onClick={() => navigate("/courses")}>
            View all {courses.length} courses →
          </button>
        </div>

        <div className="courses-grid">
          {publicCourses.map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => navigate(`/courses/${course.id}`)} />
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background: "white", borderTop: "1px solid var(--gray-200)", borderBottom: "1px solid var(--gray-200)" }}>
        <div className="section">
          <div className="section-header">
            <div className="section-eyebrow">Why Elevated Golfing</div>
            <h2 className="section-title">Built for your crew</h2>
          </div>
          <div className="features-grid">
            {[
              { icon: "📍", title: "Local Course Directory", desc: "Every public and private course in Fresno, Clovis, and Madera — with full hole-by-hole scorecards, ratings, and tee options." },
              { icon: "📊", title: "Live Leaderboard", desc: "Scores update instantly after every hole. Everyone in your group sees the standings in real time — no refresh needed." },
              { icon: "🎯", title: "Side Games Built In", desc: "Auto-calculate Skins, Nassau, and Match Play. No spreadsheet, no arguing about who owes who." },
              { icon: "🔗", title: "Share a Link", desc: "No app download required. Share a link with your crew and they can follow along from any device." },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mock leaderboard */}
      <div className="leaderboard-section">
        <div className="leaderboard-inner">
          <div className="section-header">
            <div className="section-eyebrow">Live Now</div>
            <h2 className="section-title">Recent Leaderboard</h2>
            <p className="section-sub">See how your local golfers are doing on the course.</p>
          </div>
          <div className="leaderboard-grid">
            {[
              { rank: 1, name: "Mike R.", course: "Riverside Golf Course", score: "-3" },
              { rank: 2, name: "Carlos M.", course: "Copper River CC", score: "E" },
              { rank: 3, name: "Jason T.", course: "Madera Municipal", score: "+2" },
              { rank: 4, name: "Derek W.", course: "Airways Golf Course", score: "+4" },
              { rank: 5, name: "Luis G.", course: "Fort Washington CC", score: "+5" },
              { rank: 6, name: "Anthony P.", course: "Sunnyside CC", score: "+7" },
            ].map((p) => (
              <div className="lb-card" key={p.rank}>
                <div className={`lb-rank ${p.rank <= 3 ? "top" : ""}`}>{p.rank}</div>
                <div className="lb-info">
                  <div className="lb-name">{p.name}</div>
                  <div className="lb-course">{p.course}</div>
                </div>
                <div className="lb-score">{p.score}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="btn-primary" onClick={() => navigate("/new-round")} style={{ display: "inline-flex" }}>
              ⛳ Start Your Round
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, onClick }) {
  const bestTee = course.tees[0];
  const typeClass = course.type === "Public" ? "badge-public" : course.type === "Private" ? "badge-private" : "badge-semi";

  return (
    <div className="course-card" onClick={onClick}>
      <div className="course-card-header">
        <div className="course-card-icon">⛳</div>
        <div className="course-card-badges">
          <span className={`badge ${typeClass}`}>{course.type}</span>
          <span className="badge badge-holes">{course.holes}H</span>
        </div>
      </div>
      <div className="course-card-body">
        <div className="course-card-name">{course.name}</div>
        <div className="course-card-location">📍 {course.city}, CA</div>
        <div className="course-card-stats">
          <div className="course-stat">
            <div className="course-stat-val">{course.par}</div>
            <div className="course-stat-key">Par</div>
          </div>
          <div className="course-stat">
            <div className="course-stat-val">{bestTee.yards.toLocaleString()}</div>
            <div className="course-stat-key">Yards</div>
          </div>
          <div className="course-stat">
            <div className="course-stat-val">{bestTee.slope}</div>
            <div className="course-stat-key">Slope</div>
          </div>
        </div>
        <div className="course-card-tees">
          {course.tees.map((t) => (
            <div className="tee-pill" key={t.name}>
              <span className="tee-dot" style={{ background: t.color }} />
              {t.name}
            </div>
          ))}
        </div>
      </div>
      <div className="course-card-footer">
        <span className="course-card-est">Est. {course.established}</span>
        <div className="course-card-arrow">→</div>
      </div>
    </div>
  );
}
