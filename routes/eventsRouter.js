const express = require('express');
const eventsRouter = express.Router();
const Events = require('../models/event');

eventsRouter.route('/')
.get((req, res) => {
    Events.find()
    .then(events => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(events);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Events.create(req.body)
    .then(events => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(events);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /events');
})
.delete((req, res, next) => {
    Events.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

eventsRouter.route('/:eventId')
.get((req, res, next) => {
    Events.findById(req.params.eventId)
    .then(event => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(event);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /events/${req.params.eventId}`);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Events.findByIdAndDelete(req.params.eventId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = eventsRouter;