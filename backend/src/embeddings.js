import { pipeline } from '@xenova/transformers';

const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

let extractorPromise = null;

async function getExtractor() {
  if (!extractorPromise) {
    console.log(`Loading embedding model: ${MODEL_NAME}`);
    const loggedProgress = new Map();

    extractorPromise = pipeline('feature-extraction', MODEL_NAME, {
      progress_callback: (progress) => {
        if (progress.status === 'progress') {
          const file = progress.file ? ` ${progress.file}` : '';
          const percent = Math.floor((progress.progress ?? 0) / 10) * 10;
          const previousPercent = loggedProgress.get(progress.file);

          if (percent !== previousPercent) {
            loggedProgress.set(progress.file, percent);
            console.log(`Model download:${file} ${percent}%`);
          }
        } else if (progress.status) {
          const file = progress.file ? ` ${progress.file}` : '';
          console.log(`Model load: ${progress.status}${file}`);
        }
      }
    });
  }

  return extractorPromise;
}

function tensorToVectors(tensor, count) {
  const values = Array.from(tensor.data);

  if (count === 1) {
    return [values];
  }

  const dimensions = tensor.dims.at(-1);
  const vectors = [];

  for (let index = 0; index < count; index += 1) {
    const start = index * dimensions;
    vectors.push(values.slice(start, start + dimensions));
  }

  return vectors;
}

export async function embedBatch(textArray) {
  if (!Array.isArray(textArray)) {
    throw new TypeError('embedBatch expects an array of strings.');
  }

  if (textArray.length === 0) {
    return [];
  }

  const extractor = await getExtractor();
  const output = await extractor(textArray, {
    pooling: 'mean',
    normalize: true
  });

  return tensorToVectors(output, textArray.length);
}

export async function embedText(text) {
  if (typeof text !== 'string') {
    throw new TypeError('embedText expects a string.');
  }

  const [embedding] = await embedBatch([text]);
  return embedding;
}
