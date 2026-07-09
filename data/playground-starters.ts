import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

export type PlaygroundFile = string | { code: string; active?: boolean; hidden?: boolean };
export type PlaygroundFiles = Record<string, PlaygroundFile>;

export type PlaygroundStarterOption = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

export type PlaygroundStarter = PlaygroundStarterOption & {
  template: SandpackPredefinedTemplate;
  files: PlaygroundFiles;
};

const REACT_INDEX_JS = `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

function createHtml(title: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
}

function createStyles({
  accent,
  accent2,
  accentSoft,
  background,
  panel,
  border,
  text,
  muted,
}: {
  accent: string;
  accent2: string;
  accentSoft: string;
  background: string;
  panel: string;
  border: string;
  text: string;
  muted: string;
}) {
  return `* {
  box-sizing: border-box;
}

html, body, #root {
  min-height: 100%;
}

body {
  margin: 0;
  min-height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: ${text};
  background:
    radial-gradient(circle at top left, ${accentSoft}, transparent 30%),
    radial-gradient(circle at top right, ${accent2}22, transparent 26%),
    linear-gradient(160deg, ${background}, #060814 100%);
}

button, input, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.page {
  min-height: 100dvh;
  padding: 24px;
  display: flex;
  justify-content: center;
}

.shell {
  width: min(1180px, 100%);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.topbar,
.hero,
.feature-card,
.case-card,
.pricing-card,
.footer-note {
  border: 1px solid ${border};
  background: ${panel};
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-radius: 22px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 20px;
  background: linear-gradient(135deg, ${accent}, ${accent2});
  box-shadow: 0 0 0 6px ${accentSoft};
}

.brand-copy span {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: ${muted};
}

.brand-copy strong {
  display: block;
  font-size: 18px;
  line-height: 1.1;
}

.badge {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid ${border};
  background: ${accentSoft};
  color: ${text};
  font-size: 12px;
  font-weight: 800;
}

.hero {
  display: grid;
  grid-template-columns: 1.25fr 0.95fr;
  gap: 20px;
  border-radius: 28px;
  overflow: hidden;
}

.hero-copy {
  padding: 34px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: ${accentSoft};
  color: ${accent2};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(38px, 6vw, 68px);
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.lead {
  margin: 0;
  max-width: 58ch;
  font-size: 18px;
  line-height: 1.65;
  color: ${muted};
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button {
  border: 0;
  border-radius: 999px;
  padding: 14px 18px;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, ${accent}, ${accent2});
  box-shadow: 0 16px 32px ${accent}35;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.button.secondary {
  background: transparent;
  color: ${text};
  border: 1px solid ${border};
  box-shadow: none;
}

.button:hover {
  transform: translateY(-1px);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.metric {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${border};
}

.metric strong {
  display: block;
  font-size: 22px;
  line-height: 1;
}

.metric span {
  display: block;
  margin-top: 6px;
  color: ${muted};
  font-size: 12px;
}

.hero-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
}

.hero-card .preview {
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${border};
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.preview-panel {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${border};
}

.preview-panel strong,
.card strong,
.feature-card strong,
.case-card strong,
.pricing-card strong {
  display: block;
  margin-bottom: 6px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 12px;
}

.section-head h2 {
  margin: 0;
  font-size: 22px;
}

.section-head p {
  margin: 0;
  color: ${muted};
  font-size: 14px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  border: 1px solid ${border};
  background: rgba(255, 255, 255, 0.03);
  color: ${text};
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
  transition: 0.15s ease;
}

.chip.active {
  background: ${accentSoft};
  border-color: ${accent}55;
  color: ${accent2};
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.card,
.feature-card,
.case-card,
.pricing-card {
  border-radius: 24px;
  padding: 18px;
}

.card:hover,
.feature-card:hover,
.case-card:hover,
.pricing-card:hover {
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.card-top span,
.muted {
  color: ${muted};
  font-size: 12px;
}

.card p,
.feature-card p,
.case-card p,
.pricing-card p,
.footer-note {
  margin: 0;
  color: ${muted};
  line-height: 1.6;
  font-size: 14px;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${border};
  color: ${muted};
  font-size: 12px;
}

.pricing {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.pricing-card.featured {
  border-color: ${accent}66;
  box-shadow: 0 0 0 1px ${accent}22, 0 24px 60px rgba(0, 0, 0, 0.28);
}

.check-list {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.check-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${text};
  font-size: 14px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, ${accent}, ${accent2});
  box-shadow: 0 0 0 5px ${accentSoft};
  flex: 0 0 auto;
}

.footer-note {
  padding: 16px 18px;
  border-radius: 20px;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    padding: 24px;
  }

  .hero-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 14px;
  }

  .topbar {
    padding: 12px 14px;
  }

  h1 {
    font-size: 38px;
  }
}
`;
}

function createReactStarter(config: {
  id: string;
  label: string;
  icon: string;
  description: string;
  title: string;
  accent: string;
  accent2: string;
  accentSoft: string;
  background: string;
  panel: string;
  border: string;
  text: string;
  muted: string;
  appCode: string;
}): PlaygroundStarter {
  return {
    id: config.id,
    label: config.label,
    icon: config.icon,
    description: config.description,
    template: "react",
    files: {
      "index.js": REACT_INDEX_JS,
      "public/index.html": createHtml(config.title),
      "App.js": config.appCode,
      "styles.css": createStyles({
        accent: config.accent,
        accent2: config.accent2,
        accentSoft: config.accentSoft,
        background: config.background,
        panel: config.panel,
        border: config.border,
        text: config.text,
        muted: config.muted,
      }),
    },
  };
}

function createNextStarter(config: {
  id: string;
  label: string;
  icon: string;
  description: string;
  title: string;
  accent: string;
  accent2: string;
  accentSoft: string;
  background: string;
  panel: string;
  border: string;
  text: string;
  muted: string;
  pageCode: string;
}): PlaygroundStarter {
  return {
    id: config.id,
    label: config.label,
    icon: config.icon,
    description: config.description,
    template: "nextjs",
    files: {
      "pages/index.js": config.pageCode,
      "styles/globals.css": createStyles({
        accent: config.accent,
        accent2: config.accent2,
        accentSoft: config.accentSoft,
        background: config.background,
        panel: config.panel,
        border: config.border,
        text: config.text,
        muted: config.muted,
      }),
    },
  };
}

const ecommerceApp = `import React, { useMemo, useState } from "react";
import "./styles.css";

const CATEGORIES = ["All", "Wearables", "Audio", "Workspace"];

const PRODUCTS = [
  { name: "Astra Watch", category: "Wearables", price: "$129", copy: "Battery-first smartwatch with a crisp AMOLED face.", icon: "⌚" },
  { name: "Pulse Buds", category: "Audio", price: "$89", copy: "Noise isolation, long battery life, deep bass.", icon: "🎧" },
  { name: "Nimbus Keyboard", category: "Workspace", price: "$149", copy: "Low-profile mechanical board with soft tactility.", icon: "⌨️" },
  { name: "Orbit Mouse", category: "Workspace", price: "$59", copy: "Ultra-smooth travel with a thumb-friendly shape.", icon: "🖱️" },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(2);

  const visibleProducts = useMemo(
    () => PRODUCTS.filter((product) => activeCategory === "All" || product.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="page">
      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">◉</div>
            <div className="brand-copy">
              <span>Starter</span>
              <strong>StudioCart</strong>
            </div>
          </div>
          <div className="badge">Cart {cartCount}</div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">E-commerce boilerplate</div>
            <h1>Launch a premium storefront with a single click.</h1>
            <p className="lead">A polished commerce starter with category filters, product cards, and a clean hero section that feels ready for a real brand.</p>
            <div className="actions">
              <button className="button" onClick={() => setCartCount((value) => value + 1)}>Add featured bundle</button>
              <button className="button secondary">View catalog</button>
            </div>
            <div className="hero-metrics">
              <div className="metric"><strong>12k+</strong><span>monthly visitors</span></div>
              <div className="metric"><strong>4.9/5</strong><span>average rating</span></div>
              <div className="metric"><strong>48h</strong><span>delivery promise</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="preview">
              <div className="pill-row">
                <span className="pill">Fast checkout</span>
                <span className="pill">Free shipping</span>
                <span className="pill">Hot drops</span>
              </div>
              <div className="preview-grid" style={{ marginTop: 14 }}>
                <div className="preview-panel">
                  <strong>Hot product</strong>
                  <span className="muted">Astra Watch</span>
                </div>
                <div className="preview-panel">
                  <strong>Today</strong>
                  <span className="muted">138 carts opened</span>
                </div>
                <div className="preview-panel">
                  <strong>Conversion</strong>
                  <span className="muted">8.4% this week</span>
                </div>
                <div className="preview-panel">
                  <strong>Bundle</strong>
                  <span className="muted">watch + buds + mouse</span>
                </div>
              </div>
            </div>
            <div className="footer-note">Built for product launches, drops, and landing pages that need to feel trustworthy without looking generic.</div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Shop by category</h2>
              <p>Swap between starter content blocks and keep the same checkout story.</p>
            </div>
          </div>
          <div className="chips">
            {CATEGORIES.map((category) => (
              <button key={category} type="button" className={activeCategory === category ? "chip active" : "chip"} onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </div>
          <div className="grid">
            {visibleProducts.map((product) => (
              <article className="card" key={product.name}>
                <div className="card-top">
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                  </div>
                  <span style={{ fontSize: 24 }}>{product.icon}</span>
                </div>
                <p>{product.copy}</p>
                <div className="actions" style={{ marginTop: "auto" }}>
                  <button className="button" onClick={() => setCartCount((value) => value + 1)}>Add to cart</button>
                  <button className="button secondary">{product.price}</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
`;

const kfcApp = `import React, { useState } from "react";
import "./styles.css";

const MENU = [
  { name: "Crispy Bucket", price: "$19", copy: "Classic 8-piece bucket with golden crust and signature spice.", icon: "🍗" },
  { name: "Zinger Stack", price: "$11", copy: "Crunchy fillet, spicy mayo, lettuce, and a toasted bun.", icon: "🔥" },
  { name: "Family Feast", price: "$29", copy: "A shareable combo for movie nights and game day dinners.", icon: "🪩" },
  { name: "Coleslaw Combo", price: "$8", copy: "Balanced sides, chilled drink, and a crispy main.", icon: "🥤" },
];

const DEALS = ["Chicken that snaps", "Sides with attitude", "Fast pickup", "Late-night delivery"];

export default function App() {
  const [featuredDeal, setFeaturedDeal] = useState("Crispy Bucket");

  return (
    <div className="page">
      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">KF</div>
            <div className="brand-copy">
              <span>Landing page</span>
              <strong>KFC-style promo</strong>
            </div>
          </div>
          <div className="badge">Open until 1 AM</div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">KFC landing starter</div>
            <h1>Bold chicken promo pages that sell the craving.</h1>
            <p className="lead">Designed for promo campaigns, combo offers, and delivery-first menus with punchy visuals and a strong ordering flow.</p>
            <div className="actions">
              <button className="button" onClick={() => setFeaturedDeal("Family Feast")}>Order now</button>
              <button className="button secondary">See full menu</button>
            </div>
            <div className="hero-metrics">
              <div className="metric"><strong>18 min</strong><span>average pickup</span></div>
              <div className="metric"><strong>92%</strong><span>repeat orders</span></div>
              <div className="metric"><strong>4 combos</strong><span>hero promos</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="preview">
              <div className="pill-row">
                {DEALS.map((deal) => (
                  <span key={deal} className="pill">{deal}</span>
                ))}
              </div>
              <div style={{ marginTop: 16 }} className="preview-panel">
                <strong>Featured deal</strong>
                <span className="muted">{featuredDeal}</span>
                <p style={{ marginTop: 10 }}>Built for crispy hero sections, menu teasers, and promo banners that feel instantly hungry.</p>
              </div>
            </div>
            <div className="footer-note">The layout keeps the ordering CTA prominent and gives the menu room to breathe on smaller screens.</div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Menu highlights</h2>
              <p>Tap a card to swap the highlighted deal in the hero.</p>
            </div>
          </div>
          <div className="grid">
            {MENU.map((item) => (
              <article className="card" key={item.name} onClick={() => setFeaturedDeal(item.name)}>
                <div className="card-top">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.price}</span>
                  </div>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                </div>
                <p>{item.copy}</p>
                <div className="pill-row">
                  <span className="pill">Spicy</span>
                  <span className="pill">Fresh</span>
                  <span className="pill">Delivered hot</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
`;

const saasApp = `import React, { useState } from "react";
import "./styles.css";

const FEATURES = [
  { name: "Revenue cockpit", copy: "Track billing, renewals, and expansion at a glance.", icon: "📈" },
  { name: "Automations", copy: "Set up workflows for onboarding, churn, and alerts.", icon: "⚡" },
  { name: "Team sync", copy: "One place for product, success, and engineering.", icon: "👥" },
  { name: "Security", copy: "Permissioning, audit trails, and enterprise controls.", icon: "🛡️" },
];

const PLANS = ["Starter", "Growth", "Scale"];

export default function App() {
  const [activePlan, setActivePlan] = useState("Growth");

  return (
    <div className="page">
      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">S</div>
            <div className="brand-copy">
              <span>SaaS launch</span>
              <strong>SignalStack</strong>
            </div>
          </div>
          <div className="badge">14-day free trial</div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">SaaS boilerplate</div>
            <h1>A landing page that makes software look shipped.</h1>
            <p className="lead">Built for product launches with metrics, pricing, and a dashboard preview that sells value before the demo starts.</p>
            <div className="actions">
              <button className="button" onClick={() => setActivePlan("Growth")}>Start free trial</button>
              <button className="button secondary">Book a demo</button>
            </div>
            <div className="hero-metrics">
              <div className="metric"><strong>99.98%</strong><span>platform uptime</span></div>
              <div className="metric"><strong>3.2x</strong><span>faster onboarding</span></div>
              <div className="metric"><strong>24/7</strong><span>support coverage</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="preview">
              <div className="preview-grid">
                <div className="preview-panel"><strong>MRR</strong><span className="muted">$248k</span></div>
                <div className="preview-panel"><strong>Retention</strong><span className="muted">93.4%</span></div>
                <div className="preview-panel"><strong>Seats</strong><span className="muted">1,420</span></div>
                <div className="preview-panel"><strong>Alerts</strong><span className="muted">12 open</span></div>
              </div>
              <div className="pill-row" style={{ marginTop: 14 }}>
                <span className="pill">Auto sync</span>
                <span className="pill">Role-based access</span>
                <span className="pill">Live analytics</span>
              </div>
            </div>
            <div className="footer-note">Ideal for B2B launches, feature explainers, and pricing pages that need a confident, modern feel.</div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Product features</h2>
              <p>Fast enough for a demo, polished enough for a homepage.</p>
            </div>
            <div className="chips">
              {PLANS.map((plan) => (
                <button key={plan} type="button" className={activePlan === plan ? "chip active" : "chip"} onClick={() => setActivePlan(plan)}>
                  {plan}
                </button>
              ))}
            </div>
          </div>
          <div className="grid">
            {FEATURES.map((feature) => (
              <article className="feature-card" key={feature.name}>
                <strong>{feature.name}</strong>
                <p>{feature.copy}</p>
                <div className="pill-row" style={{ marginTop: 14 }}>
                  <span className="pill">{activePlan} plan</span>
                  <span className="pill">{feature.icon}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing">
          {PLANS.map((plan) => (
            <article key={plan} className={plan === activePlan ? "pricing-card featured" : "pricing-card"}>
              <strong>{plan}</strong>
              <p>Everything you need to move from concept to a confident launch.</p>
              <ul className="check-list">
                <li><span className="dot" /> Product analytics</li>
                <li><span className="dot" /> Team workspace</li>
                <li><span className="dot" /> Customer onboarding</li>
              </ul>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
`;

const agencyApp = `import React from "react";
import "./styles.css";

const SERVICES = [
  { name: "Brand systems", copy: "Identity, typography, and motion that feel editorial.", icon: "✦" },
  { name: "Campaign pages", copy: "Landing pages built to convert with a premium visual rhythm.", icon: "⌁" },
  { name: "Motion design", copy: "Micro-interactions that make launches feel alive.", icon: "◌" },
  { name: "Content strategy", copy: "Messaging that keeps the page concise and convincing.", icon: "◌" },
];

const CASES = [
  { name: "Northstar Labs", copy: "Rebuilt their product story and cut demo friction in half." },
  { name: "Halo Fitness", copy: "Created a launch page that turned a waitlist into paid signups." },
  { name: "Atlas AI", copy: "Mapped a new identity across ads, decks, and product surfaces." },
];

export default function App() {
  return (
    <div className="page">
      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">A</div>
            <div className="brand-copy">
              <span>Creative studio</span>
              <strong>Arc Atelier</strong>
            </div>
          </div>
          <div className="badge">Pitch decks, pages, campaigns</div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">Agency landing starter</div>
            <h1>Editorial landing pages for teams with taste.</h1>
            <p className="lead">A sharp agency starter that leans premium, with case studies, services, and enough whitespace to feel expensive.</p>
            <div className="actions">
              <button className="button">Book a workshop</button>
              <button className="button secondary">See case studies</button>
            </div>
            <div className="hero-metrics">
              <div className="metric"><strong>18</strong><span>launches delivered</span></div>
              <div className="metric"><strong>6w</strong><span>average sprint</span></div>
              <div className="metric"><strong>2.4x</strong><span>conversion lift</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="preview">
              <div className="pill-row">
                <span className="pill">Naming</span>
                <span className="pill">Design systems</span>
                <span className="pill">Launches</span>
              </div>
              <div className="preview-grid" style={{ marginTop: 14 }}>
                <div className="preview-panel"><strong>Featured client</strong><span className="muted">Atlas AI</span></div>
                <div className="preview-panel"><strong>Scope</strong><span className="muted">Brand, web, motion</span></div>
                <div className="preview-panel"><strong>Turnaround</strong><span className="muted">5 weeks</span></div>
                <div className="preview-panel"><strong>Style</strong><span className="muted">Minimal, bold</span></div>
              </div>
            </div>
            <div className="footer-note">Use this as a service page, portfolio, or premium campaign starter when the brand should do most of the talking.</div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Services</h2>
              <p>Short, sharp blocks that communicate value fast.</p>
            </div>
          </div>
          <div className="grid">
            {SERVICES.map((service) => (
              <article className="feature-card" key={service.name}>
                <strong>{service.name} <span className="muted">{service.icon}</span></strong>
                <p>{service.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <h2>Selected work</h2>
              <p>Three case-study slots that fit a homepage or one-page pitch.</p>
            </div>
          </div>
          <div className="grid">
            {CASES.map((item) => (
              <article className="case-card" key={item.name}>
                <div className="card-top">
                  <div>
                    <strong>{item.name}</strong>
                    <span>Brand and product storytelling</span>
                  </div>
                  <span style={{ fontSize: 24 }}>↗</span>
                </div>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
`;

const reactStarter = createReactStarter({
  id: "react",
  label: "React App",
  icon: "⚛️",
  description: "A polished React starter with a hero, featured actions, and card-based sections.",
  title: "React App Starter",
  accent: "#0ea5e9",
  accent2: "#8b5cf6",
  accentSoft: "#0ea5e922",
  background: "#071018",
  panel: "rgba(10, 18, 28, 0.74)",
  border: "rgba(255, 255, 255, 0.10)",
  text: "#f6fbff",
  muted: "rgba(246, 251, 255, 0.70)",
  appCode: `import React from "react";
import "./styles.css";

export default function App() {
  return (
    <div className="page">
      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">R</div>
            <div className="brand-copy">
              <span>React starter</span>
              <strong>Nova UI</strong>
            </div>
          </div>
          <div className="badge">Component-ready</div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">React boilerplate</div>
            <h1>Ship polished React screens without starting from scratch.</h1>
            <p className="lead">This starter gives you a strong visual frame, reusable sections, and a layout that looks good before you add your own data or API calls.</p>
            <div className="actions">
              <button className="button">Create screen</button>
              <button className="button secondary">Open components</button>
            </div>
            <div className="hero-metrics">
              <div className="metric"><strong>3</strong><span>ready-made sections</span></div>
              <div className="metric"><strong>100%</strong><span>component friendly</span></div>
              <div className="metric"><strong>Fast</strong><span>to customize</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="preview">
              <div className="preview-grid">
                <div className="preview-panel"><strong>Widget</strong><span className="muted">Metrics</span></div>
                <div className="preview-panel"><strong>Widget</strong><span className="muted">Timeline</span></div>
                <div className="preview-panel"><strong>Widget</strong><span className="muted">Cards</span></div>
                <div className="preview-panel"><strong>Widget</strong><span className="muted">Actions</span></div>
              </div>
            </div>
            <div className="footer-note">Use this for dashboards, products, marketing pages, or any React screen that needs a clean foundation.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
`,
});

const nextStarter = createNextStarter({
  id: "nextjs",
  label: "Next.js App",
  icon: "▲",
  description: "A Next.js starter with app-like structure and a landing page that renders in Sandpack.",
  title: "Next.js App Starter",
  accent: "#22c55e",
  accent2: "#14b8a6",
  accentSoft: "#22c55e20",
  background: "#06120d",
  panel: "rgba(9, 20, 16, 0.74)",
  border: "rgba(255, 255, 255, 0.10)",
  text: "#f3fff8",
  muted: "rgba(243, 255, 248, 0.70)",
  pageCode: `export default function Home() {
  return (
    <div style={{ minHeight: "100vh", padding: 24, fontFamily: "Inter, system-ui, sans-serif", color: "#f3fff8", background: "radial-gradient(circle at top left, rgba(34, 197, 94, 0.18), transparent 30%), linear-gradient(160deg, #06120d, #020403 100%)" }}>
      <main style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 20 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: 16, borderRadius: 22, background: "rgba(10, 22, 18, 0.74)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", opacity: 0.7 }}>Next.js starter</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>LaunchPad</div>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 999, background: "rgba(34, 197, 94, 0.16)", border: "1px solid rgba(34, 197, 94, 0.24)" }}>App Router ready</div>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20 }}>
          <div style={{ padding: 32, borderRadius: 28, background: "rgba(10, 22, 18, 0.74)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "inline-flex", padding: "8px 12px", borderRadius: 999, background: "rgba(34, 197, 94, 0.16)", color: "#86efac", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Next.js boilerplate</div>
            <h1 style={{ margin: "18px 0 12px", fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>A clean Next.js page that is ready for routing, data, and deployment.</h1>
            <p style={{ margin: 0, maxWidth: 600, lineHeight: 1.7, color: "rgba(243, 255, 248, 0.72)", fontSize: 17 }}>Use this starter when you want a real Next.js feel with a polished hero, metrics, and sections that look production-ready out of the box.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 20 }}>
              <button style={{ border: 0, borderRadius: 999, padding: "14px 18px", fontWeight: 800, color: "#062015", background: "linear-gradient(135deg, #22c55e, #14b8a6)" }}>Start project</button>
              <button style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "14px 18px", fontWeight: 800, color: "#f3fff8", background: "transparent" }}>View examples</button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {[
              ["Performance", "Fast defaults"],
              ["Routing", "Pages/App ready"],
              ["Deploy", "Vercel friendly"],
              ["UI", "Easy to extend"],
            ].map(([title, value]) => (
              <div key={title} style={{ padding: 18, borderRadius: 22, background: "rgba(10, 22, 18, 0.74)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 12, color: "rgba(243,255,248,0.65)" }}>{title}</div>
                <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>{value}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
`,
});

export const PLAYGROUND_STARTERS = {
  ecommerce: createReactStarter({
    id: "ecommerce",
    label: "E-commerce",
    icon: "🛒",
    description: "A storefront starter with filters, cards, and a premium product hero.",
    title: "StudioCart E-commerce Starter",
    accent: "#6d5efc",
    accent2: "#24c08a",
    accentSoft: "#6d5efc22",
    background: "#080b18",
    panel: "rgba(9, 12, 24, 0.72)",
    border: "rgba(255, 255, 255, 0.10)",
    text: "#f5f7ff",
    muted: "rgba(245, 247, 255, 0.68)",
    appCode: ecommerceApp,
  }),
  react: reactStarter,
  kfc: createReactStarter({
    id: "kfc",
    label: "KFC Landing",
    icon: "🍗",
    description: "A bold campaign landing page for spicy combo offers and delivery promos.",
    title: "KFC Style Landing Starter",
    accent: "#e11d48",
    accent2: "#f59e0b",
    accentSoft: "#e11d4822",
    background: "#110707",
    panel: "rgba(24, 10, 10, 0.74)",
    border: "rgba(255, 255, 255, 0.11)",
    text: "#fff7f4",
    muted: "rgba(255, 247, 244, 0.70)",
    appCode: kfcApp,
  }),
  saas: createReactStarter({
    id: "saas",
    label: "SaaS Page",
    icon: "🚀",
    description: "A launch page with metrics, pricing, and dashboard-style proof points.",
    title: "SignalStack SaaS Starter",
    accent: "#3b82f6",
    accent2: "#8b5cf6",
    accentSoft: "#3b82f622",
    background: "#07111e",
    panel: "rgba(8, 16, 28, 0.72)",
    border: "rgba(255, 255, 255, 0.10)",
    text: "#f4f8ff",
    muted: "rgba(244, 248, 255, 0.70)",
    appCode: saasApp,
  }),
  agency: createReactStarter({
    id: "agency",
    label: "Agency",
    icon: "✦",
    description: "A premium editorial layout for studios, portfolios, and pitch pages.",
    title: "Arc Atelier Agency Starter",
    accent: "#f97316",
    accent2: "#14b8a6",
    accentSoft: "#f9731620",
    background: "#100d0b",
    panel: "rgba(20, 16, 14, 0.74)",
    border: "rgba(255, 255, 255, 0.10)",
    text: "#fffaf4",
    muted: "rgba(255, 250, 244, 0.70)",
    appCode: agencyApp,
  }),
  nextjs: nextStarter,
} as const;

export const PLAYGROUND_STARTER_OPTIONS: PlaygroundStarterOption[] = Object.values(PLAYGROUND_STARTERS).map(
  ({ id, label, icon, description }) => ({ id, label, icon, description })
);
