import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { generateAnswer } from './llm.js';
import {
  getChunkCount,
  indexKnowledgeBase,
  retrieveTopK
} from './vectorStore.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const chatRateLimitWindowMs = 60 * 60 * 1000;
const chatRateLimitMaxRequests = 15;
const chatRateLimitStore = new Map();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Portfolio chatbot backend is running.',
    endpoints: ['/api/health', '/api/retrieve', '/api/chat']
  });
});

app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

function chatRateLimiter(req, res, next) {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const current = chatRateLimitStore.get(ip);

  if (!current || now - current.windowStart >= chatRateLimitWindowMs) {
    chatRateLimitStore.set(ip, {
      count: 1,
      windowStart: now
    });
    return next();
  }

  if (current.count >= chatRateLimitMaxRequests) {
    const retryAfterSeconds = Math.ceil(
      (chatRateLimitWindowMs - (now - current.windowStart)) / 1000
    );

    return res.status(429).json({
      error: 'Too many chat requests. Please try again later.',
      retryAfterSeconds
    });
  }

  current.count += 1;
  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    chunksLoaded: getChunkCount()
  });
});

app.post('/api/retrieve', async (req, res, next) => {
  try {
    const { query } = req.body ?? {};

    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        error: 'Query must be a non-empty string.'
      });
    }

    const chunks = await retrieveTopK(query.trim(), 4);

    return res.json({
      query: query.trim(),
      chunks
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/chat', chatRateLimiter, async (req, res, next) => {
  try {
    const { query } = req.body ?? {};

    if (typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        error: 'Query must be a non-empty string.'
      });
    }

    const trimmedQuery = query.trim();
    const sourcesUsed = await retrieveTopK(trimmedQuery, 4);
    const result = await generateAnswer(trimmedQuery, sourcesUsed);

    const answer =
      typeof result === 'string'
        ? result
        : typeof result.answer === 'string'
        ? result.answer
        : '';

    const followUps =
      result && Array.isArray(result.followUps)
        ? result.followUps.filter((item) => typeof item === 'string').slice(0, 3)
        : [];

    return res.json({
      answer,
      followUps,
      sourcesUsed,
      query: trimmedQuery
    });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    error: 'Internal server error.'
  });
});

try {
  await indexKnowledgeBase();
  console.log(`Knowledge base indexed: ${getChunkCount()} chunks`);

  app.listen(port, () => {
    console.log(`Retrieval server listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error('Failed to start retrieval server.');
  console.error(error);
  process.exit(1);
}
