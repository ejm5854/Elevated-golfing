import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courses } from "../courses.js";

const REGIONS = ["All", "Fresno", "Madera"];
const TYPES = ["All", "Public", "Semi-Private", "Private"];

export default function Courses() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("All");
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    const matchRegion = region === "All" || c.region === region;
    const matchType = type === "All" || c.type === type;
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchType && matchSearch;
  });

  return (
    <div className="page">
      {/* Page Hero */}
      <div style={{
        background: "linear-gradient(150deg, var(--green-900) 0%, var(--green-700) 100%)",
        padding: "56px 24px 48px"
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="section-eyebrow" style={{ color: "var(--gold-light)", marginBottom: 10 }}>
            Central Valley Golf
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: "white",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            marginBottom: 12
          }}>
            Local Course Directory
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", maxWidth: 500 }}>
            Every golf course in Fresno, Clovis, and Madera — with full scorecards, ratings, and tee options.
          </p>
        </div>
      </div>

      <div className="section">
        {/* Search + Filters */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 24 }}>
          <div className="search-bar" style={{ flex: "1", minWidth: 220 }}>
            <span style={{ color: "var(--gray-400)" }}>🔍</span>
            <input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", fontSize: "1rem" }}
              >×</button>
            )}
          </div>
        </div>

        {/* Region filter */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray-400)", marginBottom: 8 }}>Region</div>
          <div className="filter-bar">
            {REGIONS.map((r) => (
              <button
                key={r}
                className={`filter-btn ${region === r ? "active" : ""}`}
                onClick={() => setRegion(r)}
              >
                {r === "All" ? `All Regions` : `${r}`}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gray-400)", marginBottom: 8 }}>Access</div>
          <div className="filter-bar">
            {TYPES.map((t) => (
              <button
                key={t}
                className={`filter-btn ${type === t ? "active" : ""}`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: "0.83rem", color: "var(--gray-500)", marginBottom: 20, fontWeight: 500 }}>
          Showing <strong style={{ color: "var(--gray-900)" }}>{filtered.length}</strong> of {courses.length} courses
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⛳</div>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, onClick }) {
  const bestTee = course.tees[0];
  const typeClass =
    course.type === "Public"
      ? "badge-public"
      : course.type === "Private"
      ? "badge-private"
      : "badge-semi";

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
              {t.name} — {t.yards.toLocaleString()} yds
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
