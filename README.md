# RAG Portfolio Chatbot

A full-stack portfolio website with an embedded AI assistant that answers questions about Subodh Singh's skills, projects, experience, certifications, and contact details.

The chatbot uses retrieval-augmented generation (RAG): it retrieves relevant chunks from a local knowledge base, passes those chunks to a Groq-hosted LLM, and returns a grounded answer through the portfolio chat widget.

## Project Overview

This project combines a personal portfolio frontend with a local retrieval backend. Visitors can browse the portfolio normally or use the floating chat assistant to ask questions such as:

- What projects has Subodh built?
- What is Subodh's DevOps experience?
- Tell me about FarmDirect.
- How can I contact Subodh?

The assistant is designed to answer only from the provided portfolio knowledge base. If the answer is not available, it should say so instead of inventing details.

## Features

- Responsive React portfolio built with Vite.
- Floating AI chat widget embedded into the portfolio.
- Suggested questions and follow-up prompts.
- Message timestamps, bot/user avatars, and loading states.
- Backend API built with Express.
- Local vector retrieval using `Xenova/all-MiniLM-L6-v2` embeddings.
- Groq LLM integration through the OpenAI-compatible SDK.
- Knowledge base stored as editable JSON.
- Basic per-IP chat rate limiting to protect free-tier usage.
- Manual test scripts for retrieval and chat verification.

## Tech Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express
- CORS
- dotenv
- OpenAI SDK configured for Groq

### AI / RAG

- Local embeddings: `@xenova/transformers`
- Embedding model: `Xenova/all-MiniLM-L6-v2`
- LLM provider: Groq
- Generation model: `llama-3.3-70b-versatile`
- Retrieval: in-memory cosine similarity over knowledge chunks

## Architecture

```text
User
  |
  v
React Portfolio Chat Widget
  |
  v
POST /api/chat
  |
  v
Express Backend
  |
  v
Vector Store retrieves top matching knowledge chunks
  |
  v
Groq LLM receives system prompt + retrieved context
  |
  v
Answer + follow-up questions returned to frontend
```

## Folder Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── embeddings.js       # Loads local embedding model and creates vectors
│   │   ├── llm.js              # Builds prompt context and calls Groq
│   │   ├── server.js           # Express API server
│   │   └── vectorStore.js      # Loads, embeds, and retrieves knowledge chunks
│   ├── test-chat.js            # Manual chat test script
│   ├── test-retrieval.js       # Manual retrieval test script
│   ├── package.json
│   └── .env.example
├── data/
│   ├── knowledge-base.json     # Portfolio knowledge chunks
│   ├── system-prompt.txt       # Runtime assistant instructions
│   └── README.md               # Knowledge base maintenance notes
├── portfolio/
│   ├── src/
│   │   ├── components/         # Portfolio sections and chat widget
│   │   ├── App.jsx             # Main frontend app
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # React entry point
│   ├── package.json
│   └── .env.example
├── PROJECT_STATE.md            # Working project context for future sessions
└── README.md
```

## Important Files

- `portfolio/src/components/ChatWidget.jsx` - Main chat UI and frontend API call logic.
- `portfolio/src/App.jsx` - Renders the portfolio sections and chat widget.
- `backend/src/server.js` - Defines API endpoints and starts the backend server.
- `backend/src/vectorStore.js` - Embeds the knowledge base and retrieves similar chunks.
- `backend/src/embeddings.js` - Uses Xenova Transformers for local embeddings.
- `backend/src/llm.js` - Calls Groq and formats chatbot answers.
- `data/knowledge-base.json` - Source content used by retrieval.
- `data/system-prompt.txt` - Defines assistant behavior and grounding rules.

## Environment Variables

Create environment files from the provided examples.

### Backend

Create `backend/.env`:

```env
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
```

`GROQ_API_KEY` is required for answer generation. Do not commit real API keys.

### Frontend

Create `portfolio/.env`:

```env
VITE_API_URL=http://localhost:3001
```

This tells the frontend where to send chat requests.

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd portfolio
npm install
```

Start the backend:

```bash
cd backend
npm start
```

Expected backend URL:

```text
http://localhost:3001
```

Start the frontend in a second terminal:

```bash
cd portfolio
npm run dev
```

Expected frontend URL:

```text
http://localhost:5173
```

If port `5173` is already busy, Vite may choose the next available port.

## API Endpoints

### Health Check

```http
GET /api/health
```

Returns backend status and the number of indexed knowledge chunks.

Example response:

```json
{
  "status": "ok",
  "chunksLoaded": 20
}
```

### Retrieve Chunks

```http
POST /api/retrieve
Content-Type: application/json
```

Request body:

```json
{
  "query": "What is Subodh's DevOps experience?"
}
```

Returns the top matching knowledge chunks with similarity scores.

### Chat

```http
POST /api/chat
Content-Type: application/json
```

Request body:

```json
{
  "query": "Tell me about FarmDirect"
}
```

Example response shape:

```json
{
  "answer": "FarmDirect is a farmer-to-customer marketplace built with a Dockerised Node.js/Express backend...",
  "followUps": [
    "What technologies were used in FarmDirect?",
    "What other projects has Subodh built?"
  ],
  "sourcesUsed": [],
  "query": "Tell me about FarmDirect"
}
```

## Knowledge Base

The assistant's facts come from `data/knowledge-base.json`.

Each chunk follows this structure:

```json
{
  "id": "unique-slug",
  "category": "about",
  "title": "Professional Summary",
  "text": "Short self-contained text about Subodh.",
  "source": "resume"
}
```

When updating the knowledge base:

- Keep chunks short and focused.
- Write in third person.
- Make each chunk understandable on its own.
- Update contact, project, and certification details before deployment.
- Add new chunks instead of making one chunk too broad.

The backend indexes this file on startup.

## Manual Testing

Run retrieval test:

```bash
cd backend
npm run test:retrieval
```

Run chat test:

```bash
cd backend
npm run test:chat
```

The chat test requires a valid `GROQ_API_KEY`.

Build the frontend:

```bash
cd portfolio
npm run build
```

## Current Status

Completed:

- Knowledge base and system prompt are prepared.
- Local embedding and similarity retrieval are implemented.
- Groq-backed answer generation is implemented.
- React portfolio and chat widget are implemented.
- Frontend can send questions to the backend.

Pending:

- Production deployment configuration.
- Production environment variable setup.
- Formal monitoring and analytics.
- More production hardening beyond current local error handling and rate limiting.

## Known Rough Edges

- The backend currently exits if port `3001` is already occupied.
- Groq responses require a valid API key and may be rate-limited.
- The first backend startup may take time while the embedding model loads.
- The frontend dev server may use a different port if `5173` is busy.

## Roadmap

- Add visible source citations under bot answers.
- Add local conversation history and export.
- Add streaming responses for better perceived latency.
- Add a search panel for exploring knowledge chunks.
- Add an authenticated admin UI for editing the knowledge base.
- Add analytics and rate monitoring.
- Prepare deployment for frontend and backend.

## Security Notes

- Never commit `backend/.env` or real API keys.
- Keep the chat rate limit enabled before public deployment.
- Review knowledge base content before publishing, because the assistant can only be as accurate as the provided chunks.

## Author

Subodh Singh

- Email: subodhsingh6536@gmail.com
- GitHub: https://github.com/subodhsingh20
- LinkedIn: https://www.linkedin.com/in/subodh-singh-717828280/
