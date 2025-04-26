import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

const FunctionsEnum = {
  SEND_WHATSAPP_MESSAGE: 'send_whatsapp_message',
  ADD_CONTACT_TO_DB: 'add_contact_to_db',
  SEND_EMAIL_MESSAGE: 'send_email_message',
};

// Ferramenta registrada
const execOperaction = ai.defineTool(
  {
    name: 'execOperaction',
    description: 'Executa uma tarefa ou responde uma pergunta',
    inputSchema: z.object({
      name: z.string().describe('Nome em contexto (pessoal ou empresa)'),
      phone: z.string().describe('Número de telefone'),
      email: z.string().describe('Email em contexto'),
      nickname: z.string().describe('Apelido ou nome informal'),
      message: z.string().describe('Mensagem a ser enviada'),
      function: z.enum(Object.values(FunctionsEnum)).describe('Operação a ser executada'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { name, phone, email, nickname, message, function: operation } = input;

    console.log(`Executando operação: ${operation}`);

    // Aqui você pode fazer a lógica para cada operação
    switch (operation) {
      case FunctionsEnum.SEND_EMAIL_MESSAGE:
        // Chamada à API de envio de e-mail, por exemplo
        return `Email enviado para ${email} com a mensagem: "${message}"`;
      case FunctionsEnum.SEND_WHATSAPP_MESSAGE:
        return `Mensagem de WhatsApp enviada para ${phone}: "${message}"`;
      case FunctionsEnum.ADD_CONTACT_TO_DB:
        return `Contato ${name} (${nickname}) adicionado ao banco de dados.`;
      default:
        return `Operação ${operation} não implementada.`;
    }
  }
);

// Fluxo principal
const training = ai.defineFlow('message', async (message) => {
  const response = await ai.generate({
    model: gemini15Flash,
    prompt: message,
    tools: [execOperaction], // Corrigido: registrando a ferramenta certa
    toolChoice: 'auto',  
  });

  return response.text;
});

// Teste
training("quem e o primeiro-ministro do Brasil?")
  .then(response => {
    console.log("Resposta:", response);
  })
  .catch(err => {
    console.error("Erro:", err);
  });
