import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";

dotenv.config();

// MistralAI is the text-completion (FIM) client; chat messages need ChatMistralAI.
const createModel = (name, maxRetries) => new ChatMistralAI({
    model: name,
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.3,
    maxRetries,
});

// Free-tier keys often get 429 "capacity" on the larger models; fall back instead of failing.
const model = createModel(process.env.MISTRAL_MODEL || "mistral-small-latest", 1)
    .withFallbacks([createModel(process.env.MISTRAL_FALLBACK_MODEL || "open-mistral-nemo", 2)]);

const ANSWER_PROMPT = `You are Perplexity, an answer engine. Give accurate, well-structured answers in Markdown.
Lead with the direct answer, then supporting detail. Use short paragraphs, lists and tables where they help.
When web sources are provided, ground your answer in them and cite them inline as [1], [2] matching their numbers.
Never invent sources. If the sources don't cover the question, say so and answer from general knowledge.`;

function toText(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content.map(part => (typeof part === "string" ? part : part.text || "")).join("");
    }
    return "";
}

function formatSources(sources) {
    return sources
        .map((s, i) => `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.content}`)
        .join("\n\n");
}

export async function generateResponse(messagesArray, sources = []) {
    const history = messagesArray.map(msg => {
        if (msg.role === "user") return new HumanMessage(msg.content);
        if (msg.role === "ai") return new AIMessage(msg.content);
        return null;
    }).filter(Boolean);

    const system = sources.length
        ? `${ANSWER_PROMPT}\n\nWeb sources for the latest question:\n\n${formatSources(sources)}`
        : ANSWER_PROMPT;

    const response = await model.invoke([new SystemMessage(system), ...history]);
    return toText(response.content).trim();
}

export async function generateChatTitle(message) {
    try {
        const response = await model.invoke([
            new SystemMessage("Write a title of at most 6 words for a conversation that starts with the user's message. Reply with the title only: no quotes, no punctuation at the end."),
            new HumanMessage(message),
        ]);
        const title = toText(response.content).trim().replace(/^["'“”]+|["'“”.]+$/g, "");
        return title.slice(0, 80) || fallbackTitle(message);
    } catch (error) {
        console.error("Title generation failed:", error.message);
        return fallbackTitle(message);
    }
}

function fallbackTitle(message) {
    return message.length > 48 ? `${message.slice(0, 48).trim()}…` : message;
}
