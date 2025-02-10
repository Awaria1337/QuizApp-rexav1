import mongoose from 'mongoose';

const shopItemSchema = new mongoose.Schema({
    name: {
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
        enum: ['heart', 'gem', 'booster', 'avatar'],
        required: true
    },
    price: {
        amount: { type: Number, required: true },
        currency: { type: String, enum: ['gem', 'real'], required: true }
    },
    quantity: {
        type: Number,
        default: 1
    },
    icon: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const ShopItem = mongoose.models?.ShopItem || mongoose.model('ShopItem', shopItemSchema);

export default ShopItem;