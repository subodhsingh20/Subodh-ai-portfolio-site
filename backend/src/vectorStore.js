import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { embedBatch, embedText } from './embeddings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const knowledgeBasePath = path.resolve(
  __dirname,
  '../../data/knowledge-base.json'
);

const rawKnowledgeBase = fs.readFileSync(knowledgeBasePath, 'utf8');
const chunks = JSON.parse(rawKnowledgeBase);

if (!Array.isArray(chunks)) {
  throw new Error('knowledge-base.json must contain a JSON array.');
}

for (const chunk of chunks) {
  if (!chunk.text || !chunk.text.trim()) {
    console.warn(`Warning: chunk "${chunk.id}" has empty text.`);
  }
}

let indexedChunks = [];
let indexingPromise = null;

export function cosineSimilarity(vecA, vecB) {
  if (!vecA?.length || !vecB?.length || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let index = 0; index < vecA.length; index += 1) {
    dotProduct += vecA[index] * vecB[index];
    magnitudeA += vecA[index] * vecA[index];
    magnitudeB += vecB[index] * vecB[index];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export async function indexKnowledgeBase() {
  if (!indexingPromise) {
    indexingPromise = (async () => {
      const texts = chunks.map((chunk) => chunk.text ?? '');
      const embeddings = await embedBatch(texts);

      indexedChunks = chunks.map((chunk, index) => ({
        ...chunk,
        embedding: embeddings[index]
      }));

      return indexedChunks;
    })();
  }

  return indexingPromise;
}

export function getChunkCount() {
  return indexedChunks.length;
}

export async function retrieveTopK(query, k = 4) {
  if (!indexedChunks.length) {
    await indexKnowledgeBase();
  }

  const queryEmbedding = await embedText(query);

  return indexedChunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((first, second) => second.score - first.score)
    .slice(0, k);
}
