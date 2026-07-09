import type { Module } from "@/types/module";

export const modules: Module[] = [
  {
    id: "mod-1",
    title: "Web Development Fundamentals",
    slug: "web-fundamentals",
    description: "Master HTML, CSS, and JavaScript from scratch",
    longDescription:
      "Start your web development journey with a solid foundation. Learn semantic HTML, modern CSS layouts with Flexbox and Grid, and JavaScript essentials including ES6+ features, DOM manipulation, and async programming.",
    thumbnail: "/modules/web-fundamentals.jpg",
    color: "#6172f9",
    icon: "</> ",
    difficulty: "beginner",
    totalLessons: 18,
    estimatedHours: 12,
    xpReward: 500,
    order: 1,
    prerequisites: [],
    tags: ["HTML", "CSS", "JavaScript", "DOM", "ES6"],
    lessons: [
      {
        id: "lesson-1-1",
        moduleId: "mod-1",
        title: "Introduction to HTML",
        slug: "intro-to-html",
        description: "Learn the building blocks of web pages",
        duration: 20,
        order: 1,
        type: "interactive",
        xpReward: 30,
        steps: [
          {
            id: "step-1",
            title: "What is HTML?",
            type: "explanation",
            content:
              "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It defines the structure and content of a page using elements represented by tags.",
          },
          {
            id: "step-2",
            title: "Your First HTML Page",
            type: "example",
            content:
              "Every HTML document has a basic structure. Let's look at the boilerplate you'll use in every project.",
            codeExample: {
              language: "html",
              code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>Welcome to my first web page.</p>
  </body>
</html>`,
              label: "HTML Boilerplate",
            },
          },
          {
            id: "step-3",
            title: "HTML Elements",
            type: "explanation",
            content:
              "HTML elements are the building blocks of HTML pages. An element consists of a start tag, content, and end tag: `<tagname>Content</tagname>`.",
          },
          {
            id: "step-4",
            title: "Try It!",
            type: "exercise",
            content: "Create a simple HTML page with a heading and a paragraph.",
            exercise: {
              prompt:
                'Write an HTML page with an <h1> tag that says "GuideLearn" and a <p> tag describing what you want to learn.',
              hint: "Use the boilerplate from the previous step and fill in your content between the body tags.",
              solution: `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>GuideLearn</title>
  </head>
  <body>
    <h1>GuideLearn</h1>
    <p>I want to learn web development!</p>
  </body>
</html>`,
            },
          },
        ],
      },
      {
        id: "lesson-1-2",
        moduleId: "mod-1",
        title: "CSS Styling Basics",
        slug: "css-basics",
        description: "Style your pages with CSS",
        duration: 25,
        order: 2,
        type: "interactive",
        xpReward: 35,
        steps: [
          {
            id: "step-1",
            title: "What is CSS?",
            type: "explanation",
            content:
              "CSS (Cascading Style Sheets) controls the visual presentation of HTML elements. It handles colors, fonts, layout, animations, and responsive design.",
          },
          {
            id: "step-2",
            title: "CSS Selectors",
            type: "example",
            content:
              "Selectors target HTML elements to apply styles. You can target by tag, class, ID, or attribute.",
            codeExample: {
              language: "css",
              code: `/* Tag selector */
h1 { color: #6172f9; }

/* Class selector */
.card { background: white; border-radius: 12px; }

/* ID selector */
#hero { padding: 80px 0; }

/* Pseudo-class */
button:hover { transform: scale(1.05); }`,
              label: "CSS Selectors",
            },
          },
        ],
      },
      {
        id: "lesson-1-3",
        moduleId: "mod-1",
        title: "JavaScript Fundamentals",
        slug: "js-fundamentals",
        description: "Learn programming with JavaScript",
        duration: 35,
        order: 3,
        type: "interactive",
        xpReward: 40,
        steps: [
          {
            id: "step-1",
            title: "Variables and Data Types",
            type: "explanation",
            content:
              "JavaScript has three ways to declare variables: var (legacy), let (block-scoped mutable), and const (block-scoped immutable). Modern JS prefers let and const.",
          },
          {
            id: "step-2",
            title: "Modern Variable Declaration",
            type: "example",
            content: "Always use const by default, let when you need to reassign.",
            codeExample: {
              language: "javascript",
              code: `const name = "Alex";           // string
const age = 25;                // number
const isLearning = true;       // boolean
let score = 0;                 // mutable

// Arrays & Objects
const skills = ["HTML", "CSS", "JS"];
const user = { name, age, isLearning };

console.log(\`\${name} has \${skills.length} skills!\`);`,
              label: "Variables",
            },
          },
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What does HTML stand for?",
        options: [
          "HyperText Markup Language",
          "HighText Machine Language",
          "HyperText Machine Language",
          "HyperTool Markup Language",
        ],
        correctIndex: 0,
        explanation:
          "HTML stands for HyperText Markup Language — the standard language for creating web pages.",
      },
      {
        id: "q2",
        question: "Which CSS property controls text color?",
        options: ["font-color", "text-color", "color", "foreground"],
        correctIndex: 2,
        explanation:
          "The `color` property in CSS sets the foreground color of an element, including text.",
      },
      {
        id: "q3",
        question: "Which keyword declares a constant in JavaScript?",
        options: ["var", "let", "const", "static"],
        correctIndex: 2,
        explanation:
          "`const` declares a block-scoped variable whose value cannot be reassigned after initialization.",
      },
    ],
    cheatSheet: [
      {
        id: "cs-1",
        title: "HTML Document Structure",
        description: "The boilerplate every HTML file needs",
        code: {
          language: "html",
          code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Page Title</title>
  </head>
  <body>
    <!-- Content here -->
  </body>
</html>`,
        },
        tags: ["HTML", "boilerplate", "structure"],
      },
      {
        id: "cs-2",
        title: "CSS Flexbox",
        description: "Center anything with flexbox",
        code: {
          language: "css",
          code: `.container {
  display: flex;
  align-items: center;    /* vertical */
  justify-content: center; /* horizontal */
  gap: 1rem;
}`,
        },
        tags: ["CSS", "flexbox", "layout"],
      },
      {
        id: "cs-3",
        title: "JavaScript Arrow Function",
        description: "Concise function syntax with ES6",
        code: {
          language: "javascript",
          code: `// Traditional
function add(a, b) { return a + b; }

// Arrow function
const add = (a, b) => a + b;

// With body
const greet = (name) => {
  const msg = \`Hello, \${name}!\`;
  return msg;
};`,
        },
        tags: ["JavaScript", "ES6", "functions"],
      },
    ],
  },
  {
    id: "mod-2",
    title: "Building Your Portfolio",
    slug: "portfolio-builder",
    description: "Create a stunning developer portfolio with AI assistance",
    longDescription:
      "A developer's portfolio is their digital resume. In this interactive module, you'll first learn what makes a great portfolio, and then our AI guide will help you build and customize your own live portfolio in real-time.",
    thumbnail: "/modules/portfolio.jpg",
    color: "#a855f7", // purple
    icon: "🎨",
    difficulty: "beginner",
    totalLessons: 1,
    estimatedHours: 2,
    xpReward: 1000,
    order: 2,
    prerequisites: ["mod-1"],
    tags: ["Portfolio", "Design", "AI", "Career"],
    lessons: [
      {
        id: "lesson-2-1",
        moduleId: "mod-2",
        title: "Portfolio Kickoff",
        slug: "portfolio-kickoff",
        description: "Learn the basics and build your portfolio interactively.",
        duration: 30,
        order: 1,
        type: "interactive",
        xpReward: 100,
        steps: [
          {
            id: "step-1",
            title: "Why You Need a Portfolio",
            type: "video",
            content: "Watch this video to understand the anatomy of a great developer portfolio. (You must watch the entire video to proceed)",
          },
          {
            id: "step-2",
            title: "Build with AI",
            type: "builder",
            content: "Chat with your AI guide to construct your portfolio live.",
          }
        ],
      }
    ],
    quiz: [],
    cheatSheet: [],
  },
  {
    id: "mod-3",
    title: "Backend APIs with Node.js",
    slug: "backend-apis",
    description: "Build scalable REST APIs with Node.js, Express & MongoDB",
    longDescription:
      "Learn to build production-ready backend APIs using Node.js, Express, MongoDB with Mongoose, JWT authentication, middleware, error handling, and deployment.",
    thumbnail: "/modules/backend-apis.jpg",
    color: "#22c55e",
    icon: "🔧",
    difficulty: "intermediate",
    totalLessons: 14,
    estimatedHours: 16,
    xpReward: 700,
    order: 3,
    prerequisites: ["mod-1"],
    tags: ["Node.js", "Express", "MongoDB", "REST API", "JWT"],
    lessons: [
      {
        id: "lesson-3-1",
        moduleId: "mod-3",
        title: "Express Server Setup",
        slug: "express-setup",
        description: "Build your first Express API server",
        duration: 30,
        order: 1,
        type: "interactive",
        xpReward: 50,
        steps: [
          {
            id: "step-1",
            title: "What is Express?",
            type: "explanation",
            content:
              "Express.js is a minimal, flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.",
          },
          {
            id: "step-2",
            title: "Your First Express Server",
            type: "example",
            content: "Create a REST API server in just a few lines:",
            codeExample: {
              language: "typescript",
              code: `import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});`,
              label: "Express Server",
            },
          },
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "Which method handles GET requests in Express?",
        options: ["app.post()", "app.get()", "app.fetch()", "app.request()"],
        correctIndex: 1,
        explanation: "app.get() registers a route handler for HTTP GET requests.",
      },
    ],
    cheatSheet: [
      {
        id: "cs-1",
        title: "Express Router",
        description: "Organize routes with Express Router",
        code: {
          language: "typescript",
          code: `import { Router } from "express";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;`,
        },
        tags: ["Express", "routing", "REST"],
      },
    ],
  },
];
