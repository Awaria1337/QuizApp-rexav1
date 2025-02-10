import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['daily', 'achievement', 'special'],
        default: 'daily'
    },
    requirement: {
        type: {
            type: String,
            enum: ['quiz_complete', 'correct_answers', 'streak', 'category_complete'],
            required: true
        },
        count: {
            type: Number,
            required: true
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: false
        }
    },
    reward: {
        xp: { type: Number, required: true },
        gems: { type: Number, default: 0 },
        hearts: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Task = mongoose.models?.Task || mongoose.model('Task', taskSchema);

export default Task;