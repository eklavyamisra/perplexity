import {tavily} from '@tavily/core'
import dotenv from 'dotenv';


dotenv.config();

const tavilyClient = tavily({
    apiKey: process.env.TAVILY_API_KEY,
});

const response = await tavilyClient.search("What is the capital of France?",);

console.log("Tavily response:", response);