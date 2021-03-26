const express = require('express');
const offersRouter = express.Router();
const Offers = require('../models/offer');

offersRouter.route('/')
.get((req, res, next) => {
    Offers.find()
    .then(offers => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(offers);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Offers.create(req.body)
    .then(offer => {
        console.log('Offer Created ', offer);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(offer);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /offers');
})
.delete((req, res, next) => {
    Offers.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err))
});

offersRouter.route('/:offersId')
.get((req, res, next) => {
    Offers.findById(req.params.offersId)
    .then(offer => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(offer);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /offers/${req.params.offersId}`);
})
.put((req, res, next) => {
    Offers.findByIdAndUpdate(req.params.offersId, {
        $set: req.body
    }, { new: true})
    .then(offer => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(offer);
    })
    .catch(err => next(err));
})
.delete((req, res) => {
    Offers.findByIdAndDelete(req.params.offersId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = offersRouter;