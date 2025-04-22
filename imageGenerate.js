import { imagen3Fast, vertexAI } from '@genkit-ai/vertexai';
import parseDataURL from 'data-urls';
import { genkit } from 'genkit';

import { writeFile } from 'node:fs/promises';

const ai = genkit({
  plugins: [vertexAI({ location: 'us-central1' })],
});

(async () => {
  const { media } = await ai.generate({
    model: imagen3Fast,
    prompt: 'photo of a meal fit for a pirate',
    output: { format: 'media' },
  });

  if (media === null) throw new Error('No media generated.');

  const data = parseDataURL(media.url);
  if (data === null) throw new Error('Invalid "data:" URL.');

  await writeFile(`output.${data.mimeType.subtype}`, data.body);
})();