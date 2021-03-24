const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating:{
    type: Number,
    min: 1,
    max: 5,
    required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const accessibleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const guestSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const suiteSchema = new Schema({
    name: {
        type: String,
        required: false,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const roomsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    guestsDescription: {
        type: String,
        required: true
    },
    suiteDescription: {
        type: String,
        required: true
    },
    accessibleDescription: {
        type: String,
        required: true
    },
    guests: [guestSchema],
    suite: [suiteSchema],
    accessible: [accessibleSchema]
}, {
    timestamps: true
});

const Rooms = mongoose.model('Rooms', roomsSchema);

module.exports = Rooms;