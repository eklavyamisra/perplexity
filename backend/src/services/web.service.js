import { tavily } from '@tavily/core';
import dotenv from 'dotenv';

dotenv.config();

// Web search is optional: without a Tavily key, answers come from the model alone.
const tavilyClient = process.env.TAVILY_API_KEY
    ? tavily({ apiKey: process.env.TAVILY_API_KEY })
    : null;

export async function searchWeb(query) {
    if (!tavilyClient) return [];

    try {
        const response = await tavilyClient.search(query, { maxResults: 5 });
        return (response.results || []).map(result => ({
            title: result.title,
            url: result.url,
            content: result.content?.slice(0, 1200) || '',
        }));
    } catch (error) {
        console.error('Web search failed:', error.message);
        return [];
    }
}
