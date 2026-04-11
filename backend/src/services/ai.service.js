import { HumanMessage, SystemMessage, AIMessage} from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import { OpenAI } from "@langchain/openai";
import { MistralAI } from "@langchain/mistralai";

dotenv.config();

const model = new MistralAI({
  model: "mistral-small",
  apiKey: process.env.MISTRAL_API_KEY
});


export async function generateResponse(messagesArray) {
    const messages = messagesArray.map(msg => {
        if (msg.role === "user") {
            return new HumanMessage(msg.content);
        }
        else if (msg.role === "ai") {
            return new AIMessage(msg.content);
        }
        return null;
    }).filter(msg => msg !== null);
    
    const response = await model.invoke(messages);
    return response.text || response.content || JSON.stringify(response);
}

export async function generateChatTitle(message) {

    const response = await model.invoke([
        new SystemMessage({ content: "You are a helpful assistant that generates concise and descriptive titles for chat conversations." }),
        new HumanMessage({ content: `Generate a concise and descriptive title for a chat conversation based on the following message: "${message}"` })
    ]);

    return response.content || response.text || JSON.stringify(response);
}



