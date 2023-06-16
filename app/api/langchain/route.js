import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";

const runLLMChain = async (prompt, key) => {
  const encoder = new TextEncoder();

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const model = new ChatOpenAI({
    streaming: true,
    openAIApiKey: key,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          await writer.write(encoder.encode(`${token}`));
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ],
  });

  model.call([new HumanChatMessage(prompt)]);

  return stream.readable;
};

export async function POST(req) {
  const { prompt, key } = await req.json();

  const stream = runLLMChain(prompt, key);
  return new Response(await stream);
}
