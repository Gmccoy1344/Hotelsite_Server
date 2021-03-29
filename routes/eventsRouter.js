const express = require('express');
const eventsRouter = express.Router();
const Events = require('../models/event');
const authenticate = require('../authenticate');
const cors = require('./cors');

eventsRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser,(req, res, next) => {
    Events.find()
    .then(events => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(events);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Events.create(req.body)
    .then(events => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(events);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /events');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Events.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

eventsRouter.route('/:eventId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Events.findById(req.params.eventId)
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /events/${req.params.eventId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Events.findByIdAndUpdate(req.params.eventId, {
        $set: req.body
    }, {new: true})
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Events.findByIdAndDelete(req.params.eventId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = eventsRouter;