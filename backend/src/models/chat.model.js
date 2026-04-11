import mongoose from 'mongoose';

const chatModel = new mongoose.Schema(
    {
        users:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            default: 'New Chat',
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Chat', chatModel);
