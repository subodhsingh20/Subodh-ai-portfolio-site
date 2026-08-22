// OpenRouter is OpenAI-compatible, so the existing SDK can be pointed at its
// API host while server.js keeps the conservative per-IP request limit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const systemPromptPath = path.resolve(__dirname, '../../data/system-prompt.txt');

dotenv.config({ path: envPath });

const openRouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openRouterApiKey || openRouterApiKey === 'your_key_here') {
  throw new Error(
    'OPENROUTER_API_KEY is missing. Add a real OpenRouter API key to backend/.env before starting the chat server.'
  );
}

const client = new OpenAI({
  apiKey: openRouterApiKey,
  baseURL: 'https://openrouter.ai/api/v1'
});

const systemPrompt = fs.readFileSync(systemPromptPath, 'utf8').trim();

function formatContext(retrievedChunks) {
  if (!Array.isArray(retrievedChunks) || retrievedChunks.length === 0) {
    return 'No context chunks were retrieved.';
  }

  return retrievedChunks
    .map((chunk, index) => {
      const score =
        typeof chunk.score === 'number' ? chunk.score.toFixed(4) : 'n/a';

      return [
        `Chunk ${index + 1}`,
        `ID: ${chunk.id}`,
        `Category: ${chunk.category}`,
        `Title: ${chunk.title}`,
        `Similarity: ${score}`,
        `Text: ${chunk.text}`
      ].join('\n');
    })
    .join('\n\n');
}

function getFallbackAnswer(retrievedChunks) {
  const contactChunk = retrievedChunks?.find(
    (chunk) => chunk.category === 'contact'
  );
  const contact = contactChunk?.text ?? 'the contact details in his portfolio';

  return `Sorry, I'm having trouble answering right now. Try reaching Subodh directly at ${contact}.`;
}

export async function generateAnswer(query, retrievedChunks) {
  const contextBlock = formatContext(retrievedChunks);
  const systemPromptWithContext = `${systemPrompt}

Provided context chunks:
${contextBlock}`;

  try {
    const response = await client.chat.completions.create({
      model: 'meta-llama/llama-3.3-70b-instruct',
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: systemPromptWithContext
        },
        {
          role: 'user',
          content: `Please answer the following query using the provided context. Return only valid JSON with two fields: "answer" and "followUps".

answer: the response text.
followUps: an array of 2-3 short, natural follow-up questions relevant to this conversation and the knowledge base.

Example:
{"answer":"...","followUps":["...","..."]}

If you cannot generate follow-up questions, return an empty array for followUps.`
        },
        {
          role: 'user',
          content: query
        }
      ]
    });

    const rawText = response.choices[0]?.message?.content?.trim() || '';

    let parsed = null;
    try {
      parsed = JSON.parse(rawText);
    } catch (jsonError) {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
          parsed = null;
        }
      }
    }

    if (parsed && typeof parsed === 'object' && typeof parsed.answer === 'string') {
      return {
        answer: parsed.answer.trim(),
        followUps: Array.isArray(parsed.followUps)
          ? parsed.followUps.filter((item) => typeof item === 'string').slice(0, 3)
          : []
      };
    }

    return {
      answer: rawText || getFallbackAnswer(retrievedChunks),
      followUps: []
    };
  } catch (error) {
    const status = error?.status ? ` Status: ${error.status}.` : '';
    console.error(`OpenRouter answer generation failed.${status}`);
    return {
      answer: getFallbackAnswer(retrievedChunks),
      followUps: []
    };
  }
}
