const express = require('express');
const offersRouter = express.Router();
const Offers = require('../models/offer');
const authenticate = require('../authenticate');
const cors = require('./cors');

offersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Offers.find()
    .then(offers => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(offers);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Offers.create(req.body)
    .then(offer => {
        console.log('Offer Created ', offer);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(offer);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /offers');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Offers.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err))
});

offersRouter.route('/:offersId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Offers.findById(req.params.offersId)
    .then(offer => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(offer);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /offers/${req.params.offersId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Offers.findByIdAndDelete(req.params.offersId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = offersRouter;