import { generateResponse , generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    const { message, chat: chatId } = req.body;
    
    let chat = null;
    let title = null;

    if (!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            users: req.userId,
            title: title,
        });
    }

    const UserMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user",
    });

    const messages = await messageModel.find({ chat: chatId || chat._id });

    const result = await generateResponse(messages)

    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role: "ai",
    });

    console.log(messages);

    res.status(200).json({
        chat: chat,
        title: title,
        aiMessage: aiMessage,
    });

}

export async function getChats(req, res) {
    const user = req.user;
    console.log("User in getChats:", user);
    const userId = req.userId;

    const chats = await chatModel.find({ users: userId })

    res.status(200).json(
        {
            message: "Fetched chats successfully",
            chats
        }
    );
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({ 
        _id: chatId,
        users: req.userId
    });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await messageModel.find({ chat: chatId });

    res.status(200).json({
        message: "Fetched messages successfully",
        messages
    });
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        users: req.userId
    });

    await messageModel.deleteMany({ chat: chatId });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
}