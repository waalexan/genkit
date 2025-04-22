import 'dotenv/config';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { z } from 'zod'; // Importing zod for schema validation

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

// Define the schema for menu items
const MenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  calories: z.number(),
  allergens: z.array(z.string()),
});

// Define the schema for the entire menu
const MenuSchema = z.object({
  starters: z.array(MenuItemSchema),
  mains: z.array(MenuItemSchema),
  desserts: z.array(MenuItemSchema),
});

// Generate and stream the menu
const generateMenu = async () => {
  const { response, stream } = await ai.generateStream({
    prompt: 'Suggest a complete menu for a pirate themed restaurant.',
    output: { schema: MenuSchema },
  });

  // Process the streamed response in chunks
  for await (const chunk of stream) {
    // `chunk.output` will give you the incremental output
    console.log('Streamed output so far:', chunk.output);

    // You can process the chunk here, e.g., accumulating the results or updating a UI
  }

  // Once the stream is finished, get the final completed output
  const { output } = await response;

  // You can now use the complete output (which matches the MenuSchema)
  if (output) {
    const { starters, mains, desserts } = output;

    console.log('Starters:', starters);
    console.log('Mains:', mains);
    console.log('Desserts:', desserts);
  }
};

// Call the function to generate and stream the menu
generateMenu().catch(console.error);
