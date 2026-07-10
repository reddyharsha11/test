"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CharacterRenderer } from "@/components/character/CharacterRenderer";
import { useGuideStore } from "@/store/guideStore";
import { Send, Sparkles, CheckCircle2, Globe, ExternalLink, Code2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CodePlayground } from "@/components/ide/CodePlayground";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: string[];
}

export function PortfolioBuilder({ onComplete }: { onComplete: () => void }) {
  const { characterType } = useGuideStore();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "msg-1", 
      sender: "bot", 
      text: "Hi! Let's build your portfolio. What kind of design style do you want?",
      options: ["Best Version", "Minimalist", "Dark", "Red & White", "Ocean Blue", "Forest Green"]
    }
  ]);
  const [input, setInput] = useState("");
  const [portfolioData, setPortfolioData] = useState({
    name: "Alex Developer",
    college: "Tech University",
    skills: "React, Next.js, Tailwind",
    contact: "1234567890",
    style: "Minimalist"
  });
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (overrideMsg?: string) => {
    const userMsg = overrideMsg || input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userMsg }]);
    if (!overrideMsg) setInput("");

    setTimeout(() => {
      if (step === 1) {
        setPortfolioData(prev => ({ ...prev, style: userMsg }));
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), sender: "bot", 
          text: `Great! A ${userMsg} portfolio it is. What is your name?`
        }]);
        setStep(2);
      } else if (step === 2) {
        setPortfolioData(prev => ({ ...prev, name: userMsg }));
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), sender: "bot", 
          text: `Nice to meet you, ${userMsg}! What college do you attend?`
        }]);
        setStep(3);
      } else if (step === 3) {
        setPortfolioData(prev => ({ ...prev, college: userMsg }));
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), sender: "bot", 
          text: `Got it. What are your main skills?`
        }]);
        setStep(4);
      } else if (step === 4) {
        setPortfolioData(prev => ({ ...prev, skills: userMsg }));
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), sender: "bot", 
          text: `Awesome skills! Finally, what is your contact number or email?`
        }]);
        setStep(5);
      } else if (step === 5) {
        setPortfolioData(prev => ({ ...prev, contact: userMsg }));
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), sender: "bot", 
          text: `All done! I've generated your custom portfolio in the IDE. You can view the Live Output on the right side! Feel free to edit the code directly. Click 'Publish Portfolio' when you're done!`
        }]);
        setStep(6);
      }
    }, 800);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...portfolioData, theme: "minimalist", isPublished: true })
      });
      const data = await res.json();
      if (data.success) {
        setPublishedUrl(`${window.location.origin}/p/${data.portfolio.userId}`);
      }
    } catch (e) {
      console.error(e);
    }
    setIsPublishing(false);
  };

  // Dynamic styling based on user input
  const styleRaw = portfolioData.style.toLowerCase();
  const isDark = styleRaw.includes('dark');
  const isColorful = styleRaw.includes('color');
  const isRed = styleRaw.includes('red');
  const isBlue = styleRaw.includes('blue');
  const isGreen = styleRaw.includes('green');
  const isPurple = styleRaw.includes('purple');
  const isOrange = styleRaw.includes('orange');
  const isPink = styleRaw.includes('pink');
  const isBest = styleRaw.includes('best');

  let themeVars = {
    bgPrimary: '#fafafa',
    bgSecondary: '#f4f4f5',
    bgCard: '#ffffff',
    textPrimary: '#18181b',
    textSecondary: '#71717a',
    accent: '#6366f1',
    border: '#e4e4e7',
    accentGlow: 'rgba(99, 102, 241, 0.15)',
    shadow: '0 10px 30px rgba(0,0,0,0.03)'
  };

  if (isBest) {
    themeVars = {
      bgPrimary: '#0B0F19',
      bgSecondary: '#111827',
      bgCard: 'rgba(255, 255, 255, 0.03)',
      textPrimary: '#f3f4f6',
      textSecondary: '#9ca3af',
      accent: '#a78bfa',
      border: 'rgba(255, 255, 255, 0.08)',
      accentGlow: 'rgba(167, 139, 250, 0.3)',
      shadow: '0 20px 40px rgba(0,0,0,0.5)'
    };
  } else if (isDark) {
    themeVars = {
      bgPrimary: '#121212',
      bgSecondary: '#1e1e1e',
      bgCard: '#1e1e1e',
      textPrimary: '#e0e0e0',
      textSecondary: '#a0a0a0',
      accent: '#38bdf8',
      border: '#2c2c2c',
      accentGlow: 'rgba(56, 189, 248, 0.2)',
      shadow: '0 10px 30px rgba(0,0,0,0.4)'
    };
  } else if (isRed) {
    themeVars = {
      bgPrimary: '#ffffff',
      bgSecondary: '#fff5f5',
      bgCard: '#ffffff',
      textPrimary: '#2d3748',
      textSecondary: '#718096',
      accent: '#e53e3e',
      border: '#fecaca',
      accentGlow: 'rgba(229, 62, 62, 0.15)',
      shadow: '0 10px 25px rgba(229, 62, 62, 0.04)'
    };
  } else if (isBlue) {
    themeVars = {
      bgPrimary: '#f0f9ff',
      bgSecondary: '#e0f2fe',
      bgCard: '#ffffff',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      accent: '#0284c7',
      border: '#bae6fd',
      accentGlow: 'rgba(2, 132, 199, 0.15)',
      shadow: '0 10px 25px rgba(2, 132, 199, 0.04)'
    };
  } else if (isGreen) {
    themeVars = {
      bgPrimary: '#f0fdf4',
      bgSecondary: '#dcfce7',
      bgCard: '#ffffff',
      textPrimary: '#14532d',
      textSecondary: '#166534',
      accent: '#16a34a',
      border: '#bbf7d0',
      accentGlow: 'rgba(22, 163, 74, 0.15)',
      shadow: '0 10px 25px rgba(22, 163, 74, 0.04)'
    };
  } else if (isPurple) {
    themeVars = {
      bgPrimary: '#faf5ff',
      bgSecondary: '#f3e8ff',
      bgCard: '#ffffff',
      textPrimary: '#3b0764',
      textSecondary: '#6b21a8',
      accent: '#8b5cf6',
      border: '#e9d5ff',
      accentGlow: 'rgba(139, 92, 246, 0.15)',
      shadow: '0 10px 25px rgba(139, 92, 246, 0.04)'
    };
  } else if (isOrange) {
    themeVars = {
      bgPrimary: '#fff7ed',
      bgSecondary: '#ffedd5',
      bgCard: '#ffffff',
      textPrimary: '#431407',
      textSecondary: '#9a3412',
      accent: '#f97316',
      border: '#fed7aa',
      accentGlow: 'rgba(249, 115, 22, 0.15)',
      shadow: '0 10px 25px rgba(249, 115, 22, 0.04)'
    };
  } else if (isPink) {
    themeVars = {
      bgPrimary: '#fdf2f8',
      bgSecondary: '#fce7f3',
      bgCard: '#ffffff',
      textPrimary: '#500724',
      textSecondary: '#9d174d',
      accent: '#ec4899',
      border: '#fbcfe8',
      accentGlow: 'rgba(236, 72, 153, 0.15)',
      shadow: '0 10px 25px rgba(236, 72, 153, 0.04)'
    };
  } else if (isColorful) {
    themeVars = {
      bgPrimary: '#fdf4ff',
      bgSecondary: '#fae8ff',
      bgCard: '#ffffff',
      textPrimary: '#3b0764',
      textSecondary: '#701a75',
      accent: '#d946ef',
      border: '#f5d0fe',
      accentGlow: 'rgba(217, 70, 239, 0.15)',
      shadow: '0 10px 25px rgba(217, 70, 239, 0.04)'
    };
  }

  // Generate self-contained HTML for Sandpack
  const generatedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolioData.name} - Professional Portfolio</title>
  <link rel="stylesheet" href="styles.css">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

  <!-- Custom Alert Toast -->
  <div id="toast" class="toast">
    <div class="toast-content">
      <span class="toast-icon">✓</span>
      <div class="toast-message">
        <strong>Success!</strong>
        <span>Message sent successfully.</span>
      </div>
    </div>
  </div>

  <!-- Ambient background glow particles -->
  <div class="glow-bg">
    <div class="glow-sphere glow-1"></div>
    <div class="glow-sphere glow-2"></div>
  </div>

  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-container">
      <a href="#" class="logo">${portfolioData.name.split(' ')[0]}<span>.</span></a>
      <div class="nav-links">
        <a href="#about" class="nav-link">About</a>
        <a href="#skills" class="nav-link">Skills</a>
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#contact" class="nav-link">Contact</a>
      </div>
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Theme">
        <!-- Sun Icon -->
        <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        <!-- Moon Icon -->
        <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="hero">
    <div class="hero-container">
      <div class="status-badge">
        <span class="pulse-dot"></span>
        <span>Available for New Projects</span>
      </div>
      <h1 class="hero-title">
        Creative developer shaping <span class="gradient-text">digital realities</span>
      </h1>
      <p class="hero-subtitle">
        Hi, I'm <strong class="name-highlight">${portfolioData.name}</strong>. I specialize in building highly responsive, premium web interfaces. Currently studying at <strong>${portfolioData.college}</strong>.
      </p>
      <div class="hero-actions">
        <a href="#projects" class="btn btn-primary">Explore My Work</a>
        <a href="#contact" class="btn btn-secondary">Let's Connect</a>
      </div>
    </div>
  </header>

  <!-- About Section -->
  <section id="about" class="section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-tag">01. ABOUT ME</span>
        <h2 class="section-title">My Journey & Focus</h2>
      </div>
      <div class="about-grid">
        <div class="about-text">
          <p>
            I'm a passionate developer focused on building interactive, user-friendly, and modern web experiences. By combining clean semantics with sleek visuals, I create applications that are both fast and engaging to use.
          </p>
          <p>
            I believe that software should not only solve technical problems but also provide delightful user experiences. Let's work together to make that happen.
          </p>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-num counter" data-target="12">0</span>
            <span class="stat-label">Projects Completed</span>
          </div>
          <div class="stat-card">
            <span class="stat-num">100%</span>
            <span class="stat-label">Client Satisfaction</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Skills Section -->
  <section id="skills" class="section bg-alt">
    <div class="section-container">
      <div class="section-header">
        <span class="section-tag">02. EXPERTISE</span>
        <h2 class="section-title">Core Technologies</h2>
      </div>
      <p class="skills-intro">Click a skill to highlight projects using that technology</p>
      <div class="skills-container">
        <!-- Generate skill badges dynamically -->
        ${portfolioData.skills.split(',').map((skill) => `
        <button class="skill-badge" data-skill="${skill.trim().toLowerCase()}">
          ${skill.trim()}
        </button>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Projects Section -->
  <section id="projects" class="section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-tag">03. WORK</span>
        <h2 class="section-title">Featured Projects</h2>
      </div>
      
      <!-- Project Category Filters -->
      <div class="project-filters">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="frontend">Frontend</button>
        <button class="filter-btn" data-filter="backend">Backend</button>
        <button class="filter-btn" data-filter="fullstack">Fullstack</button>
      </div>

      <div class="projects-grid">
        <!-- Project 1 -->
        <div class="project-card" data-category="frontend" data-skills="react,tailwind">
          <div class="project-header">
            <svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <div class="project-links">
              <a href="#" aria-label="Github"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg></a>
              <a href="#" aria-label="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a>
            </div>
          </div>
          <h3 class="project-title">StudioCart</h3>
          <p class="project-desc">A premium e-commerce platform template equipped with cart states, product filtering, and responsive structures.</p>
          <div class="project-tags">
            <span>React</span>
            <span>Tailwind</span>
            <span>Frontend</span>
          </div>
        </div>

        <!-- Project 2 -->
        <div class="project-card" data-category="backend" data-skills="node,express,mongodb">
          <div class="project-header">
            <svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
            <div class="project-links">
              <a href="#" aria-label="Github"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg></a>
              <a href="#" aria-label="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a>
            </div>
          </div>
          <h3 class="project-title">Auth Engine</h3>
          <p class="project-desc">Highly secure authentication middleware stack utilizing JWT tokens, salting, and refresh-token paradigms.</p>
          <div class="project-tags">
            <span>Node.js</span>
            <span>Express</span>
            <span>MongoDB</span>
          </div>
        </div>

        <!-- Project 3 -->
        <div class="project-card" data-category="fullstack" data-skills="next,react,mongodb">
          <div class="project-header">
            <svg class="project-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <div class="project-links">
              <a href="#" aria-label="Github"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg></a>
              <a href="#" aria-label="Live Demo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg></a>
            </div>
          </div>
          <h3 class="project-title">GuideLearn LMS</h3>
          <p class="project-desc">A next-generation gamified learning management platform integrated with simulated chatbot guide assistants.</p>
          <div class="project-tags">
            <span>Next.js</span>
            <span>React</span>
            <span>MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="section bg-alt">
    <div class="section-container max-w-md">
      <div class="section-header text-center">
        <span class="section-tag">04. CONTACT</span>
        <h2 class="section-title">Get In Touch</h2>
        <p class="section-subtitle">Have a project or opportunity? Send a message!</p>
      </div>

      <form id="contact-form" class="contact-form">
        <div class="input-group">
          <input type="text" id="name" required placeholder=" ">
          <label for="name">Your Name</label>
        </div>
        <div class="input-group">
          <input type="email" id="email" required placeholder=" ">
          <label for="email">Email Address</label>
        </div>
        <div class="input-group">
          <textarea id="message" rows="5" required placeholder=" "></textarea>
          <label for="message">Message Description</label>
        </div>
        <button type="submit" class="btn btn-primary btn-block">
          Send Message
        </button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <p>© <span id="year">2026</span> ${portfolioData.name}. All rights reserved.</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

  // Generate CSS styles
  const generatedCss = `:root {
  --bg-primary: ${themeVars.bgPrimary};
  --bg-secondary: ${themeVars.bgSecondary};
  --bg-card: ${themeVars.bgCard};
  --text-primary: ${themeVars.textPrimary};
  --text-secondary: ${themeVars.textSecondary};
  --accent: ${themeVars.accent};
  --border: ${themeVars.border};
  --accent-glow: ${themeVars.accentGlow};
  --shadow: ${themeVars.shadow};
}

/* Light / Dark overrides triggered by script toggle class */
body.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --bg-card: #ffffff;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --accent: #6366f1;
  --border: #e5e7eb;
  --accent-glow: rgba(99, 102, 241, 0.1);
  --shadow: 0 4px 20px rgba(0,0,0,0.05);
}

body.dark-theme {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: rgba(255, 255, 255, 0.03);
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --accent: #a78bfa;
  --border: rgba(255, 255, 255, 0.08);
  --accent-glow: rgba(167, 139, 250, 0.25);
  --shadow: 0 20px 45px rgba(0,0,0,0.45);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.4s ease, color 0.4s ease;
  line-height: 1.6;
  overflow-x: hidden;
  position: relative;
}

/* Glowing background ambient shapes */
.glow-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.glow-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  transition: background 0.4s ease;
}

.glow-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: var(--accent);
}

.glow-2 {
  top: 50%;
  right: -10%;
  width: 40vw;
  height: 40vw;
  background: var(--accent);
}

/* Navbar styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--bg-primary);
  opacity: 0.96;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  letter-spacing: -0.03em;
}

.logo span {
  color: var(--accent);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--accent);
}

/* Theme Toggle */
.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.theme-toggle svg {
  width: 1.1rem;
  height: 1.1rem;
}

body.dark-theme .sun-icon {
  display: block;
}
body.dark-theme .moon-icon {
  display: none;
}
body.light-theme .sun-icon {
  display: none;
}
body.light-theme .moon-icon {
  display: block;
}

.sun-icon { display: ${isDark || isBest ? 'block' : 'none'}; }
.moon-icon { display: ${isDark || isBest ? 'none' : 'block'}; }

/* Hero Section */
.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 4rem;
  z-index: 1;
  position: relative;
}

.hero-container {
  max-width: 800px;
  text-align: center;
  animation: fade-up 1s ease;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  position: relative;
}

.pulse-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: #22c55e;
  animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(2.2); opacity: 0; }
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent), var(--text-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Button UI */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--accent);
  color: #fff;
  border: none;
  box-shadow: 0 4px 15px var(--accent-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--accent-glow);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.btn-block {
  width: 100%;
}

/* Section elements */
.section {
  padding: 6rem 2rem;
  position: relative;
  z-index: 1;
}

.section-container {
  max-width: 1100px;
  margin: 0 auto;
}

.max-w-md {
  max-width: 600px;
}

.bg-alt {
  background-color: var(--bg-secondary);
}

.section-header {
  margin-bottom: 3.5rem;
}

.section-tag {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 0.75rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* About Grid */
.about-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-text p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stat-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  padding: 2.25rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: var(--shadow);
}

.stat-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: var(--accent);
  display: block;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Skills Badges */
.skills-intro {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.skill-badge {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 99px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-badge:hover {
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 4px 15px var(--accent-glow);
  transform: translateY(-2px);
}

.skill-badge.highlighted {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 4px 15px var(--accent-glow);
}

/* Project Filters */
.project-filters {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 99px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover, .filter-btn.active {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--bg-secondary);
}

/* Projects grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.project-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.project-card.fade-out {
  opacity: 0.15;
  transform: scale(0.97);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.project-icon {
  width: 2rem;
  height: 2rem;
  color: var(--accent);
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-links a {
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.project-links a:hover {
  color: var(--accent);
}

.project-links svg {
  width: 1.25rem;
  height: 1.25rem;
}

.project-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.project-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  flex: 1;
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.project-tags span {
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  color: var(--text-secondary);
}

/* Contact Form Input fields */
.contact-form {
  display: grid;
  gap: 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: var(--shadow);
}

.input-group {
  position: relative;
}

.input-group input, .input-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
}

.input-group textarea {
  resize: vertical;
}

.input-group label {
  position: absolute;
  left: 1rem;
  top: 0.85rem;
  color: var(--text-secondary);
  pointer-events: none;
  transition: all 0.25s ease;
  font-size: 0.95rem;
}

/* Input validation states / Floating labels */
.input-group input:focus, .input-group textarea:focus {
  border-color: var(--accent);
  background: var(--bg-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label,
.input-group textarea:focus ~ label,
.input-group textarea:not(:placeholder-shown) ~ label {
  top: -1.4rem;
  left: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent);
}

/* Footer Section */
.footer {
  text-align: center;
  padding: 3rem 2rem;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Custom Alert Toast overlay styling */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.35);
  display: flex;
  align-items: center;
  z-index: 1000;
  transform: translateY(150%) scale(0.9);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast.show {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-icon {
  font-size: 1.2rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-message {
  display: flex;
  flex-direction: column;
}

.toast-message strong {
  font-size: 0.95rem;
  line-height: 1.2;
}

.toast-message span {
  font-size: 0.8rem;
  opacity: 0.9;
}

/* Responsive grid layouts */
@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .nav-links {
    display: none;
  }
}
`;

  // Generate JS script
  const generatedJs = `const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check system or saved preference
const savedTheme = localStorage.getItem('theme') || '${isDark || isBest ? 'dark' : 'light'}';
body.classList.add(savedTheme + '-theme');

themeToggle.addEventListener('click', () => {
  if (body.classList.contains('dark-theme')) {
    body.classList.replace('dark-theme', 'light-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.replace('light-theme', 'dark-theme');
    localStorage.setItem('theme', 'dark');
  }
});

// Interactive Skill highlight filtering
const skillBadges = document.querySelectorAll('.skill-badge');
const projectCards = document.querySelectorAll('.project-card');

skillBadges.forEach(badge => {
  badge.addEventListener('click', () => {
    const skill = badge.getAttribute('data-skill');
    
    // Toggle active highlighted badge
    if (badge.classList.contains('highlighted')) {
      badge.classList.remove('highlighted');
      // Reset highlights
      projectCards.forEach(card => card.classList.remove('fade-out'));
    } else {
      skillBadges.forEach(b => b.classList.remove('highlighted'));
      badge.classList.add('highlighted');
      
      // Filter out non-matching cards
      projectCards.forEach(card => {
        const cardSkills = card.getAttribute('data-skills').split(',');
        if (cardSkills.includes(skill)) {
          card.classList.remove('fade-out');
        } else {
          card.classList.add('fade-out');
        }
      });
    }
  });
});

// Counter triggers
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const target = +counter.getAttribute('data-target');
  const duration = 1000;
  const step = target / (duration / 16);
  
  let current = 0;
  const update = () => {
    current += step;
    if (current < target) {
      counter.innerText = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      counter.innerText = target;
    }
  };
  update();
});

// Category filtering
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
        card.classList.remove('fade-out');
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Form trigger and notifications
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const origText = submitBtn.innerText;
  
  submitBtn.innerText = 'Sending...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    submitBtn.innerText = 'Message Sent!';
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      submitBtn.innerText = origText;
      submitBtn.disabled = false;
      contactForm.reset();
    }, 2800);
  }, 1000);
});

document.getElementById('year').innerText = new Date().getFullYear();
`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 h-[75vh] min-h-[600px] w-full max-w-[1800px] mx-auto">
      
      {/* COLUMN 1: Chat Builder Interface */}
      <div className="bg-surface-50 dark:bg-surface-dark-100 rounded-2xl border border-surface-200 dark:border-surface-dark-300 flex flex-col overflow-hidden h-full">
        <div className="p-4 border-b border-surface-200 dark:border-surface-dark-300 flex items-center gap-3 bg-white dark:bg-surface-dark-50">
          <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center overflow-hidden border-2 border-white dark:border-surface-dark-50 shadow-sm">
             <CharacterRenderer characterType={characterType} animation="idle" size="sm" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Portfolio Guide</h3>
            <p className="text-xs text-brand-500 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Assistant
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
                <div className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-brand-500 text-white rounded-br-none" : "bg-white dark:bg-surface-dark-50 border border-surface-200 dark:border-surface-dark-300 text-gray-800 dark:text-gray-200 rounded-bl-none"}`}>
                    {msg.text}
                  </div>
                </div>
                
                {/* Options Pills */}
                {idx === messages.length - 1 && msg.sender === "bot" && msg.options && (
                  <div className="flex flex-wrap gap-2 mt-1 px-1">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSend(opt)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-full border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 hover:border-brand-300 transition-colors shadow-sm dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20 dark:hover:bg-brand-500/20"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-surface-dark-50 border-t border-surface-200 dark:border-surface-dark-300 flex flex-col gap-3">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your answer..."
              className="flex-1 bg-surface-100 dark:bg-surface-dark-200 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              disabled={step === 6 || !!publishedUrl}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || step === 6 || !!publishedUrl}
              className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white disabled:opacity-50 transition-colors hover:bg-brand-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons inside the sidebar for better layout usage */}
          {step === 6 && (
            <div className="flex flex-col gap-2 mt-2">
              <Button icon={<Globe className="w-4 h-4" />} onClick={handlePublish} size="lg" disabled={isPublishing || !!publishedUrl} className="w-full">
                {isPublishing ? "Publishing..." : publishedUrl ? "Published!" : "Publish Portfolio"}
              </Button>
              {publishedUrl && <Button variant="secondary" onClick={onComplete} size="lg" className="w-full">Complete Lesson</Button>}
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 2: IDE + Built-in Preview */}
      <div className="bg-surface-900 dark:bg-surface-dark-200 rounded-2xl overflow-hidden border border-surface-800 flex flex-col h-full relative">
         <div className="p-3 bg-surface-800 border-b border-surface-700 flex items-center gap-2 text-xs text-gray-300 font-mono">
            <Code2 className="w-4 h-4 text-brand-400" /> index.html (Editable Output)
         </div>
         <div className="flex-1 overflow-hidden relative">
            
            {publishedUrl && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center text-white">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface-dark-100 border border-surface-dark-300 p-8 rounded-2xl max-w-sm w-full">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-white" /></div>
                  <h2 className="text-2xl font-bold mb-2">Portfolio Published!</h2>
                  <div className="bg-black p-3 rounded-lg flex items-center justify-between mb-4 border border-surface-dark-300 mt-4">
                    <span className="text-xs truncate text-brand-400 font-mono mr-2">{publishedUrl}</span>
                  </div>
                  <a href={publishedUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition">
                    <ExternalLink className="w-4 h-4" /> Visit Live Site
                  </a>
                </motion.div>
              </div>
            )}

            <CodePlayground 
              template="static"
              options={{ 
                showConsole: false, 
                showFileExplorer: true
              }}
              files={{ 
                "index.html": generatedHtml,
                "styles.css": generatedCss,
                "script.js": generatedJs
              }}
            />
         </div>
      </div>

    </div>
  );
}
