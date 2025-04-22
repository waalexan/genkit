import 'dotenv/config';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { z } from 'zod';  // Importing zod for schema validation

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

// Define the schema for the structured output
const MenuItemSchema = z.object({
  name: z.string().describe('nome do item do menu com letaras maiusculas'),
  description: z.string().describe('Description of the menu item'),
  calories: z.number().describe('Calories in the menu item'),
  allergens: z.array(z.string().describe('List of allergens in the menu item')),
});

// Example of generating a pirate-themed menu item
const generateMenuItem = async () => {
  const { output } = await ai.generate({
    prompt: 'Invent a menu item for a pirate themed restaurant.',
    output: { schema: MenuItemSchema }, // Ensure output matches the schema
  });

  if (output) {
    // Destructure the structured output
    const { name, description, calories, allergens } = output;

    // You can now use these structured variables safely
    console.log(`Menu Item: ${name}`);
    console.log(`Description: ${description}`);
    console.log(`Calories: ${calories}`);
    console.log(`Allergens: ${allergens.join(', ')}`);
  }
};

generateMenuItem().catch(console.error);

