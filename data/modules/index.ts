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
    title: "React & Next.js Fundamentals",
    slug: "react-nextjs",
    description: "Build modern web apps with React and Next.js 15",
    longDescription:
      "Master React's component model, hooks, state management, and server-side rendering with Next.js 15's App Router. Build real applications using TypeScript, Tailwind CSS, and modern patterns.",
    thumbnail: "/modules/react-nextjs.jpg",
    color: "#06b6d4",
    icon: "⚛️",
    difficulty: "intermediate",
    totalLessons: 15,
    estimatedHours: 18,
    xpReward: 750,
    order: 2,
    prerequisites: ["mod-1"],
    tags: ["React", "Next.js", "TypeScript", "Hooks", "SSR"],
    lessons: [
      {
        id: "lesson-2-1",
        moduleId: "mod-2",
        title: "React Components & Props",
        slug: "components-and-props",
        description: "Build reusable UI components",
        duration: 25,
        order: 1,
        type: "interactive",
        xpReward: 50,
        steps: [
          {
            id: "step-1",
            title: "What is a Component?",
            type: "explanation",
            content:
              "React components are independent, reusable pieces of UI. Think of them as custom HTML elements you define once and use anywhere in your app.",
          },
          {
            id: "step-2",
            title: "Your First Component",
            type: "example",
            content:
              "A React component is a function that returns JSX — a syntax that looks like HTML but has the full power of JavaScript.",
            codeExample: {
              language: "tsx",
              code: `interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {label}
    </button>
  );
}

// Usage
<Button label="Start Learning" onClick={() => navigate("/modules")} />`,
              label: "Button Component",
            },
          },
        ],
      },
      {
        id: "lesson-2-2",
        moduleId: "mod-2",
        title: "React Hooks",
        slug: "react-hooks",
        description: "State and side effects with hooks",
        duration: 30,
        order: 2,
        type: "interactive",
        xpReward: 60,
        steps: [
          {
            id: "step-1",
            title: "useState",
            type: "explanation",
            content:
              "useState lets you add reactive state to your components. When state changes, React automatically re-renders the component.",
          },
          {
            id: "step-2",
            title: "useState Example",
            type: "example",
            content: "A counter component using useState:",
            codeExample: {
              language: "tsx",
              code: `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <button onClick={() => setCount(c => c - 1)}>−</button>
      <span className="text-2xl font-bold">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`,
              label: "Counter with useState",
            },
          },
        ],
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What hook do you use to add state to a functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctIndex: 1,
        explanation: "useState is the primary hook for adding local state to functional components.",
      },
      {
        id: "q2",
        question: "What does JSX stand for?",
        options: [
          "JavaScript XML",
          "Java Syntax Extension",
          "JavaScript Extension",
          "JSON XML",
        ],
        correctIndex: 0,
        explanation: "JSX stands for JavaScript XML — a syntax extension that lets you write HTML-like code in JavaScript.",
      },
    ],
    cheatSheet: [
      {
        id: "cs-1",
        title: "useState Hook",
        description: "Add reactive state to components",
        code: {
          language: "tsx",
          code: `const [value, setValue] = useState<string>("");
const [count, setCount] = useState(0);

// Functional update (safe for async)
setCount(prev => prev + 1);`,
        },
        tags: ["React", "hooks", "state"],
      },
      {
        id: "cs-2",
        title: "useEffect Hook",
        description: "Run side effects in components",
        code: {
          language: "tsx",
          code: `useEffect(() => {
  // Runs after every render
}, []);

useEffect(() => {
  // Runs when dependency changes
  fetchData(id);
}, [id]);

useEffect(() => {
  const sub = subscribe();
  return () => sub.unsubscribe(); // Cleanup
}, []);`,
        },
        tags: ["React", "hooks", "effects"],
      },
    ],
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
