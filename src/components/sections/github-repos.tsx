"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  Solidity: "#aa6746",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Kotlin: "#7f52ff",
  Swift: "#f05138",
};

/* ── Typing effect hook ─────────────────── */
function useTypewriter(text: string, trigger: boolean, speed = 38) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!trigger) return;
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, trigger, speed]);
  return displayed;
}

/* ── Single repo card ────────────────────── */
function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const typedName = useTypewriter(repo.name.replace(/-/g, " "), inView, 42);
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? "rgba(255,255,255,0.3)") : "rgba(255,255,255,0.2)";
  const relativeTime = repo.updated_at
    ? new Date(repo.updated_at).toLocaleDateString("en", { month: "short", year: "numeric" })
    : "";

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }}
      animate={inView ? { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "block",
        textDecoration: "none",
        padding: "clamp(16px, 2.5vw, 28px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderLeft: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: "transparent",
        transition: "background 0.3s ease",
      }}
      whileHover={{ background: "rgba(200,168,74,0.04)" }}
    >
      {/* scan line on hover */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, transparent 40%, rgba(200,168,74,0.03) 100%)",
          opacity: 0,
          pointerEvents: "none",
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <h3 style={{
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "clamp(0.78rem, 1.2vw, 0.95rem)",
          fontWeight: 400,
          color: "rgba(200,168,74,0.9)",
          margin: 0,
          letterSpacing: "0.05em",
          minHeight: "1.2em",
        }}>
          {typedName || <span style={{ opacity: 0 }}>{repo.name}</span>}
          {inView && typedName.length < repo.name.length && (
            <span style={{ borderRight: "1.5px solid rgba(200,168,74,0.8)", marginLeft: 1, animation: "blink 0.7s step-end infinite" }} />
          )}
        </h3>
        <span style={{
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.2)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          {relativeTime}
        </span>
      </div>

      {/* description */}
      <p style={{
        fontFamily: "var(--font-cormorant, serif)",
        fontStyle: "italic",
        fontSize: "clamp(0.88rem, 1.1vw, 1rem)",
        color: "rgba(248,245,234,0.45)",
        margin: "0 0 14px",
        lineHeight: 1.5,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {repo.description ?? "—"}
      </p>

      {/* bottom row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {repo.language && (
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: langColor, flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
              fontSize: "0.58rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}>
              {repo.language}
            </span>
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.58rem",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.1em",
          }}>
            ★ {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.58rem",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.1em",
          }}>
            ⑂ {repo.forks_count}
          </span>
        )}
      </div>
    </motion.a>
  );
}

/* ── Main component ─────────────────────── */
export default function GithubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    fetch("https://api.github.com/users/AlejoReyna/repos?per_page=100&sort=updated")
      .then((r) => r.json())
      .then((data: Repo[]) => {
        const filtered = data
          .filter((r) => !r.name.startsWith(".") && r.name !== "AlejoReyna")
          .slice(0, 18);
        setRepos(filtered);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section style={{ background: "transparent" }}>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>

      {/* section header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "clamp(32px, 6vw, 56px) clamp(24px, 6vw, 80px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(200,168,74,0.82)",
            margin: "0 0 10px",
          }}>
            section 04 / open source
          </p>
          <h2 style={{
            fontFamily: "var(--font-bebas, sans-serif)",
            fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.01em",
            color: "#f8f5ea",
            margin: 0,
          }}>
            Public Repos
          </h2>
        </div>
        <a
          href="https://github.com/AlejoReyna?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(200,168,74,0.7)",
            textDecoration: "none",
            borderBottom: "1px solid rgba(200,168,74,0.3)",
            paddingBottom: "2px",
            transition: "color 0.2s, border-color 0.2s",
          }}
        >
          View all on GitHub →
        </a>
      </div>

      {/* grid */}
      {status === "loading" && (
        <div style={{
          padding: "80px",
          textAlign: "center",
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.2)",
          textTransform: "uppercase",
        }}>
          fetching repos<span style={{ animation: "blink 1s step-end infinite" }}>_</span>
        </div>
      )}

      {status === "error" && (
        <div style={{
          padding: "80px",
          textAlign: "center",
          fontFamily: "var(--font-space-mono, ui-monospace, monospace)",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          color: "rgba(200,168,74,0.4)",
          textTransform: "uppercase",
        }}>
          GitHub API rate limit — try refreshing
        </div>
      )}

      {status === "ok" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px, 30vw, 380px), 1fr))",
        }}>
          {repos.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
