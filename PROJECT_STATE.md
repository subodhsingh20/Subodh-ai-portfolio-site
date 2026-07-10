**INSTRUCTIONS FOR AI: Read this entire file before making any changes. This is the single source of truth for project context. After completing any task, update the relevant sections of this file before ending the session.**

## 1. Project Overview
- What this project is: This is a RAG-based portfolio chatbot that answers questions about Subodh using resume/project content as its knowledge base. It combines a local retrieval layer with a Groq-backed LLM to provide grounded answers.
- Tech stack summary: Frontend is React + Vite, backend is Node.js + Express, embeddings use the local Xenova sentence-transformer model, the LLM provider is Groq via an OpenAI-compatible SDK, and hosting is not implemented yet beyond local development.

## 2. Architecture
- Flow: User → Widget → Backend /api/chat → Retrieval (vectorStore.js) → Groq LLM → Response
- Key files:
  - backend/src/server.js: Express API server; exposes /api/health, /api/retrieve, and /api/chat.
  - backend/src/vectorStore.js: Loads data/knowledge-base.json, embeds chunks, and performs similarity retrieval.
  - backend/src/embeddings.js: Downloads and runs the local embedding model via @xenova/transformers.
  - backend/src/llm.js: Builds prompt context and calls the Groq model.
  - backend/test-retrieval.js and backend/test-chat.js: Small manual verification scripts.
  - portfolio/src/components/ChatWidget.jsx: Main chat UI widget and fetch logic.
  - portfolio/src/App.jsx: Mounts the chat widget.
  - data/knowledge-base.json: Source knowledge chunks for retrieval.
  - data/system-prompt.txt: System prompt used by the LLM.

## 3. Current Status
- Phase status:
  - [x] Phase 1: Data prep — knowledge base content and system prompt exist.
  - [x] Phase 2: Retrieval — embedding + similarity retrieval are implemented.
  - [x] Phase 3: LLM integration — backend calls Groq and returns answers.
  - [x] Phase 4: Frontend widget — React/Vite widget renders and sends chat requests.
  - [ ] Phase 5: Deployment — no hosting/deployment config is present yet.
- What is working right now:
  - The backend code is wired end-to-end for local retrieval and chat.
  - The frontend widget renders, accepts questions, and sends them to the backend.
  - The backend indexes the current knowledge base and performs retrieval locally.
  - The knowledge base now contains corrected project and contact data, including FarmDirect, the CodTech internship projects, and real contact details.
  - The portfolio UI now reflects the updated project list and uses real email/GitHub/LinkedIn contact links.
  - A root README.md now documents the project for GitHub, including setup, architecture, API endpoints, environment variables, testing, status, and roadmap.
  - `portfolio/node_modules` has been removed from Git tracking, root/portfolio ignore rules now cover dependency and env files, and the cleanup commit has been pushed to GitHub.
  - Frontend deployment config now includes `portfolio/vercel.json` with `outputDirectory: "dist"` to override the previous Vercel `dist ` trailing-space setting.
  - The chat widget CSS syntax warning from an orphan form style block has been fixed; `npm.cmd --prefix portfolio run build` completes successfully.
  - `portfolio/dist` has been removed from Git tracking because it is generated build output and is now ignored by `portfolio/.gitignore`.
- What is not done yet:
  - Backend production deployment is still not configured in the repo.
  - Frontend Vercel deployment config has been added, but the live deployment still needs to be verified after pushing.
  - No formal production hardening beyond basic local error handling and rate limiting.
- Known bugs / rough edges:
  - The backend currently fails to start if port 3001 is already occupied.
  - The frontend dev server may choose another Vite port if 5173 is busy.
  - Groq responses depend on a valid API key and may be rate-limited or unavailable.

Recent UI/UX updates (live in frontend):
  - [x] Added message avatars for bot and user, improving identity and scanning.
  - [x] Message timestamps and subtle meta area for each bubble.
  - [x] Suggestion chips redesigned as horizontal, pill-shaped quick replies.
  - [x] Replaced single-line input with a small auto-resizing `textarea` supporting Enter to send and Shift+Enter for newline.
  - [x] Improved bubble shadows, hover micro-interactions, and focus outlines for accessibility.
  - [ ] Visual polish/brand assets: iconography and color tokens still need final design assets.

Documentation updates:
  - [x] Added a GitHub-ready root README.md with project overview, features, tech stack, architecture, folder structure, setup instructions, API reference, knowledge-base notes, manual testing steps, current status, rough edges, roadmap, security notes, and author links.

## 4. Environment & Credentials Setup
- Required environment variables:
  - GROQ_API_KEY: Your Groq API key for LLM generation; never commit this value.
  - PORT: Backend listening port; defaults to 3001 if unset.
  - VITE_API_URL: Portfolio app base URL for the backend, typically http://localhost:3001.
- Important note: GROQ_API_KEY needs to be regenerated if switching Google accounts — get a new one free at console.groq.com/keys.
- Other setup notes:
  - Backend env file should live at backend/.env and portfolio env at portfolio/.env.
  - The repository currently ignores these env files via .gitignore.
  - No deployment service details (Render/Vercel/GitHub) are configured in the repo yet.

## 5. How to Resume Work
- Install dependencies:
  - cd backend && npm install
  - cd portfolio && npm install
- Run locally, in order:
  1. In one terminal: cd backend && npm start
  2. In another terminal: cd portfolio && npm run dev
- Expected local URLs:
  - Backend: http://localhost:3001
  - Portfolio: http://localhost:5173 (or the next available Vite port if 5173 is busy)
- Where to pick up next: Phase 5 deployment prep — set up hosting, production env vars, and a deployed backend/frontend flow.

## 6. Next Steps / Roadmap
- [ ] Phase 5: Deployment — deploy the backend and frontend, wire production environment variables, and verify the live chat flow.

## 7. Decisions & Preferences Log
- Chose Groq over OpenAI for the LLM layer because the project is targeting a free-tier-friendly workflow.
- The backend uses the llama-3.3-70b-versatile model for answer generation.
- The app uses a conservative per-IP chat rate limit of 15 requests per hour to reduce free-tier exhaustion.
- Embeddings are generated locally with Xenova/all-MiniLM-L6-v2 instead of relying on a paid embedding API.
- Knowledge content is stored in data/knowledge-base.json and edited directly rather than generated from code.

## 8. Suggested Features (prioritized)
- [ ] Conversation history & export: persist recent conversations (localStorage or backend) and allow CSV/JSON export.
- [ ] Source citations: include visible source links or chunk IDs with each answer so users can verify facts.
- [ ] Search / exploration panel: let users search the knowledge base directly and preview matching chunks.
- [ ] Authenticated admin UI: simple protected UI to edit `data/knowledge-base.json` and push updates (or upload new chunks).
- [ ] Streaming responses: show partial LLM output as it arrives for improved latency perception (if Groq supports streaming).
- [ ] Multi-turn context control: allow users to toggle whether previous messages are included in retrieval/LLM context.
- [ ] Fallback contact CTA: when confidence is low, present a clear 'Contact Subodh' option with an email/LinkedIn link.
- [ ] Analytics & rate monitoring: basic usage dashboard (requests/hour, top queries) to manage free-tier limits.
- [ ] Theme / brand customization: allow easy color token overrides and logo upload for consistent branding.

Implementation notes:
- Start with Source citations and Conversation history — these bring immediate UX & trust improvements.
- Use localStorage for conversation history first to avoid backend changes; migrate to persistent store later.
- For source citations, include `sourcesUsed` returned by `/api/chat` and render them under each bot response.

