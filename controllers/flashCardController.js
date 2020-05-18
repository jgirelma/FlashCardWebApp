const validator = require('validator');
const flashCardPack = require('../models/FlashCard.js');

exports.searchGet = (req, res) => {
    flashCardPack.find((err, docs) => {
    res.render('flashCards', { heading: 'All Flash Card Packs', title: 'Search', flashCards: docs });
  });
};

exports.searchPost = (req, res) => {
    let query = req.body.query;
    flashCardPack.find(
        { name: { $regex: query, $options: "i" }} ,
            (err, docs) => {
    res.render('flashCards', { heading: query, title: 'Search', flashCards: docs });
  });
};

exports.createGet = (req, res) => {
    res.render('createFlashCards', {title : 'Create'});
};

exports.createPost = (req, res) => {
    const validationErrors = [];

    if (validator.isEmpty(req.body.name)) 
        validationErrors.push({ msg: 'Please enter your name' });

    let cards = [];

    //If numCards == 1, front/back will be string, otherwise, front/back is array
    if (!Array.isArray(req.body.front)) {
        if (validator.isEmpty(req.body.front)) 
            validationErrors.push({ msg: 'Please enter your message.' });
        if (validator.isEmpty(req.body.back))
            validationErrors.push({ msg: 'Please enter your message.' });
        cards = [{front: req.body.front, back: req.body.back}];
    } else {
        for(let i = 0; i < req.body.back.length; i++) {
            if (validator.isEmpty(req.body.front[i])) 
            validationErrors.push({ msg: 'Please enter your message.' });
            if (validator.isEmpty(req.body.back[i]))
                validationErrors.push({ msg: 'Please enter your message.' });
            cards.push({front: req.body.front[i], back: req.body.back[i]});
        }
    }

    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        res.redirect('/create');
        return;
    };
    

    let cardPack = new flashCardPack({
        owner: req.user.id,
        name: req.body.name,
        cards: cards
    });
  
    cardPack.save((err) => {
        if (err) {
            req.flash('errors', err);
            res.redirect('/create');
        } else {
            req.flash('success', { msg: 'Flash Card Pack Has Been Created' });
            res.redirect('/pack/' + cardPack.id);
        }
    });
};

exports.getPack = (req, res) => {
    let _id = req.params.packId;
    flashCardPack.findById(_id, (err, cardPack) => {
        if (err) {
            req.flash('errors', { msg: 'Flash Card Pack Not Found' });
            res.redirect('/search');
        } else {
            res.render('viewer', {pack: cardPack, user: req.user});
        }
    });
};

exports.editGet = (req, res) => {
    let packId = req.params.packId;

    flashCardPack.findById(packId, (err, cardPack) => {
        if (err) {
            req.flash('errors', { msg: 'Flash Card Pack Not Found' });
            res.redirect('/search');
        } else {
            let userId = req.user.id;

            if(userId != cardPack.owner) {
                req.flash('errors', { msg: 'You are not authorized to edit this card pack' });
                res.redirect('/search');
            } else {
                res.render('edit', {cardPack: cardPack})
            }
        }
    });
}

exports.editPost = (req, res) => {
    let packId = req.params.packId;

    flashCardPack.findById(packId, (err, cardPack) => {
        if (err) {
            req.flash('errors', { msg: 'Flash Card Pack Not Found' });
            res.redirect('/search');
        } else {
            let userId = req.user.id;

            if(userId != cardPack.owner) {
                req.flash('errors', { msg: 'You are not authorized to edit this card pack' });
                res.redirect('/search');
            } else {
                const validationErrors = [];

                if (validator.isEmpty(req.body.name)) 
                    validationErrors.push({ msg: 'Please enter your name' });

                let cards = [];

                //If numCards == 1, front/back will be string, otherwise, front/back is array
                if (!Array.isArray(req.body.front)) {
                    if (validator.isEmpty(req.body.front)) 
                        validationErrors.push({ msg: 'Please enter your message.' });
                    if (validator.isEmpty(req.body.back))
                        validationErrors.push({ msg: 'Please enter your message.' });
                    cards = [{front: req.body.front, back: req.body.back}];
                } else {
                    for(let i = 0; i < req.body.back.length; i++) {
                        if (validator.isEmpty(req.body.front[i])) 
                        validationErrors.push({ msg: 'Please enter your message.' });
                        if (validator.isEmpty(req.body.back[i]))
                            validationErrors.push({ msg: 'Please enter your message.' });
                        cards.push({front: req.body.front[i], back: req.body.back[i]});
                    }
                }

                if (validationErrors.length) {
                    req.flash('errors', validationErrors);
                    res.redirect('/edit'+packId);
                    return;
                };

                flashCardPack.updateOne({_id : packId}, {name: req.body.name, cards: cards}, (err) => {
                    if (err) {
                        req.flash('errors', err);
                        res.redirect('/edit/' + cardPack.id);
                    }
                    req.flash('success', { msg: 'Flash Card Pack Has Been Updated' });
                    res.redirect('/pack/' + cardPack.id);
                });
            }
        }
    });
}

exports.personalPacks = (req, res) => {
    flashCardPack.find({owner : req.user.id}, (err, docs) => {
        res.render('flashCards', { title: 'Your Flash Card Packs', flashCards: docs });
    });
}

exports.deletePost = (req, res) => {
    let packId = req.params.packId;

    flashCardPack.findById(packId, (err, cardPack) => {
        if (err || !cardPack) {
            req.flash('errors', { msg: 'Flash Card Pack Not Found' });
            res.redirect('/search');
        } else {
            let userId = req.user.id;

            if(userId != cardPack.owner) {
                req.flash('errors', { msg: 'You are not authorized to edit this card pack' });
                res.redirect('/search');
            } else {
                cardPack.deleteOne((err, docs) => {
                    req.flash('success', {msg: 'Flash Card Pack Has Been Deleted'});
                    res.redirect('/search');
                });
            }
        }
    });
}