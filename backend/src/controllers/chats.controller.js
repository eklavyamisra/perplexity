import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import { searchWeb } from "../services/web.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    const message = req.body.message?.trim();
    const chatId = req.body.chat;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    let chat;
    if (chatId) {
        chat = await chatModel.findOne({ _id: chatId, users: req.userId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
    } else {
        const title = await generateChatTitle(message);
        chat = await chatModel.create({ users: req.userId, title });
    }

    const userMessage = await messageModel.create({
        chat: chat._id,
        content: message,
        role: "user",
    });

    const [messages, sources] = await Promise.all([
        messageModel.find({ chat: chat._id }).sort({ createdAt: 1 }),
        searchWeb(message),
    ]);

    let result;
    try {
        result = await generateResponse(messages, sources);
    } catch (error) {
        // Don't leave a dangling question in the history if the model call fails.
        await userMessage.deleteOne();
        if (!chatId) await chat.deleteOne();
        console.error("Answer generation failed:", error.message);
        return res.status(error.statusCode === 429 ? 429 : 502).json({
            message: error.statusCode === 429
                ? "The AI model is busy right now. Try again in a moment."
                : "Couldn't generate an answer. Please try again.",
        });
    }

    const aiMessage = await messageModel.create({
        chat: chat._id,
        content: result || "I couldn't generate an answer for that. Please try rephrasing.",
        role: "ai",
        sources,
    });

    // Bump updatedAt so the thread moves to the top of the list.
    chat.set("updatedAt", new Date());
    await chat.save();

    res.status(200).json({
        chat,
        title: chat.title,
        userMessage,
        aiMessage,
    });
}

export async function getChats(req, res) {
    const chats = await chatModel.find({ users: req.userId }).sort({ updatedAt: -1 });

    res.status(200).json({
        message: "Fetched chats successfully",
        chats,
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        users: req.userId,
    });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Fetched messages successfully",
        messages,
    });
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        users: req.userId,
    });

    // Only touch messages once ownership is confirmed.
    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    await messageModel.deleteMany({ chat: chatId });

    res.status(200).json({ message: "Chat deleted successfully" });
}
