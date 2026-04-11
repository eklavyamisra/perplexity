import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { sendMessage, getChats , getMessages, deleteChat } from "../controllers/chats.controller.js";


const chatRouter = Router();

/** * @route GET /api/chat
 * @desc Get all chat conversations for the logged in user
 * @access Private
 */
chatRouter.post('/messages', verifyToken, sendMessage)
chatRouter.get('/', verifyToken, getChats);
chatRouter.get('/:chatId/messages', verifyToken, getMessages);
chatRouter.delete('/:chatId', verifyToken, deleteChat);

export default chatRouter;