import 'dotenv/config';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

const training = ai.defineFlow('message', async (message) => {
  const { text } = await ai.generate(message);
  return text;
});

training("oi como te chamas").then(response => {
  console.log(response);
});
