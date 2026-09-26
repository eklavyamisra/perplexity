import mongoose from 'mongoose';

const messageModel = new mongoose.Schema(
    {
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'ai'],
            required: true,
        },
        sources: [
            {
                _id: false,
                title: String,
                url: String,
                content: String,
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Message', messageModel);
