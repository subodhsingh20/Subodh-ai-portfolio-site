import { retrieveTopK } from './src/vectorStore.js';

const sampleQueries = [
  "What is Subodh's DevOps experience?",
  'Tell me about FarmDirect',
  'What certifications does Subodh have?',
  'How can I contact Subodh?',
  'What frontend skills does he have?',
  'What databases does he know?'
];

for (const query of sampleQueries) {
  console.log(`\nQuery: ${query}`);
  console.log('Top matches:');

  const results = await retrieveTopK(query, 4);

  for (const [index, chunk] of results.entries()) {
    console.log(
      `${index + 1}. [${chunk.category}] ${chunk.title} ` +
        `(${chunk.id}) - score: ${chunk.score.toFixed(4)}`
    );
    console.log(`   ${chunk.text}`);
  }
}
