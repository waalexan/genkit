import 'dotenv/config';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { readFile } from 'fs/promises';  // Importando readFile para ler a imagem local

const ai = genkit({
  plugins: [googleAI()], // Garantir que o plugin Google AI está carregado
  model: gemini15Flash,   // Seleção do modelo (gemini15Flash)
});

// Função para ler e converter a imagem local para base64
const getBase64Image = async (filePath) => {
  const b64Data = await readFile(filePath, { encoding: 'base64' });
  return `data:image/jpeg;base64,${b64Data}`;  // Retorna a imagem no formato base64
};

const training = ai.defineFlow('message', async (message) => {
  // Caminho da imagem local
  const imagePath = './files/imagem.webp';  // Substitua pelo caminho correto do seu arquivo de imagem

  // Obter a imagem local em formato base64
  const base64Image = await getBase64Image(imagePath);

  // Gerar a resposta utilizando o modelo
  const response = await ai.generate([
    { media: { url: base64Image } },  // Passando a imagem local convertida em base64
    { text: message }  // Passando o texto para análise
  ]);

  // Retorna o texto gerado pela IA
  return response.text;
});

// Testando o fluxo com uma mensagem de exemplo
training("o que é isso?")  // Substitua pela sua mensagem
  .then(response => console.log(response))  // Exibe a resposta gerada
  .catch(err => console.error('Erro:', err));  // Tratamento de erro
