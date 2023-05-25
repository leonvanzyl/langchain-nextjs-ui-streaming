import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage } from "langchain/schema";

export default async function handler(req, res) {
  const { prompt } = req.body;

  const model = new ChatOpenAI({
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          res.write(token);
        },
      },
    ],
  });

  await model.call([new HumanChatMessage(prompt)]);

  res.end();
}
