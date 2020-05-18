const mongoose = require('mongoose');


const cardSchema = new mongoose.Schema({
    front: String,
    back: String
});

const cardsSchema = new mongoose.Schema({
    owner: String,
    name: String,
    cards: [cardSchema]
});

const flashCardPack = mongoose.model('flashCardPack', cardsSchema);
module.exports = flashCardPack;