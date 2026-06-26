const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    asset: {
        type: String,
        required: true
    },
    direction: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    entry: {
        type: Number,
        required: true
    },
    sl: {
        type: Number,
        required: true
    },
    tp: {
        type: Number,
        required: true
    },
    lotSize: {
        type: Number,
        required: true
    },
    riskPercent: {
        type: Number,
        required: true
    },
    profit: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    mistakes: [{
        type: String
    }],
    checklist: {
        htfBias: { type: Boolean, default: false },
        confirmation: { type: Boolean, default: false },
        riskPlanned: { type: Boolean, default: false },
        emotionControlled: { type: Boolean, default: false }
    },
    disciplineScore: {
        type: Number,
        default: 100
    }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
