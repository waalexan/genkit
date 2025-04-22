import 'dotenv/config';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

// Define the training flow using generateStream for streaming responses
const training = ai.defineFlow('message', async (message) => {
  const { response, stream } = await ai.generateStream({
    prompt: message,
  });

  let accumulatedText = '';

  // Process the streamed chunks
  for await (const chunk of stream) {
    // Log the entire chunk to inspect the structure
    console.log('Received chunk:', chunk);

    // If chunk has an 'output' property, accumulate it
    if (chunk && chunk.output) {
      accumulatedText += chunk.output;
      console.log('Streaming:', chunk.output);
    }
  }

  // Once the stream is complete, return the accumulated result
  return accumulatedText;
});

// Call the training function with a message
training("qual e a capital de angola, e quem e o presidente")
