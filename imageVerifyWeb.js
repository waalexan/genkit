import 'dotenv/config';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

const ai = genkit({
  plugins: [googleAI()], // Ensure you have the Google AI plugin loaded
  model: gemini15Flash,   // Model selection (gemini15Flash)
});

const imageUrl = 'https://res.cloudinary.com/dd8cs4zds/image/upload/v1745235072/caxyolqev8vl4boqoatz.jpg';

const training = ai.defineFlow('message', async (message) => {
  const response = await ai.generate([
    { media: { url: imageUrl } },
    { text: message }  
  ]);

  // Return the generated text response from AI
  return response.text;
});

// Testing the flow with a sample message
training("o que e isso?")  // Replace with your message
  .then(response => console.log(response))  // Log the generated response
  .catch(err => console.error('Error:', err));  // Error handling
