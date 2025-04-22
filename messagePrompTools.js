import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

const getSchool = ai.defineTool(
  {
    name: 'getSchool',
    description: 'Obtém o nome da escola onde o usuário estuda',
    inputSchema: z.object({
      name: z.string().describe('Nome do usuário'),
      school: z.string().describe('Nome da escola'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Processa a entrada para identificar a escola mencionada
    console.log('Input:', input.school);
    console.log('Input:', input.name);
    return `Você estuda na ${input.school}.`;
  }
);


const training = ai.defineFlow('message', async (message) => {
  const response = await ai.generate({
    model: gemini15Flash,
    prompt: message,
    tools: [getSchool],
  });

  return response.text;
});

training("Eu me chama walter e estudo na escola 42 de Luanda escola de progracao, onde eu estudo?")
  .then(response => {
    console.log("Resposta:", response);
  })
  .catch(err => {
    console.error("Erro:", err);
  });
