import { generateAnswer } from './src/llm.js';
import { retrieveTopK } from './src/vectorStore.js';

const sampleQueries = [
  "What is Subodh's DevOps experience?",
  'Tell me about FarmDirect',
  'What certifications does Subodh have?',
  'How can I contact Subodh?'
];

for (const query of sampleQueries) {
  console.log(`\nQuery: ${query}`);

  const retrievedChunks = await retrieveTopK(query, 4);

  console.log('Retrieved chunks:');
  for (const [index, chunk] of retrievedChunks.entries()) {
    console.log(
      `${index + 1}. [${chunk.category}] ${chunk.title} ` +
        `(${chunk.id}) - score: ${chunk.score.toFixed(4)}`
    );
  }

  const answer = await generateAnswer(query, retrievedChunks);
  console.log('Answer:');
  console.log(answer);
}
