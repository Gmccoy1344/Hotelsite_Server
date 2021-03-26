const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema ({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    offerCode: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Offers = mongoose.model('Offers', offerSchema);

module.exports = Offers;